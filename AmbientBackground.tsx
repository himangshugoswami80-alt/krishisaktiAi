'use client';

import { useEffect, useState } from 'react';

const nodes = [
  { left: '12%', top: '22%', delay: '0s' },
  { left: '78%', top: '16%', delay: '1.2s' },
  { left: '88%', top: '68%', delay: '2.1s' },
  { left: '24%', top: '82%', delay: '.7s' },
  { left: '55%', top: '42%', delay: '1.6s' },
];

export function AmbientBackground() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return <div aria-hidden="true" className={`ambient ${reduced ? 'ambient-reduced' : ''}`}>
    <div className="ambient-glow ambient-glow-one" />
    <div className="ambient-glow ambient-glow-two" />
    <div className="ambient-grid" />
    <svg className="ambient-lines" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <path d="M110 170 C 330 60, 390 420, 620 340 S 920 120, 1120 250" />
      <path d="M20 650 C 260 520, 360 690, 540 490 S 840 390, 1190 610" />
      <path d="M260 0 C 330 170, 580 210, 720 80 S 930 30, 1200 160" />
    </svg>
    {nodes.map((node) => <span key={node.left} className="ambient-node" style={{ left: node.left, top: node.top, animationDelay: node.delay }} />)}
  </div>;
}
