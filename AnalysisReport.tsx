'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, CircleAlert, Leaf, ShieldCheck, Sparkles, Store, Timer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { demoScan, normalizeScan, type ScanReport } from '@/lib/scan-data';
import { ScoreRing } from '@/components/ScoreRing';

export function AnalysisReport() {
  const [report, setReport] = useState<ScanReport>(demoScan);
  const [preview, setPreview] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const storedReport = sessionStorage.getItem('krishilens-report');
    const storedPreview = sessionStorage.getItem('krishilens-preview');
    if (storedReport) {
      try {
        setReport(normalizeScan(JSON.parse(storedReport) as Record<string, unknown>));
      } catch {
        setLoadError(true);
      }
    }
    if (storedPreview) setPreview(storedPreview);
  }, []);

  if (loadError) return <div className="mx-auto max-w-6xl rounded-[28px] border border-[#f0d6d0] bg-white p-8"><h1 className="text-2xl font-semibold text-ink">This analysis could not be loaded.</h1><p className="mt-2 text-sm text-[#718079]">Start a new scan to create a fresh report.</p><Link href="/scanner" className="mt-6 inline-flex rounded-full bg-forest px-5 py-3 text-xs font-semibold text-white">Start new scan</Link></div>;

  return <div className="mx-auto max-w-6xl">
    <div className="mb-8 flex items-center justify-between"><Link href="/scanner" className="flex items-center gap-2 text-xs font-semibold text-[#718079] transition hover:text-ink"><ArrowLeft size={15} /> Scan another</Link><span className="flex items-center gap-2 text-xs font-medium text-[#718079]"><span className="h-2 w-2 rounded-full bg-leaf" /> Analysis complete</span></div>
    <div className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-leaf">KrishiLens intelligence report</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] text-ink sm:text-6xl">Your produce,<br /><span className="text-[#91ad98]">understood.</span></h1></div>
    <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative min-h-[390px] overflow-hidden rounded-[30px] bg-[#132119] p-6 text-white"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(183,243,74,.2),transparent_42%)]" />{preview ? <Image src={preview} alt={report.produce} fill unoptimized sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover opacity-55" /> : <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 30% 32%, #efad86 0 15%, transparent 16%), radial-gradient(circle at 68% 63%, #c96552 0 20%, transparent 21%), radial-gradient(circle at 44% 80%, #efb18d 0 15%, transparent 16%)' }} />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101811] via-transparent to-transparent" /><div className="relative flex h-full flex-col justify-between"><div className="flex justify-between"><span className="rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-white/65 backdrop-blur">AI visual scan</span><Sparkles size={18} className="text-[#b7f34a]" /></div><div><p className="text-sm text-white/55">Detected produce</p><h2 className="mt-1 text-4xl font-semibold tracking-[-.05em]">{report.produce}</h2><div className="mt-5 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#b7f34a] text-xl font-bold text-[#132119]">{report.grade}</span><div><p className="text-sm font-semibold">Quality grade</p><p className="text-xs text-white/50">Premium condition</p></div></div></div></div>
      </motion.section>
      <div className="grid gap-5 sm:grid-cols-3"><MetricCard delay={.05} icon={<Sparkles size={17} />} label="Freshness score" value={`${report.freshness}`} suffix="/100" tone="lime" /><MetricCard delay={.1} icon={<ShieldCheck size={17} />} label="Model confidence" value={`${report.confidence}`} suffix="%" /><MetricCard delay={.15} icon={<Timer size={17} />} label="Shelf life" value={`${report.shelfLife}`} suffix=" days" /></div>
    </div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]"><motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="rounded-[28px] border border-[#e6eee6] bg-white p-6 sm:p-8"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#98a69d]">Condition profile</p><h2 className="mt-2 text-xl font-semibold tracking-tight">Freshness at a glance</h2></div><ScoreRing value={report.freshness} label="fresh" size={116} /></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-[#edf3ed]"><motion.div initial={{ width: 0 }} animate={{ width: `${report.freshness}%` }} transition={{ duration: 1.2, delay: .4 }} className="h-full rounded-full bg-[#b7f34a]" /></div><div className="mt-5 flex items-center justify-between text-xs text-[#718079]"><span>Needs attention</span><span className="font-semibold text-forest">Excellent condition</span></div></motion.section><motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} className="rounded-[28px] border border-[#e6eee6] bg-white p-6 sm:p-8"><div className="flex items-center gap-2"><CircleAlert size={17} className="text-[#c77b15]" /><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#98a69d]">Visible defects</p></div><div className="mt-7 flex flex-wrap gap-2">{report.defects.length ? report.defects.map((defect) => <span key={defect} className="rounded-full bg-[#fff6e8] px-3 py-2 text-xs font-semibold text-[#a96710]">{defect}</span>) : <span className="rounded-full bg-[#eaf8ed] px-3 py-2 text-xs font-semibold text-forest">No defects detected</span>}</div><p className="mt-7 text-sm leading-6 text-[#718079]">The model found a strong surface profile with only minor visual variation.</p></motion.section></div>
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }} className="mt-5 flex flex-col items-start justify-between gap-5 rounded-[28px] bg-[#132119] p-6 text-white sm:flex-row sm:items-center sm:p-8"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b7f34a]">Final recommendation</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.05em]">{report.recommendation}</h2><p className="mt-2 text-sm text-white/50">Spoilage risk is <span className="font-semibold text-[#b7f34a]">{report.risk}</span>. Best value comes from a cool, dry store.</p></div><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><Store size={21} className="text-[#b7f34a]" /><div><p className="text-xs font-semibold">Ready for action</p><p className="mt-1 text-[10px] text-white/45">Decision confidence {report.confidence}%</p></div><Check size={16} className="text-[#b7f34a]" /></div></motion.section>
  </div>;
}

function MetricCard({ icon, label, value, suffix, tone, delay }: { icon: React.ReactNode; label: string; value: string; suffix: string; tone?: 'lime'; delay: number }) {
  return <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: .35 }} className="rounded-[25px] border border-[#e6eee6] bg-white p-5"><span className={`grid h-9 w-9 place-items-center rounded-xl ${tone === 'lime' ? 'bg-[#eef8df] text-forest' : 'bg-[#edf3ed] text-[#718079]'}`}>{icon}</span><p className="mt-7 text-xs text-[#8b9990]">{label}</p><p className="mt-1 text-3xl font-semibold tracking-[-.06em] text-ink">{value}<small className="text-sm font-normal tracking-normal text-[#8b9990]">{suffix}</small></p></motion.div>;
}
