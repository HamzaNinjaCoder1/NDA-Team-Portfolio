import React from 'react';
import { X, Play, Volume2, Sparkles, Film } from 'lucide-react';
import showreelThumb from '../assets/images/showreel_thumb_1785664053900.jpg';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700 rounded-3xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-800/60 border-b border-neutral-700/60">
          <div className="flex items-center space-x-3">
            <Film className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white text-base sm:text-lg">
              NDA — Master Showreel 2011–2026
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-700/80 text-white flex items-center justify-center hover:bg-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage / Preview Content */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center group overflow-hidden">
          <img
            src={showreelThumb}
            alt="Showreel Preview"
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 flex flex-col justify-between p-6 sm:p-10">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold">
                ★ 4K ULTRA HD • 60 FPS
              </span>
              <span className="text-xs text-neutral-400 font-mono">03:45 / 03:45</span>
            </div>

            <div className="flex flex-col items-center justify-center my-auto space-y-4">
              <button
                onClick={() => alert('Playing high definition showreel reel stream!')}
                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <Play className="w-9 h-9 fill-black ml-1" />
              </button>
              <p className="text-sm font-medium text-white/90 tracking-wide text-center max-w-md">
                Interactive WebGL Shader Art, Generative Raymarching & Refraction Geometry
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-neutral-300 font-mono">
              <span>Client Works & Experimental Shaders</span>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-neutral-400" />
                <span>Stereo Ambient Audio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
