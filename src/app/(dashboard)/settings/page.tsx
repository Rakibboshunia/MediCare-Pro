'use client';

import { useState } from 'react';
import { ChevronDownIcon, BuildingOfficeIcon, Cog6ToothIcon, ShieldCheckIcon, BellAlertIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const [openSection, setOpenSection] = useState('hospital');
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const handleSave = (section: string) => {
    setSavingSection(section);
    setSavedSection(null);

    // Simulate API call
    setTimeout(() => {
      setSavingSection(null);
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 3000);
    }, 1000);
  };

  const inputClass = "w-full px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none transition-all focus:border-accent-light focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)]";
  const labelClass = "block mb-2 text-sm font-medium text-text-secondary";

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Accordion 1: Hospital Information */}
        <div className={`glass-panel overflow-hidden transition-all duration-300 border ${openSection === 'hospital' ? 'border-accent-light shadow-glow' : 'border-border'}`}>
          <button 
            className="w-full flex items-center justify-between p-6 bg-transparent border-none cursor-pointer text-left"
            onClick={() => toggleSection('hospital')}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${openSection === 'hospital' ? 'bg-accent-light text-accent-primary' : 'bg-bg-primary border border-border text-text-muted'}`}>
                <BuildingOfficeIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Hospital Information</h2>
                <p className="text-sm text-text-muted mt-0.5">Manage hospital details, contacts, and emergency info</p>
              </div>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-text-muted transition-transform duration-300 ${openSection === 'hospital' ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 px-6 transition-all duration-500 ease-in-out ${openSection === 'hospital' ? 'pb-6 grid-rows-[1fr] opacity-100' : 'hidden opacity-0 pb-0'}`}>
            <div className="col-span-1 md:col-span-2 pt-4 border-t border-border"></div>
            <div>
              <label className={labelClass}>Hospital Name</label>
              <input type="text" defaultValue="MediCare Pro Hospital" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Email</label>
              <input type="email" defaultValue="admin@medicarepro.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Emergency Phone</label>
              <input type="text" defaultValue="+1 (555) 0198-9999" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Hospital Address</label>
              <input type="text" defaultValue="123 Medical Drive, Health City, NY 10001" className={inputClass} />
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end items-center gap-4 mt-2">
              {savedSection === 'hospital' && <span className="text-success text-sm font-medium animate-fade-in">✓ Changes saved</span>}
              <button 
                onClick={() => handleSave('hospital')}
                disabled={savingSection === 'hospital'}
                className="px-6 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer border-none shadow-sm"
              >
                {savingSection === 'hospital' ? 'Saving...' : 'Save Hospital Info'}
              </button>
            </div>
          </div>
        </div>

        {/* Accordion 2: System Preferences */}
        <div className={`glass-panel overflow-hidden transition-all duration-300 border ${openSection === 'system' ? 'border-accent-light shadow-glow' : 'border-border'}`}>
          <button 
            className="w-full flex items-center justify-between p-6 bg-transparent border-none cursor-pointer text-left"
            onClick={() => toggleSection('system')}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${openSection === 'system' ? 'bg-accent-light text-accent-primary' : 'bg-bg-primary border border-border text-text-muted'}`}>
                <Cog6ToothIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">System Preferences</h2>
                <p className="text-sm text-text-muted mt-0.5">Configure timezones, formats, and defaults</p>
              </div>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-text-muted transition-transform duration-300 ${openSection === 'system' ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 px-6 transition-all duration-500 ease-in-out ${openSection === 'system' ? 'pb-6 grid-rows-[1fr] opacity-100' : 'hidden opacity-0 pb-0'}`}>
            <div className="col-span-1 md:col-span-2 pt-4 border-t border-border"></div>
            <div>
              <label className={labelClass}>Time Zone</label>
              <select className={inputClass} defaultValue="Eastern Time (ET)">
                <option>Eastern Time (ET)</option>
                <option>Pacific Time (PT)</option>
                <option>UTC</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Date Format</label>
              <select className={inputClass} defaultValue="MM/DD/YYYY">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select className={inputClass} defaultValue="USD ($)">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end items-center gap-4 mt-2">
              {savedSection === 'system' && <span className="text-success text-sm font-medium animate-fade-in">✓ Changes saved</span>}
              <button 
                onClick={() => handleSave('system')}
                disabled={savingSection === 'system'}
                className="px-6 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer border-none shadow-sm"
              >
                {savingSection === 'system' ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>

        {/* Accordion 3: Account & Security */}
        <div className={`glass-panel overflow-hidden transition-all duration-300 border ${openSection === 'security' ? 'border-accent-light shadow-glow' : 'border-border'}`}>
          <button 
            className="w-full flex items-center justify-between p-6 bg-transparent border-none cursor-pointer text-left"
            onClick={() => toggleSection('security')}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${openSection === 'security' ? 'bg-accent-light text-accent-primary' : 'bg-bg-primary border border-border text-text-muted'}`}>
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Account & Security</h2>
                <p className="text-sm text-text-muted mt-0.5">Update credentials and security settings</p>
              </div>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-text-muted transition-transform duration-300 ${openSection === 'security' ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 px-6 transition-all duration-500 ease-in-out ${openSection === 'security' ? 'pb-6 grid-rows-[1fr] opacity-100' : 'hidden opacity-0 pb-0'}`}>
            <div className="col-span-1 md:col-span-2 pt-4 border-t border-border"></div>
            <div>
              <label className={labelClass}>Admin Full Name</label>
              <input type="text" defaultValue="Dr. Felix" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Login Email</label>
              <input type="email" defaultValue="admin@medicarepro.com" className={inputClass} disabled />
              <span className="text-xs text-text-muted mt-1 block">Contact support to change login email</span>
            </div>
            <div>
              <label className={labelClass}>Current Password</label>
              <input type="password" placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input type="password" placeholder="••••••••" className={inputClass} />
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end items-center gap-4 mt-2">
              {savedSection === 'security' && <span className="text-success text-sm font-medium animate-fade-in">✓ Changes saved</span>}
              <button 
                onClick={() => handleSave('security')}
                disabled={savingSection === 'security'}
                className="px-6 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer border-none shadow-sm"
              >
                {savingSection === 'security' ? 'Saving...' : 'Save Security Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Accordion 4: Notification Preferences */}
        <div className={`glass-panel overflow-hidden transition-all duration-300 border ${openSection === 'notifications' ? 'border-accent-light shadow-glow' : 'border-border'}`}>
          <button 
            className="w-full flex items-center justify-between p-6 bg-transparent border-none cursor-pointer text-left"
            onClick={() => toggleSection('notifications')}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${openSection === 'notifications' ? 'bg-accent-light text-accent-primary' : 'bg-bg-primary border border-border text-text-muted'}`}>
                <BellAlertIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Notification Preferences</h2>
                <p className="text-sm text-text-muted mt-0.5">Manage email and SMS alert settings</p>
              </div>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-text-muted transition-transform duration-300 ${openSection === 'notifications' ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 px-6 transition-all duration-500 ease-in-out ${openSection === 'notifications' ? 'pb-6 grid-rows-[1fr] opacity-100' : 'hidden opacity-0 pb-0'}`}>
            <div className="col-span-1 md:col-span-2 pt-4 border-t border-border"></div>
            
            <div className="flex items-center justify-between p-4 bg-bg-primary rounded-xl border border-border cursor-pointer transition-colors hover:border-text-muted" onClick={() => setEmailAlerts(!emailAlerts)}>
              <div>
                <h3 className="font-medium text-text-primary text-sm">Email Alerts</h3>
                <p className="text-xs text-text-muted mt-1">Receive daily summary reports</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors ${emailAlerts ? 'bg-accent-primary' : 'bg-bg-secondary border border-border'}`}>
                <div className={`w-4 h-4 rounded-full absolute top-[3px] transition-all shadow-sm ${emailAlerts ? 'bg-white right-1' : 'bg-text-muted left-1'}`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-bg-primary rounded-xl border border-border cursor-pointer transition-colors hover:border-text-muted" onClick={() => setSmsAlerts(!smsAlerts)}>
              <div>
                <h3 className="font-medium text-text-primary text-sm">SMS Notifications</h3>
                <p className="text-xs text-text-muted mt-1">Alerts for emergency appointments</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors ${smsAlerts ? 'bg-accent-primary' : 'bg-bg-secondary border border-border'}`}>
                <div className={`w-4 h-4 rounded-full absolute top-[3px] transition-all shadow-sm ${smsAlerts ? 'bg-white right-1' : 'bg-text-muted left-1'}`}></div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end items-center gap-4 mt-2">
              {savedSection === 'notifications' && <span className="text-success text-sm font-medium animate-fade-in">✓ Changes saved</span>}
              <button 
                onClick={() => handleSave('notifications')}
                disabled={savingSection === 'notifications'}
                className="px-6 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer border-none shadow-sm"
              >
                {savingSection === 'notifications' ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
