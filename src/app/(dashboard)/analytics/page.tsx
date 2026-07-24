'use client';

import { useState } from 'react';
import { 
  ChartBarIcon, ArrowTrendingUpIcon, UsersIcon, ArrowDownTrayIcon, 
  CurrencyDollarIcon, HeartIcon, CalendarIcon, ClockIcon,
  ArrowTrendingDownIcon, UserGroupIcon
} from '@heroicons/react/24/outline';

// Mini Bar Chart Component
function BarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end justify-between gap-2 h-[180px] pt-4">
      {data.map((value, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <span className="text-[10px] font-semibold text-text-muted">{value}</span>
          <div className="w-full flex justify-center">
            <div
              className={`w-full max-w-[36px] rounded-t-lg bg-gradient-to-t ${color} transition-all duration-700 hover:opacity-80`}
              style={{ height: `${(value / max) * 140}px` }}
            />
          </div>
          <span className="text-[10px] text-text-muted font-medium">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// Donut Chart Component
function DonutChart({ segments, size = 140 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  let cumulativePercent = 0;
  const radius = 15.9;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
        {segments.map((seg, i) => {
          const percent = (seg.value / total) * 100;
          const offset = (cumulativePercent / 100) * circumference;
          const dashLength = (percent / 100) * circumference;
          cumulativePercent += percent;
          return (
            <circle
              key={i}
              cx="18" cy="18" r={radius}
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-offset}
              className={seg.color}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-text-primary">{total}</span>
        <span className="text-[10px] text-text-muted">Total</span>
      </div>
    </div>
  );
}

// Line Chart Component  
function LineChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 160;
  const width = 100;
  
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 20) - 10,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-[180px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="0" y1={10 + i * ((height - 20) / 3)} x2={width} y2={10 + i * ((height - 20) / 3)} stroke="currentColor" strokeWidth="0.3" className="text-border" />
        ))}
        <path d={areaD} fill={`url(#grad-${color})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} stroke="white" strokeWidth="1" />
        ))}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        {labels.map((l, i) => (
          <span key={i} className="text-[10px] text-text-muted">{l}</span>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [isExporting, setIsExporting] = useState(false);
  const [period, setPeriod] = useState('This Week');

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Analytics report exported successfully!');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Analytics & Reports</h1>
          <p className="text-sm text-text-muted mt-1">Comprehensive hospital performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2.5 bg-bg-secondary text-text-primary border border-border rounded-xl text-sm font-medium outline-none cursor-pointer"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button
            className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none text-sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: '৳12,45,000', trend: '+15.3%', up: true, icon: CurrencyDollarIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'vs last month' },
          { title: 'Patient Admissions', value: '1,248', trend: '+12.5%', up: true, icon: UsersIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10', desc: 'total this month' },
          { title: 'Surgeries Performed', value: '156', trend: '+8.2%', up: true, icon: HeartIcon, color: 'text-rose-500', bg: 'bg-rose-500/10', desc: 'successful rate: 98.7%' },
          { title: 'Avg Wait Time', value: '18 min', trend: '-12.4%', up: true, icon: ClockIcon, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'improved from 21 min' },
        ].map((kpi, i) => (
          <div key={i} className="glass-panel p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${kpi.up ? 'text-success bg-success-light' : 'text-danger bg-danger-light'}`}>
                {kpi.up ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
                {kpi.trend}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary">{kpi.value}</h3>
              <p className="text-[11px] text-text-muted mt-0.5">{kpi.title} • {kpi.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Admissions Chart */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-semibold text-text-primary">Patient Admissions</h3>
            </div>
            <span className="flex items-center gap-1 text-success font-semibold text-xs bg-success-light px-2 py-1 rounded-md">
              +12.5% <ArrowTrendingUpIcon className="w-3 h-3" />
            </span>
          </div>
          <BarChart 
            data={[145, 198, 176, 210, 185, 232, 178]} 
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} 
            color="from-indigo-500 to-violet-500" 
          />
        </div>

        {/* Revenue Trend */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-semibold text-text-primary">Revenue Trend</h3>
            </div>
            <span className="flex items-center gap-1 text-success font-semibold text-xs bg-success-light px-2 py-1 rounded-md">
              +15.3% <ArrowTrendingUpIcon className="w-3 h-3" />
            </span>
          </div>
          <LineChart 
            data={[42, 58, 45, 72, 68, 85, 78, 92, 88, 105, 95, 118]} 
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            color="#10b981"
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Distribution */}
        <div className="glass-panel p-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-text-primary">Patient Distribution</h3>
          </div>
          <DonutChart 
            segments={[
              { value: 340, color: 'text-indigo-500', label: 'Outpatient' },
              { value: 280, color: 'text-emerald-500', label: 'Inpatient' },
              { value: 156, color: 'text-amber-500', label: 'Emergency' },
              { value: 92, color: 'text-rose-500', label: 'ICU' },
            ]}
            size={160}
          />
          <div className="grid grid-cols-2 gap-3 mt-6 w-full">
            {[
              { label: 'Outpatient', value: 340, color: 'bg-indigo-500' },
              { label: 'Inpatient', value: 280, color: 'bg-emerald-500' },
              { label: 'Emergency', value: 156, color: 'bg-amber-500' },
              { label: 'ICU', value: 92, color: 'bg-rose-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-text-muted">{item.label}</span>
                <span className="text-xs font-bold text-text-primary ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Revenue */}
        <div className="glass-panel p-6 col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-text-primary">Revenue by Department</h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { dept: 'Cardiology', revenue: '৳3,45,000', percent: 92, color: 'from-rose-500 to-pink-500' },
              { dept: 'General Medicine', revenue: '৳2,85,000', percent: 76, color: 'from-indigo-500 to-violet-500' },
              { dept: 'Orthopedics', revenue: '৳2,10,000', percent: 56, color: 'from-cyan-500 to-blue-500' },
              { dept: 'Neurology', revenue: '৳1,80,000', percent: 48, color: 'from-violet-500 to-purple-500' },
              { dept: 'Pediatrics', revenue: '৳1,42,000', percent: 38, color: 'from-amber-500 to-orange-500' },
              { dept: 'Dental', revenue: '৳83,000', percent: 22, color: 'from-emerald-500 to-green-500' },
            ].map((item) => (
              <div key={item.dept} className="flex items-center gap-4">
                <span className="text-sm font-medium text-text-secondary w-32 shrink-0">{item.dept}</span>
                <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`} style={{ width: `${item.percent}%` }} />
                </div>
                <span className="text-sm font-bold text-text-primary w-24 text-right shrink-0">{item.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Time */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-cyan-500" />
              <h3 className="text-base font-semibold text-text-primary">Appointment Distribution</h3>
            </div>
          </div>
          <BarChart 
            data={[12, 28, 35, 42, 30, 18, 8, 4]} 
            labels={['8AM', '9AM', '10AM', '11AM', '12PM', '2PM', '4PM', '6PM']} 
            color="from-cyan-500 to-blue-500" 
          />
        </div>

        {/* Staff Overview */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-5 h-5 text-violet-500" />
              <h3 className="text-base font-semibold text-text-primary">Staff Overview</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { role: 'Doctors', count: 48, available: 36, color: 'bg-indigo-500' },
              { role: 'Nurses', count: 124, available: 98, color: 'bg-emerald-500' },
              { role: 'Lab Technicians', count: 22, available: 18, color: 'bg-amber-500' },
              { role: 'Admin Staff', count: 35, available: 32, color: 'bg-violet-500' },
            ].map((staff) => (
              <div key={staff.role} className="p-4 bg-bg-primary rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${staff.color}`} />
                  <span className="text-xs font-medium text-text-muted">{staff.role}</span>
                </div>
                <p className="text-xl font-bold text-text-primary">{staff.count}</p>
                <p className="text-[10px] text-text-muted mt-1">
                  <span className="text-success font-semibold">{staff.available}</span> on duty
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
