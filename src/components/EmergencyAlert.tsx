'use client';

import { useState, useEffect, useCallback } from 'react';
import { BoltIcon, XMarkIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

const ALERT_TYPES = [
  { label: 'Code Blue', color: 'from-blue-600 to-blue-800', text: 'Cardiac Arrest — Immediate Response Required', emoji: '🔵' },
  { label: 'Code Red', color: 'from-red-600 to-red-800', text: 'Fire Emergency — Evacuate Immediately', emoji: '🔴' },
  { label: 'Code Orange', color: 'from-orange-500 to-orange-700', text: 'Hazardous Spill — Area Evacuation in Progress', emoji: '🟠' },
  { label: 'Code Black', color: 'from-gray-700 to-gray-900', text: 'Bomb Threat — Security Alert', emoji: '⚫' },
  { label: 'Code Yellow', color: 'from-yellow-500 to-yellow-700', text: 'Mass Casualty Incident — All Staff Report', emoji: '🟡' },
];

export interface EmergencyAlert {
  id: string;
  type: string;
  location: string;
  text: string;
  color: string;
  time: string;
  emoji: string;
}

let listeners: ((alert: EmergencyAlert | null) => void)[] = [];

export function broadcastAlert(alert: EmergencyAlert | null) {
  listeners.forEach(l => l(alert));
}

export function useEmergencyAlert() {
  const [alert, setAlert] = useState<EmergencyAlert | null>(null);

  useEffect(() => {
    listeners.push(setAlert);
    return () => { listeners = listeners.filter(l => l !== setAlert); };
  }, []);

  return alert;
}

// The full-screen alert overlay
export function EmergencyAlertOverlay() {
  const alert = useEmergencyAlert();
  const [muted, setMuted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!alert) return;
    const interval = setInterval(() => setTick(t => t + 1), 600);
    return () => clearInterval(interval);
  }, [alert]);

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      {/* Flashing border */}
      <div className={`absolute inset-0 border-[6px] ${tick % 2 === 0 ? 'border-red-500 opacity-100' : 'border-transparent opacity-0'} transition-all duration-300 rounded-none pointer-events-none`} />

      {/* Alert banner at top */}
      <div className={`pointer-events-auto absolute top-0 left-0 right-0 bg-gradient-to-r ${alert.color} shadow-2xl`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl ${tick % 2 === 0 ? 'scale-110' : 'scale-90'} transition-transform duration-300`}>
              {alert.emoji}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-xl tracking-wide">{alert.type}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold bg-white/20 text-white ${tick % 2 === 0 ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
                  ACTIVE
                </span>
              </div>
              <p className="text-white/90 text-sm mt-0.5">{alert.text}</p>
              <p className="text-white/70 text-xs mt-0.5">📍 {alert.location} · {alert.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(m => !m)}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors border-none cursor-pointer"
            >
              {muted ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => broadcastAlert(null)}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors border-none cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// The trigger panel (floating button + dispatch modal)
export function EmergencyAlertButton() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [location, setLocation] = useState('ICU Ward — Floor 2');
  const [selectedType, setSelectedType] = useState(0);
  const [dispatched, setDispatched] = useState(false);

  const dispatch = useCallback(() => {
    const type = ALERT_TYPES[selectedType];
    const alert: EmergencyAlert = {
      id: Date.now().toString(),
      type: type.label,
      location,
      text: type.text,
      color: type.color,
      emoji: type.emoji,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    broadcastAlert(alert);
    setDispatched(true);
    setPanelOpen(false);
    setTimeout(() => setDispatched(false), 3000);
  }, [selectedType, location]);

  return (
    <>
      {/* Floating SOS button */}
      <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-3">
        {panelOpen && (
          <div className="bg-bg-secondary border border-border rounded-2xl shadow-2xl p-5 w-80 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-red-500" /> Emergency Alert
              </h3>
              <button onClick={() => setPanelOpen(false)} className="text-text-muted hover:text-text-primary bg-transparent border-none cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Alert Type</label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {ALERT_TYPES.map((t, i) => (
                    <button
                      key={t.label}
                      onClick={() => setSelectedType(i)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all cursor-pointer text-left ${selectedType === i ? 'border-red-500 bg-red-500/10' : 'border-border bg-bg-primary hover:border-red-500/30'}`}
                    >
                      <span className="text-lg">{t.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{t.label}</p>
                        <p className="text-xs text-text-muted leading-tight">{t.text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="mt-2 w-full px-3 py-2 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none focus:border-red-400"
                />
              </div>

              <button
                onClick={dispatch}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:opacity-90 transition-opacity border-none cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
              >
                <BoltIcon className="w-5 h-5" /> BROADCAST ALERT
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setPanelOpen(p => !p)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-none cursor-pointer transition-all ${dispatched ? 'bg-green-600 scale-95' : 'bg-gradient-to-br from-red-500 to-red-700 hover:scale-110'} `}
          title="Emergency Alert"
        >
          <BoltIcon className="w-6 h-6 text-white" />
          <span className="absolute w-14 h-14 rounded-full bg-red-500 animate-ping opacity-30" />
        </button>
      </div>
    </>
  );
}
