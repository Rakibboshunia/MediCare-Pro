'use client';

import React, { useState } from 'react';
import {
  ClipboardDocumentListIcon,
  HeartIcon,
  FireIcon,
  ChartPieIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';
import toast from 'react-hot-toast';

type DietStatus = 'Pending' | 'Preparing' | 'Prepared' | 'Delivered';

type DietPlan = {
  id: string;
  patient: string;
  ward: string;
  mealType: string;
  calories: number;
  allergies: string;
  status: DietStatus;
};

const MEAL_TYPES = ['Regular Balanced', 'Diabetic Diet', 'Liquid Diet', 'High Protein', 'Low Sodium', 'Low Fat', 'Gluten Free', 'Post-Op Diet'];
const WARDS = ['General Ward', 'ICU', 'Post-Op Ward', 'Maternity', 'Pediatrics', 'Emergency', 'Oncology'];

const STATUS_STYLES: Record<DietStatus, string> = {
  'Pending': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'Preparing': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Prepared': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Delivered': 'bg-green-500/10 text-green-500 border-green-500/20',
};

const initialPlans: DietPlan[] = [
  { id: 'DP-001', patient: 'Rahim Uddin', ward: 'General Ward', mealType: 'Diabetic Diet', calories: 1800, allergies: 'None', status: 'Prepared' },
  { id: 'DP-002', patient: 'Mina Begum', ward: 'ICU', mealType: 'Liquid Diet', calories: 1200, allergies: 'Nuts', status: 'Delivered' },
  { id: 'DP-003', patient: 'Karim Hasan', ward: 'Post-Op Ward', mealType: 'High Protein', calories: 2200, allergies: 'Lactose', status: 'Preparing' },
  { id: 'DP-004', patient: 'Sumi Akter', ward: 'Maternity', mealType: 'Regular Balanced', calories: 2000, allergies: 'None', status: 'Pending' },
];

export default function DietaryManagement() {
  const [plans, setPlans] = useState<DietPlan[]>(initialPlans);
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<DietPlan | null>(null);

  const filtered = plans.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.patient.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.mealType.toLowerCase().includes(q);
    const matchWard = wardFilter === 'All' || p.ward === wardFilter;
    return matchSearch && matchWard;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPlan: DietPlan = {
      id: `DP-${String(plans.length + 1).padStart(3, '0')}`,
      patient: fd.get('patient') as string,
      ward: fd.get('ward') as string,
      mealType: fd.get('mealType') as string,
      calories: Number(fd.get('calories')),
      allergies: fd.get('allergies') as string || 'None',
      status: 'Pending',
    };
    setPlans([newPlan, ...plans]);
    toast.success('Diet plan created!');
    setIsAddOpen(false);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const fd = new FormData(e.currentTarget);
    const updated: DietPlan = {
      ...editItem,
      patient: fd.get('patient') as string,
      ward: fd.get('ward') as string,
      mealType: fd.get('mealType') as string,
      calories: Number(fd.get('calories')),
      allergies: fd.get('allergies') as string || 'None',
      status: fd.get('status') as DietStatus,
    };
    setPlans(plans.map(p => p.id === editItem.id ? updated : p));
    toast.success('Diet plan updated!');
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    toast.success('Diet plan removed.');
  };

  const PlanForm = ({ defaultValues, onSubmit, onClose }: { defaultValues?: DietPlan; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) => (
    <form onSubmit={onSubmit}>
      <div className={formStyles.formGroup}>
        <label>Patient Name</label>
        <input type="text" name="patient" required defaultValue={defaultValues?.patient} placeholder="e.g. Rahim Uddin" />
      </div>
      <div className={formStyles.formGroup}>
        <label>Ward / Location</label>
        <select name="ward" required defaultValue={defaultValues?.ward}>
          <option value="">Select Ward</option>
          {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div className={formStyles.formGroup}>
        <label>Meal / Diet Type</label>
        <select name="mealType" required defaultValue={defaultValues?.mealType}>
          <option value="">Select Meal Type</option>
          {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className={formStyles.formGroup}>
        <label>Estimated Calories (kcal)</label>
        <input type="number" name="calories" required defaultValue={defaultValues?.calories} min="200" max="4000" placeholder="e.g. 1800" />
      </div>
      <div className={formStyles.formGroup}>
        <label>Allergies / Restrictions</label>
        <input type="text" name="allergies" defaultValue={defaultValues?.allergies} placeholder="e.g. Nuts, Lactose (or None)" />
      </div>
      {defaultValues && (
        <div className={formStyles.formGroup}>
          <label>Status</label>
          <select name="status" defaultValue={defaultValues.status}>
            {(['Pending', 'Preparing', 'Prepared', 'Delivered'] as DietStatus[]).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      <div className={formStyles.formActions}>
        <button type="button" className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="submit" className={formStyles.submitBtn}>{defaultValues ? 'Save Changes' : 'Create Plan'}</button>
      </div>
    </form>
  );

  const avgCalories = plans.length > 0 ? Math.round(plans.reduce((sum, p) => sum + p.calories, 0) / plans.length) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Dietary & Nutrition</h1>
        <button onClick={() => setIsAddOpen(true)} className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-sm whitespace-nowrap">
          <PlusIcon className="w-5 h-5" /> New Diet Plan
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Plans', value: plans.length, icon: ClipboardDocumentListIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Special Diets', value: plans.filter(p => p.mealType !== 'Regular Balanced').length, icon: HeartIcon, color: 'text-red-500', bg: 'bg-red-500/10' },
          { title: 'Avg. Calories', value: `${avgCalories} kcal`, icon: FireIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { title: 'Delivered Today', value: plans.filter(p => p.status === 'Delivered').length, icon: ChartPieIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
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
            <input type="text" placeholder="Search by patient, ID, or meal type..." className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={wardFilter} onChange={e => setWardFilter(e.target.value)} className="bg-bg-primary border border-border rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary">
            <option value="All">All Wards</option>
            {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm">
                {['Plan ID', 'Patient', 'Ward', 'Diet Type', 'Calories', 'Allergies', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 font-medium text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? filtered.map(p => (
                <tr key={p.id} className="hover:bg-bg-primary/50 transition-colors text-sm">
                  <td className="px-5 py-4 font-medium text-text-primary">{p.id}</td>
                  <td className="px-5 py-4 text-text-primary font-semibold whitespace-nowrap">{p.patient}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{p.ward}</td>
                  <td className="px-5 py-4 whitespace-nowrap"><span className="bg-bg-primary border border-border px-2 py-1 rounded text-xs font-medium text-text-secondary">{p.mealType}</span></td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{p.calories} kcal</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{p.allergies}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditItem(p)} className="p-1.5 text-text-muted hover:text-accent-primary rounded-lg hover:bg-accent-primary/10 transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="text-center p-8 text-text-muted">No diet plans found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Diet Plan">
        <PlanForm onSubmit={handleAdd} onClose={() => setIsAddOpen(false)} />
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Diet Plan">
        {editItem && <PlanForm defaultValues={editItem} onSubmit={handleEdit} onClose={() => setEditItem(null)} />}
      </Modal>
    </div>
  );
}
