'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Patients', href: '/patients', icon: UsersIcon },
  { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
  { name: 'Prescriptions', href: '/prescriptions', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>M</div>
        <div className={styles.logoText}>MediCare Pro</div>
      </div>

      <nav className={styles.nav}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <item.icon className={styles.navIcon} style={{ width: 24, height: 24 }} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"
          alt="Dr. Felix"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <span className={styles.userName}>Dr. Felix</span>
          <span className={styles.userRole}>Chief Medical Officer</span>
        </div>
      </div>
    </aside>
  );
}
