'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, EllipsisVerticalIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

const initialAppointments = [
  { id: 'APT-2501', patient: 'Fatema Akter', doctor: 'Dr. Rashida Khanam', department: 'General Medicine', date: '2025-07-15', time: '09:00 AM', status: 'Completed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema' },
  { id: 'APT-2502', patient: 'Rafiqul Islam', doctor: 'Dr. Karim Hossain', department: 'Cardiology', date: '2025-07-15', time: '10:30 AM', status: 'In Progress', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul' },
  { id: 'APT-2503', patient: 'Sumaiya Begum', doctor: 'Dr. Nusrat Jahan', department: 'Dental', date: '2025-07-15', time: '11:15 AM', status: 'Scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumaiya' },
  { id: 'APT-2504', patient: 'Jahangir Alam', doctor: 'Dr. Iftekhar Ahmed', department: 'Orthopedics', date: '2025-07-16', time: '02:00 PM', status: 'Scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jahangir' },
  { id: 'APT-2505', patient: 'Nasrin Parvin', doctor: 'Dr. Sabrina Sultana', department: 'Neurology', date: '2025-07-16', time: '03:30 PM', status: 'Cancelled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin' },
  { id: 'APT-2506', patient: 'Mizanur Rahman', doctor: 'Dr. Mahbubur Rahman', department: 'Pediatrics', date: '2025-07-17', time: '09:45 AM', status: 'Scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mizanur' },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newId = `APT-10${appointments.length + 1}`;
    
    const newApt = {
      id: newId,
      patient: formData.get('patient') as string,
      doctor: formData.get('doctor') as string,
      department: formData.get('department') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      status: 'Scheduled',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`
    };
    
    setAppointments([newApt, ...appointments]);
    setIsModalOpen(false);
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-success-light text-success';
      case 'In Progress': return 'bg-warning-light text-warning';
      case 'Scheduled': return 'bg-accent-light text-accent-primary';
      case 'Cancelled': return 'bg-danger-light text-danger';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Appointments</h1>
        <button className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer text-sm sm:text-base whitespace-nowrap" onClick={() => setIsModalOpen(true)}>+ Schedule Appointment</button>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted flex-1">
            <MagnifyingGlassIcon className="w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className="flex-1 bg-transparent border-none text-text-primary outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-bg-primary border border-border rounded-xl font-medium cursor-pointer transition-colors hover:border-border-focus whitespace-nowrap text-text-secondary">
            <CalendarIcon className="w-5 h-5" />
            <span>Today, Nov 15</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div key={apt.id} className="bg-bg-primary border border-border rounded-2xl p-5 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="font-medium text-sm text-text-muted">{apt.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img src={apt.avatar} alt={apt.patient} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-base m-0">{apt.patient}</h3>
                      <p className="text-sm text-text-muted m-0 mt-1">{apt.department}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted m-0">Consulting Doctor</p>
                    <h4 className="font-medium text-sm mt-1 mb-0">{apt.doctor}</h4>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border mt-auto">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ClockIcon className="w-4 h-4" />
                    <span>{apt.time}</span>
                    <span className="text-text-muted font-normal border-l border-border pl-2 ml-2">{apt.date}</span>
                  </div>
                  <button className="bg-transparent text-text-muted border-none cursor-pointer p-1 rounded-md transition-colors hover:bg-bg-secondary hover:text-text-primary">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 text-text-muted">
              No appointments found.
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Appointment">
        <form onSubmit={handleAddAppointment}>
          <div className={formStyles.formGroup}>
            <label>Patient Name</label>
            <input type="text" name="patient" required placeholder="John Doe" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Doctor Name</label>
            <input type="text" name="doctor" required placeholder="Dr. Smith" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Department</label>
            <select name="department" required>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dental">Dental</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Date</label>
            <input type="date" name="date" required />
          </div>
          <div className={formStyles.formGroup}>
            <label>Time</label>
            <input type="time" name="time" required />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Schedule</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
