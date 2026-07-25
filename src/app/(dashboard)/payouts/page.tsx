'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, CheckCircleIcon, BanknotesIcon, ClockIcon, BuildingLibraryIcon, DevicePhoneMobileIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const initialPayouts = [
  { id: 'PAY-8801', recipient: 'Dr. Sarah Connor', role: 'Cardiologist', date: '2025-07-24', amount: '৳ 85,000', method: 'Bank Transfer', status: 'Completed' },
  { id: 'PAY-8802', recipient: 'Md. Ali Hossain', role: 'Vendor', date: '2025-07-25', amount: '৳ 12,500', method: 'Mobile Money', status: 'Pending' },
  { id: 'PAY-8803', recipient: 'Dr. John Doe', role: 'Neurologist', date: '2025-07-20', amount: '৳ 92,000', method: 'Bank Transfer', status: 'Completed' },
  { id: 'PAY-8804', recipient: 'Jamal Bhuyan', role: 'Nurse', date: '2025-07-25', amount: '৳ 22,000', method: 'Mobile Money', status: 'Pending' },
  { id: 'PAY-8805', recipient: 'Medical Supplies Ltd.', role: 'Supplier', date: '2025-07-15', amount: '৳ 1,45,000', method: 'Bank Transfer', status: 'Completed' },
];

export default function Payouts() {
  const [payouts, setPayouts] = useState(initialPayouts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPayouts = payouts.filter((pay) => {
    const matchesSearch = pay.recipient.toLowerCase().includes(searchQuery.toLowerCase()) || pay.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || pay.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProcessPayout = (id: string) => {
    setPayouts(payouts.map(pay => pay.id === id ? { ...pay, status: 'Completed' } : pay));
    toast.success(`Payout ${id} processed successfully!`);
  };

  const handleNewPayout = () => {
    toast('Process New Payout modal would open here.', { icon: '💸' });
  };

  // Calculate totals
  const totalPayoutsAmount = payouts.reduce((acc, curr) => acc + parseInt(curr.amount.replace('৳', '').replace(/,/g, '').trim()), 0);
  const completedAmount = payouts.filter(p => p.status === 'Completed').reduce((acc, curr) => acc + parseInt(curr.amount.replace('৳', '').replace(/,/g, '').trim()), 0);
  const pendingAmount = payouts.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + parseInt(curr.amount.replace('৳', '').replace(/,/g, '').trim()), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', minimumFractionDigits: 0 }).format(amount).replace('BDT', '৳');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Payouts</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage payments to doctors, staff, and vendors</p>
        </div>
        <button 
          onClick={handleNewPayout}
          className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-all hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-primary/30 cursor-pointer flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" /> Process Payout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
            <BanknotesIcon className="w-24 h-24 text-text-primary" />
          </div>
          <span className="text-text-secondary font-medium relative z-10 text-sm uppercase tracking-wider">Total Payouts</span>
          <span className="text-4xl font-bold text-text-primary relative z-10">{formatCurrency(totalPayoutsAmount)}</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 border-success/20 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
            <CheckCircleIcon className="w-24 h-24 text-success" />
          </div>
          <span className="text-success font-medium relative z-10 text-sm uppercase tracking-wider">Completed</span>
          <span className="text-4xl font-bold text-success relative z-10">{formatCurrency(completedAmount)}</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 border-warning/20 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
            <ClockIcon className="w-24 h-24 text-warning" />
          </div>
          <span className="text-warning font-medium relative z-10 text-sm uppercase tracking-wider">Pending Processing</span>
          <span className="text-4xl font-bold text-warning relative z-10">{formatCurrency(pendingAmount)}</span>
        </div>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-muted w-full sm:max-w-md focus-within:border-accent-primary/50 focus-within:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] transition-all">
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by recipient or ID..." 
              className="flex-1 bg-transparent border-none text-text-primary outline-none min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-text-muted text-sm font-medium whitespace-nowrap">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary outline-none cursor-pointer w-full sm:w-auto hover:border-text-muted transition-colors focus:border-accent-primary/50"
            >
              <option value="All">All Payouts</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto mt-2">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 text-text-muted font-medium border-b border-border">Payout ID</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Recipient</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Role / Type</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Date</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Method</th>
                <th className="p-4 text-text-muted font-medium border-b border-border text-right">Amount</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Status</th>
                <th className="p-4 text-text-muted font-medium border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.length > 0 ? (
                filteredPayouts.map((pay) => (
                  <tr key={pay.id} className="transition-colors hover:bg-bg-primary/50 group border-b border-border/50 last:border-b-0">
                    <td className="p-4 text-text-primary align-middle">
                      <span className="font-semibold text-accent-primary bg-accent-light px-2.5 py-1 rounded-md">{pay.id}</span>
                    </td>
                    <td className="p-4 text-text-primary align-middle font-medium">{pay.recipient}</td>
                    <td className="p-4 text-text-secondary align-middle">
                      <span className="bg-bg-primary px-2 py-1 rounded text-xs">{pay.role}</span>
                    </td>
                    <td className="p-4 text-text-secondary align-middle">{pay.date}</td>
                    <td className="p-4 text-text-secondary align-middle">
                      <div className="flex items-center gap-1.5">
                        {pay.method === 'Bank Transfer' ? <BuildingLibraryIcon className="w-4 h-4" /> : <DevicePhoneMobileIcon className="w-4 h-4" />}
                        {pay.method}
                      </div>
                    </td>
                    <td className="p-4 text-text-primary align-middle font-bold text-right">{pay.amount}</td>
                    <td className="p-4 text-text-primary align-middle">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        pay.status === 'Completed' ? 'bg-success-light text-success border border-success/20' : 
                        'bg-warning-light text-warning border border-warning/20'
                      }`}>
                        {pay.status === 'Completed' ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <ClockIcon className="w-3.5 h-3.5" />}
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-4 text-text-primary align-middle text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {pay.status === 'Pending' ? (
                          <button 
                            onClick={() => handleProcessPayout(pay.id)}
                            className="px-3 py-1.5 rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5"
                          >
                            <CurrencyDollarIcon className="w-4 h-4" /> Process
                          </button>
                        ) : (
                          <span className="text-success text-sm font-medium flex items-center gap-1">
                            <CheckCircleIcon className="w-4 h-4" /> Processed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-text-muted">
                      <BanknotesIcon className="w-12 h-12 opacity-20" />
                      <p className="text-lg">No payouts found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
