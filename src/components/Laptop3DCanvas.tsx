import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import laptopScreenImg from '../assets/images/laptop-screen.jpg?url';

interface Laptop3DCanvasProps {
  activeStepIndex?: number;
}

const SCREEN_SIZE: [number, number] = [29.4, 20];
const getPixelRatioCap = () => {
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (deviceMemory <= 2 || cores <= 2) return 1;
  if (cores <= 4 || deviceMemory <= 4) return 1.5;
  return 2;
};

const MODEL_URL = 'https://ksenia-k.com/models/mac-noUv.glb';
const KEYBOARD_OVERLAY_URL = 'https://ksenia-k.com/img/threejs/keyboard-overlay.png';

const SCREEN_IMAGES = [
  laptopScreenImg,
];

const SCREEN_COPY = [
  'Excellence in every pixel',
];

function createStepScreenTexture(image: HTMLImageElement | null, index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1440;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = '#101010';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (image?.naturalWidth) {
    const ratio = Math.max(
      canvas.width / image.naturalWidth,
      canvas.height / image.naturalHeight,
    );
    const width = image.naturalWidth * ratio;
    const height = image.naturalHeight * ratio;
    ctx.drawImage(
      image,
      (canvas.width - width) / 2,
      (canvas.height - height) / 2,
      width,
      height,
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  return texture;
}

export function Laptop3DCanvas({ activeStepIndex = 0 }: Laptop3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef(activeStepIndex);
  const stepTexturesRef = useRef<THREE.Texture[]>([]);
  const screenMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const incomingMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  activeStepRef.current = activeStepIndex;

  useEffect(() => {
    const next = stepTexturesRef.current[activeStepIndex];
    const screen = screenMaterialRef.current;
    const incoming = incomingMaterialRef.current;
    if (!next || !screen || !incoming) return;

    incoming.map = next;
    gsap.killTweensOf(incoming);
    gsap.fromTo(
      incoming,
      { opacity: 0 },
      {
        opacity: 0.96,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: () => {
          screen.map = incoming.map;
          screen.opacity = 0.96;
          incoming.opacity = 0;
        },
      },
    );
  }, [activeStepIndex]);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    let cancelled = false;
    let frameId = 0;
    let visible = true;

    RectAreaLightUniformsLib.init();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, 1, 10, 1000);
    camera.position.set(0, 14, 70);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, getPixelRatioCap()));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    host.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envMap = pmrem.fromScene(roomEnv, 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 1.15;
    roomEnv.dispose();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(ambientLight);

    const lightHolder = new THREE.Group();
    scene.add(lightHolder);
    const pointLight = new THREE.PointLight(0xfff5e1, 1.05);
    pointLight.position.set(0, 5, 50);
    lightHolder.add(pointLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.65);
    fillLight.position.set(-8, 6, 30);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.45);
    rimLight.position.set(12, 4, -16);
    scene.add(rimLight);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.minDistance = 45;
    orbit.maxDistance = 120;
    orbit.enablePan = false;
    orbit.enableZoom = false;
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.055;
    orbit.minPolarAngle = Math.PI * 0.35;
    orbit.maxPolarAngle = Math.PI * 0.65;
    orbit.minAzimuthAngle = -0.4;
    orbit.maxAzimuthAngle = 0.4;
    orbit.target.set(0, 3, 0);

    // Allow vertical page scrolling over the canvas on touch screens.
    renderer.domElement.style.touchAction = 'pan-y';

    const macGroup = new THREE.Group();
    macGroup.position.z = -10;
    scene.add(macGroup);

    const lidGroup = new THREE.Group();
    macGroup.add(lidGroup);

    const bottomGroup = new THREE.Group();
    macGroup.add(bottomGroup);

    const textureLoader = new THREE.TextureLoader();

    const screenMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
    });
    screenMaterialRef.current = screenMaterial;

    const incomingScreenMaterial = screenMaterial.clone();
    incomingScreenMaterial.opacity = 0;
    incomingMaterialRef.current = incomingScreenMaterial;

    const keyboardTexture = textureLoader.load(KEYBOARD_OVERLAY_URL);
    keyboardTexture.colorSpace = THREE.SRGBColorSpace;

    const keyboardMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      alphaMap: keyboardTexture,
      transparent: true,
    });

    const darkPlasticMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.9,
      metalness: 0.9,
    });

    const cameraMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
    });

    const baseMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xcecfd3,
      roughness: 0.35,
      metalness: 0.85,
      envMapIntensity: 1.2,
    });

    const logoMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    let screenLight: THREE.RectAreaLight | null = null;
    const timelines: gsap.core.Timeline[] = [];
    let floatingTimeline: gsap.core.Timeline | null = null;
    let modelRoot: THREE.Group | null = null;

    const parseModel = (glb: { scene: THREE.Group }) => {
      modelRoot = glb.scene;
      [...glb.scene.children].forEach((child) => {
        if (child.name === '_top') {
          lidGroup.add(child);
          child.children.forEach((mesh) => {
            if (!(mesh instanceof THREE.Mesh)) return;
            if (mesh.name === 'lid') mesh.material = baseMetalMaterial;
            else if (mesh.name === 'logo') mesh.material = logoMaterial;
            else if (mesh.name === 'screen-frame') mesh.material = darkPlasticMaterial;
            else if (mesh.name === 'camera') mesh.material = cameraMaterial;
          });
        } else if (child.name === '_bottom') {
          bottomGroup.add(child);
          child.children.forEach((mesh) => {
            if (!(mesh instanceof THREE.Mesh)) return;
            if (mesh.name === 'base') mesh.material = baseMetalMaterial;
            else if (mesh.name === 'legs') mesh.material = darkPlasticMaterial;
            else if (mesh.name === 'keyboard') mesh.material = darkPlasticMaterial;
            else if (mesh.name === 'inner') mesh.material = darkPlasticMaterial;
          });
        }
      });
    };

    const addScreen = () => {
      const screenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(SCREEN_SIZE[0], SCREEN_SIZE[1]),
        screenMaterial,
      );
      screenMesh.position.set(0, 10.5, -0.11);
      screenMesh.rotation.set(Math.PI, 0, 0);
      lidGroup.add(screenMesh);

      const incomingMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(SCREEN_SIZE[0], SCREEN_SIZE[1]),
        incomingScreenMaterial,
      );
      incomingMesh.position.set(0, 10.5, -0.115);
      incomingMesh.rotation.set(Math.PI, 0, 0);
      lidGroup.add(incomingMesh);

      screenLight = new THREE.RectAreaLight(0xffffff, 0, SCREEN_SIZE[0], SCREEN_SIZE[1]);
      screenLight.position.set(0, 10.5, 0);
      screenLight.rotation.set(Math.PI, 0, 0);
      lidGroup.add(screenLight);

      const darkScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(SCREEN_SIZE[0], SCREEN_SIZE[1]),
        darkPlasticMaterial,
      );
      darkScreen.position.set(0, 10.5, -0.111);
      darkScreen.rotation.set(Math.PI, Math.PI, 0);
      lidGroup.add(darkScreen);
    };

    const addKeyboard = () => {
      const keyboardKeys = new THREE.Mesh(
        new THREE.PlaneGeometry(27.7, 11.6),
        keyboardMaterial,
      );
      keyboardKeys.rotation.set(-0.5 * Math.PI, 0, 0);
      keyboardKeys.position.set(0, 0.045, 7.21);
      bottomGroup.add(keyboardKeys);
    };

    const createTimelines = () => {
      const floatingTl = gsap.timeline({ repeat: -1 });
      floatingTl
        .to([lidGroup.position, bottomGroup.position], {
          duration: 1.5,
          y: '+=1',
          ease: 'power1.inOut',
        }, 0)
        .to([lidGroup.position, bottomGroup.position], {
          duration: 1.5,
          y: '-=1',
          ease: 'power1.inOut',
        })
        .timeScale(0);
      timelines.push(floatingTl);
      floatingTimeline = floatingTl;

      const screenOnTl = gsap.timeline({ paused: true });
      if (screenLight) {
        screenOnTl
          .to(screenMaterial, { duration: 0.1, opacity: 0.96 }, 0)
          .to(screenLight, { duration: 0.1, intensity: 1.5 }, 0);
      }
      timelines.push(screenOnTl);

      const laptopOpeningTl = gsap.timeline({ paused: true });
      laptopOpeningTl
        .from(lidGroup.position, { duration: 0.75, z: '+=0.5' }, 0)
        .fromTo(
          lidGroup.rotation,
          { duration: 1, x: 0.5 * Math.PI },
          { x: -0.2 * Math.PI },
          0,
        )
        .to(screenOnTl, { duration: 0.06, progress: 1 }, 0.05);
      timelines.push(laptopOpeningTl);

      const laptopAppearTl = gsap.timeline({ paused: true });
      laptopAppearTl
        .fromTo(
          macGroup.rotation,
          { x: 0.5 * Math.PI, y: 0.2 * Math.PI },
          { duration: 2, x: 0.05 * Math.PI, y: -0.1 * Math.PI },
          0,
        )
        .fromTo(macGroup.position, { y: -50 }, { duration: 1, y: 8 }, 0);
      timelines.push(laptopAppearTl);

      const mainTl = gsap.timeline({ defaults: { ease: 'none' } });
      mainTl
        .to(laptopAppearTl, { duration: 1.5, progress: 1 }, 0)
        .to(laptopOpeningTl, { duration: 1, progress: 1 }, 0.5)
        .to(floatingTl, { duration: 1, timeScale: 1 }, 1);
      timelines.push(mainTl);

      mainTl.play(0);
      if (!rendering) floatingTl.pause();
    };

    const loader = new GLTFLoader();
    loader.load(MODEL_URL, (glb) => {
      if (cancelled) return;
      parseModel(glb);
      addScreen();
      addKeyboard();
      createTimelines();

      // Use the first available texture regardless of active step
      const initial = stepTexturesRef.current[0] || stepTexturesRef.current[activeStepRef.current];
      if (initial && screenMaterialRef.current) {
        screenMaterialRef.current.map = initial;
        screenMaterialRef.current.opacity = 0.96;
        screenMaterialRef.current.needsUpdate = true;
        if (screenLight) screenLight.intensity = 1.5;
      }
    });

    SCREEN_IMAGES.forEach((url, index) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (cancelled) return;
        const texture = createStepScreenTexture(image, index);
        stepTexturesRef.current[index] = texture;
        
        // Apply texture to screen if material is ready
        if (screenMaterialRef.current) {
          screenMaterialRef.current.map = texture;
          screenMaterialRef.current.opacity = 0.96;
          screenMaterialRef.current.needsUpdate = true;
          if (screenLight) screenLight.intensity = 1.5;
        }
      };
      image.onerror = (error) => {
        console.error('Failed to load laptop screen image:', error, 'URL:', url);
        if (cancelled) return;
        stepTexturesRef.current[index] = createStepScreenTexture(null, index);
      };
      image.src = url;
    });

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let rendering = false;
    const updateRendering = () => {
      const shouldRender = visible && !document.hidden;
      if (shouldRender && !rendering) {
        rendering = true;
        floatingTimeline?.resume();
        renderLoop();
      } else if (!shouldRender && rendering) {
        rendering = false;
        cancelAnimationFrame(frameId);
        floatingTimeline?.pause();
      }
    };
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updateRendering();
      },
      { threshold: 0.01, rootMargin: '250px' },
    );
    intersectionObserver.observe(host);

    const renderLoop = () => {
      if (!rendering) return;
      frameId = requestAnimationFrame(renderLoop);
      orbit.update();
      lightHolder.quaternion.copy(camera.quaternion);
      renderer.render(scene, camera);
    };
    document.addEventListener('visibilitychange', updateRendering);
    updateRendering();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', updateRendering);
      timelines.forEach((tl) => tl.kill());
      gsap.killTweensOf(incomingScreenMaterial);

      orbit.dispose();
      stepTexturesRef.current.forEach((t) => t.dispose());
      stepTexturesRef.current = [];
      screenMaterialRef.current = null;
      incomingMaterialRef.current = null;

      keyboardTexture.dispose();
      darkPlasticMaterial.dispose();
      cameraMaterial.dispose();
      baseMetalMaterial.dispose();
      logoMaterial.dispose();
      keyboardMaterial.dispose();
      screenMaterial.dispose();
      incomingScreenMaterial.dispose();
      screenLight?.dispose();
      pointLight.dispose();
      fillLight.dispose();
      rimLight.dispose();
      ambientLight.dispose();

      envMap.dispose();
      pmrem.dispose();
      modelRoot?.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      renderer.dispose();
      host.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
      aria-label="Interactive 3D laptop showing project websites"
    />
  );
}
