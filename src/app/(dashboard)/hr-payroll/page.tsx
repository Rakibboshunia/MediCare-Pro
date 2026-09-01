'use client';

import React, { useState } from 'react';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';
import toast from 'react-hot-toast';

type PayStatus = 'Paid' | 'Pending' | 'Processing';

type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  attendance: number;
  leaveBalance: number;
  status: PayStatus;
};

const DEPARTMENTS = ['Surgery', 'Cardiology', 'ICU', 'Pathology', 'Emergency', 'Pharmacy', 'Radiology', 'Administration'];
const ROLES = ['Senior Surgeon', 'Cardiologist', 'Head Nurse', 'Lab Technician', 'Radiologist', 'Pharmacist', 'Admin Officer', 'Receptionist'];

const PAY_STATUS_STYLES: Record<PayStatus, string> = {
  'Paid': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Processing': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Pending': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

const initialEmployees: Employee[] = [
  { id: 'EMP-001', name: 'Dr. Sarah Smith', role: 'Senior Surgeon', department: 'Surgery', salary: 150000, attendance: 26, leaveBalance: 12, status: 'Paid' },
  { id: 'EMP-002', name: 'Dr. John Doe', role: 'Cardiologist', department: 'Cardiology', salary: 180000, attendance: 24, leaveBalance: 8, status: 'Pending' },
  { id: 'EMP-003', name: 'Mina Begum', role: 'Head Nurse', department: 'ICU', salary: 45000, attendance: 27, leaveBalance: 5, status: 'Processing' },
  { id: 'EMP-004', name: 'Karim Hasan', role: 'Lab Technician', department: 'Pathology', salary: 35000, attendance: 28, leaveBalance: 15, status: 'Paid' },
];

export default function HRPayroll() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Employee | null>(null);

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newEmp: Employee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: fd.get('name') as string,
      role: fd.get('role') as string,
      department: fd.get('department') as string,
      salary: Number(fd.get('salary')),
      attendance: 0,
      leaveBalance: 20,
      status: 'Pending',
    };
    setEmployees([newEmp, ...employees]);
    toast.success('Employee added successfully!');
    setIsAddOpen(false);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const fd = new FormData(e.currentTarget);
    const updated: Employee = {
      ...editItem,
      name: fd.get('name') as string,
      role: fd.get('role') as string,
      department: fd.get('department') as string,
      salary: Number(fd.get('salary')),
      attendance: Number(fd.get('attendance')),
      leaveBalance: Number(fd.get('leaveBalance')),
      status: fd.get('status') as PayStatus,
    };
    setEmployees(employees.map(e => e.id === editItem.id ? updated : e));
    toast.success('Employee record updated!');
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
    toast.success('Employee removed.');
  };

  const EmpForm = ({ defaultValues, onSubmit, onClose }: { defaultValues?: Employee; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) => (
    <form onSubmit={onSubmit}>
      <div className={formStyles.formGroup}>
        <label>Full Name</label>
        <input type="text" name="name" required defaultValue={defaultValues?.name} placeholder="e.g. Dr. Rashida Khanam" />
      </div>
      <div className={formStyles.formGroup}>
        <label>Role / Designation</label>
        <select name="role" required defaultValue={defaultValues?.role}>
          <option value="">Select Role</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className={formStyles.formGroup}>
        <label>Department</label>
        <select name="department" required defaultValue={defaultValues?.department}>
          <option value="">Select Department</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className={formStyles.formGroup}>
        <label>Monthly Salary (৳)</label>
        <input type="number" name="salary" required defaultValue={defaultValues?.salary} min="1" placeholder="e.g. 80000" />
      </div>
      {defaultValues && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className={formStyles.formGroup}>
              <label>Attendance (days)</label>
              <input type="number" name="attendance" required defaultValue={defaultValues.attendance} min="0" max="31" />
            </div>
            <div className={formStyles.formGroup}>
              <label>Leave Balance (days)</label>
              <input type="number" name="leaveBalance" required defaultValue={defaultValues.leaveBalance} min="0" />
            </div>
          </div>
          <div className={formStyles.formGroup}>
            <label>Payroll Status</label>
            <select name="status" defaultValue={defaultValues.status}>
              {(['Pending', 'Processing', 'Paid'] as PayStatus[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className={formStyles.formActions}>
        <button type="button" className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="submit" className={formStyles.submitBtn}>{defaultValues ? 'Save Changes' : 'Add Employee'}</button>
      </div>
    </form>
  );

  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">HR & Payroll</h1>
        <button onClick={() => setIsAddOpen(true)} className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-sm whitespace-nowrap">
          <PlusIcon className="w-5 h-5" /> Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Employees', value: employees.length, icon: UsersIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Monthly Payroll', value: `৳ ${(totalPayroll / 1000).toFixed(0)}K`, icon: CurrencyDollarIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Paid', value: employees.filter(e => e.status === 'Paid').length, icon: DocumentChartBarIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'Pending Pay', value: employees.filter(e => e.status === 'Pending').length, icon: ClockIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
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
            <input type="text" placeholder="Search by name, ID, or role..." className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="bg-bg-primary border border-border rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary">
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm">
                {['Emp ID', 'Name', 'Role', 'Department', 'Attendance', 'Leave Balance', 'Net Salary', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 font-medium text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? filtered.map(e => (
                <tr key={e.id} className="hover:bg-bg-primary/50 transition-colors text-sm">
                  <td className="px-5 py-4 font-medium text-text-primary">{e.id}</td>
                  <td className="px-5 py-4 text-text-primary font-semibold whitespace-nowrap">{e.name}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{e.role}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{e.department}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{e.attendance} days</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{e.leaveBalance} days</td>
                  <td className="px-5 py-4 text-text-primary font-medium whitespace-nowrap">৳ {e.salary.toLocaleString()}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${PAY_STATUS_STYLES[e.status]}`}>{e.status}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditItem(e)} className="p-1.5 text-text-muted hover:text-accent-primary rounded-lg hover:bg-accent-primary/10 transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(e.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="text-center p-8 text-text-muted">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Employee">
        <EmpForm onSubmit={handleAdd} onClose={() => setIsAddOpen(false)} />
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Employee">
        {editItem && <EmpForm defaultValues={editItem} onSubmit={handleEdit} onClose={() => setEditItem(null)} />}
      </Modal>
    </div>
  );
}
