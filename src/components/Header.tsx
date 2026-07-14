'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useMobileNav } from '@/components/MobileNavProvider';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { toggleMobileMenu } = useMobileNav();
  const [mounted, setMounted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-bg-secondary border-b border-border sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          className="md:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-primary transition-colors"
          onClick={toggleMobileMenu}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Search Bar - Hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-3 flex-1 px-4 py-2.5 bg-bg-primary border border-border rounded-xl">
          <MagnifyingGlassIcon className="w-5 h-5 text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search patients, appointments, doctors..."
            className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm placeholder:text-text-muted w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        {mounted && (
          <button
            className="w-10 h-10 flex items-center justify-center bg-transparent border border-border rounded-xl text-text-muted transition-all hover:bg-bg-primary hover:text-text-primary cursor-pointer"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        )}

        {/* Chat Button */}
        <div className="relative">
          <button
            className="relative w-10 h-10 flex items-center justify-center bg-transparent border border-border rounded-xl text-text-muted transition-all hover:bg-bg-primary hover:text-text-primary cursor-pointer"
            onClick={() => { setShowChat(!showChat); setShowNotifications(false); }}
          >
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>

          {showChat && (
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-80 bg-bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
              <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-text-primary">Messages</h3>
                <span className="text-xs text-accent-primary cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="flex flex-col">
                {[
                   { avatar: 'K', title: 'Dr. Karim Hossain', desc: "Please review patient PT-002's Lipid Profile report.", time: '5m ago' },
                   { avatar: 'R', title: 'Dr. Rashida Khanam', desc: 'Patient Fatema Akter needs follow-up appointment.', time: '1h ago' },
                   { avatar: 'A', title: 'Admin Office', desc: 'Staff meeting scheduled at 3 PM today.', time: '2h ago' },
                 ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 px-4 py-3 border-b border-border transition-colors hover:bg-bg-primary cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {item.avatar}
                    </div>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <p className="font-semibold text-sm text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-muted truncate">{item.desc}</p>
                      <span className="text-xs text-text-muted opacity-60">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center py-3 text-sm text-accent-primary cursor-pointer hover:bg-bg-primary transition-colors">
                View all messages
              </div>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            className="relative w-10 h-10 flex items-center justify-center bg-transparent border border-border rounded-xl text-text-muted transition-all hover:bg-bg-primary hover:text-text-primary cursor-pointer"
            onClick={() => { setShowNotifications(!showNotifications); setShowChat(false); }}
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">12</span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-80 bg-bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
              <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-text-primary">Notifications</h3>
                <span className="text-xs text-accent-primary cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="flex flex-col">
                {[
                   { bgClass: 'bg-success-light', colorClass: 'text-success', title: 'New Appointment Booked', desc: 'Mizanur Rahman scheduled for Pediatrics tomorrow.', time: '10m ago' },
                   { bgClass: 'bg-warning-light', colorClass: 'text-warning', title: 'Low Stock Alert', desc: 'Amoxil 250mg stock is critically low (38 units).', time: '30m ago' },
                   { bgClass: 'bg-accent-light', colorClass: 'text-accent-primary', title: 'Lab Result Ready', desc: 'CBC report for Fatema Akter is ready for review.', time: '1h ago' },
                 ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 px-4 py-3 border-b border-border transition-colors hover:bg-bg-primary cursor-pointer">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.bgClass} ${item.colorClass}`}>
                      <BellIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold text-sm text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                      <span className="text-xs text-text-muted opacity-60">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center py-3 text-sm text-accent-primary cursor-pointer hover:bg-bg-primary transition-colors">
                View all notifications
              </div>
            </div>
          )}
        </div>

        {/* Sign Out */}
        <button
          className="w-10 h-10 flex items-center justify-center bg-transparent border border-border rounded-xl text-text-muted transition-all hover:bg-danger-light hover:text-danger hover:border-danger cursor-pointer"
          title="Sign Out"
          onClick={() => window.location.href = '/login'}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
