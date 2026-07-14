'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, DocumentArrowDownIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

const initialTests = [
  { id: 'LAB-001', patient: 'Sarah Jenkins', testName: 'Complete Blood Count', doctor: 'Dr. Felix', date: '2023-11-15', status: 'Completed' },
  { id: 'LAB-002', patient: 'Michael Chen', testName: 'Lipid Profile', doctor: 'Dr. Smith', date: '2023-11-15', status: 'In Progress' },
  { id: 'LAB-003', patient: 'Emma Watson', testName: 'X-Ray (Chest)', doctor: 'Dr. Jane', date: '2023-11-16', status: 'Pending' },
  { id: 'LAB-004', patient: 'James Smith', testName: 'MRI Scan', doctor: 'Dr. Brown', date: '2023-11-14', status: 'Completed' },
  { id: 'LAB-005', patient: 'Olivia Davis', testName: 'Urine Analysis', doctor: 'Dr. Felix', date: '2023-11-16', status: 'Pending' },
];

export default function Laboratory() {
  const [tests, setTests] = useState(initialTests);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const filteredTests = tests.filter(
    (t) =>
      t.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = tests.filter(t => t.status === 'Pending').length;
  const inProgressCount = tests.filter(t => t.status === 'In Progress').length;
  const completedCount = tests.filter(t => t.status === 'Completed').length;

  const handleAddTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTest = {
      id: `LAB-00${tests.length + 1}`,
      patient: formData.get('patient') as string,
      testName: formData.get('testName') as string,
      doctor: formData.get('doctor') as string,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    
    setTests([newTest, ...tests]);
    setIsModalOpen(false);
  };

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert('Report downloaded successfully!');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Laboratory & Tests</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" /> New Test Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="glass-panel p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary font-medium">Pending Tests</span>
            <ClockIcon className="w-6 h-6 text-warning" />
          </div>
          <span className="text-3xl font-bold text-text-primary">{pendingCount}</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary font-medium">In Progress</span>
            <div className="w-6 h-6 rounded-full border-2 border-accent-primary border-t-transparent animate-spin"></div>
          </div>
          <span className="text-3xl font-bold text-text-primary">{inProgressCount}</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 border-success">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary font-medium">Completed</span>
            <CheckCircleIcon className="w-6 h-6 text-success" />
          </div>
          <span className="text-3xl font-bold text-success">{completedCount}</span>
        </div>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by patient, test name, or ID..." 
            className="flex-1 bg-transparent border-none text-text-primary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 text-text-muted font-medium border-b border-border">Test ID</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Patient Name</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Test Name</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Referred By</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Date</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Status</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Report</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <tr key={test.id} className="transition-colors hover:bg-bg-primary/50">
                    <td className="p-4 border-b border-border text-text-muted font-medium align-middle">{test.id}</td>
                    <td className="p-4 border-b border-border text-text-primary font-semibold align-middle">{test.patient}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle">{test.testName}</td>
                    <td className="p-4 border-b border-border text-text-secondary align-middle">{test.doctor}</td>
                    <td className="p-4 border-b border-border text-text-secondary align-middle">{test.date}</td>
                    <td className="p-4 border-b border-border align-middle">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        test.status === 'Completed' ? 'bg-success-light text-success' : 
                        test.status === 'In Progress' ? 'bg-accent-light text-accent-primary' : 
                        'bg-warning-light text-warning'
                      }`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-border align-middle">
                      {test.status === 'Completed' ? (
                        <button 
                          onClick={() => handleDownload(test.id)}
                          className="bg-transparent text-text-muted border-none cursor-pointer p-1 rounded-md transition-colors hover:text-accent-primary hover:bg-bg-secondary flex items-center" 
                          title="Download Report"
                          disabled={downloading === test.id}
                        >
                          {downloading === test.id ? (
                            <div className="w-5 h-5 rounded-full border-2 border-accent-primary border-t-transparent animate-spin"></div>
                          ) : (
                            <DocumentArrowDownIcon className="w-5 h-5" />
                          )}
                        </button>
                      ) : (
                        <span className="text-text-muted text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-text-muted">No lab tests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Test Request">
        <form onSubmit={handleAddTest}>
          <div className={formStyles.formGroup}>
            <label>Patient Name</label>
            <input type="text" name="patient" required placeholder="e.g. Sarah Jenkins" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Test Name</label>
            <select name="testName" required>
              <option value="Complete Blood Count">Complete Blood Count</option>
              <option value="Lipid Profile">Lipid Profile</option>
              <option value="X-Ray (Chest)">X-Ray (Chest)</option>
              <option value="MRI Scan">MRI Scan</option>
              <option value="Urine Analysis">Urine Analysis</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Referring Doctor</label>
            <input type="text" name="doctor" required placeholder="e.g. Dr. Felix" />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Submit Request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
