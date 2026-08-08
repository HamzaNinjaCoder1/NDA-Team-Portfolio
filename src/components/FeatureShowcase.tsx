import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Sun, 
  Shapes, 
  Cpu, 
  CheckCircle2, 
  Sliders, 
  Zap,
  Box,
  Image as ImageIcon
} from 'lucide-react';
import { GlassParams, PresetTheme } from '../types';

interface FeatureShowcaseProps {
  onSelectPreset: (preset: PresetTheme) => void;
  activePresetName: string;
  presets: PresetTheme[];
  onOpenControls: () => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  onSelectPreset,
  activePresetName,
  presets,
  onOpenControls,
}) => {
  return (
    <section className="w-full py-16 px-4 sm:px-8 lg:px-12 bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-black/60 mb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Technical Capabilities & Design System</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight">
              Crafted with Physical WebGL Refraction
            </h2>
          </div>
          <p className="text-sm text-black/70 max-w-md font-medium leading-relaxed">
            Real-time optical refraction, specular highlights, customizable geometries, and HDR reflections powered by Three.js & custom GLSL shaders.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Geometries */}
          <div className="p-8 rounded-3xl bg-neutral-50 border border-black/10 hover:border-black/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Shapes className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-2">
                Dynamic Refraction Geometries
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                Switch between smooth rounded boxes, sculpted heart shapes, hex polygons, and custom bevel extrusions in real-time without recompiling shaders.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/5 flex items-center space-x-2 text-xs font-mono text-black/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Parametric Bezier & Bevel Extrusions</span>
            </div>
          </div>

          {/* Card 2: Physical Materials */}
          <div className="p-8 rounded-3xl bg-neutral-50 border border-black/10 hover:border-black/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-2">
                Physical Mesh Transmission (IOR)
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                Adjust Index of Refraction (IOR) from 1.0 to 2.33 (diamond level), opacity, clearcoat, and attenuation color for hyper-realistic glass aesthetics.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/5 flex items-center space-x-2 text-xs font-mono text-black/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ACESFilmic Tone Mapping Enabled</span>
            </div>
          </div>

          {/* Card 3: Custom Texture Upload */}
          <div className="p-8 rounded-3xl bg-neutral-50 border border-black/10 hover:border-black/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-2">
                Embedded Artwork & Photo Scale
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                Upload your own photos or artwork to instantly view them refracted through crystal glass with custom aspect-ratio scaling.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/5 flex items-center space-x-2 text-xs font-mono text-black/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>sRGB Color Space Calibration</span>
            </div>
          </div>
        </div>

        {/* Refraction Presets Showcase Cards */}
        <div id="presets" className="pt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/60">
                Studio Library
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                Refraction Material Presets
              </h3>
            </div>
            <button
              onClick={onOpenControls}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-black/85 transition-colors"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Studio Controls</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {presets.map((preset) => {
              const isActive = activePresetName === preset.name;
              return (
                <div
                  key={preset.name}
                  onClick={() => onSelectPreset(preset)}
                  className={`p-5 rounded-2xl cursor-pointer border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'bg-black text-white border-black shadow-lg scale-[1.02]'
                      : 'bg-neutral-50 text-black border-black/10 hover:border-black/30 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-black/70'
                    }`}>
                      {preset.shape}
                    </span>
                    <Sparkles className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-black/40'}`} />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base tracking-tight mb-1">
                      {preset.name}
                    </h4>
                    <p className={`text-xs ${isActive ? 'text-white/70' : 'text-black/60'}`}>
                      IOR {preset.internalReflect.toFixed(2)} • {preset.envMap}
                    </p>
                  </div>

                  <div className={`pt-3 border-t text-xs font-bold flex items-center justify-between ${
                    isActive ? 'border-white/15 text-amber-300' : 'border-black/5 text-black'
                  }`}>
                    <span>{isActive ? 'Active Preset' : 'Apply Preset'}</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
