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
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 p-6 rounded-2xl border border-teal-500/20 shadow-sm">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">Bed Management</h1>
          <p className="text-sm text-text-muted mt-2 font-medium">Real-time bed availability, patient allocation, and ward status</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-teal-500/30 cursor-pointer flex items-center gap-2 text-sm border-none"
        >
          <PlusIcon className="w-5 h-5" /> Add Bed
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        <div className="glass-panel p-5 flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
              <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${occupancyRate} ${100 - occupancyRate}`}
                className={`transition-all duration-1000 ease-out ${occupancyRate > 85 ? 'text-rose-500' : occupancyRate > 60 ? 'text-amber-500' : 'text-emerald-500'}`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-text-primary">{occupancyRate}%</span>
          </div>
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">Occupancy</span>
        </div>
        {[
          { label: 'Total Beds', value: totalBeds, color: 'from-indigo-500 to-indigo-700', bg: 'bg-indigo-500/10' },
          { label: 'Available', value: available, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Occupied', value: occupied, color: 'from-rose-400 to-rose-600', bg: 'bg-rose-500/10' },
          { label: 'Maintenance', value: maintenance + reserved, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-5 flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute -right-4 -top-4 w-20 h-20 ${stat.bg} rounded-full blur-xl group-hover:opacity-75 transition-opacity`}></div>
            <span className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-panel p-6 flex flex-col gap-6 border-t-4 border-t-teal-500">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-bg-primary/50 backdrop-blur-md border border-border focus-within:border-teal-500/50 focus-within:ring-2 focus-within:ring-teal-500/20 rounded-xl text-text-muted flex-1 min-w-[200px] transition-all shadow-sm">
            <MagnifyingGlassIcon className="w-5 h-5 text-teal-500" />
            <input type="text" placeholder="Search bed ID or patient..." className="flex-1 bg-transparent border-none text-text-primary outline-none placeholder:text-text-muted/70"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select className="px-5 py-3.5 bg-bg-primary/50 backdrop-blur-md border border-border focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 rounded-xl text-text-primary font-medium outline-none cursor-pointer shadow-sm transition-all"
            value={filterWard} onChange={(e) => setFilterWard(e.target.value)}>
            {wards.map(w => <option key={w}>{w}</option>)}
          </select>
          <select className="px-5 py-3.5 bg-bg-primary/50 backdrop-blur-md border border-border focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 rounded-xl text-text-primary font-medium outline-none cursor-pointer shadow-sm transition-all"
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center bg-bg-primary/50 backdrop-blur-md border border-border rounded-xl p-1 shadow-sm">
            <button onClick={() => setViewMode('grid')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${viewMode === 'grid' ? 'bg-teal-500 text-white shadow-md' : 'bg-transparent text-text-muted hover:text-text-primary'}`}>Grid</button>
            <button onClick={() => setViewMode('table')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${viewMode === 'table' ? 'bg-teal-500 text-white shadow-md' : 'bg-transparent text-text-muted hover:text-text-primary'}`}>Table</button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredBeds.map((bed) => (
              <div key={bed.id} className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group bg-bg-primary/40 backdrop-blur-sm ${getStatusColor(bed.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold tracking-wide opacity-90">{bed.id}</span>
                  <div className="p-1 rounded-full bg-current/10">
                    {getStatusIcon(bed.status)}
                  </div>
                </div>
                <div className="text-[11px] font-bold opacity-75 mb-1 tracking-wider uppercase">{bed.type}</div>
                <div className="text-sm font-bold">{bed.ward}</div>
                {bed.patient && (
                  <div className="mt-3 pt-3 border-t border-current/20 flex flex-col gap-1">
                    <p className="text-xs font-bold truncate">{bed.patient}</p>
                    <p className="text-[10px] opacity-80 font-medium">{bed.doctor}</p>
                  </div>
                )}
                {bed.status === 'Occupied' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDischarge(bed.id); }}
                    className="mt-3 w-full py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-all transform hover:scale-[1.02] cursor-pointer border-none opacity-0 group-hover:opacity-100 absolute bottom-3 left-0 right-0 w-[calc(100%-1.5rem)] mx-auto"
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
