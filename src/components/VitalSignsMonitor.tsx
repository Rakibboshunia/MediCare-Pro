
'use client';

import { useState, useEffect, useRef } from 'react';

interface VitalConfig {
  label: string;
  unit: string;
  color: string;
  min: number;
  max: number;
  normal: [number, number];
  decimals?: number;
}

const VITALS: VitalConfig[] = [
  { label: 'Heart Rate', unit: 'bpm', color: '#ef4444', min: 40, max: 160, normal: [60, 100] },
  { label: 'SpO₂', unit: '%', color: '#3b82f6', min: 85, max: 100, normal: [95, 100] },
  { label: 'Blood Pressure', unit: 'mmHg', color: '#a855f7', min: 60, max: 180, normal: [90, 130] },
  { label: 'Temperature', unit: '°C', color: '#f97316', min: 35, max: 40, normal: [36.1, 37.5], decimals: 1 },
  { label: 'Resp. Rate', unit: '/min', color: '#10b981', min: 8, max: 30, normal: [12, 20] },
];

function useVitalValue(config: VitalConfig) {
  const [value, setValue] = useState(() => {
    const mid = (config.normal[0] + config.normal[1]) / 2;
    return parseFloat(mid.toFixed(config.decimals ?? 0));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => {
        const drift = (Math.random() - 0.5) * (config.max - config.min) * 0.04;
        const next = Math.min(config.max, Math.max(config.min, prev + drift));
        return parseFloat(next.toFixed(config.decimals ?? 0));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [config]);

  const isNormal = value >= config.normal[0] && value <= config.normal[1];
  return { value, isNormal };
}

function EcgWave({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    const ecg = (x: number) => {
      const t = (x % 100) / 100;
      if (t < 0.1) return 0;
      if (t < 0.15) return (t - 0.1) / 0.05 * -8;
      if (t < 0.2) return ((t - 0.15) / 0.05) * 8 - 8;
      if (t < 0.25) return ((0.25 - t) / 0.05) * 40;
      if (t < 0.3) return ((t - 0.25) / 0.05) * -40 + 40;
      if (t < 0.35) return ((0.35 - t) / 0.05) * -5;
      if (t < 0.4) return ((t - 0.35) / 0.05) * 5 - 5;
      if (t < 0.45) return 0;
      if (t < 0.5) return (t - 0.45) / 0.05 * -12;
      if (t < 0.6) return (0.6 - t) / 0.1 * -12;
      return 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 10) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Glowing trace
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      for (let px = 0; px < W; px++) {
        const dataX = (px + offsetRef.current) % (W * 2);
        const y = H / 2 + ecg(dataX * 0.8) * (H / 90);
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();

      // Moving cursor
      const cursorX = W - (offsetRef.current % W);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.setLineDash([2, 4]);
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, H);
      ctx.stroke();
      ctx.setLineDash([]);

      offsetRef.current = (offsetRef.current + 1.5) % (W * 2);
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [color]);

  return <canvas ref={canvasRef} width={200} height={50} className="w-full" style={{ height: 50 }} />;
}

function VitalCard({ config }: { config: VitalConfig }) {
  const { value, isNormal } = useVitalValue(config);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setBlink(b => !b), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 flex flex-col gap-2 transition-all duration-500 ${isNormal ? 'border-border bg-bg-secondary' : 'border-red-500/50 bg-red-500/5'}`}>
      {!isNormal && (
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white transition-opacity ${blink ? 'opacity-100 bg-red-500' : 'opacity-0 bg-transparent'}`}>
          ⚠ ALERT
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{config.label}</p>
        <div className={`w-2 h-2 rounded-full ${isNormal ? 'bg-emerald-400' : 'bg-red-400'} ${blink ? 'opacity-100' : 'opacity-40'} transition-opacity`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black font-mono" style={{ color: config.color }}>
          {value}
        </span>
        <span className="text-sm text-text-muted">{config.unit}</span>
      </div>
      <EcgWave color={config.color} />
      <div className="flex justify-between text-[10px] text-text-muted mt-1">
        <span>Normal: {config.normal[0]}–{config.normal[1]} {config.unit}</span>
        <span className={isNormal ? 'text-emerald-500' : 'text-red-500'}>{isNormal ? 'Normal' : 'Abnormal'}</span>
      </div>
    </div>
  );
}

// Patient selector
const PATIENTS = [
  { name: 'Fatema Akter', id: 'PT-001', ward: 'ICU', avatar: 'Fatema' },
  { name: 'Rafiqul Islam', id: 'PT-002', ward: 'Cardiology', avatar: 'Rafiqul' },
  { name: 'Sumaiya Begum', id: 'PT-003', ward: 'General', avatar: 'Sumaiya' },
];

export default function VitalSignsMonitor() {
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0]);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Live Vital Signs Monitor</h1>
          <p className="text-text-muted text-sm mt-1">Real-time patient vitals • Auto-refreshes every 1.2s</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">LIVE</span>
            <span className="text-emerald-600 text-sm font-mono">{formatTime(elapsed)}</span>
          </div>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="glass-panel p-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Select Patient</p>
        <div className="flex flex-wrap gap-3">
          {PATIENTS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPatient(p)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${selectedPatient.id === p.id ? 'border-accent-primary bg-accent-light' : 'border-border bg-bg-primary hover:border-accent-primary/40'}`}
            >
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.avatar}`} alt={p.name} className="w-8 h-8 rounded-full bg-bg-secondary" />
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary">{p.name}</p>
                <p className="text-xs text-text-muted">{p.id} · {p.ward}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {VITALS.map(v => (
          <VitalCard key={v.label} config={v} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-text-muted text-center">
        ⚠ This is a simulation for demonstration. Connect to actual medical devices for real monitoring.
      </p>
    </div>
  );
}
