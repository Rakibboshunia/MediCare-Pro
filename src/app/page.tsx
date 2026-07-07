import styles from './page.module.css';
import Link from 'next/link';
import { 
  UsersIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const stats = [
  { label: 'Total Patients', value: '1,248', icon: UsersIcon, color: 'var(--accent-primary)', bg: 'var(--accent-light)' },
  { label: 'Available Beds', value: '142', icon: UserGroupIcon, color: 'var(--success)', bg: 'var(--success-light)' },
  { label: 'Appointments Today', value: '86', icon: CalendarIcon, color: 'var(--warning)', bg: 'var(--warning-light)' },
  { label: 'Revenue', value: '$24.5k', icon: CurrencyDollarIcon, color: 'var(--danger)', bg: 'var(--danger-light)' },
];

const appointments = [
  { id: 1, patient: 'Sarah Jenkins', type: 'General Checkup', time: '09:00 AM', status: 'Completed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 2, patient: 'Michael Chen', type: 'Cardiology', time: '10:30 AM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: 3, patient: 'Emma Watson', type: 'Dental', time: '11:15 AM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: 4, patient: 'James Smith', type: 'Orthopedics', time: '02:00 PM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
];

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={stat.label} className={`glass-panel ${styles.statCard} delay-${(i + 1) * 100}`}>
            <div className={styles.statIcon} style={{ color: stat.color, background: stat.bg }}>
              <stat.icon style={{ width: 28, height: 28 }} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={`glass-panel ${styles.card} delay-300`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Appointments</h2>
            <Link href="/appointments" className={styles.viewAll}>View All</Link>
          </div>
          
          <div className={styles.appointmentList}>
            {appointments.map((apt) => (
              <div key={apt.id} className={styles.appointmentItem}>
                <div className={styles.patientInfo}>
                  <img src={apt.avatar} alt={apt.patient} className={styles.patientAvatar} />
                  <div>
                    <div className={styles.patientName}>{apt.patient}</div>
                    <div className={styles.appointmentType}>{apt.type}</div>
                  </div>
                </div>
                <div className={styles.appointmentTime}>
                  <div className={styles.time}>{apt.time}</div>
                  <div className={`${styles.status} ${apt.status === 'Completed' ? styles.statusCompleted : styles.statusUpcoming}`}>
                    {apt.status}
                  </div>
                </div>
                <button style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                  <EllipsisVerticalIcon style={{ width: 20, height: 20 }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`glass-panel ${styles.card} delay-300`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>
          {/* Quick actions placeholders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <button style={{ padding: '1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '12px', fontWeight: 600 }}>+ New Patient</button>
             <button style={{ padding: '1rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 600 }}>Schedule Appointment</button>
             <button style={{ padding: '1rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 600 }}>Create Prescription</button>
          </div>
        </div>
      </div>
    </div>
  );
}
