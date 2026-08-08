import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { GlassParams, EnvMapPreset } from '../types';

interface ThreeGlassCanvasProps {
  params: GlassParams;
  customImageSrc?: string | null;
  onFpsUpdate?: (fps: number) => void;
  onReady?: () => void;
}

const HDRI_URLS: Record<EnvMapPreset, string> = {
  'Royal Esplanade': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/royal_esplanade_2k.hdr',
  'Studio Small': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_03_2k.hdr',
  'Moonless Golf': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/moonless_golf_2k.hdr',
  'Overcast': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/zhgezhda_2k.hdr',
  'Cyberpunk Neon': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_03_2k.hdr',
};

const getPixelRatioCap = () => {
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (deviceMemory <= 2 || cores <= 2) return 1;
  if (cores <= 4 || deviceMemory <= 4) return 1.5;
  return 2;
};

export const ThreeGlassCanvas: React.FC<ThreeGlassCanvasProps> = ({
  params,
  customImageSrc,
  onFpsUpdate,
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glFailed, setGlFailed] = useState(false);
  
  // Three.js object references kept across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const glassMeshRef = useRef<THREE.Mesh | null>(null);
  const photoMeshRef = useRef<THREE.Mesh | null>(null);
  const photoMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const glassMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const environmentTextureRef = useRef<THREE.Texture | null>(null);
  const envLoadIdRef = useRef(0);
  const paramsRef = useRef(params);
  
  const currentAspectRatioRef = useRef<number>(1.0);
  const interactionOnModelRef = useRef(false);
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const hdrLoaderRef = useRef<HDRLoader | null>(null);
  const readyReportedRef = useRef(false);

  paramsRef.current = params;

  // Helper functions for custom geometry creation
  const createSmoothShape = (radiusX: number, radiusY: number, points = 128) => {
    const shape = new THREE.Shape();
    const step = (Math.PI * 2) / points;
    for (let i = 0; i < points; i++) {
      const angle = i * step;
      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    return shape;
  };

  const createHeartShape = () => {
    const x = 0, y = 0;
    const shape = new THREE.Shape();
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    return shape;
  };

  const createPolygonShape = (sides: number, radius: number) => {
    const shape = new THREE.Shape();
    const angleStep = (Math.PI * 2) / sides;
    const offset = sides === 6 ? Math.PI / 2 : Math.PI / 8;
    for (let i = 0; i < sides; i++) {
      const x = Math.cos(i * angleStep + offset) * radius;
      const y = Math.sin(i * angleStep + offset) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    return shape;
  };

  // Recalculate photo mesh dimensions to fit inside glass bounds cleanly
  const updatePhotoScale = useCallback(() => {
    if (!photoMeshRef.current) return;
    const s = params.photoScale;
    let safeMargin = 1.0;
    if (params.shape === 'Heart' || params.shape === 'Oval') {
      safeMargin = 0.9;
    }
    const finalScale = s * safeMargin;
    const ar = currentAspectRatioRef.current;

    if (ar > 1) {
      photoMeshRef.current.scale.set(finalScale, finalScale / ar, 1);
    } else {
      photoMeshRef.current.scale.set(finalScale * ar, finalScale, 1);
    }
  }, [params.photoScale, params.shape]);

  // Update geometry of glass crystal mesh
  const updateGeometry = useCallback(() => {
    if (!glassMeshRef.current) return;
    if (glassMeshRef.current.geometry) {
      glassMeshRef.current.geometry.dispose();
    }

    let geo: THREE.BufferGeometry;
    const type = params.shape;
    const detail = params.segments;

    const extrudeSettings = {
      depth: 1.0,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.1,
      curveSegments: detail,
    };

    switch (type) {
      case 'Square':
        geo = new RoundedBoxGeometry(2.2, 3.1, 0.95, 32, 0.25);
        break;
      case 'Heart':
        geo = new THREE.ExtrudeGeometry(createHeartShape(), extrudeSettings);
        geo.center();
        geo.rotateZ(Math.PI);
        geo.scale(1.2, 1.2, 1);
        break;
      case 'Circle':
        geo = new THREE.ExtrudeGeometry(createSmoothShape(1.1, 1.1, Math.max(detail, 64)), extrudeSettings);
        geo.center();
        break;
      case 'Oval':
        geo = new THREE.ExtrudeGeometry(createSmoothShape(0.8, 1.3, Math.max(detail, 64)), extrudeSettings);
        geo.center();
        break;
      case 'Hexagon (6)':
        geo = new THREE.ExtrudeGeometry(createPolygonShape(6, 1.2), extrudeSettings);
        geo.center();
        break;
      case 'Octagon (8)':
        geo = new THREE.ExtrudeGeometry(createPolygonShape(8, 1.2), extrudeSettings);
        geo.center();
        break;
      default:
        geo = new RoundedBoxGeometry(2.2, 3.1, 0.95, 32, 0.25);
    }

    glassMeshRef.current.geometry = geo;
    updatePhotoScale();
  }, [params.shape, params.segments, updatePhotoScale]);

  // Load HDRI environment
  const loadEnvironmentMap = useCallback((envName: EnvMapPreset) => {
    if (!hdrLoaderRef.current || !sceneRef.current) return;
    const url = HDRI_URLS[envName] || HDRI_URLS['Royal Esplanade'];
    const loadId = ++envLoadIdRef.current;

    hdrLoaderRef.current.load(
      url,
      (texture) => {
        if (loadId !== envLoadIdRef.current || !sceneRef.current) {
          texture.dispose();
          return;
        }
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        environmentTextureRef.current?.dispose();
        environmentTextureRef.current = texture;
        sceneRef.current.environment = texture;
        sceneRef.current.environmentIntensity = paramsRef.current.envIntensity;
      },
      undefined,
      (err) => {
        console.warn('HDRI load fallback triggered:', err);
      }
    );
  }, []);

  // Create default fallback luxury pastel gradient environment studio map
  const createGradientEnvMap = useCallback((renderer: THREE.WebGLRenderer) => {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Soft ambient Studio background matching #F2F2F2
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, '#F4F4F6');
      grad.addColorStop(0.7, '#E5E5EA');
      grad.addColorStop(1, '#D1D1D6');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Pearl White Highlight
      const gWhite = ctx.createRadialGradient(250, 120, 0, 250, 120, 160);
      gWhite.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      gWhite.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gWhite;
      ctx.beginPath(); ctx.arc(250, 120, 160, 0, Math.PI * 2); ctx.fill();

      // Soft Ice Blue Studio Softbox
      const gIceBlue = ctx.createRadialGradient(780, 140, 0, 780, 140, 180);
      gIceBlue.addColorStop(0, 'rgba(224, 242, 254, 0.85)');
      gIceBlue.addColorStop(1, 'rgba(224, 242, 254, 0)');
      ctx.fillStyle = gIceBlue;
      ctx.beginPath(); ctx.arc(780, 140, 180, 0, Math.PI * 2); ctx.fill();

      // Soft Lavender / Lilac Studio Softbox
      const gLavender = ctx.createRadialGradient(150, 360, 0, 150, 360, 200);
      gLavender.addColorStop(0, 'rgba(243, 232, 255, 0.85)');
      gLavender.addColorStop(1, 'rgba(243, 232, 255, 0)');
      ctx.fillStyle = gLavender;
      ctx.beginPath(); ctx.arc(150, 360, 200, 0, Math.PI * 2); ctx.fill();

      // Warm Champagne Gold Softbox
      const gChampagne = ctx.createRadialGradient(512, 80, 0, 512, 80, 150);
      gChampagne.addColorStop(0, 'rgba(254, 243, 199, 0.8)');
      gChampagne.addColorStop(1, 'rgba(254, 243, 199, 0)');
      ctx.fillStyle = gChampagne;
      ctx.beginPath(); ctx.arc(512, 80, 150, 0, Math.PI * 2); ctx.fill();

      // Soft Peach Warm Accent
      const gPeach = ctx.createRadialGradient(880, 380, 0, 880, 380, 160);
      gPeach.addColorStop(0, 'rgba(255, 237, 213, 0.75)');
      gPeach.addColorStop(1, 'rgba(255, 237, 213, 0)');
      ctx.fillStyle = gPeach;
      ctx.beginPath(); ctx.arc(880, 380, 160, 0, Math.PI * 2); ctx.fill();
    }

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envRenderTarget = pmremGenerator.fromEquirectangular(canvasTexture);
    canvasTexture.dispose();
    pmremGenerator.dispose();
    return envRenderTarget.texture;
  }, []);

  // Create BLACK CODE SVG with code lines texture for glass interior (EXACT SVG COORDINATES)
  const createCodeIconCanvasTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Transparent background - no color
      ctx.clearRect(0, 0, 512, 512);

      // roundRect is missing on older Safari/iOS — fall back to plain rects.
      // Must bind() so `this` stays the canvas context (otherwise "Illegal invocation").
      const rrNative = ctx.roundRect?.bind(ctx);
      const rr = (x: number, y: number, w: number, h: number, r: number) => {
        if (rrNative) rrNative(x, y, w, h, r);
        else ctx.rect(x, y, w, h);
      };

      // Scale factor to convert 256x256 SVG to 512x512 canvas
      const scale = 2;

      // Create gradient for stroke (black gradient)
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#111111');
      gradient.addColorStop(1, '#000000');

      // Apply soft shadow effect
      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      // Draw LEFT < bracket
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 10 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(70 * scale, 42 * scale);
      ctx.lineTo(34 * scale, 78 * scale);
      ctx.lineTo(70 * scale, 114 * scale);
      ctx.stroke();

      // Draw SLASH /
      ctx.beginPath();
      ctx.moveTo(128 * scale, 18 * scale);
      ctx.lineTo(96 * scale, 136 * scale);
      ctx.stroke();

      // Draw RIGHT > bracket
      ctx.beginPath();
      ctx.moveTo(186 * scale, 42 * scale);
      ctx.lineTo(222 * scale, 78 * scale);
      ctx.lineTo(186 * scale, 114 * scale);
      ctx.stroke();

      // Reset shadow for code lines
      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      // Draw CODE LINES (rectangles with rounded corners)
      ctx.fillStyle = gradient;

      // Row 1
      ctx.beginPath();
      rr(26 * scale, 168 * scale, 110 * scale, 10 * scale, 5 * scale);
      ctx.fill();

      ctx.beginPath();
      rr(174 * scale, 168 * scale, 42 * scale, 10 * scale, 5 * scale);
      ctx.fill();

      // Row 2
      ctx.beginPath();
      rr(26 * scale, 196 * scale, 46 * scale, 10 * scale, 5 * scale);
      ctx.fill();

      ctx.beginPath();
      rr(96 * scale, 196 * scale, 94 * scale, 10 * scale, 5 * scale);
      ctx.fill();

      // Row 3
      ctx.beginPath();
      rr(26 * scale, 224 * scale, 112 * scale, 10 * scale, 5 * scale);
      ctx.fill();

      ctx.beginPath();
      rr(174 * scale, 224 * scale, 42 * scale, 10 * scale, 5 * scale);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  // Update photo texture source
  const loadPhotoTexture = useCallback((src?: string | null) => {
    if (!photoMatRef.current) return;

    if (!src) {
      // Generate default black code SVG with code lines texture
      const tex = createCodeIconCanvasTexture();
      if (photoMatRef.current.map) photoMatRef.current.map.dispose();
      photoMatRef.current.map = tex;
      photoMatRef.current.opacity = 1.0; // Ensure full opacity for visibility
      photoMatRef.current.visible = true; // Ensure visibility
      photoMatRef.current.needsUpdate = true;
      currentAspectRatioRef.current = 1.0;
      updatePhotoScale();
      return;
    }

    if (!textureLoaderRef.current) return;
    textureLoaderRef.current.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (photoMatRef.current) {
        if (photoMatRef.current.map) photoMatRef.current.map.dispose();
        photoMatRef.current.map = tex;
        photoMatRef.current.opacity = 1.0; // Ensure full opacity for visibility
        photoMatRef.current.visible = true; // Ensure visibility
        photoMatRef.current.needsUpdate = true;
      }
      if (tex.image) {
        currentAspectRatioRef.current = tex.image.width / tex.image.height;
        updatePhotoScale();
      }
    });
  }, [createCodeIconCanvasTexture, updatePhotoScale]);

  // Handle custom image updates
  useEffect(() => {
    loadPhotoTexture(customImageSrc);
  }, [customImageSrc, loadPhotoTexture]);

  // Ensure photo mesh is always visible for SVG display
  useEffect(() => {
    if (photoMeshRef.current) {
      photoMeshRef.current.visible = true;
      if (photoMatRef.current) {
        photoMatRef.current.visible = true;
        photoMatRef.current.opacity = 1.0;
      }
    }
  }, []);

  // Synchronize parameters with Three.js material & scene
  useEffect(() => {
    if (glassMatRef.current) {
      glassMatRef.current.color.set(params.glassColor);
      glassMatRef.current.ior = params.internalReflect;
      glassMatRef.current.opacity = params.opacity;
      glassMatRef.current.transmission = params.transmission;
      glassMatRef.current.roughness = params.roughness;
      glassMatRef.current.thickness = params.thickness;
    }
    if (sceneRef.current) {
      sceneRef.current.environmentIntensity = params.envIntensity;
    }
    if (controlsRef.current) {
      controlsRef.current.enabled = params.orbitEnabled;
    }
  }, [params]);

  // Handle HDRI and Shape changes
  useEffect(() => {
    updateGeometry();
  }, [params.shape, params.segments, updateGeometry]);

  useEffect(() => {
    loadEnvironmentMap(params.envMap);
  }, [params.envMap, loadEnvironmentMap]);

  // Mouse move handler for interactive parralax/swing
  const handleMouseMove = useCallback((e: PointerEvent) => {
    if (!paramsRef.current.mouseInteraction) return;
    // On touch devices, only respond when the touch starts on the 3D model itself
    if (e.pointerType !== 'mouse' && !interactionOnModelRef.current) return;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    mousePos.current.targetX = (e.clientX - windowHalfX) / windowHalfX;
    mousePos.current.targetY = (e.clientY - windowHalfY) / windowHalfY;
  }, [params.mouseInteraction]);

  // Primary Initialization & Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent background to show #F2F2F2 DOM background seamlessly

    // 2. CAMERA
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    // Responsive camera position based on screen width
    const isSmallScreen = window.innerWidth < 768;
    const isLaptopDesktop = window.innerWidth >= 1024;
    camera.position.set(0, 0, isSmallScreen ? 5.0 : isLaptopDesktop ? 6.6 : 6.8);
    cameraRef.current = camera;

    // 3. RENDERER — wrapped in try/catch so browsers without WebGL2 degrade gracefully instead of crashing
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      console.warn('WebGL is unavailable on this browser — showing fallback:', err);
      sceneRef.current = null;
      cameraRef.current = null;
      setGlFailed(true);
      onReady?.();
      return;
    }
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, getPixelRatioCap()));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    // Clear existing canvas children if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Browser GPU context loss recovery: prevent the default browser behavior
    // (which blanks the canvas permanently) and let three.js re-initialize on restore.
    const onContextLost = (event: Event) => event.preventDefault();
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    // Initial default canvas gradient environment fallback
    const fallbackEnv = createGradientEnvMap(renderer);
    scene.environment = fallbackEnv;
    environmentTextureRef.current = fallbackEnv;
    scene.environmentIntensity = params.envIntensity;

    // 4. CONTROLS (Disable zoom on wheel so page scroll works naturally)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false; // Prevents wheel scroll from zooming camera so user can scroll page smoothly
    controls.minDistance = 3.5;
    controls.maxDistance = 12;
    controls.enabled = params.orbitEnabled;
    controlsRef.current = controls;

    // Allow the page to scroll vertically when touching over the canvas —
    // only horizontal drags on the model itself rotate it on touch screens.
    renderer.domElement.style.touchAction = 'pan-y';

    // 5. LIGHTING (Studio pastel lighting setup for optical crystal edge highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 3.2);
    backLight.position.set(-5, 4, -10);
    scene.add(backLight);

    const topLight = new THREE.DirectionalLight(0xfff4e6, 2.5); // Warm Champagne
    topLight.position.set(2, 10, 3);
    scene.add(topLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.8);
    frontLight.position.set(0, 2, 8);
    scene.add(frontLight);

    const rimLight = new THREE.DirectionalLight(0xe0f2fe, 2.2); // Soft Ice Blue Edge
    rimLight.position.set(6, -2, -5);
    scene.add(rimLight);

    const leftRimLight = new THREE.DirectionalLight(0xf3e8ff, 1.8); // Soft Lavender Edge
    leftRimLight.position.set(-6, -2, -5);
    scene.add(leftRimLight);

    // 6. MAIN 3D GROUP
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // 7. PHOTO MESH (Enabled to display SVG texture inside the glass model)
    const photoGeo = new THREE.PlaneGeometry(1, 1);
    const photoMat = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 1.0,
      visible: true,
    });
    photoMatRef.current = photoMat;
    const photoMesh = new THREE.Mesh(photoGeo, photoMat);
    photoMesh.position.set(0, 0, 0.05); // Slightly offset to be inside the glass
    photoMesh.visible = true; // Enable SVG texture display inside glass
    photoMesh.renderOrder = 0; // Render before glass
    group.add(photoMesh); // Add to group to make it visible
    photoMeshRef.current = photoMesh;

    // 8. GLASS REFRACTION MATERIAL & MESH (Luxury Optical Crystal Material)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(params.glassColor),
      transmission: params.transmission,
      opacity: params.opacity,
      metalness: 0.0,
      roughness: params.roughness,
      ior: params.internalReflect,
      thickness: params.thickness,
      attenuationColor: new THREE.Color(0xffffff),
      attenuationDistance: 50.0,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      envMapIntensity: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      iridescence: 0.15,
      iridescenceIOR: 1.33,
      iridescenceThicknessRange: [100, 360],
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    glassMatRef.current = glassMat;

    const glassMesh = new THREE.Mesh(new THREE.BufferGeometry(), glassMat);
    glassMesh.receiveShadow = false;
    glassMesh.renderOrder = 2; // Render after photo mesh
    group.add(glassMesh);
    glassMeshRef.current = glassMesh;

    // Loaders
    textureLoaderRef.current = new THREE.TextureLoader();
    hdrLoaderRef.current = new HDRLoader();

    // Load initial texture and environment map
    loadPhotoTexture(customImageSrc);
    updateGeometry();
    loadEnvironmentMap(params.envMap);

    // Event listener for mouse move
    renderer.domElement.addEventListener('pointermove', handleMouseMove, { passive: true });

    // Touch gating: on touch devices the 3D model only responds to touches that
    // land directly ON the model (raycast hit). Touches outside are ignored so
    // the model never moves when tapping elsewhere on the screen.
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    const isPointerOnModel = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObjects(group.children, true).length > 0;
    };

    const onWindowPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      const onModel = isPointerOnModel(event);
      interactionOnModelRef.current = onModel;
      if (!onModel && controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    };

    const onWindowPointerUp = () => {
      interactionOnModelRef.current = false;
      if (controlsRef.current) {
        controlsRef.current.enabled = paramsRef.current.orbitEnabled;
      }
    };

    window.addEventListener('pointerdown', onWindowPointerDown, { capture: true });
    window.addEventListener('pointerup', onWindowPointerUp, { capture: true });
    window.addEventListener('pointercancel', onWindowPointerUp, { capture: true });

    // Responsive Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const isMobile = width < 768;
      const isLaptopDesktop = width >= 1024;

      cameraRef.current.aspect = width / height;
      cameraRef.current.position.z = isMobile ? 5.0 : isLaptopDesktop ? 6.6 : 6.8;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, getPixelRatioCap()));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. ANIMATION LOOP & FPS COUNTER
    const timer = new THREE.Timer();
    let animFrameId = 0;
    let rendering = false;
    let inViewport = true;
    let time = 0;
    let frameCount = 0;
    let lastFpsCheck = performance.now();

    const animate = () => {
      if (!rendering) return;
      animFrameId = requestAnimationFrame(animate);
      timer.update();
      const delta = Math.min(timer.getDelta(), 0.033);

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastFpsCheck >= 1000) {
        if (onFpsUpdate) {
          onFpsUpdate(Math.round((frameCount * 1000) / (now - lastFpsCheck)));
        }
        frameCount = 0;
        lastFpsCheck = now;
      }

      // Smooth lerp mouse coordinates (damped)
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.06;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.06;

      const currentParams = paramsRef.current;
      if (groupRef.current && currentParams.playing) {
        time += delta * currentParams.globalSpeed;

        let baseRotX = 0;
        let baseRotY = 0;
        let baseRotZ = 0;

        // Base Y rotation calculation
        if (currentParams.yAxis.mode === 'Spin') {
          baseRotY = (time * currentParams.yAxis.speed * 0.4);
        } else {
          baseRotY = Math.sin(time * currentParams.yAxis.speed * 0.8) * currentParams.yAxis.amp * 0.4;
        }

        // X pitch rotation & Z tilt
        if (currentParams.xAxis.enabled) {
          baseRotX = Math.cos(time * currentParams.xAxis.speed * 0.6) * currentParams.xAxis.amp * 0.3;
        }
        if (currentParams.zAxis.enabled) {
          baseRotZ = Math.sin(time * currentParams.zAxis.speed * 0.5) * currentParams.zAxis.amp * 0.25;
        }

        // Mouse influence calculated cleanly as an offset
        const mouseTiltX = currentParams.mouseInteraction ? mousePos.current.y * 0.2 : 0;
        const mouseTiltY = currentParams.mouseInteraction ? mousePos.current.x * 0.3 : 0;

        groupRef.current.rotation.x = baseRotX + mouseTiltX;
        groupRef.current.rotation.y = baseRotY + mouseTiltY;
        groupRef.current.rotation.z = baseRotZ;

        // Smooth floating bobbing movement
        groupRef.current.position.y = Math.sin(time * 1.2) * 0.08;
      }

      if (controlsRef.current && currentParams.orbitEnabled) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        if (!readyReportedRef.current && frameCount >= 4) {
          readyReportedRef.current = true;
          onReady?.();
        }
      }
    };

    const updateRendering = () => {
      const shouldRender = inViewport && !document.hidden;
      if (shouldRender && !rendering) {
        rendering = true;
        timer.update();
        animate();
      } else if (!shouldRender && rendering) {
        rendering = false;
        cancelAnimationFrame(animFrameId);
      }
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      updateRendering();
    }, { threshold: 0, rootMargin: '150px' });
    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', updateRendering);
    updateRendering();

    // CLEANUP
    return () => {
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('pointerdown', onWindowPointerDown, { capture: true });
      window.removeEventListener('pointerup', onWindowPointerUp, { capture: true });
      window.removeEventListener('pointercancel', onWindowPointerUp, { capture: true });
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', updateRendering);
      envLoadIdRef.current++;

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
      }

      if (glassMeshRef.current && glassMeshRef.current.geometry) {
        glassMeshRef.current.geometry.dispose();
      }
      if (glassMatRef.current) {
        glassMatRef.current.dispose();
      }
      if (photoMatRef.current) {
        photoMatRef.current.map?.dispose();
        photoMatRef.current.dispose();
      }
      environmentTextureRef.current?.dispose();
      environmentTextureRef.current = null;
    };
  }, []); // Run setup once on mount

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
      {glFailed ? (
        <div className="w-full h-full" style={{ background: 'radial-gradient(120% 90% at 50% 30%, #ffffff 0%, #F2F2F2 48%, #E2E2E6 100%)' }} />
      ) : (
        <div 
          ref={containerRef} 
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      )}
    </div>
  );
};
