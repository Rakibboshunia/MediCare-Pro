'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'bn';

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  patients: { en: 'Patients', bn: 'রোগী' },
  appointments: { en: 'Appointments', bn: 'অ্যাপয়েন্টমেন্ট' },
  doctors: { en: 'Doctors & Staff', bn: 'ডাক্তার ও স্টাফ' },
  billing: { en: 'Billing & Invoices', bn: 'বিলিং ও ইনভয়েস' },
  prescriptions: { en: 'Prescriptions', bn: 'প্রেসক্রিপশন' },
  laboratory: { en: 'Laboratory', bn: 'ল্যাবরেটরি' },
  emergency: { en: 'Emergency', bn: 'জরুরি বিভাগ' },
  telemedicine: { en: 'Telemedicine', bn: 'টেলিমেডিসিন' },
  bloodBank: { en: 'Blood Bank', bn: 'ব্লাড ব্যাংক' },
  analytics: { en: 'Analytics', bn: 'বিশ্লেষণ' },
  aiAssistant: { en: 'AI Assistant', bn: 'AI সহকারী' },
  bedManagement: { en: 'Bed Management', bn: 'বেড ব্যবস্থাপনা' },
  pharmacy: { en: 'Pharmacy', bn: 'ফার্মেসি' },
  insurance: { en: 'Insurance Claims', bn: 'বীমা দাবি' },
  otManagement: { en: 'OT Management', bn: 'ওটি ব্যবস্থাপনা' },
  search: { en: 'Search...', bn: 'খুঁজুন...' },
  addNew: { en: '+ Add New', bn: '+ নতুন যোগ করুন' },
  save: { en: 'Save', bn: 'সংরক্ষণ' },
  cancel: { en: 'Cancel', bn: 'বাতিল' },
  delete: { en: 'Delete', bn: 'মুছুন' },
  edit: { en: 'Edit', bn: 'সম্পাদনা' },
  status: { en: 'Status', bn: 'অবস্থা' },
  name: { en: 'Name', bn: 'নাম' },
  date: { en: 'Date', bn: 'তারিখ' },
  active: { en: 'Active', bn: 'সক্রিয়' },
  inactive: { en: 'Inactive', bn: 'নিষ্ক্রিয়' },
  settings: { en: 'Settings', bn: 'সেটিংস' },
  logout: { en: 'Logout', bn: 'লগ আউট' },
  totalPatients: { en: 'Total Patients', bn: 'মোট রোগী' },
  todayAppointments: { en: "Today's Appointments", bn: 'আজকের অ্যাপয়েন্টমেন্ট' },
  availableDoctors: { en: 'Available Doctors', bn: 'উপলব্ধ ডাক্তার' },
  monthlyRevenue: { en: 'Monthly Revenue', bn: 'মাসিক আয়' },
};

const LangContext = createContext<LangContextType>({
  lang: 'en',
  toggle: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggle = () => setLang(l => l === 'en' ? 'bn' : 'en');
  const t = (key: string) => translations[key]?.[lang] ?? key;

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function LangToggleButton() {
  const { lang, toggle } = useLang();

  return (
    <button
      onClick={toggle}
      title="Toggle Language"
      className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-xl text-text-secondary text-sm font-semibold hover:border-accent-primary/40 hover:text-text-primary transition-all cursor-pointer group"
    >
      <span className="text-base group-hover:scale-125 transition-transform">
        {lang === 'en' ? '🇧🇩' : '🇬🇧'}
      </span>
      <span className="font-mono text-xs font-bold">
        {lang === 'en' ? 'বাং' : 'EN'}
      </span>
    </button>
  );
}
