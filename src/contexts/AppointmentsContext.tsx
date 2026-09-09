'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  status: string;
  avatar: string;
}

const initialAppointments: Appointment[] = [
  { id: 'APT-2501', patient: 'Fatema Akter', doctor: 'Dr. Rashida Khanam', department: 'General Medicine', date: '2025-07-15', time: '09:00 AM', status: 'Completed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema' },
  { id: 'APT-2502', patient: 'Rafiqul Islam', doctor: 'Dr. Karim Hossain', department: 'Cardiology', date: '2025-07-15', time: '10:30 AM', status: 'In Progress', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul' },
  { id: 'APT-2503', patient: 'Sumaiya Begum', doctor: 'Dr. Nusrat Jahan', department: 'Dental', date: '2025-07-15', time: '11:15 AM', status: 'Scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumaiya' },
  { id: 'APT-2504', patient: 'Jahangir Alam', doctor: 'Dr. Iftekhar Ahmed', department: 'Orthopedics', date: '2025-07-16', time: '02:00 PM', status: 'Scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jahangir' },
  { id: 'APT-2505', patient: 'Nasrin Parvin', doctor: 'Dr. Sabrina Sultana', department: 'Neurology', date: '2025-07-16', time: '03:30 PM', status: 'Cancelled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin' },
  { id: 'APT-2506', patient: 'Mizanur Rahman', doctor: 'Dr. Mahbubur Rahman', department: 'Pediatrics', date: '2025-07-17', time: '09:45 AM', status: 'Scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mizanur' },
];

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'avatar'>) => void;
  updateAppointment: (id: string, apt: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const addAppointment = (apt: Omit<Appointment, 'id' | 'avatar'>) => {
    const newId = `APT-${Date.now()}`;
    setAppointments(prev => [{
      ...apt,
      id: newId,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`,
    }, ...prev]);
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, updateAppointment, deleteAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointments must be used within AppointmentsProvider');
  return ctx;
}
