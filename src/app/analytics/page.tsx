import styles from './page.module.css';
import { ChartBarIcon, ArrowTrendingUpIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function Analytics() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics & Reports</h1>
        <button className={styles.addButton}>Export Data</button>
      </div>
      
      <div className={styles.grid}>
        <div className={`glass-panel ${styles.card}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <UsersIcon style={{ width: 24, height: 24, color: 'var(--accent-primary)' }} />
              <h3>Patient Growth</h3>
            </div>
            <span className={styles.trendPositive}>+12.5% <ArrowTrendingUpIcon style={{ width: 16, height: 16 }} /></span>
          </div>
          <div className={styles.chartArea}>
            <div className={styles.barChart}>
              {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
                <div key={i} className={styles.barWrapper}>
                  <div className={styles.bar} style={{ height: `${h}%` }}></div>
                  <span className={styles.barLabel}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`glass-panel ${styles.card}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <ChartBarIcon style={{ width: 24, height: 24, color: 'var(--warning)' }} />
              <h3>Revenue Overview</h3>
            </div>
            <span className={styles.trendPositive}>+8.2% <ArrowTrendingUpIcon style={{ width: 16, height: 16 }} /></span>
          </div>
          <div className={styles.statsList}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Revenue</span>
              <span className={styles.statValue}>$124,500</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Outstanding</span>
              <span className={styles.statValue}>$12,300</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Expenses</span>
              <span className={styles.statValue}>$45,200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
