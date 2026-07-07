'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

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

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = () => {
    const newId = `PT-00${patients.length + 1}`;
    const newPatient = {
      id: newId,
      name: 'New Patient',
      age: 30,
      gender: 'Other',
      bloodGroup: 'Unknown',
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`
    };
    setPatients([newPatient, ...patients]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Patients</h1>
        <button className={styles.addButton} onClick={handleAddPatient}>+ Add New Patient</button>
      </div>
      
      <div className={`glass-panel ${styles.content}`}>
        <div className={styles.searchBar}>
          <MagnifyingGlassIcon style={{ width: 20, height: 20 }} />
          <input 
            type="text" 
            placeholder="Search patients by name or ID..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>ID</th>
                <th>Age/Gender</th>
                <th>Blood Group</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className={styles.patientInfo}>
                        <img src={patient.avatar} alt={patient.name} className={styles.avatar} />
                        <span className={styles.patientName}>{patient.name}</span>
                      </div>
                    </td>
                    <td className={styles.patientId}>{patient.id}</td>
                    <td>{patient.age} yrs, {patient.gender}</td>
                    <td><span className={styles.bloodGroup}>{patient.bloodGroup}</span></td>
                    <td>{patient.lastVisit}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${patient.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.actionButton}>
                        <EllipsisVerticalIcon style={{ width: 20, height: 20 }} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
