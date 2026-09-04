'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, DocumentTextIcon, PrinterIcon, TrashIcon, PencilSquareIcon, CheckBadgeIcon, ClipboardDocumentListIcon, ClockIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

const initialPrescriptions = [
  { id: 'RX-2501', patient: 'Fatema Akter', doctor: 'Dr. Rashida Khanam', date: '2025-07-10', medications: 3, status: 'Active' },
  { id: 'RX-2502', patient: 'Rafiqul Islam', doctor: 'Dr. Karim Hossain', date: '2025-07-08', medications: 2, status: 'Completed' },
  { id: 'RX-2503', patient: 'Sumaiya Begum', doctor: 'Dr. Nusrat Jahan', date: '2025-07-05', medications: 2, status: 'Active' },
  { id: 'RX-2504', patient: 'Jahangir Alam', doctor: 'Dr. Iftekhar Ahmed', date: '2025-07-12', medications: 4, status: 'Completed' },
  { id: 'RX-2505', patient: 'Nasrin Parvin', doctor: 'Dr. Sabrina Sultana', date: '2025-07-11', medications: 1, status: 'Active' },
  { id: 'RX-2506', patient: 'Mizanur Rahman', doctor: 'Dr. Mahbubur Rahman', date: '2025-07-09', medications: 3, status: 'Active' },
];

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [viewItem, setViewItem] = useState<any>(null);

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
      status: 'Active',
    };

    setPrescriptions([newRx, ...prescriptions]);
    setIsModalOpen(false);
    toast.success('Prescription created successfully!');
  };

  const handleEditPrescription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...editItem,
      patient: formData.get('patient') as string,
      doctor: formData.get('doctor') as string,
      medications: parseInt(formData.get('medications') as string),
      status: formData.get('status') as string,
    };
    setPrescriptions(prescriptions.map(p => p.id === editItem.id ? updated : p));
    toast.success('Prescription updated!');
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    toast.success('Prescription removed.');
  };

  const totalRx = prescriptions.length;
  const activeRx = prescriptions.filter(rx => rx.status === 'Active').length;
  const completedRx = prescriptions.filter(rx => rx.status === 'Completed').length;
  const totalMeds = prescriptions.reduce((sum, rx) => sum + rx.medications, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Prescriptions</h1>
        <button className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 border-none cursor-pointer text-sm sm:text-base whitespace-nowrap" onClick={() => setIsModalOpen(true)}>+ Create Prescription</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Prescriptions', value: totalRx, icon: ClipboardDocumentListIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Active', value: activeRx, icon: ClockIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { title: 'Completed', value: completedRx, icon: CheckBadgeIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Total Medications', value: totalMeds, icon: DocumentTextIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setViewItem(rx)} className="px-3 py-1 rounded-md border border-border bg-transparent text-text-primary cursor-pointer text-sm font-medium transition-colors hover:bg-bg-secondary" title="View Details">
                          View
                        </button>
                        <button onClick={() => setEditItem(rx)} className="bg-transparent text-text-muted border-none cursor-pointer p-1.5 rounded-md transition-colors hover:text-accent-primary hover:bg-bg-secondary" title="Edit">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(rx.id)} className="bg-transparent text-text-muted border-none cursor-pointer p-1.5 rounded-md transition-colors hover:text-red-500 hover:bg-bg-secondary" title="Delete">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => toast('Printing prescription...', { icon: '🖨️' })} className="bg-transparent text-text-muted border-none cursor-pointer p-1.5 rounded-md transition-colors hover:text-text-primary hover:bg-bg-secondary flex items-center" title="Print">
                          <PrinterIcon className="w-4 h-4" />
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
        <RxForm onSubmit={handleAddPrescription} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Prescription">
        {editItem && <RxForm defaultValues={editItem} onSubmit={handleEditPrescription} onClose={() => setEditItem(null)} />}
      </Modal>
      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title={`Prescription: ${viewItem?.id}`}>
        {viewItem && (
          <div className="p-4 flex flex-col gap-4 text-text-primary">
            <div className="flex justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm text-text-muted">Patient</p>
                <p className="font-semibold text-lg">{viewItem.patient}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Date Issued</p>
                <p className="font-medium">{viewItem.date}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">Prescribing Doctor</p>
                <p className="font-medium">{viewItem.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Medications</p>
                <p className="font-medium">{viewItem.medications} items</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-muted">Status</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${viewItem.status === 'Active' ? 'bg-success-light text-success' : 'bg-bg-secondary text-text-muted'}`}>
                {viewItem.status}
              </span>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => toast('Printing prescription...', { icon: '🖨️' })} className="px-4 py-2 border border-border text-text-primary bg-bg-primary rounded-lg text-sm font-medium hover:bg-border transition-colors flex items-center gap-2">
                <PrinterIcon className="w-4 h-4" /> Print
              </button>
              <button onClick={() => setViewItem(null)} className="px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

const RxForm = ({ defaultValues, onSubmit, onClose }: { defaultValues?: any; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) => (
  <form onSubmit={onSubmit}>
    <div className={formStyles.formGroup}>
      <label>Patient Name</label>
      <input type="text" name="patient" required defaultValue={defaultValues?.patient} placeholder="John Doe" />
    </div>
    <div className={formStyles.formGroup}>
      <label>Prescribing Doctor</label>
      <input type="text" name="doctor" required defaultValue={defaultValues?.doctor} placeholder="Dr. Felix" />
    </div>
    <div className={formStyles.formGroup}>
      <label>Number of Medications</label>
      <input type="number" name="medications" required defaultValue={defaultValues?.medications} placeholder="1" min="1" />
    </div>
    {defaultValues && (
      <div className={formStyles.formGroup}>
        <label>Status</label>
        <select name="status" defaultValue={defaultValues.status}>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    )}
    <div className={formStyles.formGroup}>
      <label>Notes / Instructions</label>
      <textarea name="notes" placeholder="Take after meals..." rows={3} defaultValue={defaultValues?.notes}></textarea>
    </div>
    <div className={formStyles.formActions}>
      <button type="button" className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
      <button type="submit" className={formStyles.submitBtn}>{defaultValues ? 'Save Changes' : 'Create'}</button>
    </div>
  </form>
);
