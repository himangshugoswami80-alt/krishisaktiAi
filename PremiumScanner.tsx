'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera, ImagePlus, RefreshCw, ScanLine, Sparkles, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { normalizeScan } from '@/lib/scan-data';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type Mode = 'camera' | 'upload';

export function PremiumScanner() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mode, setMode] = useState<Mode>('camera');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => () => stopCamera(), []);

  async function startCamera() {
    setMode('camera');
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraReady(true);
    } catch {
      setCameraError(true);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }

  function captureFrame() {
    const video = videoRef.current;
    if (!video || !cameraReady) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const captured = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setFile(captured);
      setPreview(URL.createObjectURL(blob));
      stopCamera();
    }, 'image/jpeg', .92);
  }

  function selectFile(nextFile?: File) {
    if (!nextFile) return;
    stopCamera();
    setMode('upload');
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  }

  async function scanNow() {
    if (!file || scanning) return;
    setScanning(true);
    setScanError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch(`${API_URL}/scan`, { method: 'POST', body });
      if (!response.ok) {
        const detail = await response.json().catch(() => null) as { detail?: string } | null;
        throw new Error(detail?.detail || 'Scanner unavailable');
      }
      const payload = normalizeScan(await response.json());
      sessionStorage.setItem('krishilens-report', JSON.stringify(payload));
      sessionStorage.setItem('krishilens-preview', preview ?? '');
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'The scanner could not analyze this image.');
    } finally {
      setScanning(false);
    }
  }

  return <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#101811] shadow-[0_30px_100px_rgba(7,17,10,.28)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(183,243,74,.13),transparent_40%)]" />
    <div className="relative p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-medium text-white/50"><span className="h-2 w-2 animate-pulse rounded-full bg-[#b7f34a]" /> AI vision online</div><span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[.2em] text-white/45">YOLOv8</span></div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[25px] bg-[#18251b] sm:aspect-[16/9]">
        <AnimatePresence mode="wait">
          {preview ? <motion.img key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={preview} alt="Produce preview" className="absolute inset-0 h-full w-full object-cover" /> : mode === 'camera' ? <motion.video key="video" ref={videoRef} autoPlay muted playsInline className="absolute inset-0 h-full w-full object-cover" /> : <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 grid place-items-center"><div className="text-center"><ImagePlus size={38} className="mx-auto text-white/25" /><p className="mt-3 text-sm text-white/45">Choose a produce image</p></div></motion.div>}
        </AnimatePresence>
        <div className="absolute inset-5 rounded-[19px] border border-white/20" />
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b7f34a]/40 shadow-[0_0_0_999px_rgba(6,14,8,.28)] sm:h-56 sm:w-56" />
        {scanning && <motion.div initial={{ top: '18%' }} animate={{ top: '82%' }} transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute left-6 right-6 h-px bg-[#b7f34a] shadow-[0_0_20px_5px_rgba(183,243,74,.7)]" />}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[10px] text-white/65 backdrop-blur-md"><ScanLine size={13} className="text-[#b7f34a]" /> {scanning ? 'Analyzing quality markers' : 'Center produce in the frame'}</div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-3"><button onClick={() => { stopCamera(); setPreview(null); setFile(null); startCamera(); }} className={`flex h-11 items-center gap-2 rounded-full px-5 text-xs font-semibold ${mode === 'camera' ? 'bg-white text-[#101811]' : 'border border-white/10 text-white/65'}`}><Camera size={16} /> Live camera</button><button onClick={() => inputRef.current?.click()} className={`flex h-11 items-center gap-2 rounded-full px-5 text-xs font-semibold ${mode === 'upload' ? 'bg-white text-[#101811]' : 'border border-white/10 text-white/65'}`}><Upload size={15} /> Upload image</button></div>
      <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectFile(event.target.files?.[0])} />
      {cameraError && <p className="mt-3 text-center text-xs text-[#ffad9f]">Camera access is unavailable. Upload an image instead.</p>}
      {scanError && <p role="alert" className="mt-3 text-center text-xs text-[#ffad9f]">{scanError}</p>}
      <button onClick={cameraReady ? captureFrame : scanNow} disabled={scanning || (!file && !cameraReady)} className="group mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#b7f34a] py-4 text-sm font-bold text-[#101811] transition hover:bg-[#d0ff78] disabled:cursor-not-allowed disabled:opacity-35"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#101811]/10">{scanning ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}</span>{cameraReady ? 'Capture frame' : scanning ? 'Building your report' : 'Scan now'}<ArrowRight size={17} className="transition group-hover:translate-x-1" /></button>
    </div>
  </div>;
}
