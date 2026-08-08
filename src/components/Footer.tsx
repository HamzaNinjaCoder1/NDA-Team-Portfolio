import React from 'react';
import { ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { NAV_ITEMS, SitePath, TEAM } from '../site';

export const Footer: React.FC<{ onNavigate: (path: SitePath) => void }> = ({ onNavigate }) => (
  <footer className="bg-black px-6 py-12 text-white sm:px-10 lg:px-14">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 border-y border-white/15 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div><p className="font-serif text-4xl font-bold">NDA.</p><h2 className="mt-5 text-xl font-medium">Senior software & creative technology team.</h2><p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">Distributed across Colombia, Japan, and Ukraine. Available worldwide.</p></div>
        <div><p className="font-mono text-[10px] font-bold tracking-widest text-white/45">NAVIGATION</p><div className="mt-4 grid grid-cols-2 gap-3">{NAV_ITEMS.map(([label, path]) => <button key={path} onClick={() => onNavigate(path)} className="cursor-pointer text-left font-mono text-xs text-white/75 hover:text-white">{label}</button>)}</div></div>
        <div><p className="font-mono text-[10px] font-bold tracking-widest text-white/45">CONTACT</p><div className="mt-4 space-y-3"><a href="mailto:saasbusiness2026@gmail.com" className="flex items-center gap-2 font-mono text-xs text-white/75 hover:text-white"><Mail size={13} /> EMAIL NDA</a><a href="https://wa.me/380937713309" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs text-white/75 hover:text-white"><MessageCircle size={13} /> +380 93 771 3309</a><div className="pt-2">{TEAM.filter(member => member.link).map(member => <a key={member.name} href={member.link} target="_blank" rel="noreferrer" className="flex items-center justify-between py-1 font-mono text-xs text-white/75 hover:text-white">{member.name}<ExternalLink size={13} /></a>)}</div></div></div>
      </div>
    </div>
  </footer>
);
