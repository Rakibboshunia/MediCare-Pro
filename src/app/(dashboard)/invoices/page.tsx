'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, CheckCircleIcon, DocumentTextIcon, ExclamationCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const initialInvoices = [
  { id: 'INV-250801', patient: 'Fatema Akter', issueDate: '2025-07-25', dueDate: '2025-08-01', amount: '৳ 4,500', status: 'Pending' },
  { id: 'INV-250720', patient: 'Rafiqul Islam', issueDate: '2025-07-20', dueDate: '2025-07-27', amount: '৳ 12,000', status: 'Paid' },
  { id: 'INV-250715', patient: 'Sumaiya Begum', issueDate: '2025-07-15', dueDate: '2025-07-22', amount: '৳ 8,800', status: 'Overdue' },
  { id: 'INV-250802', patient: 'Jahangir Alam', issueDate: '2025-07-25', dueDate: '2025-08-02', amount: '৳ 1,200', status: 'Pending' },
  { id: 'INV-250718', patient: 'Nasrin Parvin', issueDate: '2025-07-18', dueDate: '2025-07-25', amount: '৳ 25,000', status: 'Paid' },
  { id: 'INV-250710', patient: 'Kamal Uddin', issueDate: '2025-07-10', dueDate: '2025-07-17', amount: '৳ 32,500', status: 'Paid' },
  { id: 'INV-250705', patient: 'Mizanur Rahman', issueDate: '2025-07-05', dueDate: '2025-07-12', amount: '৳ 5,400', status: 'Overdue' },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.patient.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsPaid = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    toast.success(`Invoice ${id} marked as paid!`);
  };

  const handleCreateInvoice = () => {
    toast('Create Invoice modal would open here.', { icon: '📝' });
  };

  // Calculate totals
  const totalInvoiced = invoices.reduce((acc, curr) => acc + parseInt(curr.amount.replace('৳', '').replace(',', '').trim()), 0);
  const paidAmount = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + parseInt(curr.amount.replace('৳', '').replace(',', '').trim()), 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, curr) => acc + parseInt(curr.amount.replace('৳', '').replace(',', '').trim()), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', minimumFractionDigits: 0 }).format(amount).replace('BDT', '৳');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Invoices</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage patient invoices and track payments</p>
        </div>
        <button 
          onClick={handleCreateInvoice}
          className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-all hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-primary/30 cursor-pointer flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" /> Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
            <DocumentTextIcon className="w-24 h-24 text-text-primary" />
          </div>
          <span className="text-text-secondary font-medium relative z-10 text-sm uppercase tracking-wider">Total Invoiced</span>
          <span className="text-4xl font-bold text-text-primary relative z-10">{formatCurrency(totalInvoiced)}</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 border-success/20 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
            <CheckCircleIcon className="w-24 h-24 text-success" />
          </div>
          <span className="text-success font-medium relative z-10 text-sm uppercase tracking-wider">Amount Paid</span>
          <span className="text-4xl font-bold text-success relative z-10">{formatCurrency(paidAmount)}</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 border-warning/20 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
            <ExclamationCircleIcon className="w-24 h-24 text-warning" />
          </div>
          <span className="text-warning font-medium relative z-10 text-sm uppercase tracking-wider">Pending & Overdue</span>
          <span className="text-4xl font-bold text-warning relative z-10">{formatCurrency(pendingAmount)}</span>
        </div>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-muted w-full sm:max-w-md focus-within:border-accent-primary/50 focus-within:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] transition-all">
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by patient name or ID..." 
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
              <option value="All">All Invoices</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto mt-2">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 text-text-muted font-medium border-b border-border">Invoice ID</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Patient Name</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Issue Date</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Due Date</th>
                <th className="p-4 text-text-muted font-medium border-b border-border text-right">Amount</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Status</th>
                <th className="p-4 text-text-muted font-medium border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-bg-primary/50 group border-b border-border/50 last:border-b-0">
                    <td className="p-4 text-text-primary align-middle">
                      <span className="font-semibold text-accent-primary bg-accent-light px-2.5 py-1 rounded-md">{inv.id}</span>
                    </td>
                    <td className="p-4 text-text-primary align-middle font-medium">{inv.patient}</td>
                    <td className="p-4 text-text-secondary align-middle">{inv.issueDate}</td>
                    <td className="p-4 text-text-secondary align-middle">{inv.dueDate}</td>
                    <td className="p-4 text-text-primary align-middle font-bold text-right">{inv.amount}</td>
                    <td className="p-4 text-text-primary align-middle">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        inv.status === 'Paid' ? 'bg-success-light text-success border border-success/20' : 
                        inv.status === 'Pending' ? 'bg-warning-light text-warning border border-warning/20' : 
                        'bg-danger-light text-danger border border-danger/20'
                      }`}>
                        {inv.status === 'Paid' && <CheckCircleIcon className="w-3.5 h-3.5" />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-text-primary align-middle text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 rounded-lg bg-bg-secondary border border-border text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 hover:bg-accent-light transition-colors"
                          title="View Invoice"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {inv.status !== 'Paid' && (
                          <button 
                            onClick={() => handleMarkAsPaid(inv.id)}
                            className="p-2 rounded-lg bg-bg-secondary border border-border text-text-secondary hover:bg-success hover:text-white hover:border-success transition-colors"
                            title="Mark as Paid"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-text-muted">
                      <DocumentTextIcon className="w-12 h-12 opacity-20" />
                      <p className="text-lg">No invoices found matching your criteria.</p>
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
