'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

const initialPatients = [
  { id: 'PT-001', name: 'Sarah Jenkins', age: 34, gender: 'Female', bloodGroup: 'O+', lastVisit: '2023-10-15', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'PT-002', name: 'Michael Chen', age: 45, gender: 'Male', bloodGroup: 'A-', lastVisit: '2023-10-20', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: 'PT-003', name: 'Emma Watson', age: 28, gender: 'Female', bloodGroup: 'B+', lastVisit: '2023-11-02', status: 'Inactive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: 'PT-004', name: 'James Smith', age: 52, gender: 'Male', bloodGroup: 'AB+', lastVisit: '2023-11-05', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { id: 'PT-005', name: 'Olivia Davis', age: 41, gender: 'Female', bloodGroup: 'O-', lastVisit: '2023-11-10', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia' },
];

export default function Patients() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
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
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Patients</h1>
        <button className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer text-sm sm:text-base whitespace-nowrap" onClick={() => setIsModalOpen(true)}>+ Add New Patient</button>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search patients by name or ID..." 
            className="flex-1 bg-transparent border-none text-text-primary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                      <button className="bg-transparent text-text-muted border-none cursor-pointer p-1 rounded-md transition-colors hover:bg-bg-primary hover:text-text-primary">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                      </button>
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
        <form onSubmit={handleAddPatient}>
          <div className={formStyles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="John Doe" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Age</label>
            <input type="number" name="age" required placeholder="30" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Gender</label>
            <select name="gender" required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Blood Group</label>
            <select name="bloodGroup" required>
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
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Add Patient</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
