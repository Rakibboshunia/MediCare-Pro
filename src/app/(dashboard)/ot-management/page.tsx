'use client';

import React, { useState } from 'react';
import {
  HeartIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';
import toast from 'react-hot-toast';

type Surgery = {
  id: string;
  patient: string;
  surgery: string;
  doctor: string;
  otRoom: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Pending';
};

const initialSchedules: Surgery[] = [
  { id: 'OT-001', patient: 'Rahim Uddin', surgery: 'Appendectomy', doctor: 'Dr. Sarah Smith', otRoom: 'Room 1', date: '2026-09-02', time: '10:00 AM', status: 'Scheduled' },
  { id: 'OT-002', patient: 'Karim Hasan', surgery: 'Knee Replacement', doctor: 'Dr. John Doe', otRoom: 'Room 2', date: '2026-09-02', time: '01:30 PM', status: 'In Progress' },
  { id: 'OT-003', patient: 'Mina Begum', surgery: 'Cataract Surgery', doctor: 'Dr. Emily Chen', otRoom: 'Room 3', date: '2026-09-03', time: '09:00 AM', status: 'Pending' },
  { id: 'OT-004', patient: 'Sumi Akter', surgery: 'Gallbladder Removal', doctor: 'Dr. Michael Ray', otRoom: 'Room 1', date: '2026-09-01', time: '02:00 PM', status: 'Completed' },
];

const TABS = ['All', 'Scheduled', 'In Progress', 'Completed', 'Pending'] as const;
type Tab = typeof TABS[number];

const STATUS_STYLES: Record<string, string> = {
  'Completed': 'bg-green-500/10 text-green-500 border-green-500/20',
  'In Progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Scheduled': 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
  'Pending': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

export default function OTManagement() {
  const [schedules, setSchedules] = useState<Surgery[]>(initialSchedules);
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Surgery | null>(null);

  const filtered = schedules.filter(s => {
    const matchesTab = activeTab === 'All' || s.status === activeTab;
    const q = search.toLowerCase();
    const matchesSearch = s.patient.toLowerCase().includes(q) || s.surgery.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newSurgery: Surgery = {
      id: `OT-${String(schedules.length + 1).padStart(3, '0')}`,
      patient: fd.get('patient') as string,
      surgery: fd.get('surgery') as string,
      doctor: fd.get('doctor') as string,
      otRoom: fd.get('otRoom') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      status: 'Scheduled',
    };
    setSchedules([newSurgery, ...schedules]);
    toast.success('Surgery scheduled successfully!');
    setIsAddOpen(false);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const fd = new FormData(e.currentTarget);
    const updated: Surgery = {
      ...editItem,
      patient: fd.get('patient') as string,
      surgery: fd.get('surgery') as string,
      doctor: fd.get('doctor') as string,
      otRoom: fd.get('otRoom') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      status: fd.get('status') as Surgery['status'],
    };
    setSchedules(schedules.map(s => s.id === editItem.id ? updated : s));
    toast.success('Surgery updated!');
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
    toast.success('Surgery record removed.');
  };

  const stats = [
    { title: 'Total Scheduled', value: schedules.length, icon: CalendarDaysIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'In Progress', value: schedules.filter(s => s.status === 'In Progress').length, icon: ClockIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Completed Today', value: schedules.filter(s => s.status === 'Completed').length, icon: CheckCircleIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Surgeons Available', value: 6, icon: UserGroupIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const SurgeryForm = ({ defaultValues, onSubmit, onClose }: { defaultValues?: Surgery; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) => (
    <form onSubmit={onSubmit}>
      <div className={formStyles.formGroup}>
        <label>Patient Name</label>
        <input type="text" name="patient" required defaultValue={defaultValues?.patient} placeholder="e.g. Rahim Uddin" />
      </div>
      <div className={formStyles.formGroup}>
        <label>Surgery Type</label>
        <input type="text" name="surgery" required defaultValue={defaultValues?.surgery} placeholder="e.g. Appendectomy" />
      </div>
      <div className={formStyles.formGroup}>
        <label>Assigned Surgeon</label>
        <select name="doctor" required defaultValue={defaultValues?.doctor}>
          <option value="">Select Surgeon</option>
          {['Dr. Sarah Smith', 'Dr. John Doe', 'Dr. Emily Chen', 'Dr. Michael Ray'].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <div className={formStyles.formGroup}>
        <label>OT Room</label>
        <select name="otRoom" required defaultValue={defaultValues?.otRoom}>
          {['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5'].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={formStyles.formGroup}>
          <label>Date</label>
          <input type="date" name="date" required defaultValue={defaultValues?.date} />
        </div>
        <div className={formStyles.formGroup}>
          <label>Time</label>
          <input type="text" name="time" required defaultValue={defaultValues?.time} placeholder="e.g. 10:00 AM" />
        </div>
      </div>
      {defaultValues && (
        <div className={formStyles.formGroup}>
          <label>Status</label>
          <select name="status" defaultValue={defaultValues.status}>
            {(['Pending', 'Scheduled', 'In Progress', 'Completed'] as const).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      <div className={formStyles.formActions}>
        <button type="button" className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="submit" className={formStyles.submitBtn}>{defaultValues ? 'Save Changes' : 'Schedule Surgery'}</button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Operation Theatre (OT)</h1>
        <button onClick={() => setIsAddOpen(true)} className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-sm whitespace-nowrap">
          <PlusIcon className="w-5 h-5" /> Schedule Surgery
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-panel p-5 flex items-center gap-4 hover:border-accent-primary/30 transition-colors group">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">{s.title}</p>
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel flex flex-col overflow-hidden">
        {/* Search + Tabs */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-muted flex-1 w-full sm:max-w-xs">
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
            <input type="text" placeholder="Search patient or surgery..." className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-accent-primary text-white' : 'text-text-secondary hover:bg-bg-primary'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm">
                {['Surgery ID', 'Patient', 'Surgery Type', 'Surgeon', 'OT Room', 'Date & Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 font-medium text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? filtered.map(s => (
                <tr key={s.id} className="hover:bg-bg-primary/50 transition-colors text-sm">
                  <td className="px-5 py-4 font-medium text-text-primary whitespace-nowrap">{s.id}</td>
                  <td className="px-5 py-4 text-text-primary font-semibold whitespace-nowrap">{s.patient}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{s.surgery}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{s.doctor}</td>
                  <td className="px-5 py-4 text-text-secondary font-medium whitespace-nowrap">{s.otRoom}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-text-primary font-medium">{s.date}</div>
                    <div className="text-text-muted text-xs">{s.time}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditItem(s)} className="p-1.5 text-text-muted hover:text-accent-primary rounded-lg hover:bg-accent-primary/10 transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="text-center p-8 text-text-muted">No surgeries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule Surgery">
        <SurgeryForm onSubmit={handleAdd} onClose={() => setIsAddOpen(false)} />
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Surgery">
        {editItem && <SurgeryForm defaultValues={editItem} onSubmit={handleEdit} onClose={() => setEditItem(null)} />}
      </Modal>
    </div>
  );
}
