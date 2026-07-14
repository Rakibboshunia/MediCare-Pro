'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UsersIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  HeartIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  DocumentTextIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

// Mini Sparkline Component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Animated Counter Hook
function useAnimatedCounter(end: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

const initialAppointments = [
  { id: 1, patient: 'Fatema Akter', type: 'General Medicine', time: '09:00 AM', status: 'Completed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema', doctor: 'Dr. Rashida Khanam' },
  { id: 2, patient: 'Rafiqul Islam', type: 'Cardiology', time: '10:30 AM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul', doctor: 'Dr. Karim Hossain' },
  { id: 3, patient: 'Sumaiya Begum', type: 'Dental', time: '11:15 AM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumaiya', doctor: 'Dr. Nusrat Jahan' },
  { id: 4, patient: 'Jahangir Alam', type: 'Orthopedics', time: '02:00 PM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jahangir', doctor: 'Dr. Iftekhar Ahmed' },
  { id: 5, patient: 'Nasrin Parvin', type: 'Neurology', time: '03:30 PM', status: 'Upcoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin', doctor: 'Dr. Sabrina Sultana' },
];

const recentActivities = [
  { id: 1, icon: UsersIcon, text: 'New patient Kamal Uddin registered', time: '2 min ago', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 2, icon: BeakerIcon, text: 'Lab report ready for Fatema Akter (CBC)', time: '15 min ago', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 3, icon: DocumentTextIcon, text: 'Prescription RX-2507 created by Dr. Karim', time: '32 min ago', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { id: 4, icon: ExclamationTriangleIcon, text: 'Low stock alert: Amoxil 250mg (38 units)', time: '1 hr ago', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 5, icon: CalendarIcon, text: 'Appointment rescheduled for Mizanur Rahman', time: '2 hrs ago', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 6, icon: CurrencyDollarIcon, text: 'Payment ৳32,000 received from Jahangir Alam', time: '3 hrs ago', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const departments = [
  { name: 'Cardiology', patients: 48, beds: 24, occupancy: 88, color: 'from-rose-500 to-pink-600' },
  { name: 'Neurology', patients: 32, beds: 18, occupancy: 72, color: 'from-violet-500 to-purple-600' },
  { name: 'Orthopedics', patients: 41, beds: 20, occupancy: 65, color: 'from-cyan-500 to-blue-600' },
  { name: 'Pediatrics', patients: 56, beds: 30, occupancy: 53, color: 'from-amber-500 to-orange-600' },
  { name: 'General Medicine', patients: 78, beds: 50, occupancy: 92, color: 'from-emerald-500 to-green-600' },
  { name: 'Dental', patients: 23, beds: 0, occupancy: 0, color: 'from-indigo-500 to-blue-600' },
];

const upcomingOperations = [
  { id: 1, patient: 'Jahangir Alam', type: 'Knee Replacement', surgeon: 'Dr. Iftekhar Ahmed', time: '02:00 PM', ot: 'OT-1', priority: 'High' },
  { id: 2, patient: 'Shahnaz Akhter', type: 'Cataract Surgery', surgeon: 'Dr. Sabrina Sultana', time: '04:00 PM', ot: 'OT-2', priority: 'Medium' },
  { id: 3, patient: 'Kamal Uddin', type: 'Cardiac Bypass', surgeon: 'Dr. Karim Hossain', time: '06:30 PM', ot: 'OT-1', priority: 'Critical' },
];

export default function Dashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const markAsCompleted = (id: number) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'Completed' } : apt
    ));
  };

  const patientsCount = useAnimatedCounter(1248);
  const bedsCount = useAnimatedCounter(142);
  const appointmentsCount = useAnimatedCounter(86);
  const revenueCount = useAnimatedCounter(24500);

  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : currentTime.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner with Live Clock */}
      <div className="relative p-6 md:p-8 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/25">
        {/* Animated background orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-5 h-5 text-amber-300" />
              <span className="text-sm font-semibold tracking-wider text-white/90 uppercase">{greeting}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold mb-2 text-white">Welcome, Dr. Boshunia</h1>
            <p className="text-white/80 text-sm md:text-base">
              You have <strong className="text-white">{initialAppointments.filter(a => a.status === 'Upcoming').length}</strong> upcoming appointments and <strong className="text-white">3</strong> pending operations today.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-3xl md:text-4xl font-mono font-bold tracking-wider tabular-nums">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-sm text-white/70 font-medium">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <button 
              onClick={() => router.push('/appointments')}
              className="mt-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer border-none"
            >
              View Schedule <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { title: 'Total Patients', value: patientsCount.toLocaleString(), icon: UsersIcon, trend: '+12.5%', up: true, sparkData: [30, 40, 35, 50, 49, 60, 70], color: '#6366f1', bg: 'bg-indigo-500/10 text-indigo-500' },
          { title: 'Available Beds', value: bedsCount.toString(), icon: UserGroupIcon, trend: '-3.2%', up: false, sparkData: [60, 55, 52, 48, 50, 45, 42], color: '#10b981', bg: 'bg-emerald-500/10 text-emerald-500' },
          { title: 'Appointments Today', value: appointmentsCount.toString(), icon: CalendarIcon, trend: '+8.1%', up: true, sparkData: [40, 55, 45, 70, 65, 80, 86], color: '#f59e0b', bg: 'bg-amber-500/10 text-amber-500' },
          { title: 'Revenue (Monthly)', value: `৳${(revenueCount / 1000).toFixed(1)}k`, icon: CurrencyDollarIcon, trend: '+15.3%', up: true, sparkData: [20, 25, 22, 30, 28, 35, 40], color: '#ef4444', bg: 'bg-rose-500/10 text-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:shadow-glow cursor-pointer group relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <Sparkline data={stat.sparkData} color={stat.color} />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium mb-1">{stat.title}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-text-primary">{stat.value}</h3>
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${stat.up ? 'text-success bg-success-light' : 'text-danger bg-danger-light'}`}>
                  {stat.up ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bed Occupancy Visual Bar */}
      <div className="glass-panel p-5 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Bed Occupancy Overview</h2>
            <p className="text-sm text-text-muted mt-0.5">Real-time bed availability across departments</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Occupied</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Critical</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {departments.filter(d => d.beds > 0).map((dept) => (
            <div key={dept.name} className="flex flex-col items-center gap-2 p-4 bg-bg-primary rounded-xl border border-border hover:border-accent-light transition-all">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
                  <circle 
                    cx="18" cy="18" r="15.9" fill="none" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeDasharray={`${dept.occupancy} ${100 - dept.occupancy}`}
                    className={dept.occupancy > 85 ? 'text-rose-500' : dept.occupancy > 60 ? 'text-amber-500' : 'text-emerald-500'}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">{dept.occupancy}%</span>
              </div>
              <span className="text-xs font-semibold text-text-primary text-center leading-tight">{dept.name}</span>
              <span className="text-[10px] text-text-muted">{dept.beds} beds</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Recent Appointments */}
        <div className="glass-panel p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Today&apos;s Appointments</h2>
              <p className="text-sm text-text-muted mt-0.5">Your schedule for today</p>
            </div>
            <Link href="/appointments" className="text-accent-primary text-sm font-semibold hover:text-accent-hover bg-accent-light px-4 py-2 rounded-lg transition-colors">
              View All
            </Link>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            {appointments.map((apt) => (
              <div key={apt.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-primary rounded-2xl border border-border transition-all hover:border-accent-light hover:shadow-md gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={apt.avatar} alt={apt.patient} className="w-11 h-11 rounded-full object-cover border-2 border-border group-hover:border-accent-primary transition-colors" />
                    {apt.status === 'Completed' && (
                      <div className="absolute -bottom-1 -right-1 bg-success text-white rounded-full p-0.5">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-text-primary group-hover:text-accent-primary transition-colors">{apt.patient}</div>
                    <div className="text-xs text-text-muted mt-0.5">{apt.type} • {apt.doctor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:w-auto w-full justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-semibold text-text-primary text-xs flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5 text-text-muted" />
                      {apt.time}
                    </div>
                    <div className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold inline-block mt-1 ${apt.status === 'Completed' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`}>
                      {apt.status}
                    </div>
                  </div>
                  <button 
                    onClick={() => markAsCompleted(apt.id)}
                    title={apt.status === 'Completed' ? "Already completed" : "Mark as completed"}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${apt.status === 'Completed' ? 'bg-success-light text-success cursor-default' : 'bg-bg-secondary text-text-muted cursor-pointer hover:bg-success hover:text-white shadow-sm'}`}
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Actions + Activity */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="glass-panel p-5 flex flex-col bg-gradient-to-b from-bg-card to-bg-primary/50">
            <h2 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Patient', icon: UsersIcon, href: '/patients', gradient: 'from-indigo-500 to-violet-600' },
                { label: 'Appointment', icon: CalendarIcon, href: '/appointments', gradient: 'from-cyan-500 to-blue-600' },
                { label: 'Prescription', icon: DocumentTextIcon, href: '/prescriptions', gradient: 'from-emerald-500 to-green-600' },
                { label: 'Lab Test', icon: BeakerIcon, href: '/laboratory', gradient: 'from-amber-500 to-orange-600' },
                { label: 'Billing', icon: CurrencyDollarIcon, href: '/billing', gradient: 'from-rose-500 to-pink-600' },
                { label: 'AI Assistant', icon: SparklesIcon, href: '/ai-assistant', gradient: 'from-violet-500 to-purple-600' },
              ].map((action) => (
                <button 
                  key={action.label}
                  onClick={() => router.push(action.href)}
                  className={`group p-3 bg-gradient-to-br ${action.gradient} text-white rounded-xl font-medium text-xs transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-none flex flex-col items-center gap-2`}
                >
                  <action.icon className="w-5 h-5 opacity-90 group-hover:scale-110 transition-transform" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="glass-panel p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
              <BellAlertIcon className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex flex-col gap-3">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 group cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary leading-relaxed group-hover:text-accent-primary transition-colors">{activity.text}</p>
                    <span className="text-[10px] text-text-muted">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Operations */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-rose-500" />
              Upcoming Operations
            </h2>
            <p className="text-sm text-text-muted mt-0.5">Scheduled surgical procedures for today</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingOperations.map((op) => (
            <div key={op.id} className="p-4 bg-bg-primary rounded-2xl border border-border hover:border-accent-light hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                  op.priority === 'Critical' ? 'bg-danger-light text-danger' :
                  op.priority === 'High' ? 'bg-warning-light text-warning' :
                  'bg-accent-light text-accent-primary'
                }`}>
                  {op.priority}
                </span>
                <span className="text-xs text-text-muted font-medium">{op.ot}</span>
              </div>
              <h3 className="font-bold text-text-primary text-sm mb-1">{op.type}</h3>
              <p className="text-xs text-text-muted mb-3">Patient: <span className="text-text-secondary font-medium">{op.patient}</span></p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-text-muted">{op.surgeon}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-text-primary">
                  <ClockIcon className="w-3.5 h-3.5" /> {op.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Performance */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Department Performance</h2>
            <p className="text-sm text-text-muted mt-0.5">Overview of patients and capacity by department</p>
          </div>
          <Link href="/analytics" className="text-accent-primary text-sm font-semibold hover:text-accent-hover bg-accent-light px-4 py-2 rounded-lg transition-colors">
            Full Analytics
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.name} className="p-4 bg-bg-primary rounded-xl border border-border hover:border-accent-light transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-text-primary">{dept.name}</h3>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${dept.color}`} />
              </div>
              <div className="flex gap-4 mb-3">
                <div>
                  <p className="text-lg font-bold text-text-primary">{dept.patients}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Patients</p>
                </div>
                <div className="border-l border-border pl-4">
                  <p className="text-lg font-bold text-text-primary">{dept.beds}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Beds</p>
                </div>
              </div>
              {dept.beds > 0 && (
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${dept.color} transition-all duration-1000`}
                    style={{ width: `${dept.occupancy}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
