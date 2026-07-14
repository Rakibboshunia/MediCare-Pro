'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

type Bed = {
  id: string;
  ward: string;
  floor: number;
  type: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  patient?: string;
  admittedDate?: string;
  doctor?: string;
};

const initialBeds: Bed[] = [
  { id: 'BED-A101', ward: 'Cardiology', floor: 1, type: 'ICU', status: 'Occupied', patient: 'Rafiqul Islam', admittedDate: '2025-07-10', doctor: 'Dr. Karim Hossain' },
  { id: 'BED-A102', ward: 'Cardiology', floor: 1, type: 'ICU', status: 'Occupied', patient: 'Kamal Uddin', admittedDate: '2025-07-12', doctor: 'Dr. Karim Hossain' },
  { id: 'BED-A103', ward: 'Cardiology', floor: 1, type: 'Semi-Private', status: 'Available' },
  { id: 'BED-A104', ward: 'Cardiology', floor: 1, type: 'General', status: 'Reserved', patient: 'Mizanur Rahman', admittedDate: '2025-07-15', doctor: 'Dr. Karim Hossain' },
  { id: 'BED-B201', ward: 'General Medicine', floor: 2, type: 'General', status: 'Occupied', patient: 'Fatema Akter', admittedDate: '2025-07-08', doctor: 'Dr. Rashida Khanam' },
  { id: 'BED-B202', ward: 'General Medicine', floor: 2, type: 'General', status: 'Available' },
  { id: 'BED-B203', ward: 'General Medicine', floor: 2, type: 'Semi-Private', status: 'Maintenance' },
  { id: 'BED-B204', ward: 'General Medicine', floor: 2, type: 'Private', status: 'Occupied', patient: 'Sumaiya Begum', admittedDate: '2025-07-11', doctor: 'Dr. Rashida Khanam' },
  { id: 'BED-C301', ward: 'Neurology', floor: 3, type: 'ICU', status: 'Occupied', patient: 'Nasrin Parvin', admittedDate: '2025-07-09', doctor: 'Dr. Sabrina Sultana' },
  { id: 'BED-C302', ward: 'Neurology', floor: 3, type: 'General', status: 'Available' },
  { id: 'BED-C303', ward: 'Neurology', floor: 3, type: 'General', status: 'Available' },
  { id: 'BED-D401', ward: 'Orthopedics', floor: 4, type: 'Semi-Private', status: 'Occupied', patient: 'Jahangir Alam', admittedDate: '2025-07-12', doctor: 'Dr. Iftekhar Ahmed' },
  { id: 'BED-D402', ward: 'Orthopedics', floor: 4, type: 'General', status: 'Available' },
  { id: 'BED-D403', ward: 'Orthopedics', floor: 4, type: 'Private', status: 'Occupied', patient: 'Shahnaz Akhter', admittedDate: '2025-07-13', doctor: 'Dr. Iftekhar Ahmed' },
  { id: 'BED-E501', ward: 'Pediatrics', floor: 5, type: 'General', status: 'Occupied', patient: 'Child - Arif Hasan', admittedDate: '2025-07-14', doctor: 'Dr. Mahbubur Rahman' },
  { id: 'BED-E502', ward: 'Pediatrics', floor: 5, type: 'General', status: 'Available' },
  { id: 'BED-E503', ward: 'Pediatrics', floor: 5, type: 'NICU', status: 'Maintenance' },
  { id: 'BED-E504', ward: 'Pediatrics', floor: 5, type: 'General', status: 'Available' },
];

export default function BedManagement() {
  const [beds, setBeds] = useState(initialBeds);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWard, setFilterWard] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const wards = ['All', ...Array.from(new Set(beds.map(b => b.ward)))];
  const statuses = ['All', 'Available', 'Occupied', 'Reserved', 'Maintenance'];

  const filteredBeds = beds.filter(bed => {
    const matchSearch = bed.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (bed.patient?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchWard = filterWard === 'All' || bed.ward === filterWard;
    const matchStatus = filterStatus === 'All' || bed.status === filterStatus;
    return matchSearch && matchWard && matchStatus;
  });

  const totalBeds = beds.length;
  const available = beds.filter(b => b.status === 'Available').length;
  const occupied = beds.filter(b => b.status === 'Occupied').length;
  const maintenance = beds.filter(b => b.status === 'Maintenance').length;
  const reserved = beds.filter(b => b.status === 'Reserved').length;
  const occupancyRate = Math.round((occupied / totalBeds) * 100);

  const handleDischarge = (bedId: string) => {
    setBeds(beds.map(bed => 
      bed.id === bedId ? { ...bed, status: 'Available' as const, patient: undefined, admittedDate: undefined, doctor: undefined } : bed
    ));
  };

  const handleAddBed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBed: Bed = {
      id: `BED-${(formData.get('ward') as string).charAt(0)}${formData.get('floor')}0${beds.length + 1}`,
      ward: formData.get('ward') as string,
      floor: parseInt(formData.get('floor') as string),
      type: formData.get('type') as string,
      status: 'Available',
    };
    setBeds([...beds, newBed]);
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
      case 'Occupied': return 'bg-rose-500/15 text-rose-500 border-rose-500/30';
      case 'Reserved': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      case 'Maintenance': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Available': return <CheckCircleIcon className="w-4 h-4" />;
      case 'Occupied': return <XCircleIcon className="w-4 h-4" />;
      case 'Reserved': return <ExclamationTriangleIcon className="w-4 h-4" />;
      default: return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Bed Management</h1>
          <p className="text-sm text-text-muted mt-1">Real-time bed availability and patient allocation</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm border-none"
        >
          <PlusIcon className="w-5 h-5" /> Add Bed
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-4 flex flex-col items-center gap-1">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
              <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${occupancyRate} ${100 - occupancyRate}`}
                className={occupancyRate > 85 ? 'text-rose-500' : occupancyRate > 60 ? 'text-amber-500' : 'text-emerald-500'} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">{occupancyRate}%</span>
          </div>
          <span className="text-xs text-text-muted font-medium">Occupancy</span>
        </div>
        {[
          { label: 'Total Beds', value: totalBeds, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Available', value: available, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Occupied', value: occupied, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Maintenance', value: maintenance + reserved, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-4 flex flex-col items-center gap-1">
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-text-muted font-medium">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-panel p-5 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-muted flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="w-5 h-5" />
            <input type="text" placeholder="Search bed ID or patient..." className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none cursor-pointer"
            value={filterWard} onChange={(e) => setFilterWard(e.target.value)}>
            {wards.map(w => <option key={w}>{w}</option>)}
          </select>
          <select className="px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none cursor-pointer"
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center bg-bg-primary border border-border rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer border-none ${viewMode === 'grid' ? 'bg-accent-primary text-white' : 'bg-transparent text-text-muted hover:text-text-primary'}`}>Grid</button>
            <button onClick={() => setViewMode('table')} className={`px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer border-none ${viewMode === 'table' ? 'bg-accent-primary text-white' : 'bg-transparent text-text-muted hover:text-text-primary'}`}>Table</button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredBeds.map((bed) => (
              <div key={bed.id} className={`p-3 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer group ${getStatusColor(bed.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold opacity-80">{bed.id}</span>
                  {getStatusIcon(bed.status)}
                </div>
                <div className="text-[10px] font-medium opacity-70 mb-1">{bed.type}</div>
                <div className="text-xs font-semibold">{bed.ward}</div>
                {bed.patient && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <p className="text-[10px] font-semibold truncate">{bed.patient}</p>
                    <p className="text-[9px] opacity-60 mt-0.5">{bed.doctor}</p>
                  </div>
                )}
                {bed.status === 'Occupied' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDischarge(bed.id); }}
                    className="mt-2 w-full py-1 text-[10px] font-bold rounded-md bg-white/20 hover:bg-white/40 transition-colors cursor-pointer border-none opacity-0 group-hover:opacity-100"
                  >
                    Discharge
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Bed ID</th>
                  <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Ward</th>
                  <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Floor</th>
                  <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Type</th>
                  <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Patient</th>
                  <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Doctor</th>
                  <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Status</th>
                  <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeds.map((bed) => (
                  <tr key={bed.id} className="transition-colors hover:bg-bg-primary/50">
                    <td className="p-3 border-b border-border text-text-primary font-semibold text-sm">{bed.id}</td>
                    <td className="p-3 border-b border-border text-text-primary text-sm">{bed.ward}</td>
                    <td className="p-3 border-b border-border text-text-muted text-sm">Floor {bed.floor}</td>
                    <td className="p-3 border-b border-border text-text-muted text-sm">{bed.type}</td>
                    <td className="p-3 border-b border-border text-text-primary text-sm font-medium">{bed.patient || '-'}</td>
                    <td className="p-3 border-b border-border text-text-muted text-sm">{bed.doctor || '-'}</td>
                    <td className="p-3 border-b border-border text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        bed.status === 'Available' ? 'bg-success-light text-success' :
                        bed.status === 'Occupied' ? 'bg-danger-light text-danger' :
                        bed.status === 'Reserved' ? 'bg-warning-light text-warning' :
                        'bg-bg-secondary text-text-muted'
                      }`}>{bed.status}</span>
                    </td>
                    <td className="p-3 border-b border-border text-sm">
                      {bed.status === 'Occupied' && (
                        <button onClick={() => handleDischarge(bed.id)} className="px-3 py-1 rounded-md bg-danger-light text-danger text-xs font-semibold cursor-pointer border-none hover:bg-danger hover:text-white transition-colors">
                          Discharge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Bed">
        <form onSubmit={handleAddBed}>
          <div className={formStyles.formGroup}>
            <label>Ward</label>
            <select name="ward" required>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Floor</label>
            <input type="number" name="floor" required min="1" max="10" placeholder="1" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Bed Type</label>
            <select name="type" required>
              <option value="General">General</option>
              <option value="Semi-Private">Semi-Private</option>
              <option value="Private">Private</option>
              <option value="ICU">ICU</option>
              <option value="NICU">NICU</option>
            </select>
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Add Bed</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
