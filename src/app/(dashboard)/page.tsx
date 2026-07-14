'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UsersIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const stats = [
  { label: 'Total Patients', value: '1,248', icon: UsersIcon, colorClass: 'text-accent-primary', bgClass: 'bg-accent-light', borderClass: 'hover:border-accent-primary' },
  { label: 'Available Beds', value: '142', icon: UserGroupIcon, colorClass: 'text-success', bgClass: 'bg-success-light', borderClass: 'hover:border-success' },
  { label: 'Appointments Today', value: '86', icon: CalendarIcon, colorClass: 'text-warning', bgClass: 'bg-warning-light', borderClass: 'hover:border-warning' },
  { label: 'Revenue', value: '$24.5k', icon: CurrencyDollarIcon, colorClass: 'text-danger', bgClass: 'bg-danger-light', borderClass: 'hover:border-danger' },
];

const initialAppointments = [
  { id: 1, patient: 'Sarah Jenkins', type: 'General Checkup', time: '09:00 AM', status: 'Completed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 2, patient: 'Michael Chen', type: 'Cardiology', time: '10:30 AM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: 3, patient: 'Emma Watson', type: 'Dental', time: '11:15 AM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: 4, patient: 'James Smith', type: 'Orthopedics', time: '02:00 PM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
];

export default function Dashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);

  const markAsCompleted = (id: number) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'Completed' } : apt
    ));
  };

  const userName = 'Dr. Admin';

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden border-0 bg-gradient-to-r from-accent-primary to-violet-600 text-white shadow-xl shadow-accent-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-5 h-5 text-warning" />
              <span className="text-sm font-semibold tracking-wider text-white/90 uppercase">Welcome Back</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold mb-2 text-white">Good Morning, Dr. Admin</h1>
            <p className="text-white/80 text-sm md:text-base">You have <strong className="text-white">86</strong> appointments today and <strong className="text-white">12</strong> pending reports. Have a great day ahead!</p>
          </div>
          <button className="px-5 py-2.5 bg-white text-accent-primary rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0">
            View Schedule <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: 'Total Patients', value: '1,248', icon: UsersIcon, bg: 'bg-indigo-500/10 text-indigo-500' },
          { title: 'Available Beds', value: '142', icon: UserGroupIcon, bg: 'bg-emerald-500/10 text-emerald-500' },
          { title: 'Appointments Today', value: '86', icon: CalendarIcon, bg: 'bg-amber-500/10 text-amber-500' },
          { title: 'Revenue', value: '$24.5k', icon: CurrencyDollarIcon, bg: 'bg-rose-500/10 text-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 md:p-6 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-glow cursor-pointer group">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} transition-transform group-hover:scale-110`}>
              <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-text-secondary font-medium mb-1">{stat.title}</p>
              <h3 className="text-xl md:text-2xl font-bold text-text-primary">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Recent Appointments */}
        <div className="glass-panel p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Recent Appointments</h2>
              <p className="text-sm text-text-muted mt-1">Your upcoming schedule for today</p>
            </div>
            <Link href="/appointments" className="text-accent-primary text-sm font-semibold hover:text-accent-hover hover:underline bg-accent-light px-4 py-2 rounded-lg transition-colors">
              View All
            </Link>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {appointments.map((apt) => (
              <div key={apt.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-primary rounded-2xl border border-border transition-all hover:border-accent-light hover:shadow-md gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={apt.avatar} alt={apt.patient} className="w-14 h-14 rounded-full object-cover border-2 border-border group-hover:border-accent-primary transition-colors" />
                    {apt.status === 'Completed' && (
                      <div className="absolute -bottom-1 -right-1 bg-success text-white rounded-full p-0.5">
                        <CheckCircleIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-base text-text-primary group-hover:text-accent-primary transition-colors">{apt.patient}</div>
                    <div className="text-sm text-text-muted mt-0.5 flex items-center gap-2">
                      <span>{apt.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="font-semibold text-text-primary text-sm flex items-center sm:justify-end gap-1">
                      <CalendarIcon className="w-4 h-4 text-text-muted" />
                      {apt.time}
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-bold inline-block mt-2 ${apt.status === 'Completed' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`}>
                      {apt.status}
                    </div>
                  </div>
                  <button 
                    onClick={() => markAsCompleted(apt.id)}
                    title={apt.status === 'Completed' ? "Already completed" : "Mark as completed"}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${apt.status === 'Completed' ? 'bg-success-light text-success cursor-default' : 'bg-bg-secondary text-text-muted cursor-pointer hover:bg-success hover:text-white shadow-sm'}`}
                  >
                    <CheckCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel p-6 flex flex-col h-full bg-gradient-to-b from-bg-card to-bg-primary/50">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary">Quick Actions</h2>
            <p className="text-sm text-text-muted mt-1">Frequently used tools</p>
          </div>
          <div className="flex flex-col gap-4 flex-1 justify-center">
             <button 
                onClick={() => router.push('/patients')}
                className="group p-5 bg-gradient-to-r from-accent-primary to-accent-hover text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-none flex justify-between items-center"
             >
               <span className="flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-lg"><UsersIcon className="w-5 h-5" /></div>
                 New Patient
               </span>
               <ArrowRightIcon className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
             </button>
             
             <button 
                onClick={() => router.push('/appointments')}
                className="group p-5 bg-bg-secondary text-text-primary border border-border rounded-2xl font-semibold transition-all hover:bg-bg-primary hover:border-text-muted cursor-pointer flex justify-between items-center"
             >
               <span className="flex items-center gap-3">
                 <div className="bg-bg-primary p-2 rounded-lg border border-border"><CalendarIcon className="w-5 h-5 text-text-secondary" /></div>
                 Schedule Appointment
               </span>
               <ArrowRightIcon className="w-5 h-5 text-text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
             </button>
             
             <button 
                onClick={() => router.push('/prescriptions')}
                className="group p-5 bg-bg-secondary text-text-primary border border-border rounded-2xl font-semibold transition-all hover:bg-bg-primary hover:border-text-muted cursor-pointer flex justify-between items-center"
             >
               <span className="flex items-center gap-3">
                 <div className="bg-bg-primary p-2 rounded-lg border border-border"><CalendarIcon className="w-5 h-5 text-text-secondary" /></div>
                 Create Prescription
               </span>
               <ArrowRightIcon className="w-5 h-5 text-text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
