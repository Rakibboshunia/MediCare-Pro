'use client';

import React, { useState } from 'react';
import {
  WrenchScrewdriverIcon,
  CogIcon,
  CalendarIcon,
  CheckBadgeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';
import toast from 'react-hot-toast';

type EqStatus = 'Operational' | 'Needs Maintenance' | 'Under Repair';

type Equipment = {
  id: string;
  name: string;
  department: string;
  lastMaintained: string;
  nextMaintenance: string;
  status: EqStatus;
};

const DEPARTMENTS = ['Radiology', 'ICU', 'Cardiology', 'Surgery', 'Emergency', 'Pathology', 'Pharmacy'];

const STATUS_STYLES: Record<EqStatus, string> = {
  'Operational': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Needs Maintenance': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Under Repair': 'bg-red-500/10 text-red-500 border-red-500/20',
};

const initialEquipment: Equipment[] = [
  { id: 'EQ-MRI-01', name: 'MRI Scanner', department: 'Radiology', lastMaintained: '2026-08-15', nextMaintenance: '2026-11-15', status: 'Operational' },
  { id: 'EQ-XRAY-02', name: 'X-Ray Machine', department: 'Radiology', lastMaintained: '2026-05-10', nextMaintenance: '2026-09-10', status: 'Needs Maintenance' },
  { id: 'EQ-VENT-05', name: 'ICU Ventilator', department: 'ICU', lastMaintained: '2026-08-01', nextMaintenance: '2026-09-01', status: 'Under Repair' },
  { id: 'EQ-ECG-12', name: 'ECG Machine', department: 'Cardiology', lastMaintained: '2026-07-20', nextMaintenance: '2026-10-20', status: 'Operational' },
  { id: 'EQ-US-08', name: 'Ultrasound Machine', department: 'Radiology', lastMaintained: '2026-08-10', nextMaintenance: '2026-11-10', status: 'Operational' },
];

export default function EquipmentMaintenance() {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Equipment | null>(null);

  const filtered = equipment.filter(eq => {
    const q = search.toLowerCase();
    const matchSearch = eq.name.toLowerCase().includes(q) || eq.id.toLowerCase().includes(q) || eq.department.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || eq.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newEq: Equipment = {
      id: `EQ-${String(equipment.length + 1).padStart(3, '0')}`,
      name: fd.get('name') as string,
      department: fd.get('department') as string,
      lastMaintained: fd.get('lastMaintained') as string,
      nextMaintenance: fd.get('nextMaintenance') as string,
      status: 'Operational',
    };
    setEquipment([newEq, ...equipment]);
    toast.success('Equipment added!');
    setIsAddOpen(false);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const fd = new FormData(e.currentTarget);
    const updated: Equipment = {
      ...editItem,
      name: fd.get('name') as string,
      department: fd.get('department') as string,
      lastMaintained: fd.get('lastMaintained') as string,
      nextMaintenance: fd.get('nextMaintenance') as string,
      status: fd.get('status') as EqStatus,
    };
    setEquipment(equipment.map(eq => eq.id === editItem.id ? updated : eq));
    toast.success('Equipment record updated!');
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setEquipment(equipment.filter(eq => eq.id !== id));
    toast.success('Equipment removed.');
  };

  const EqForm = ({ defaultValues, onSubmit, onClose }: { defaultValues?: Equipment; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) => (
    <form onSubmit={onSubmit}>
      <div className={formStyles.formGroup}>
        <label>Equipment Name</label>
        <input type="text" name="name" required defaultValue={defaultValues?.name} placeholder="e.g. MRI Scanner" />
      </div>
      <div className={formStyles.formGroup}>
        <label>Department</label>
        <select name="department" required defaultValue={defaultValues?.department}>
          <option value="">Select Department</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={formStyles.formGroup}>
          <label>Last Maintained</label>
          <input type="date" name="lastMaintained" required defaultValue={defaultValues?.lastMaintained} />
        </div>
        <div className={formStyles.formGroup}>
          <label>Next Maintenance</label>
          <input type="date" name="nextMaintenance" required defaultValue={defaultValues?.nextMaintenance} />
        </div>
      </div>
      {defaultValues && (
        <div className={formStyles.formGroup}>
          <label>Status</label>
          <select name="status" defaultValue={defaultValues.status}>
            {(['Operational', 'Needs Maintenance', 'Under Repair'] as EqStatus[]).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      <div className={formStyles.formActions}>
        <button type="button" className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="submit" className={formStyles.submitBtn}>{defaultValues ? 'Save Changes' : 'Add Equipment'}</button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Equipment Maintenance</h1>
        <button onClick={() => setIsAddOpen(true)} className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-sm whitespace-nowrap">
          <PlusIcon className="w-5 h-5" /> Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Assets', value: equipment.length, icon: CogIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Operational', value: equipment.filter(e => e.status === 'Operational').length, icon: CheckBadgeIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Needs Maintenance', value: equipment.filter(e => e.status === 'Needs Maintenance').length, icon: CalendarIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { title: 'Under Repair', value: equipment.filter(e => e.status === 'Under Repair').length, icon: WrenchScrewdriverIcon, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((s, i) => (
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
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-muted flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
            <input type="text" placeholder="Search by name, ID, or department..." className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-bg-primary border border-border rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary">
            {['All', 'Operational', 'Needs Maintenance', 'Under Repair'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm">
                {['Equipment ID', 'Name', 'Department', 'Last Maintained', 'Next Scheduled', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 font-medium text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? filtered.map(eq => (
                <tr key={eq.id} className="hover:bg-bg-primary/50 transition-colors text-sm">
                  <td className="px-5 py-4 font-medium text-text-primary">{eq.id}</td>
                  <td className="px-5 py-4 text-text-primary font-semibold whitespace-nowrap">{eq.name}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{eq.department}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{eq.lastMaintained}</td>
                  <td className="px-5 py-4 font-medium whitespace-nowrap" style={{ color: new Date(eq.nextMaintenance) <= new Date() ? 'var(--warning)' : undefined }}>{eq.nextMaintenance}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[eq.status]}`}>{eq.status}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditItem(eq)} className="p-1.5 text-text-muted hover:text-accent-primary rounded-lg hover:bg-accent-primary/10 transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(eq.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="text-center p-8 text-text-muted">No equipment found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Equipment">
        <EqForm onSubmit={handleAdd} onClose={() => setIsAddOpen(false)} />
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Equipment">
        {editItem && <EqForm defaultValues={editItem} onSubmit={handleEdit} onClose={() => setEditItem(null)} />}
      </Modal>
    </div>
  );
}
