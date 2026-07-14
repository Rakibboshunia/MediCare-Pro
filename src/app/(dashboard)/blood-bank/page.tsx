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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">🩸 Blood Bank</h1>
          <p className="text-sm text-text-muted mt-1">Blood inventory management and donor tracking</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-danger text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm border-none">
          <PlusIcon className="w-5 h-5" /> Record Donation
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 flex flex-col gap-1">
          <span className="text-3xl font-bold text-text-primary">{totalUnits}</span>
          <span className="text-xs text-text-muted font-medium">Total Units Available</span>
        </div>
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-amber-500">
          <span className="text-3xl font-bold text-amber-500">{lowGroups}</span>
          <span className="text-xs text-text-muted font-medium">Low Stock Groups</span>
        </div>
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-red-500">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-red-500">{criticalGroups}</span>
            {criticalGroups > 0 && <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
          </div>
          <span className="text-xs text-text-muted font-medium">Critical Groups</span>
        </div>
      </div>

      {/* Blood Group Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {bloodStock.map((blood) => (
          <div key={blood.id} className="glass-panel p-5 flex flex-col items-center gap-3 hover:shadow-glow transition-all cursor-pointer group">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGroupColor(blood.bloodGroup)} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform`}>
              {blood.bloodGroup}
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">{blood.unitsAvailable}</p>
              <p className="text-xs text-text-muted">units</p>
            </div>
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${
              blood.status === 'Available' ? 'bg-success-light text-success' :
              blood.status === 'Low' ? 'bg-warning-light text-warning' :
              blood.status === 'Critical' ? 'bg-danger-light text-danger' :
              'bg-bg-secondary text-text-muted'
            }`}>{blood.status}</span>
            {blood.status === 'Critical' && (
              <div className="flex items-center gap-1 text-[10px] text-danger font-medium">
                <ExclamationTriangleIcon className="w-3.5 h-3.5" /> Urgent Need
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
