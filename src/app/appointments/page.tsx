'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { MagnifyingGlassIcon, EllipsisVerticalIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const initialAppointments = [
  { id: 'APT-101', patient: 'Sarah Jenkins', doctor: 'Dr. Felix', department: 'General Medicine', date: '2023-11-15', time: '09:00 AM', status: 'Completed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'APT-102', patient: 'Michael Chen', doctor: 'Dr. Smith', department: 'Cardiology', date: '2023-11-15', time: '10:30 AM', status: 'In Progress', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: 'APT-103', patient: 'Emma Watson', doctor: 'Dr. Jane', department: 'Dental', date: '2023-11-15', time: '11:15 AM', status: 'Scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: 'APT-104', patient: 'James Smith', doctor: 'Dr. Brown', department: 'Orthopedics', date: '2023-11-16', time: '02:00 PM', status: 'Scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { id: 'APT-105', patient: 'Olivia Davis', doctor: 'Dr. Felix', department: 'General Medicine', date: '2023-11-16', time: '03:30 PM', status: 'Cancelled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia' },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAppointment = () => {
    const newId = `APT-10${appointments.length + 1}`;
    const newApt = {
      id: newId,
      patient: 'New Patient',
      doctor: 'Dr. Unassigned',
      department: 'General Medicine',
      date: new Date().toISOString().split('T')[0],
      time: '12:00 PM',
      status: 'Scheduled',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`
    };
    setAppointments([newApt, ...appointments]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Appointments</h1>
        <button className={styles.addButton} onClick={handleAddAppointment}>+ Schedule Appointment</button>
      </div>
      
      <div className={`glass-panel ${styles.content}`}>
        <div className={styles.filterSection}>
          <div className={styles.searchBar}>
            <MagnifyingGlassIcon style={{ width: 20, height: 20 }} />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.dateFilter}>
            <CalendarIcon style={{ width: 20, height: 20 }} />
            <span>Today, Nov 15</span>
          </div>
        </div>
        
        <div className={styles.gridContainer}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div key={apt.id} className={styles.appointmentCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.aptId}>{apt.id}</span>
                  <span className={`${styles.statusBadge} ${styles[apt.status.replace(' ', '')]}`}>
                    {apt.status}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.patientInfo}>
                    <img src={apt.avatar} alt={apt.patient} className={styles.avatar} />
                    <div>
                      <h3 className={styles.patientName}>{apt.patient}</h3>
                      <p className={styles.department}>{apt.department}</p>
                    </div>
                  </div>
                  <div className={styles.doctorInfo}>
                    <p>Consulting Doctor</p>
                    <h4>{apt.doctor}</h4>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.timeInfo}>
                    <ClockIcon style={{ width: 16, height: 16 }} />
                    <span>{apt.time}</span>
                    <span className={styles.dateInfo}>{apt.date}</span>
                  </div>
                  <button className={styles.actionButton}>
                    <EllipsisVerticalIcon style={{ width: 20, height: 20 }} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No appointments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
