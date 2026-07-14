'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Doctors', href: '/doctors', icon: UserCircleIcon },
  { name: 'Patients', href: '/patients', icon: UsersIcon },
  { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
  { name: 'Prescriptions', href: '/prescriptions', icon: DocumentTextIcon },
  { name: 'Laboratory', href: '/laboratory', icon: ClipboardDocumentCheckIcon },
  { name: 'Pharmacy', href: '/pharmacy', icon: BeakerIcon },
  { name: 'Billing', href: '/billing', icon: CreditCardIcon },
  { name: 'AI Assistant', href: '/ai-assistant', icon: SparklesIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

import { useMobileNav } from '@/components/MobileNavProvider';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileNav();

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
        w-64 shrink-0 flex flex-col bg-bg-secondary border-r border-border h-screen
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MediCare Pro Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm bg-white" />
            <span className="font-bold text-lg text-text-primary">MediCare Pro</span>
          </div>
          
          <button 
            className="md:hidden p-2 text-text-muted hover:text-text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-accent-primary text-white shadow-lg'
                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="flex items-center gap-3 px-4 py-4 border-t border-border mt-auto">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4"
            alt="Profile"
            className="w-10 h-10 rounded-xl object-cover border-2 border-border shrink-0 bg-white"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm text-text-primary truncate">Dr. Admin</span>
            <span className="text-xs text-text-muted truncate">Administrator</span>
          </div>
        </div>
      </aside>
    </>
  );
}
