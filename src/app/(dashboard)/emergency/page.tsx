'use client';

import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, PlusIcon, ClockIcon, HeartIcon,
  TruckIcon, PhoneIcon, CheckCircleIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

type EmergencyCase = {
  id: string;
  patient: string;
  age: number;
  gender: string;
  condition: string;
  severity: 'Critical' | 'Urgent' | 'Moderate' | 'Minor';
  arrivalTime: string;
  assignedDoctor: string;
  status: 'Triaged' | 'Under Treatment' | 'Admitted' | 'Discharged' | 'Waiting';
  vitals: { bp: string; pulse: number; temp: string; spo2: number };
  arrivalMode: 'Walk-in' | 'Ambulance' | 'Referral';
};

const initialCases: EmergencyCase[] = [
  { id: 'EM-001', patient: 'Anwar Hossain', age: 58, gender: 'Male', condition: 'Chest Pain - Suspected MI', severity: 'Critical', arrivalTime: '08:15 AM', assignedDoctor: 'Dr. Karim Hossain', status: 'Under Treatment', vitals: { bp: '160/95', pulse: 110, temp: '98.6°F', spo2: 89 }, arrivalMode: 'Ambulance' },
  { id: 'EM-002', patient: 'Selina Parvin', age: 34, gender: 'Female', condition: 'Severe Allergic Reaction', severity: 'Urgent', arrivalTime: '09:30 AM', assignedDoctor: 'Dr. Rashida Khanam', status: 'Under Treatment', vitals: { bp: '100/65', pulse: 125, temp: '99.1°F', spo2: 94 }, arrivalMode: 'Walk-in' },
  { id: 'EM-003', patient: 'Golam Rabbani', age: 45, gender: 'Male', condition: 'Road Traffic Accident - Multiple Fractures', severity: 'Critical', arrivalTime: '10:00 AM', assignedDoctor: 'Dr. Iftekhar Ahmed', status: 'Triaged', vitals: { bp: '90/60', pulse: 130, temp: '97.8°F', spo2: 91 }, arrivalMode: 'Ambulance' },
  { id: 'EM-004', patient: 'Mariam Khatun', age: 28, gender: 'Female', condition: 'Acute Appendicitis', severity: 'Urgent', arrivalTime: '10:45 AM', assignedDoctor: 'Dr. Nusrat Jahan', status: 'Waiting', vitals: { bp: '120/80', pulse: 95, temp: '101.2°F', spo2: 97 }, arrivalMode: 'Walk-in' },
  { id: 'EM-005', patient: 'Rafiq Mia', age: 67, gender: 'Male', condition: 'Stroke - Left Side Weakness', severity: 'Critical', arrivalTime: '11:20 AM', assignedDoctor: 'Dr. Sabrina Sultana', status: 'Under Treatment', vitals: { bp: '180/110', pulse: 88, temp: '98.4°F', spo2: 93 }, arrivalMode: 'Ambulance' },
  { id: 'EM-006', patient: 'Liton Das', age: 22, gender: 'Male', condition: 'Deep Laceration - Hand', severity: 'Moderate', arrivalTime: '12:00 PM', assignedDoctor: 'Dr. Rashida Khanam', status: 'Under Treatment', vitals: { bp: '115/75', pulse: 82, temp: '98.6°F', spo2: 99 }, arrivalMode: 'Walk-in' },
  { id: 'EM-007', patient: 'Shahida Begum', age: 55, gender: 'Female', condition: 'High Fever & Dehydration', severity: 'Moderate', arrivalTime: '12:30 PM', assignedDoctor: 'Dr. Mahbubur Rahman', status: 'Waiting', vitals: { bp: '105/70', pulse: 100, temp: '103.5°F', spo2: 96 }, arrivalMode: 'Referral' },
  { id: 'EM-008', patient: 'Ratan Kumar', age: 8, gender: 'Male', condition: 'Fractured Arm (Fall)', severity: 'Minor', arrivalTime: '01:15 PM', assignedDoctor: 'Dr. Mahbubur Rahman', status: 'Discharged', vitals: { bp: '100/65', pulse: 88, temp: '98.6°F', spo2: 99 }, arrivalMode: 'Walk-in' },
];

export default function Emergency() {
  const [cases, setCases] = useState(initialCases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, string>>({});

  // Simulated elapsed timer
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      cases.forEach(c => {
        // Random elapsed minutes for demo
        const minutes = Math.floor(Math.random() * 120) + 10;
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        times[c.id] = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
      });
      setElapsedTimes(times);
    };
    updateTimes();
  }, [cases.length]);

  const critical = cases.filter(c => c.severity === 'Critical' && c.status !== 'Discharged').length;
  const urgent = cases.filter(c => c.severity === 'Urgent' && c.status !== 'Discharged').length;
  const waiting = cases.filter(c => c.status === 'Waiting').length;
  const underTreatment = cases.filter(c => c.status === 'Under Treatment').length;

  const filteredCases = filterSeverity === 'All' 
    ? cases 
    : cases.filter(c => c.severity === filterSeverity);

  const handleAdmit = (id: string) => {
    setCases(cases.map(c => c.id === id ? { ...c, status: 'Admitted' as const } : c));
  };

  const handleDischarge = (id: string) => {
    setCases(cases.map(c => c.id === id ? { ...c, status: 'Discharged' as const } : c));
  };

  const handleAddCase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCase: EmergencyCase = {
      id: `EM-${String(cases.length + 1).padStart(3, '0')}`,
      patient: formData.get('patient') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      condition: formData.get('condition') as string,
      severity: formData.get('severity') as EmergencyCase['severity'],
      arrivalTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      assignedDoctor: formData.get('doctor') as string,
      status: 'Waiting',
      vitals: { bp: '120/80', pulse: 80, temp: '98.6°F', spo2: 98 },
      arrivalMode: formData.get('arrivalMode') as EmergencyCase['arrivalMode'],
    };
    setCases([newCase, ...cases]);
    setIsModalOpen(false);
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'bg-red-500/15 text-red-500 border-red-500/30';
      case 'Urgent': return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
      case 'Moderate': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      case 'Minor': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-danger-light rounded-xl">
            <ExclamationTriangleIcon className="w-7 h-7 text-danger" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Emergency Department</h1>
            <p className="text-sm text-text-muted mt-0.5">Active emergency cases and triage management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="tel:999" className="px-4 py-2.5 bg-danger text-white rounded-xl font-semibold transition-opacity hover:opacity-90 flex items-center gap-2 text-sm border-none">
            <PhoneIcon className="w-4 h-4" /> Emergency: 999
          </a>
          <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm border-none">
            <PlusIcon className="w-5 h-5" /> New Case
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 border-l-4 border-red-500 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red-500">{critical}</span>
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span className="text-xs text-text-muted font-medium">Critical Cases</span>
        </div>
        <div className="glass-panel p-5 border-l-4 border-orange-500 flex flex-col gap-1">
          <span className="text-2xl font-bold text-orange-500">{urgent}</span>
          <span className="text-xs text-text-muted font-medium">Urgent Cases</span>
        </div>
        <div className="glass-panel p-5 border-l-4 border-amber-500 flex flex-col gap-1">
          <span className="text-2xl font-bold text-amber-500">{waiting}</span>
          <span className="text-xs text-text-muted font-medium">Waiting</span>
        </div>
        <div className="glass-panel p-5 border-l-4 border-indigo-500 flex flex-col gap-1">
          <span className="text-2xl font-bold text-indigo-500">{underTreatment}</span>
          <span className="text-xs text-text-muted font-medium">Under Treatment</span>
        </div>
      </div>

      {/* Severity Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {['All', 'Critical', 'Urgent', 'Moderate', 'Minor'].map((sev) => (
          <button 
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
              filterSeverity === sev 
                ? 'bg-accent-primary text-white border-accent-primary' 
                : 'bg-bg-secondary text-text-secondary border-border hover:border-text-muted'
            }`}
          >
            {sev === 'Critical' && '🔴 '}{sev === 'Urgent' && '🟠 '}{sev === 'Moderate' && '🟡 '}{sev === 'Minor' && '🟢 '}{sev}
          </button>
        ))}
      </div>

      {/* Cases */}
      <div className="flex flex-col gap-4">
        {filteredCases.map((eCase) => (
          <div key={eCase.id} className={`glass-panel p-5 border-l-4 transition-all hover:shadow-md ${
            eCase.severity === 'Critical' ? 'border-red-500' :
            eCase.severity === 'Urgent' ? 'border-orange-500' :
            eCase.severity === 'Moderate' ? 'border-amber-500' : 'border-emerald-500'
          } ${eCase.status === 'Discharged' ? 'opacity-60' : ''}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Patient Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-2 rounded-xl shrink-0 ${getSeverityColor(eCase.severity)}`}>
                  <HeartIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-text-primary text-base">{eCase.patient}</h3>
                    <span className="text-xs text-text-muted">{eCase.age} yrs, {eCase.gender}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getSeverityColor(eCase.severity)}`}>
                      {eCase.severity}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1 font-medium">{eCase.condition}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-muted flex-wrap">
                    <span className="flex items-center gap-1"><TruckIcon className="w-3.5 h-3.5" /> {eCase.arrivalMode}</span>
                    <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> {eCase.arrivalTime}</span>
                    <span>Dr: <span className="text-text-primary font-medium">{eCase.assignedDoctor}</span></span>
                    {elapsedTimes[eCase.id] && (
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <ClockIcon className="w-3.5 h-3.5" /> Elapsed: {elapsedTimes[eCase.id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vitals */}
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { label: 'BP', value: eCase.vitals.bp, alert: parseInt(eCase.vitals.bp) > 140 },
                  { label: 'Pulse', value: `${eCase.vitals.pulse}`, alert: eCase.vitals.pulse > 100 },
                  { label: 'SpO2', value: `${eCase.vitals.spo2}%`, alert: eCase.vitals.spo2 < 94 },
                  { label: 'Temp', value: eCase.vitals.temp, alert: parseFloat(eCase.vitals.temp) > 100 },
                ].map((vital) => (
                  <div key={vital.label} className={`px-3 py-1.5 rounded-lg text-center border ${vital.alert ? 'bg-danger-light border-danger/30' : 'bg-bg-primary border-border'}`}>
                    <p className="text-[10px] text-text-muted font-medium">{vital.label}</p>
                    <p className={`text-sm font-bold ${vital.alert ? 'text-danger' : 'text-text-primary'}`}>{vital.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${
                  eCase.status === 'Under Treatment' ? 'bg-accent-light text-accent-primary' :
                  eCase.status === 'Waiting' ? 'bg-warning-light text-warning' :
                  eCase.status === 'Admitted' ? 'bg-success-light text-success' :
                  eCase.status === 'Triaged' ? 'bg-cyan-500/15 text-cyan-500' :
                  'bg-bg-secondary text-text-muted'
                }`}>{eCase.status}</span>
                {eCase.status !== 'Discharged' && eCase.status !== 'Admitted' && (
                  <button onClick={() => handleAdmit(eCase.id)} className="px-3 py-1.5 rounded-lg bg-success-light text-success text-xs font-semibold cursor-pointer border-none hover:bg-success hover:text-white transition-colors">
                    Admit
                  </button>
                )}
                {eCase.status !== 'Discharged' && (
                  <button onClick={() => handleDischarge(eCase.id)} className="px-3 py-1.5 rounded-lg bg-bg-secondary text-text-muted text-xs font-semibold cursor-pointer border border-border hover:bg-danger-light hover:text-danger hover:border-danger/30 transition-colors">
                    Discharge
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Emergency Case">
        <form onSubmit={handleAddCase}>
          <div className={formStyles.formGroup}>
            <label>Patient Name</label>
            <input type="text" name="patient" required placeholder="e.g. Anwar Hossain" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={formStyles.formGroup}>
              <label>Age</label>
              <input type="number" name="age" required min="0" placeholder="45" />
            </div>
            <div className={formStyles.formGroup}>
              <label>Gender</label>
              <select name="gender" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className={formStyles.formGroup}>
            <label>Condition / Chief Complaint</label>
            <textarea name="condition" required placeholder="Describe the emergency condition..." rows={2}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={formStyles.formGroup}>
              <label>Severity</label>
              <select name="severity" required>
                <option value="Critical">🔴 Critical</option>
                <option value="Urgent">🟠 Urgent</option>
                <option value="Moderate">🟡 Moderate</option>
                <option value="Minor">🟢 Minor</option>
              </select>
            </div>
            <div className={formStyles.formGroup}>
              <label>Arrival Mode</label>
              <select name="arrivalMode" required>
                <option value="Walk-in">Walk-in</option>
                <option value="Ambulance">Ambulance</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>
          <div className={formStyles.formGroup}>
            <label>Assign Doctor</label>
            <select name="doctor" required>
              <option value="Dr. Rashida Khanam">Dr. Rashida Khanam</option>
              <option value="Dr. Karim Hossain">Dr. Karim Hossain</option>
              <option value="Dr. Nusrat Jahan">Dr. Nusrat Jahan</option>
              <option value="Dr. Iftekhar Ahmed">Dr. Iftekhar Ahmed</option>
              <option value="Dr. Sabrina Sultana">Dr. Sabrina Sultana</option>
              <option value="Dr. Mahbubur Rahman">Dr. Mahbubur Rahman</option>
            </select>
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Register Case</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
