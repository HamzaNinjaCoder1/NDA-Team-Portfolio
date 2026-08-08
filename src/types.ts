export type GlassShape = 
  | 'Square'
  | 'Heart'
  | 'Oval'
  | 'Circle'
  | 'Hexagon (6)'
  | 'Octagon (8)';

export type EnvMapPreset = 
  | 'Royal Esplanade'
  | 'Studio Small'
  | 'Moonless Golf'
  | 'Overcast'
  | 'Cyberpunk Neon';

export interface GlassParams {
  shape: GlassShape;
  segments: number;
  photoScale: number;
  bg: string;
  envMap: EnvMapPreset;
  glassColor: string;
  envIntensity: number;
  internalReflect: number;
  opacity: number;
  transmission: number;
  roughness: number;
  thickness: number;
  playing: boolean;
  globalSpeed: number;
  orbitEnabled: boolean;
  mouseInteraction: boolean;
  yAxis: {
    mode: 'Spin' | 'Swing';
    speed: number;
    amp: number;
  };
  xAxis: {
    enabled: boolean;
    speed: number;
    amp: number;
  };
  zAxis: {
    enabled: boolean;
    speed: number;
    amp: number;
  };
}

export interface PresetTheme {
  name: string;
  shape: GlassShape;
  glassColor: string;
  envMap: EnvMapPreset;
  internalReflect: number;
  envIntensity: number;
}
