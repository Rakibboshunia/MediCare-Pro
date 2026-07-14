'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, UserPlusIcon, EllipsisVerticalIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

type Staff = {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  shift: 'Day' | 'Night' | 'Rotating';
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  joinDate: string;
  avatar: string;
};

const initialStaff: Staff[] = [
  { id: 'NRS-001', name: 'Taslima Begum', role: 'Head Nurse', department: 'General Medicine', phone: '+880 1711-111111', email: 'taslima@medicare.com', shift: 'Day', status: 'On Duty', joinDate: '2019-03-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taslima' },
  { id: 'NRS-002', name: 'Roksana Parveen', role: 'Senior Nurse', department: 'Cardiology', phone: '+880 1811-222222', email: 'roksana@medicare.com', shift: 'Day', status: 'On Duty', joinDate: '2020-06-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roksana' },
  { id: 'NRS-003', name: 'Farida Yasmin', role: 'ICU Nurse', department: 'Neurology', phone: '+880 1911-333333', email: 'farida@medicare.com', shift: 'Night', status: 'On Duty', joinDate: '2021-01-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farida' },
  { id: 'NRS-004', name: 'Mamunur Rashid', role: 'Ward Boy', department: 'Orthopedics', phone: '+880 1611-444444', email: 'mamun@medicare.com', shift: 'Rotating', status: 'On Duty', joinDate: '2022-08-05', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mamunur' },
  { id: 'NRS-005', name: 'Jannatul Ferdous', role: 'Nurse', department: 'Pediatrics', phone: '+880 1711-555555', email: 'jannat@medicare.com', shift: 'Day', status: 'On Leave', joinDate: '2021-11-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jannatul' },
  { id: 'NRS-006', name: 'Habibur Rahman', role: 'Lab Technician', department: 'Laboratory', phone: '+880 1811-666666', email: 'habib@medicare.com', shift: 'Day', status: 'On Duty', joinDate: '2020-04-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Habibur' },
  { id: 'NRS-007', name: 'Shamima Nasrin', role: 'Receptionist', department: 'Administration', phone: '+880 1911-777777', email: 'shamima@medicare.com', shift: 'Day', status: 'On Duty', joinDate: '2023-02-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shamima' },
  { id: 'NRS-008', name: 'Abdul Karim', role: 'Pharmacist', department: 'Pharmacy', phone: '+880 1611-888888', email: 'karim@medicare.com', shift: 'Rotating', status: 'Off Duty', joinDate: '2019-09-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AbdulK' },
  { id: 'NRS-009', name: 'Rehana Akter', role: 'Senior Nurse', department: 'Emergency', phone: '+880 1711-999999', email: 'rehana@medicare.com', shift: 'Night', status: 'On Duty', joinDate: '2018-07-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rehana' },
  { id: 'NRS-010', name: 'Shafiqul Islam', role: 'X-Ray Technician', department: 'Radiology', phone: '+880 1811-101010', email: 'shafiq@medicare.com', shift: 'Day', status: 'On Duty', joinDate: '2022-01-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shafiqul' },
];

export default function NursesStaff() {
  const [staff, setStaff] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const roles = ['All', ...Array.from(new Set(staff.map(s => s.role)))];

  const filteredStaff = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'All' || s.role === filterRole;
    const matchStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const onDuty = staff.filter(s => s.status === 'On Duty').length;
  const offDuty = staff.filter(s => s.status === 'Off Duty').length;
  const onLeave = staff.filter(s => s.status === 'On Leave').length;

  const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStaff: Staff = {
      id: `NRS-${String(staff.length + 1).padStart(3, '0')}`,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      department: formData.get('department') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      shift: formData.get('shift') as 'Day' | 'Night' | 'Rotating',
      status: 'On Duty',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=NRS${staff.length + 1}`,
    };
    setStaff([newStaff, ...staff]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Nurses & Staff</h1>
          <p className="text-sm text-text-muted mt-1">Manage hospital staff, shifts, and assignments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm border-none"
        >
          <UserPlusIcon className="w-5 h-5" /> Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 flex flex-col gap-1">
          <span className="text-2xl font-bold text-text-primary">{staff.length}</span>
          <span className="text-xs text-text-muted font-medium">Total Staff</span>
        </div>
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-success">
          <span className="text-2xl font-bold text-success">{onDuty}</span>
          <span className="text-xs text-text-muted font-medium">On Duty</span>
        </div>
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-warning">
          <span className="text-2xl font-bold text-warning">{offDuty}</span>
          <span className="text-xs text-text-muted font-medium">Off Duty</span>
        </div>
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-danger">
          <span className="text-2xl font-bold text-danger">{onLeave}</span>
          <span className="text-xs text-text-muted font-medium">On Leave</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-5 flex flex-col gap-5 min-h-[400px]">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-muted flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="w-5 h-5" />
            <input type="text" placeholder="Search staff by name, ID, or department..." className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none cursor-pointer"
            value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
          <select className="px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none cursor-pointer"
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>On Duty</option>
            <option>Off Duty</option>
            <option>On Leave</option>
          </select>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((member) => (
              <div key={member.id} className="bg-bg-primary border border-border rounded-2xl p-5 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-accent-light cursor-pointer"
                onClick={() => setSelectedStaff(member)}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-bg-secondary" />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-primary ${
                        member.status === 'On Duty' ? 'bg-success' : member.status === 'Off Duty' ? 'bg-warning' : 'bg-danger'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-text-primary">{member.name}</h3>
                      <p className="text-xs text-text-muted">{member.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    member.status === 'On Duty' ? 'bg-success-light text-success' :
                    member.status === 'Off Duty' ? 'bg-warning-light text-warning' :
                    'bg-danger-light text-danger'
                  }`}>{member.status}</span>
                </div>
                <div className="flex flex-col gap-2 pt-3 border-t border-border text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Department</span>
                    <span className="font-medium text-text-primary">{member.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Shift</span>
                    <span className={`font-semibold ${member.shift === 'Night' ? 'text-violet-500' : member.shift === 'Rotating' ? 'text-amber-500' : 'text-cyan-500'}`}>{member.shift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">ID</span>
                    <span className="font-medium text-text-primary">{member.id}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-auto">
                  <a href={`tel:${member.phone}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-bg-secondary border border-border rounded-lg text-xs text-text-secondary font-medium hover:bg-accent-light hover:text-accent-primary hover:border-accent-light transition-colors">
                    <PhoneIcon className="w-3.5 h-3.5" /> Call
                  </a>
                  <a href={`mailto:${member.email}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-bg-secondary border border-border rounded-lg text-xs text-text-secondary font-medium hover:bg-accent-light hover:text-accent-primary hover:border-accent-light transition-colors">
                    <EnvelopeIcon className="w-3.5 h-3.5" /> Email
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 text-text-muted">No staff members found.</div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedStaff} onClose={() => setSelectedStaff(null)} title="Staff Details">
        {selectedStaff && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-16 h-16 rounded-full border-2 border-border" />
              <div>
                <h3 className="font-bold text-lg text-text-primary">{selectedStaff.name}</h3>
                <p className="text-sm text-text-muted">{selectedStaff.role} • {selectedStaff.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Staff ID', value: selectedStaff.id },
                { label: 'Status', value: selectedStaff.status },
                { label: 'Shift', value: selectedStaff.shift },
                { label: 'Join Date', value: selectedStaff.joinDate },
                { label: 'Phone', value: selectedStaff.phone },
                { label: 'Email', value: selectedStaff.email },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-text-muted mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>
            <div className={formStyles.formActions}>
              <button className={formStyles.cancelBtn} onClick={() => setSelectedStaff(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Staff Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Staff">
        <form onSubmit={handleAddStaff}>
          <div className={formStyles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="e.g. Rehana Akter" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Role</label>
            <select name="role" required>
              <option value="Nurse">Nurse</option>
              <option value="Senior Nurse">Senior Nurse</option>
              <option value="Head Nurse">Head Nurse</option>
              <option value="ICU Nurse">ICU Nurse</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="X-Ray Technician">X-Ray Technician</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Ward Boy">Ward Boy</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Department</label>
            <select name="department" required>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Emergency">Emergency</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Radiology">Radiology</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Shift</label>
            <select name="shift" required>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
              <option value="Rotating">Rotating</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Phone Number</label>
            <input type="text" name="phone" required placeholder="+880 1711-000000" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Email</label>
            <input type="email" name="email" required placeholder="name@medicare.com" />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Add Staff</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
