'use client';

import styles from './Header.module.css';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  ChatBubbleLeftEllipsisIcon 
} from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <MagnifyingGlassIcon style={{ width: 20, height: 20, color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search patients, appointments, doctors..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton}>
          <ChatBubbleLeftEllipsisIcon style={{ width: 20, height: 20 }} />
          <span className={styles.badge}>3</span>
        </button>
        <button className={styles.iconButton}>
          <BellIcon style={{ width: 20, height: 20 }} />
          <span className={styles.badge}>12</span>
        </button>
      </div>
    </header>
  );
}
