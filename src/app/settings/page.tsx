import styles from './page.module.css';

export default function Settings() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </div>
      
      <div className={`glass-panel ${styles.content}`}>
        <div className={styles.settingsGrid}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Hospital Information</h2>
            <div className={styles.formGroup}>
              <label>Hospital Name</label>
              <input type="text" defaultValue="MediCare Pro Hospital" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Contact Email</label>
              <input type="email" defaultValue="admin@medicarepro.com" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Emergency Phone</label>
              <input type="text" defaultValue="+1 (555) 0198-9999" className={styles.input} />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>System Preferences</h2>
            <div className={styles.formGroup}>
              <label>Time Zone</label>
              <select className={styles.input}>
                <option>Eastern Time (ET)</option>
                <option>Pacific Time (PT)</option>
                <option>UTC</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Date Format</label>
              <select className={styles.input}>
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.saveButton}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
