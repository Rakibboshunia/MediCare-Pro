'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, EllipsisVerticalIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

const initialDoctors = [
  { id: 'DR-001', name: 'Dr. Rashida Khanam', specialty: 'General Medicine', phone: '+880 1711-234567', experience: '14 Years', status: 'Available', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rashida' },
  { id: 'DR-002', name: 'Dr. Karim Hossain', specialty: 'Cardiology', phone: '+880 1812-345678', experience: '18 Years', status: 'In Surgery', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim' },
  { id: 'DR-003', name: 'Dr. Nusrat Jahan', specialty: 'Dental', phone: '+880 1913-456789', experience: '9 Years', status: 'Available', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nusrat' },
  { id: 'DR-004', name: 'Dr. Iftekhar Ahmed', specialty: 'Orthopedics', phone: '+880 1614-567890', experience: '22 Years', status: 'Off Duty', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Iftekhar' },
  { id: 'DR-005', name: 'Dr. Sabrina Sultana', specialty: 'Neurology', phone: '+880 1715-678901', experience: '11 Years', status: 'Available', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sabrina' },
  { id: 'DR-006', name: 'Dr. Mahbubur Rahman', specialty: 'Pediatrics', phone: '+880 1816-789012', experience: '16 Years', status: 'Available', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahbubur' },
];

export default function Doctors() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newId = `DR-00${doctors.length + 1}`;
    const newDoctor = {
      id: newId,
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      phone: formData.get('phone') as string,
      experience: formData.get('experience') as string + ' Years',
      status: 'Available',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`
    };
    
    setDoctors([newDoctor, ...doctors]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Doctors & Staff</h1>
        <button className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm sm:text-base whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
          <UserPlusIcon className="w-5 h-5" /> Add Doctor
        </button>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search doctors by name or specialty..." 
            className="flex-1 bg-transparent border-none text-text-primary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-bg-primary border border-border rounded-2xl p-5 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-accent-light">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <img src={doctor.avatar} alt={doctor.name} className="w-14 h-14 rounded-full object-cover border-2 border-bg-secondary" />
                    <div>
                      <h3 className="font-semibold text-lg text-text-primary m-0">{doctor.name}</h3>
                      <p className="text-sm text-text-secondary m-0">{doctor.specialty}</p>
                    </div>
                  </div>
                  <button className="bg-transparent text-text-muted border-none cursor-pointer p-1 rounded-md transition-colors hover:bg-bg-secondary hover:text-text-primary">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">ID</span>
                    <span className="font-medium text-text-primary">{doctor.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Experience</span>
                    <span className="font-medium text-text-primary">{doctor.experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Phone</span>
                    <span className="font-medium text-text-primary">{doctor.phone}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-text-muted">Status</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      doctor.status === 'Available' ? 'bg-success-light text-success' : 
                      doctor.status === 'In Surgery' ? 'bg-danger-light text-danger' : 
                      'bg-warning-light text-warning'
                    }`}>
                      {doctor.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 text-text-muted">No doctors found.</div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Doctor">
        <form onSubmit={handleAddDoctor}>
          <div className={formStyles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="Dr. John Doe" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Specialty</label>
            <select name="specialty" required>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dental">Dental</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Experience (Years)</label>
            <input type="number" name="experience" required placeholder="5" min="1" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Phone Number</label>
            <input type="text" name="phone" required placeholder="+1 234-567-8900" />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Add Doctor</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
