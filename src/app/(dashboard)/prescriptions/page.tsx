'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, DocumentTextIcon, PrinterIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

const initialPrescriptions = [
  { id: 'RX-701', patient: 'Sarah Jenkins', doctor: 'Dr. Felix', date: '2023-11-15', medications: 3, status: 'Active' },
  { id: 'RX-702', patient: 'Michael Chen', doctor: 'Dr. Smith', date: '2023-11-10', medications: 1, status: 'Completed' },
  { id: 'RX-703', patient: 'Emma Watson', doctor: 'Dr. Jane', date: '2023-11-05', medications: 2, status: 'Active' },
  { id: 'RX-704', patient: 'James Smith', doctor: 'Dr. Brown', date: '2023-10-28', medications: 4, status: 'Completed' },
  { id: 'RX-705', patient: 'Olivia Davis', doctor: 'Dr. Felix', date: '2023-10-20', medications: 2, status: 'Active' },
];

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPrescription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newId = `RX-70${prescriptions.length + 1}`;
    
    const newRx = {
      id: newId,
      patient: formData.get('patient') as string,
      doctor: formData.get('doctor') as string,
      date: new Date().toISOString().split('T')[0],
      medications: parseInt(formData.get('medications') as string),
      status: 'Active'
    };
    
    setPrescriptions([newRx, ...prescriptions]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Prescriptions</h1>
        <button className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 border-none cursor-pointer text-sm sm:text-base whitespace-nowrap" onClick={() => setIsModalOpen(true)}>+ Create Prescription</button>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search prescriptions by patient or ID..." 
            className="flex-1 bg-transparent border-none text-text-primary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 text-text-muted font-medium border-b border-border">Prescription ID</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Patient Name</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Doctor</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Date Issued</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Medications</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Status</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((rx) => (
                  <tr key={rx.id}>
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <div className="flex items-center gap-2 font-semibold text-accent-primary">
                        <DocumentTextIcon className="w-4 h-4" />
                        {rx.id}
                      </div>
                    </td>
                    <td className="p-4 border-b border-border text-text-primary align-middle font-medium">{rx.patient}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">{rx.doctor}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">{rx.date}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">{rx.medications} items</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${rx.status === 'Active' ? 'bg-success-light text-success' : 'bg-bg-secondary text-text-muted'}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">
                      <div className="flex items-center gap-3">
                        <button className="px-3 py-1 rounded-md border border-border bg-transparent text-text-primary cursor-pointer text-sm font-medium transition-colors hover:bg-bg-secondary" title="View Details">
                          View
                        </button>
                        <button className="bg-transparent text-text-muted border-none cursor-pointer p-1 rounded-md transition-colors hover:text-text-primary hover:bg-bg-secondary flex items-center" title="Print">
                          <PrinterIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-text-muted">No prescriptions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Prescription">
        <form onSubmit={handleAddPrescription}>
          <div className={formStyles.formGroup}>
            <label>Patient Name</label>
            <input type="text" name="patient" required placeholder="John Doe" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Prescribing Doctor</label>
            <input type="text" name="doctor" required placeholder="Dr. Felix" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Number of Medications</label>
            <input type="number" name="medications" required placeholder="1" min="1" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Notes / Instructions</label>
            <textarea name="notes" placeholder="Take after meals..." rows={3}></textarea>
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
