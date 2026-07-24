'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  CreditCardIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const modules = [
  {
    id: 'overview',
    name: 'Overview',
    icon: HomeIcon,
    subItems: [
      { name: 'Dashboard', href: '/' },
      { name: 'Analytics', href: '/analytics' },
    ]
  },
  {
    id: 'clinical',
    name: 'Clinical Hub',
    icon: UsersIcon,
    subItems: [
      { name: 'Patients', href: '/patients' },
      { name: 'Doctors', href: '/doctors' },
      { name: 'Appointments', href: '/appointments' },
    ]
  },
  {
    id: 'medical',
    name: 'Medical Records',
    icon: DocumentTextIcon,
    subItems: [
      { name: 'Prescriptions', href: '/prescriptions' },
      { name: 'Laboratory', href: '/laboratory' },
      { name: 'Pharmacy', href: '/pharmacy' },
    ]
  },
  {
    id: 'finance',
    name: 'Finance Hub',
    icon: CreditCardIcon,
    subItems: [
      { name: 'Billing', href: '/billing' },
      { name: 'Invoices', href: '/invoices' },
      { name: 'Payouts', href: '/payouts' },
    ]
  },
  {
    id: 'tools',
    name: 'Tools & Settings',
    icon: Cog6ToothIcon,
    subItems: [
      { name: 'AI Assistant', href: '/ai-assistant' },
      { name: 'Settings', href: '/settings' },
    ]
  }
];

import { useMobileNav } from '@/components/MobileNavProvider';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileNav();

  // Find initial module based on pathname
  const initialModule = modules.find(m => m.subItems.some(sub => pathname === sub.href)) || modules[0];
  const [activeModule, setActiveModule] = useState(initialModule);

  // Update active module if pathname changes and it's in a different module
  useEffect(() => {
    const currentModule = modules.find(m => m.subItems.some(sub => pathname === sub.href));
    if (currentModule && currentModule.id !== activeModule.id) {
      setActiveModule(currentModule);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 
        w-[320px] shrink-0 flex flex-row bg-bg-secondary border-r border-border h-full
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Primary Sidebar (Modules) */}
        <div className="w-[80px] flex flex-col items-center py-4 shrink-0 border-r border-border z-10 relative">
          {/* Logo Icon */}
          <div className="mb-6">
            <div className="w-10 h-10 bg-accent-primary text-white flex items-center justify-center rounded-xl font-bold text-xl shadow-lg shadow-accent-primary/20">
              M
            </div>
          </div>

          {/* Module Icons */}
          <div className="flex-1 w-full flex flex-col gap-2 px-3 overflow-y-auto no-scrollbar">
            {modules.map(module => {
              const isActive = activeModule.id === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module)}
                  title={module.name}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group ${isActive ? "bg-accent-primary text-white shadow-md shadow-accent-primary/20" : "text-text-muted hover:bg-bg-primary hover:text-text-primary"
                    }`}
                >
                  {isActive && (
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-primary rounded-r-full" />
                  )}
                  <module.icon className="w-6 h-6" />
                </button>
              )
            })}
          </div>

          {/* User Footer */}
          <div className="mt-auto pt-4 border-t border-border w-full flex justify-center">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4"
              alt="Profile"
              className="w-10 h-10 rounded-xl object-cover border-2 border-bg-primary shrink-0 bg-white"
            />
          </div>
        </div>

        {/* Secondary Sidebar (Sub-modules) */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border h-[88px] shrink-0">
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">MediCare Pro</span>
              <h2 className="font-bold text-lg text-text-primary leading-tight mt-0.5">{activeModule.name}</h2>
            </div>
            <button
              className="md:hidden p-2 text-text-muted hover:text-text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
            {activeModule.subItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${isActive
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

      </aside>
    </>
  );
}
