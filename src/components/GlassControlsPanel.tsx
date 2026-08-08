import React from 'react';
import { 
  X, 
  Upload, 
  RotateCw, 
  Eye, 
  Sun, 
  Palette, 
  Shapes, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  RefreshCw,
  Move3d,
  MousePointer,
  Check
} from 'lucide-react';
import { GlassParams, GlassShape, EnvMapPreset, PresetTheme } from '../types';

interface GlassControlsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  params: GlassParams;
  onChange: (updated: Partial<GlassParams>) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  activePresetName: string;
  onSelectPreset: (preset: PresetTheme) => void;
}

const SHAPES: GlassShape[] = ['Square', 'Heart', 'Oval', 'Circle', 'Hexagon (6)', 'Octagon (8)'];
const ENVS: EnvMapPreset[] = ['Royal Esplanade', 'Studio Small', 'Moonless Golf', 'Overcast', 'Cyberpunk Neon'];

const COLOR_SWATCHES = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Champagne Gold', value: '#ffdf90' },
  { name: 'Crystal Rose', value: '#ffd4e5' },
  { name: 'Cyber Cyan', value: '#80f5ff' },
  { name: 'Emerald Glass', value: '#7effb4' },
  { name: 'Smoked Violet', value: '#d580ff' },
];

export const PRESET_THEMES: PresetTheme[] = [
  {
    name: 'Code Crystal (Box)',
    shape: 'Square',
    glassColor: '#ffffff',
    envMap: 'Royal Esplanade',
    internalReflect: 1.5,
    envIntensity: 1.3,
  },
  {
    name: 'Diamond Crystal',
    shape: 'Hexagon (6)',
    glassColor: '#ffffff',
    envMap: 'Studio Small',
    internalReflect: 1.85,
    envIntensity: 1.5,
  },
  {
    name: 'Ruby Heart',
    shape: 'Heart',
    glassColor: '#ffb3c6',
    envMap: 'Royal Esplanade',
    internalReflect: 1.6,
    envIntensity: 1.2,
  },
  {
    name: 'Emerald Polygon',
    shape: 'Octagon (8)',
    glassColor: '#80ffd4',
    envMap: 'Overcast',
    internalReflect: 1.7,
    envIntensity: 1.4,
  },
  {
    name: 'Midnight Glass',
    shape: 'Square',
    glassColor: '#d6e4ff',
    envMap: 'Moonless Golf',
    internalReflect: 1.45,
    envIntensity: 1.0,
  },
];

export const GlassControlsPanel: React.FC<GlassControlsPanelProps> = ({
  isOpen,
  onClose,
  params,
  onChange,
  onUploadImage,
  onReset,
  activePresetName,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-black/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft font-sans">
      {/* Drawer Top Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-neutral-50 border-b border-black/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-black text-base tracking-tight">
              3D Glass Refraction Studio
            </h3>
            <p className="text-xs text-black/50">Realtime Shader & Lighting Inspector</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-black flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Control Content Sections */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Preset Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center space-x-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Preset Styles</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_THEMES.map((pt) => {
              const isActive = activePresetName === pt.name;
              return (
                <button
                  key={pt.name}
                  onClick={() => onSelectPreset(pt)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between ${
                    isActive
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-neutral-50 text-black/80 border-black/10 hover:bg-neutral-100 hover:border-black/20'
                  }`}
                >
                  <span className="truncate">{pt.name}</span>
                  {isActive && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content & Photo Upload */}
        <div className="pt-2 border-t border-black/5">
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center space-x-1.5 mb-2.5">
            <Upload className="w-3.5 h-3.5 text-black" />
            <span>Photo Content & Custom Image</span>
          </label>
          <div className="flex items-center space-x-3">
            <label className="flex-1 cursor-pointer bg-black text-white hover:bg-black/85 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95">
              <Upload className="w-4 h-4" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={onUploadImage} className="hidden" />
            </label>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-black/70 font-medium mb-1">
              <span>Photo Scale inside Glass</span>
              <span>{params.photoScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={params.photoScale}
              onChange={(e) => onChange({ photoScale: parseFloat(e.target.value) })}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Glass Shape selection */}
        <div className="pt-2 border-t border-black/5">
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center space-x-1.5 mb-2.5">
            <Shapes className="w-3.5 h-3.5 text-black" />
            <span>Refraction Geometry Shape</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SHAPES.map((shape) => {
              const isSelected = params.shape === shape;
              return (
                <button
                  key={shape}
                  onClick={() => onChange({ shape })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border text-center ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-neutral-50 text-black/80 border-black/10 hover:bg-neutral-100'
                  }`}
                >
                  {shape}
                </button>
              );
            })}
          </div>
        </div>

        {/* Glass Color & Tint */}
        <div className="pt-2 border-t border-black/5">
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center space-x-1.5 mb-2.5">
            <Palette className="w-3.5 h-3.5 text-black" />
            <span>Glass Tint Color</span>
          </label>
          <div className="flex items-center space-x-2 mb-3">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                onClick={() => onChange({ glassColor: swatch.value })}
                title={swatch.name}
                className={`w-7 h-7 rounded-full border border-black/20 shadow-xs transition-transform hover:scale-110 flex items-center justify-center ${
                  params.glassColor.toLowerCase() === swatch.value.toLowerCase()
                    ? 'ring-2 ring-black ring-offset-2'
                    : ''
                }`}
                style={{ backgroundColor: swatch.value }}
              />
            ))}
            <input
              type="color"
              value={params.glassColor}
              onChange={(e) => onChange({ glassColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border border-black/20 bg-transparent"
            />
          </div>
        </div>

        {/* Lighting & Environment Map */}
        <div className="pt-2 border-t border-black/5">
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center space-x-1.5 mb-2.5">
            <Sun className="w-3.5 h-3.5 text-black" />
            <span>HDRI Environment Lighting</span>
          </label>
          <select
            value={params.envMap}
            onChange={(e) => onChange({ envMap: e.target.value as EnvMapPreset })}
            className="w-full bg-neutral-50 border border-black/15 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:ring-2 focus:ring-black mb-3"
          >
            {ENVS.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-black/70 font-medium mb-1">
                <span>Refraction Index (IOR)</span>
                <span>{params.internalReflect.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.33"
                step="0.01"
                value={params.internalReflect}
                onChange={(e) => onChange({ internalReflect: parseFloat(e.target.value) })}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-black/70 font-medium mb-1">
                <span>Environment Brightness</span>
                <span>{params.envIntensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={params.envIntensity}
                onChange={(e) => onChange({ envIntensity: parseFloat(e.target.value) })}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Interaction & Animation Mode */}
        <div className="pt-2 border-t border-black/5">
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center space-x-1.5 mb-2.5">
            <Move3d className="w-3.5 h-3.5 text-black" />
            <span>3D Interaction & Animation</span>
          </label>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => onChange({ orbitEnabled: !params.orbitEnabled })}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-between ${
                params.orbitEnabled
                  ? 'bg-black text-white border-black'
                  : 'bg-neutral-50 text-black/70 border-black/10'
              }`}
            >
              <span>360° Drag Orbit</span>
              <Move3d className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onChange({ mouseInteraction: !params.mouseInteraction })}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-between ${
                params.mouseInteraction
                  ? 'bg-black text-white border-black'
                  : 'bg-neutral-50 text-black/70 border-black/10'
              }`}
            >
              <span>Mouse Parallax</span>
              <MousePointer className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-black/70 font-medium mb-1">
                <span>Rotation Speed</span>
                <span>{params.globalSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={params.globalSpeed}
                onChange={(e) => onChange({ globalSpeed: parseFloat(e.target.value) })}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Bottom Actions */}
      <div className="p-4 bg-neutral-50 border-t border-black/10 flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs font-semibold text-black/70 hover:text-black py-2 px-3 rounded-lg hover:bg-black/5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
        <button
          onClick={onClose}
          className="bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-black/85 transition-colors shadow-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
};
