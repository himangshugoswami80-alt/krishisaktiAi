'use client';

import { motion } from 'framer-motion';

export function ScoreRing({ value, label, color = '#b7f34a', size = 132 }: { value: number; label: string; color?: string; size?: number }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  return <div className="relative shrink-0" style={{ width: size, height: size }}>
    <svg className="h-full w-full -rotate-90" viewBox="0 0 110 110" aria-label={`${label}: ${value}%`}>
      <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="7" />
      <motion.circle cx="55" cy="55" r={radius} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }} transition={{ duration: 1.2, ease: 'easeOut', delay: .25 }} />
    </svg>
    <div className="absolute inset-0 grid place-items-center text-center"><div><strong className="block text-2xl font-semibold tracking-[-.06em] text-white">{value}</strong><span className="text-[9px] uppercase tracking-[.18em] text-white/50">{label}</span></div></div>
  </div>;
}
