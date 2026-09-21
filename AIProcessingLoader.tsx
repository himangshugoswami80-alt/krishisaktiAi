import { CircleCheck, LoaderCircle } from 'lucide-react';

const stages = ['Uploading image', 'Detecting food', 'Analyzing visual quality', 'Checking defects', 'Combining sensor data', 'Predicting shelf life', 'Generating report'];

export function AIProcessingLoader({ active = 0, compact = false }: { active?: number; compact?: boolean }) {
  return <div className={`processing-loader ${compact ? 'processing-loader-compact' : ''}`}>
    <div className="processing-orbit"><span /><span /><span /><LoaderCircle size={compact ? 18 : 24} /></div>
    <div className="processing-copy"><p className="eyebrow">KrishiSetu intelligence engine</p><h2>{stages[Math.min(active, stages.length - 1)]}...</h2><div className="processing-track"><span style={{ width: `${Math.max(8, ((active + 1) / stages.length) * 100)}%` }} /></div></div>
    {!compact && <div className="processing-stages">{stages.map((stage, index) => <span key={stage} className={index < active ? 'stage-done' : index === active ? 'stage-active' : ''}>{index < active ? <CircleCheck size={13} /> : <i />}{stage}</span>)}</div>}
  </div>;
}
