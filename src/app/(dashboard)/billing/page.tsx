'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, DocumentTextIcon, BanknotesIcon, ArrowDownTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const initialInvoices = [
  { id: 'INV-2025-001', patient: 'Fatema Akter', date: '2025-07-10', amount: '৳ 2,500', status: 'Paid' },
  { id: 'INV-2025-002', patient: 'Rafiqul Islam', date: '2025-07-08', amount: '৳ 15,000', status: 'Pending' },
  { id: 'INV-2025-003', patient: 'Sumaiya Begum', date: '2025-07-05', amount: '৳ 4,800', status: 'Paid' },
  { id: 'INV-2025-004', patient: 'Jahangir Alam', date: '2025-07-12', amount: '৳ 32,000', status: 'Overdue' },
  { id: 'INV-2025-005', patient: 'Nasrin Parvin', date: '2025-07-11', amount: '৳ 1,200', status: 'Paid' },
  { id: 'INV-2025-006', patient: 'Mizanur Rahman', date: '2025-07-09', amount: '৳ 8,500', status: 'Pending' },
  { id: 'INV-2025-007', patient: 'Kamal Uddin', date: '2025-07-13', amount: '৳ 22,000', status: 'Paid' },
];

export default function Billing() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Billing report exported successfully!');
    }, 1500);
  };

  const handleRecordPayment = (id: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: 'Paid' } : inv
    ));
  };

  // Calculate totals
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + parseFloat(curr.amount.replace('$', '').replace(',', '')), 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + parseFloat(curr.amount.replace('$', '').replace(',', '')), 0);
  const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + parseFloat(curr.amount.replace('$', '').replace(',', '')), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Billing & Invoices</h1>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="px-5 py-2.5 bg-bg-secondary text-text-primary border border-border rounded-xl font-semibold transition-colors hover:bg-border cursor-pointer flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
        >
          <ArrowDownTrayIcon className="w-5 h-5" /> {isExporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="glass-panel p-6 flex flex-col gap-2">
          <span className="text-text-secondary font-medium">Total Revenue</span>
          <span className="text-3xl font-bold text-text-primary">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 border-warning">
          <span className="text-text-secondary font-medium">Pending Payments</span>
          <span className="text-3xl font-bold text-warning">{formatCurrency(pendingAmount)}</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 border-danger">
          <span className="text-text-secondary font-medium">Overdue</span>
          <span className="text-3xl font-bold text-danger">{formatCurrency(overdueAmount)}</span>
        </div>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search invoices by patient or ID..." 
            className="flex-1 bg-transparent border-none text-text-primary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 text-text-muted font-medium border-b border-border">Invoice ID</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Patient Name</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Date</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Amount</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Status</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-bg-primary/50">
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <div className="flex items-center gap-2 font-semibold text-accent-primary">
                        <DocumentTextIcon className="w-4 h-4" />
                        {inv.id}
                      </div>
                    </td>
                    <td className="p-4 border-b border-border text-text-primary align-middle font-medium">{inv.patient}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">{inv.date}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle font-semibold">{inv.amount}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        inv.status === 'Paid' ? 'bg-success-light text-success' : 
                        inv.status === 'Pending' ? 'bg-warning-light text-warning' : 
                        'bg-danger-light text-danger'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <div className="flex items-center gap-3">
                        <button className="px-3 py-1 rounded-md border border-border bg-transparent text-text-primary cursor-pointer text-sm font-medium transition-colors hover:bg-bg-secondary" title="View Details">
                          View
                        </button>
                        {inv.status !== 'Paid' ? (
                          <button 
                            onClick={() => handleRecordPayment(inv.id)}
                            className="bg-transparent text-text-muted border-none cursor-pointer p-1 rounded-md transition-colors hover:text-success hover:bg-success-light flex items-center" 
                            title="Record Payment"
                          >
                            <BanknotesIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <span className="p-1 text-success flex items-center" title="Payment Recorded">
                            <CheckCircleIcon className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-text-muted">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
