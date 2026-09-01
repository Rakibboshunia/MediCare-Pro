'use client';

import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  DocumentCheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';
import toast from 'react-hot-toast';

type ClaimStatus = 'Approved' | 'Pending' | 'Rejected';

type Claim = {
  id: string;
  patient: string;
  provider: string;
  amount: string;
  date: string;
  status: ClaimStatus;
};

const initialClaims: Claim[] = [
  { id: 'CLM-9821', patient: 'Abdullah Al Mamun', provider: 'MetLife Insurance', amount: '45000', date: '2026-09-01', status: 'Approved' },
  { id: 'CLM-9822', patient: 'Nafis Ahmed', provider: 'Green Delta', amount: '12500', date: '2026-08-30', status: 'Pending' },
  { id: 'CLM-9823', patient: 'Sadia Islam', provider: 'Pragati Insurance', amount: '8000', date: '2026-08-28', status: 'Rejected' },
  { id: 'CLM-9824', patient: 'Kamrul Hasan', provider: 'MetLife Insurance', amount: '120000', date: '2026-08-25', status: 'Approved' },
];

const STATUS_STYLES: Record<ClaimStatus, string> = {
  'Approved': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Pending': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
};

const PROVIDERS = ['MetLife Insurance', 'Green Delta', 'Pragati Insurance', 'Rupali Life', 'National Life'];

export default function InsuranceClaims() {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Claim | null>(null);

  const filtered = claims.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.patient.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newClaim: Claim = {
      id: `CLM-${9824 + claims.length + 1}`,
      patient: fd.get('patient') as string,
      provider: fd.get('provider') as string,
      amount: fd.get('amount') as string,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setClaims([newClaim, ...claims]);
    toast.success('Insurance claim submitted!');
    setIsAddOpen(false);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const fd = new FormData(e.currentTarget);
    const updated: Claim = {
      ...editItem,
      patient: fd.get('patient') as string,
      provider: fd.get('provider') as string,
      amount: fd.get('amount') as string,
      status: fd.get('status') as ClaimStatus,
    };
    setClaims(claims.map(c => c.id === editItem.id ? updated : c));
    toast.success('Claim updated!');
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setClaims(claims.filter(c => c.id !== id));
    toast.success('Claim removed.');
  };

  const ClaimForm = ({ defaultValues, onSubmit, onClose }: { defaultValues?: Claim; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) => (
    <form onSubmit={onSubmit}>
      <div className={formStyles.formGroup}>
        <label>Patient Name</label>
        <input type="text" name="patient" required defaultValue={defaultValues?.patient} placeholder="e.g. Karim Hasan" />
      </div>
      <div className={formStyles.formGroup}>
        <label>Insurance Provider</label>
        <select name="provider" required defaultValue={defaultValues?.provider}>
          <option value="">Select Provider</option>
          {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className={formStyles.formGroup}>
        <label>Claim Amount (৳)</label>
        <input type="number" name="amount" required defaultValue={defaultValues?.amount} placeholder="e.g. 50000" min="1" />
      </div>
      {defaultValues && (
        <div className={formStyles.formGroup}>
          <label>Status</label>
          <select name="status" defaultValue={defaultValues.status}>
            {(['Pending', 'Approved', 'Rejected'] as ClaimStatus[]).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      <div className={formStyles.formActions}>
        <button type="button" className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="submit" className={formStyles.submitBtn}>{defaultValues ? 'Save Changes' : 'Submit Claim'}</button>
      </div>
    </form>
  );

  const stats = [
    { title: 'Total Claims', value: claims.length, icon: ShieldCheckIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Approved', value: claims.filter(c => c.status === 'Approved').length, icon: DocumentCheckIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Pending', value: claims.filter(c => c.status === 'Pending').length, icon: ArrowPathIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Rejected', value: claims.filter(c => c.status === 'Rejected').length, icon: ExclamationCircleIcon, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Insurance Claims</h1>
        <button onClick={() => setIsAddOpen(true)} className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-sm whitespace-nowrap">
          <PlusIcon className="w-5 h-5" /> New Claim
        </button>
      </div>

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
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-muted flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
            <input type="text" placeholder="Search by patient, ID, or provider..." className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-bg-primary border border-border rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary">
            {['All', 'Pending', 'Approved', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm">
                {['Claim ID', 'Patient', 'Provider', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 font-medium text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? filtered.map(c => (
                <tr key={c.id} className="hover:bg-bg-primary/50 transition-colors text-sm">
                  <td className="px-5 py-4 font-medium text-text-primary">{c.id}</td>
                  <td className="px-5 py-4 text-text-primary font-semibold whitespace-nowrap">{c.patient}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{c.provider}</td>
                  <td className="px-5 py-4 text-text-primary font-medium whitespace-nowrap">৳ {Number(c.amount).toLocaleString()}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{c.date}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditItem(c)} className="p-1.5 text-text-muted hover:text-accent-primary rounded-lg hover:bg-accent-primary/10 transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="text-center p-8 text-text-muted">No claims found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Insurance Claim">
        <ClaimForm onSubmit={handleAdd} onClose={() => setIsAddOpen(false)} />
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Claim">
        {editItem && <ClaimForm defaultValues={editItem} onSubmit={handleEdit} onClose={() => setEditItem(null)} />}
      </Modal>
    </div>
  );
}
