'use client';

import { Atom, RotateCcw } from 'lucide-react';

type ReactionCanvasProps = {
  isPlaying: boolean;
  onReset: () => void;
};

export function ReactionCanvas({ isPlaying, onReset }: ReactionCanvasProps) {
  return <section className="relative min-h-[390px] overflow-hidden rounded-2xl bg-[#101811] p-5 text-white shadow-[0_25px_80px_rgba(7,17,10,.2)] sm:p-7">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(183,243,74,.16),transparent_30%),linear-gradient(135deg,#101811,#18251b)]" />
    <div className="grid-paper absolute inset-0 opacity-20" />
    <div className="relative flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-medium text-white/65"><span className="h-2 w-2 rounded-full bg-[#b7f34a] shadow-[0_0_12px_#b7f34a]" /> 3D reaction canvas</div><button onClick={onReset} aria-label="Reset canvas" title="Reset canvas" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/50 transition hover:border-white/25 hover:text-white"><RotateCcw size={14} /></button></div>
    <div className={`relative mx-auto mt-7 flex h-64 max-w-[530px] items-center justify-center transition-transform duration-1000 ${isPlaying ? 'scale-[1.03]' : 'scale-100'}`}>
      <div className={`absolute h-56 w-56 rounded-full border border-[#b7f34a]/20 shadow-[0_0_70px_rgba(183,243,74,.1)] ${isPlaying ? 'animate-pulse' : ''}`} />
      <div className="absolute h-40 w-40 rounded-full border border-dashed border-white/15" />
      <div className={`relative grid h-20 w-20 place-items-center rounded-full border border-[#b7f34a]/50 bg-[#b7f34a]/10 shadow-[0_0_35px_rgba(183,243,74,.25)] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}><Atom size={34} className="text-[#d0ff78]" /></div>
      {[['left-10 top-12', 'Na+'], ['right-10 top-16', 'Cl-'], ['left-16 bottom-10', 'H2O'], ['right-16 bottom-8', 'OH-']].map(([position, label]) => <div key={label} className={`absolute ${position} grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-[10px] font-bold text-white/75 backdrop-blur-sm ${isPlaying ? 'animate-bounce' : ''}`} style={{ animationDuration: '2.8s' }}>{label}</div>)}
      <div className="absolute inset-x-16 top-1/2 h-px bg-gradient-to-r from-transparent via-[#b7f34a]/60 to-transparent" />
    </div>
    <div className="relative mt-2 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] uppercase tracking-[.18em] text-white/35"><span>Interactive preview</span><span>{isPlaying ? 'Reaction running' : 'Paused at 00:00'}</span></div>
  </section>;
}