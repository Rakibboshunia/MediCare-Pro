'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { MagnifyingGlassIcon, DocumentTextIcon, PrinterIcon } from '@heroicons/react/24/outline';

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

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPrescription = () => {
    const newId = `RX-70${prescriptions.length + 1}`;
    const newRx = {
      id: newId,
      patient: 'New Patient',
      doctor: 'Dr. Felix',
      date: new Date().toISOString().split('T')[0],
      medications: 1,
      status: 'Active'
    };
    setPrescriptions([newRx, ...prescriptions]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Prescriptions</h1>
        <button className={styles.addButton} onClick={handleAddPrescription}>+ Create Prescription</button>
      </div>
      
      <div className={`glass-panel ${styles.content}`}>
        <div className={styles.searchBar}>
          <MagnifyingGlassIcon style={{ width: 20, height: 20 }} />
          <input 
            type="text" 
            placeholder="Search prescriptions by patient or ID..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Prescription ID</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Date Issued</th>
                <th>Medications</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((rx) => (
                  <tr key={rx.id}>
                    <td className={styles.rxId}>
                      <DocumentTextIcon style={{ width: 16, height: 16 }} />
                      {rx.id}
                    </td>
                    <td className={styles.patientName}>{rx.patient}</td>
                    <td>{rx.doctor}</td>
                    <td>{rx.date}</td>
                    <td>{rx.medications} items</td>
                    <td>
                      <span className={`${styles.statusBadge} ${rx.status === 'Active' ? styles.statusActive : styles.statusCompleted}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionButton} title="View Details">
                          View
                        </button>
                        <button className={styles.iconButton} title="Print">
                          <PrinterIcon style={{ width: 20, height: 20 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No prescriptions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
