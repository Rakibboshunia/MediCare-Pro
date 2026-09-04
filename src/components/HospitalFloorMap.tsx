'use client';

import { useState } from 'react';

type BedStatus = 'occupied' | 'available' | 'critical' | 'maintenance' | 'reserved';

interface Bed {
  id: string;
  status: BedStatus;
  patient?: string;
  doctor?: string;
  ward: string;
  floor: number;
}

const INITIAL_BEDS: Bed[] = [
  // ICU Floor 1
  { id: 'ICU-01', status: 'critical', patient: 'Fatema Akter', doctor: 'Dr. Rashida Khanam', ward: 'ICU', floor: 1 },
  { id: 'ICU-02', status: 'occupied', patient: 'Rafiqul Islam', doctor: 'Dr. Karim Hossain', ward: 'ICU', floor: 1 },
  { id: 'ICU-03', status: 'available', ward: 'ICU', floor: 1 },
  { id: 'ICU-04', status: 'critical', patient: 'Nasrin Parvin', doctor: 'Dr. Sabrina Sultana', ward: 'ICU', floor: 1 },
  { id: 'ICU-05', status: 'maintenance', ward: 'ICU', floor: 1 },
  { id: 'ICU-06', status: 'available', ward: 'ICU', floor: 1 },
  // General Floor 2
  { id: 'GEN-01', status: 'occupied', patient: 'Sumaiya Begum', doctor: 'Dr. Nusrat Jahan', ward: 'General', floor: 2 },
  { id: 'GEN-02', status: 'available', ward: 'General', floor: 2 },
  { id: 'GEN-03', status: 'occupied', patient: 'Jahangir Alam', doctor: 'Dr. Iftekhar Ahmed', ward: 'General', floor: 2 },
  { id: 'GEN-04', status: 'reserved', ward: 'General', floor: 2 },
  { id: 'GEN-05', status: 'available', ward: 'General', floor: 2 },
  { id: 'GEN-06', status: 'occupied', patient: 'Mizanur Rahman', doctor: 'Dr. Mahbubur Rahman', ward: 'General', floor: 2 },
  { id: 'GEN-07', status: 'available', ward: 'General', floor: 2 },
  { id: 'GEN-08', status: 'maintenance', ward: 'General', floor: 2 },
  // Cardiology Floor 3
  { id: 'CAR-01', status: 'critical', patient: 'Kamal Uddin', doctor: 'Dr. Karim Hossain', ward: 'Cardiology', floor: 3 },
  { id: 'CAR-02', status: 'occupied', patient: 'Shahnaz Akhter', doctor: 'Dr. Rashida Khanam', ward: 'Cardiology', floor: 3 },
  { id: 'CAR-03', status: 'available', ward: 'Cardiology', floor: 3 },
  { id: 'CAR-04', status: 'reserved', ward: 'Cardiology', floor: 3 },
  { id: 'CAR-05', status: 'available', ward: 'Cardiology', floor: 3 },
  { id: 'CAR-06', status: 'occupied', patient: 'Rahim Chowdhury', doctor: 'Dr. Sabrina Sultana', ward: 'Cardiology', floor: 3 },
  // Pediatrics Floor 4
  { id: 'PED-01', status: 'occupied', patient: 'Rina Islam', doctor: 'Dr. Mahbubur Rahman', ward: 'Pediatrics', floor: 4 },
  { id: 'PED-02', status: 'available', ward: 'Pediatrics', floor: 4 },
  { id: 'PED-03', status: 'available', ward: 'Pediatrics', floor: 4 },
  { id: 'PED-04', status: 'occupied', patient: 'Toha Ahmed', doctor: 'Dr. Nusrat Jahan', ward: 'Pediatrics', floor: 4 },
];

const STATUS_CONFIG: Record<BedStatus, { label: string; bg: string; border: string; text: string; dot: string }> = {
  occupied:    { label: 'Occupied',    bg: 'bg-blue-500/15',   border: 'border-blue-400/40',   text: 'text-blue-400',   dot: 'bg-blue-400' },
  available:   { label: 'Available',   bg: 'bg-emerald-500/15',border: 'border-emerald-400/40',text: 'text-emerald-400',dot: 'bg-emerald-400' },
  critical:    { label: 'Critical',    bg: 'bg-red-500/15',    border: 'border-red-400/40',    text: 'text-red-400',    dot: 'bg-red-400' },
  maintenance: { label: 'Maintenance', bg: 'bg-orange-500/15', border: 'border-orange-400/40', text: 'text-orange-400', dot: 'bg-orange-400' },
  reserved:    { label: 'Reserved',    bg: 'bg-purple-500/15', border: 'border-purple-400/40', text: 'text-purple-400', dot: 'bg-purple-400' },
};

export default function HospitalFloorMap() {
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [hoveredBed, setHoveredBed] = useState<string | null>(null);

  const floors = [1, 2, 3, 4];
  const floorNames: Record<number, string> = { 1: 'ICU', 2: 'General Ward', 3: 'Cardiology', 4: 'Pediatrics' };
  const floorBeds = beds.filter(b => b.floor === selectedFloor);

  const stats = {
    available: floorBeds.filter(b => b.status === 'available').length,
    occupied: floorBeds.filter(b => b.status === 'occupied').length,
    critical: floorBeds.filter(b => b.status === 'critical').length,
    maintenance: floorBeds.filter(b => b.status === 'maintenance').length,
    reserved: floorBeds.filter(b => b.status === 'reserved').length,
  };

  const updateStatus = (id: string, status: BedStatus) => {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setSelectedBed(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Hospital Floor Map</h1>
          <p className="text-text-muted text-sm mt-1">Interactive bed management — click any bed to view details</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20">
            {stats.available} Available
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 font-medium border border-red-500/20">
            {stats.critical} Critical
          </div>
        </div>
      </div>

      {/* Floor Selector */}
      <div className="flex gap-2 flex-wrap">
        {floors.map(f => (
          <button
            key={f}
            onClick={() => { setSelectedFloor(f); setSelectedBed(null); }}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer border-2 ${selectedFloor === f ? 'bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/30' : 'border-border bg-bg-secondary text-text-secondary hover:border-accent-primary/50'}`}
          >
            Floor {f} — {floorNames[f]}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Floor Plan */}
        <div className="flex-1 glass-panel p-6">
          <h2 className="text-lg font-bold text-text-primary mb-2">Floor {selectedFloor} — {floorNames[selectedFloor]}</h2>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
              const count = floorBeds.filter(b => b.status === status).length;
              return (
                <div key={status} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-xs text-text-muted">{cfg.label}: <b className="text-text-primary">{count}</b></span>
                </div>
              );
            })}
          </div>

          {/* Corridor visual */}
          <div className="relative">
            {/* Corridor line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-px z-0" />
            <div className="text-xs text-text-muted text-center mb-3 relative z-10 bg-bg-secondary/50 mx-auto w-fit px-2 py-0.5 rounded">— Corridor —</div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 relative z-10">
              {floorBeds.map(bed => {
                const cfg = STATUS_CONFIG[bed.status];
                const isSelected = selectedBed?.id === bed.id;
                return (
                  <button
                    key={bed.id}
                    onClick={() => setSelectedBed(isSelected ? null : bed)}
                    onMouseEnter={() => setHoveredBed(bed.id)}
                    onMouseLeave={() => setHoveredBed(null)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer group
                      ${cfg.bg} ${cfg.border}
                      ${isSelected ? 'ring-2 ring-accent-primary scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-md'}
                      ${bed.status === 'critical' ? 'animate-pulse' : ''}
                    `}
                    title={bed.id}
                  >
                    {/* Bed icon */}
                    <div className="text-2xl mb-1">
                      {bed.status === 'available' ? '🛏️' :
                       bed.status === 'critical' ? '🚨' :
                       bed.status === 'maintenance' ? '🔧' :
                       bed.status === 'reserved' ? '📋' : '🧑‍⚕️'}
                    </div>
                    <p className={`text-xs font-bold ${cfg.text}`}>{bed.id}</p>
                    {bed.patient && (
                      <p className="text-[10px] text-text-muted mt-0.5 truncate w-full text-center">{bed.patient.split(' ')[0]}</p>
                    )}
                    <div className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bed Details Panel */}
        <div className="w-full lg:w-72 glass-panel p-5 flex flex-col gap-4">
          {selectedBed ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-text-primary text-lg">{selectedBed.id}</h3>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${STATUS_CONFIG[selectedBed.status].bg} ${STATUS_CONFIG[selectedBed.status].text}`}>
                  {STATUS_CONFIG[selectedBed.status].label}
                </span>
              </div>

              {selectedBed.patient ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-bg-primary rounded-xl">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedBed.patient}`} alt="" className="w-10 h-10 rounded-full bg-bg-secondary" />
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{selectedBed.patient}</p>
                      <p className="text-xs text-text-muted">{selectedBed.ward} Ward</p>
                    </div>
                  </div>
                  {selectedBed.doctor && (
                    <div>
                      <p className="text-xs text-text-muted">Attending Doctor</p>
                      <p className="text-sm font-medium text-text-primary mt-0.5">{selectedBed.doctor}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-bg-primary rounded-xl text-center text-text-muted text-sm">
                  No patient assigned
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Change Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(STATUS_CONFIG) as BedStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedBed.id, s)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${selectedBed.status === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} ${STATUS_CONFIG[s].border} border-2` : 'border-border bg-bg-primary text-text-muted hover:border-accent-primary/30'}`}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-text-muted">
              <span className="text-5xl">🏥</span>
              <p className="text-sm">Select a bed to view<br />details and manage status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
