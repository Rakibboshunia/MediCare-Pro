'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

const initialPatients = [
  { id: 'PT-001', name: 'Fatema Akter', age: 34, gender: 'Female', bloodGroup: 'O+', lastVisit: '2025-07-10', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema' },
  { id: 'PT-002', name: 'Rafiqul Islam', age: 47, gender: 'Male', bloodGroup: 'A-', lastVisit: '2025-07-08', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul' },
  { id: 'PT-003', name: 'Sumaiya Begum', age: 29, gender: 'Female', bloodGroup: 'B+', lastVisit: '2025-07-05', status: 'Inactive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumaiya' },
  { id: 'PT-004', name: 'Jahangir Alam', age: 55, gender: 'Male', bloodGroup: 'AB+', lastVisit: '2025-07-12', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jahangir' },
  { id: 'PT-005', name: 'Nasrin Parvin', age: 42, gender: 'Female', bloodGroup: 'O-', lastVisit: '2025-07-11', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin' },
  { id: 'PT-006', name: 'Mizanur Rahman', age: 38, gender: 'Male', bloodGroup: 'A+', lastVisit: '2025-07-09', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mizanur' },
  { id: 'PT-007', name: 'Shahnaz Akhter', age: 61, gender: 'Female', bloodGroup: 'B-', lastVisit: '2025-07-07', status: 'Inactive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shahnaz' },
  { id: 'PT-008', name: 'Kamal Uddin', age: 50, gender: 'Male', bloodGroup: 'AB-', lastVisit: '2025-07-13', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamal' },
];

export default function Patients() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filteredPatients = patients.filter(
    (p) =>
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === 'All' || p.status === statusFilter) &&
      (genderFilter === 'All' || p.gender === genderFilter) &&
      (bloodGroupFilter === 'All' || p.bloodGroup === bloodGroupFilter)
  );

  const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newId = `PT-00${patients.length + 1}`;
    const newPatient = {
      id: newId,
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      bloodGroup: formData.get('bloodGroup') as string,
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`
    };
    
    setPatients([newPatient, ...patients]);
    toast.success('Patient added successfully!');
    setIsModalOpen(false);
  };

  const handleEditPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...editItem,
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      bloodGroup: formData.get('bloodGroup') as string,
      status: formData.get('status') as string,
    };
    setPatients(patients.map(p => p.id === editItem.id ? updated : p));
    toast.success('Patient updated!');
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
    toast.success('Patient removed.');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Patients</h1>
        <button className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer text-sm sm:text-base whitespace-nowrap" onClick={() => setIsModalOpen(true)}>+ Add New Patient</button>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
            <input 
              type="text" 
              placeholder="Search patients by name or ID..." 
              className="flex-1 bg-transparent border-none text-text-primary outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-3 bg-bg-primary border border-border rounded-xl font-medium text-text-secondary outline-none focus:border-accent-light">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="px-4 py-3 bg-bg-primary border border-border rounded-xl font-medium text-text-secondary outline-none focus:border-accent-light">
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select value={bloodGroupFilter} onChange={e => setBloodGroupFilter(e.target.value)} className="px-4 py-3 bg-bg-primary border border-border rounded-xl font-medium text-text-secondary outline-none focus:border-accent-light">
            <option value="All">All Blood Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 text-text-muted font-medium border-b border-border">Patient</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">ID</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Age/Gender</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Blood Group</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Last Visit</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Status</th>
                <th className="p-4 text-text-muted font-medium border-b border-border"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <div className="flex items-center gap-3">
                        <img src={patient.avatar} alt={patient.name} className="w-9 h-9 rounded-full bg-bg-primary" />
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-border align-middle text-text-muted">{patient.id}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">{patient.age} yrs, {patient.gender}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle"><span className="bg-danger-light text-danger px-2 py-1 rounded-md text-sm font-semibold">{patient.bloodGroup}</span></td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">{patient.lastVisit}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${patient.status === 'Active' ? 'bg-success-light text-success' : 'bg-bg-secondary text-text-muted'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditItem(patient)} className="bg-transparent text-text-muted border-none cursor-pointer p-1.5 rounded-md transition-colors hover:bg-bg-primary hover:text-accent-primary">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(patient.id)} className="bg-transparent text-text-muted border-none cursor-pointer p-1.5 rounded-md transition-colors hover:bg-bg-primary hover:text-red-500">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-text-muted">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Patient">
        <PatientForm onSubmit={handleAddPatient} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Patient">
        {editItem && <PatientForm defaultValues={editItem} onSubmit={handleEditPatient} onClose={() => setEditItem(null)} />}
      </Modal>
    </div>
  );
}

const PatientForm = ({ defaultValues, onSubmit, onClose }: { defaultValues?: any; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) => (
  <form onSubmit={onSubmit}>
    <div className={formStyles.formGroup}>
      <label>Full Name</label>
      <input type="text" name="name" required defaultValue={defaultValues?.name} placeholder="John Doe" />
    </div>
    <div className={formStyles.formGroup}>
      <label>Age</label>
      <input type="number" name="age" required defaultValue={defaultValues?.age} placeholder="30" />
    </div>
    <div className={formStyles.formGroup}>
      <label>Gender</label>
      <select name="gender" required defaultValue={defaultValues?.gender}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div className={formStyles.formGroup}>
      <label>Blood Group</label>
      <select name="bloodGroup" required defaultValue={defaultValues?.bloodGroup}>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>
    </div>
    {defaultValues && (
      <div className={formStyles.formGroup}>
        <label>Status</label>
        <select name="status" defaultValue={defaultValues.status}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    )}
    <div className={formStyles.formActions}>
      <button type="button" className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
      <button type="submit" className={formStyles.submitBtn}>{defaultValues ? 'Save Changes' : 'Add Patient'}</button>
    </div>
  </form>
);
