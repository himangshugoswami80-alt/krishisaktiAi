import { CircleCheck, CircleDot, Radio, TriangleAlert } from 'lucide-react';

type Tone = 'live' | 'demo' | 'warning' | 'quiet';

const config: Record<Tone, { label: string; className: string; icon: typeof Radio }> = {
  live: { label: 'LIVE SENSOR DATA', className: 'status-live', icon: Radio },
  demo: { label: 'DEMO DATA', className: 'status-demo', icon: CircleDot },
  warning: { label: 'ATTENTION', className: 'status-warning', icon: TriangleAlert },
  quiet: { label: 'STANDBY', className: 'status-quiet', icon: CircleCheck },
};

export function StatusBadge({ tone = 'quiet', label }: { tone?: Tone; label?: string }) {
  const item = config[tone];
  const Icon = item.icon;
  return <span className={`status-badge ${item.className}`}><Icon size={12} />{label ?? item.label}</span>;
}
