'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

type BloodEntry = {
  id: string;
  bloodGroup: string;
  unitsAvailable: number;
  lastDonation: string;
  donorName: string;
  donorPhone: string;
  expiryDate: string;
  status: 'Available' | 'Low' | 'Critical' | 'Expired';
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const initialBloodStock: BloodEntry[] = [
  { id: 'BB-001', bloodGroup: 'A+', unitsAvailable: 45, lastDonation: '2025-07-14', donorName: 'Rafiqul Islam', donorPhone: '+880 1812-345678', expiryDate: '2025-08-13', status: 'Available' },
  { id: 'BB-002', bloodGroup: 'A-', unitsAvailable: 8, lastDonation: '2025-07-12', donorName: 'Nasrin Parvin', donorPhone: '+880 1715-678901', expiryDate: '2025-08-11', status: 'Low' },
  { id: 'BB-003', bloodGroup: 'B+', unitsAvailable: 32, lastDonation: '2025-07-13', donorName: 'Sumaiya Begum', donorPhone: '+880 1913-456789', expiryDate: '2025-08-12', status: 'Available' },
  { id: 'BB-004', bloodGroup: 'B-', unitsAvailable: 3, lastDonation: '2025-07-10', donorName: 'Jahangir Alam', donorPhone: '+880 1614-567890', expiryDate: '2025-08-09', status: 'Critical' },
  { id: 'BB-005', bloodGroup: 'AB+', unitsAvailable: 18, lastDonation: '2025-07-11', donorName: 'Kamal Uddin', donorPhone: '+880 1816-789012', expiryDate: '2025-08-10', status: 'Available' },
  { id: 'BB-006', bloodGroup: 'AB-', unitsAvailable: 5, lastDonation: '2025-07-09', donorName: 'Shahnaz Akhter', donorPhone: '+880 1711-234567', expiryDate: '2025-08-08', status: 'Low' },
  { id: 'BB-007', bloodGroup: 'O+', unitsAvailable: 62, lastDonation: '2025-07-14', donorName: 'Mizanur Rahman', donorPhone: '+880 1812-345678', expiryDate: '2025-08-13', status: 'Available' },
  { id: 'BB-008', bloodGroup: 'O-', unitsAvailable: 12, lastDonation: '2025-07-13', donorName: 'Fatema Akter', donorPhone: '+880 1711-234567', expiryDate: '2025-08-12', status: 'Low' },
];

const recentRequests = [
  { id: 'REQ-001', patient: 'Anwar Hossain', bloodGroup: 'O-', units: 2, urgency: 'Emergency', status: 'Fulfilled', date: '2025-07-14' },
  { id: 'REQ-002', patient: 'Golam Rabbani', bloodGroup: 'A+', units: 3, urgency: 'Urgent', status: 'Pending', date: '2025-07-14' },
  { id: 'REQ-003', patient: 'Rafiq Mia', bloodGroup: 'B-', units: 1, urgency: 'Emergency', status: 'Pending', date: '2025-07-14' },
  { id: 'REQ-004', patient: 'Selina Parvin', bloodGroup: 'AB+', units: 2, urgency: 'Routine', status: 'Fulfilled', date: '2025-07-13' },
];

export default function BloodBank() {
  const [bloodStock, setBloodStock] = useState(initialBloodStock);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState(recentRequests);

  const totalUnits = bloodStock.reduce((a, b) => a + b.unitsAvailable, 0);
  const criticalGroups = bloodStock.filter(b => b.status === 'Critical').length;
  const lowGroups = bloodStock.filter(b => b.status === 'Low').length;

  const handleAddDonation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const group = formData.get('bloodGroup') as string;
    const units = parseInt(formData.get('units') as string);
    
    setBloodStock(bloodStock.map(b => {
      if (b.bloodGroup === group) {
        const newUnits = b.unitsAvailable + units;
        return {
          ...b,
          unitsAvailable: newUnits,
          lastDonation: new Date().toISOString().split('T')[0],
          donorName: formData.get('donorName') as string,
          donorPhone: formData.get('donorPhone') as string,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: newUnits > 20 ? 'Available' as const : newUnits > 5 ? 'Low' as const : 'Critical' as const,
        };
      }
      return b;
    }));
    setIsModalOpen(false);
  };

  const handleFulfillRequest = (reqId: string) => {
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'Fulfilled' } : r));
  };

  const getGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      'A+': 'from-rose-500 to-pink-600',
      'A-': 'from-rose-400 to-pink-500',
      'B+': 'from-cyan-500 to-blue-600',
      'B-': 'from-cyan-400 to-blue-500',
      'AB+': 'from-violet-500 to-purple-600',
      'AB-': 'from-violet-400 to-purple-500',
      'O+': 'from-emerald-500 to-green-600',
      'O-': 'from-emerald-400 to-green-500',
    };
    return colors[group] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 p-6 rounded-2xl border border-red-500/20 shadow-sm">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400">🩸 Blood Bank</h1>
          <p className="text-sm text-text-muted mt-2 font-medium">Blood inventory management, donor tracking, and emergency requests</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-500/30 cursor-pointer flex items-center gap-2 text-sm border-none">
          <PlusIcon className="w-5 h-5" /> Record Donation
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-700">{totalUnits}</span>
          <span className="text-sm text-text-secondary font-semibold uppercase tracking-wider">Total Units Available</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors"></div>
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">{lowGroups}</span>
          <span className="text-sm text-text-secondary font-semibold uppercase tracking-wider">Low Stock Groups</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-colors"></div>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">{criticalGroups}</span>
            {criticalGroups > 0 && <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
          </div>
          <span className="text-sm text-text-secondary font-semibold uppercase tracking-wider">Critical Groups</span>
        </div>
      </div>

      {/* Blood Group Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {bloodStock.map((blood) => (
          <div key={blood.id} className="bg-bg-primary/40 backdrop-blur-sm border border-border rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-red-500/30 cursor-pointer group">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGroupColor(blood.bloodGroup)} flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-${getGroupColor(blood.bloodGroup).split('-')[1]}/30 group-hover:scale-110 transition-transform duration-300`}>
              {blood.bloodGroup}
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-text-primary group-hover:text-red-500 transition-colors">{blood.unitsAvailable}</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">units</p>
            </div>
            <span className={`text-[11px] px-4 py-1.5 rounded-full font-bold shadow-sm border ${
              blood.status === 'Available' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
              blood.status === 'Low' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
              blood.status === 'Critical' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse' :
              'bg-bg-secondary text-text-muted border-border'
            }`}>{blood.status}</span>
            {blood.status === 'Critical' && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-500/10 px-3 py-1.5 rounded-lg w-full justify-center">
                <ExclamationTriangleIcon className="w-4 h-4" /> Urgent Need
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Blood Requests */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-text-primary">Recent Blood Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Request ID</th>
                <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Patient</th>
                <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Blood Group</th>
                <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Units</th>
                <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Urgency</th>
                <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Status</th>
                <th className="p-3 text-text-muted font-medium border-b border-border text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-bg-primary/50 transition-colors">
                  <td className="p-3 border-b border-border text-text-muted font-medium text-sm">{req.id}</td>
                  <td className="p-3 border-b border-border text-text-primary font-semibold text-sm">{req.patient}</td>
                  <td className="p-3 border-b border-border text-sm">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${getGroupColor(req.bloodGroup)}`}>
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="p-3 border-b border-border text-text-primary font-semibold text-sm">{req.units}</td>
                  <td className="p-3 border-b border-border text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      req.urgency === 'Emergency' ? 'bg-danger-light text-danger' :
                      req.urgency === 'Urgent' ? 'bg-warning-light text-warning' :
                      'bg-accent-light text-accent-primary'
                    }`}>{req.urgency}</span>
                  </td>
                  <td className="p-3 border-b border-border text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Fulfilled' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'
                    }`}>{req.status}</span>
                  </td>
                  <td className="p-3 border-b border-border text-sm">
                    {req.status === 'Pending' && (
                      <button onClick={() => handleFulfillRequest(req.id)} className="px-3 py-1 rounded-lg bg-success-light text-success text-xs font-semibold cursor-pointer border-none hover:bg-success hover:text-white transition-colors">
                        Fulfill
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Blood Donation">
        <form onSubmit={handleAddDonation}>
          <div className={formStyles.formGroup}>
            <label>Blood Group</label>
            <select name="bloodGroup" required>
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Units Donated</label>
            <input type="number" name="units" required min="1" placeholder="1" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Donor Name</label>
            <input type="text" name="donorName" required placeholder="e.g. Rafiqul Islam" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Donor Phone</label>
            <input type="text" name="donorPhone" required placeholder="+880 1711-000000" />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Record Donation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
