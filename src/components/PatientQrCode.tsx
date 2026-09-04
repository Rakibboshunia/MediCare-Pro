'use client';

import { useState, useRef } from 'react';
import { QrCodeIcon, ArrowDownTrayIcon, PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  ward?: string;
}

// Minimal QR code builder using path SVG (no external library needed)
// Uses a simple visual QR-like grid for demonstration
function QrDisplay({ value, size = 160 }: { value: string; size?: number }) {
  // Create a deterministic pseudo-QR pattern from the string
  const hash = Array.from(value).reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
  const grid = 21;
  const cells: boolean[][] = [];

  // Fixed finder patterns (top-left, top-right, bottom-left)
  const finderPositions = [
    [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,0],[1,6],[2,0],[2,2],[2,3],[2,4],[2,6],
    [3,0],[3,2],[3,3],[3,4],[3,6],[4,0],[4,2],[4,3],[4,4],[4,6],
    [5,0],[5,6],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],
  ];

  for (let r = 0; r < grid; r++) {
    cells[r] = [];
    for (let c = 0; c < grid; c++) {
      // Finder patterns
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c > grid - 8;
      const inBottomLeft = r > grid - 8 && c < 7;

      if (inTopLeft) {
        cells[r][c] = finderPositions.some(([fr, fc]) => fr === r && fc === c);
      } else if (inTopRight) {
        cells[r][c] = finderPositions.some(([fr, fc]) => fr === r && fc === (c - (grid - 7)));
      } else if (inBottomLeft) {
        cells[r][c] = finderPositions.some(([fr, fc]) => fr === (r - (grid - 7)) && fc === c);
      } else {
        // Data cells — pseudo-random from hash
        const seed = (hash ^ (r * 73 + c * 37)) >>> 0;
        cells[r][c] = (seed % 3) !== 0;
      }
    }
  }

  const cellSize = size / grid;

  return (
    <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        {cells.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize - 0.5}
                height={cellSize - 0.5}
                fill="#0f172a"
                rx={cellSize * 0.15}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

const SAMPLE_PATIENTS: Patient[] = [
  { id: 'PT-001', name: 'Fatema Akter', age: 34, bloodGroup: 'O+', ward: 'ICU' },
  { id: 'PT-002', name: 'Rafiqul Islam', age: 47, bloodGroup: 'A-', ward: 'Cardiology' },
  { id: 'PT-003', name: 'Sumaiya Begum', age: 29, bloodGroup: 'B+', ward: 'General' },
  { id: 'PT-004', name: 'Jahangir Alam', age: 55, bloodGroup: 'AB+', ward: 'Orthopedics' },
  { id: 'PT-005', name: 'Nasrin Parvin', age: 42, bloodGroup: 'O-', ward: 'Neurology' },
];

export default function PatientQrCode() {
  const [selected, setSelected] = useState<Patient | null>(null);
  const [search, setSearch] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = SAMPLE_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const qrValue = selected ? `MEDICARE-PRO|${selected.id}|${selected.name}|${selected.age}|${selected.bloodGroup}|${selected.ward}` : '';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
          <QrCodeIcon className="w-8 h-8 text-accent-primary" /> Patient QR Code
        </h1>
        <p className="text-text-muted text-sm mt-1">Generate unique QR codes for instant patient record access</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Patient List */}
        <div className="flex-1 glass-panel p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Select Patient</h2>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none focus:border-accent-primary/50"
          />
          <div className="flex flex-col gap-2">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all cursor-pointer text-left ${selected?.id === p.id ? 'border-accent-primary bg-accent-light' : 'border-border bg-bg-primary hover:border-accent-primary/40'}`}
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} alt={p.name} className="w-10 h-10 rounded-full bg-bg-secondary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary text-sm truncate">{p.name}</p>
                  <p className="text-xs text-text-muted">{p.id} · Age {p.age} · {p.bloodGroup}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-bg-secondary text-text-muted shrink-0">{p.ward}</span>
              </button>
            ))}
          </div>
        </div>

        {/* QR Display */}
        <div className="w-full lg:w-80 glass-panel p-6 flex flex-col items-center gap-5">
          {selected ? (
            <>
              <div ref={printRef} className="flex flex-col items-center gap-4 w-full">
                <QrDisplay value={qrValue} size={180} />

                <div className="text-center w-full">
                  <p className="font-bold text-text-primary text-lg">{selected.name}</p>
                  <p className="text-text-muted text-sm">{selected.id} · Ward: {selected.ward}</p>
                  <div className="flex justify-center gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-1 rounded-lg bg-bg-primary text-xs text-text-muted border border-border">Age: {selected.age}</span>
                    <span className="px-2 py-1 rounded-lg bg-danger-light text-danger text-xs font-semibold border border-danger/20">🩸 {selected.bloodGroup}</span>
                  </div>
                </div>

                <div className="w-full p-3 bg-bg-primary rounded-xl border border-border">
                  <p className="text-[10px] text-text-muted text-center font-mono break-all">{qrValue}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary text-sm font-medium hover:bg-border transition-colors cursor-pointer"
                >
                  <PrinterIcon className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2.5 bg-bg-primary border border-border rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text-muted py-8">
              <QrCodeIcon className="w-20 h-20 opacity-20" />
              <p className="text-sm text-center">Select a patient from the list to generate their QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
