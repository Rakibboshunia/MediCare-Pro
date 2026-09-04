'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon, HomeIcon, UserGroupIcon, CalendarIcon,
  CurrencyDollarIcon, DocumentTextIcon, BeakerIcon, HeartIcon,
  ComputerDesktopIcon, ClockIcon, PlusIcon, ArrowRightIcon,
  CommandLineIcon, Bars3Icon, BoltIcon,
} from '@heroicons/react/24/outline';

const PAGES = [
  { label: 'Dashboard', href: '/', icon: HomeIcon, category: 'Pages' },
  { label: 'Patients', href: '/patients', icon: UserGroupIcon, category: 'Pages' },
  { label: 'Appointments', href: '/appointments', icon: CalendarIcon, category: 'Pages' },
  { label: 'Doctors & Staff', href: '/doctors', icon: UserGroupIcon, category: 'Pages' },
  { label: 'Billing & Invoices', href: '/billing', icon: CurrencyDollarIcon, category: 'Pages' },
  { label: 'Prescriptions', href: '/prescriptions', icon: DocumentTextIcon, category: 'Pages' },
  { label: 'Laboratory', href: '/laboratory', icon: BeakerIcon, category: 'Pages' },
  { label: 'Emergency', href: '/emergency', icon: BoltIcon, category: 'Pages' },
  { label: 'Telemedicine', href: '/telemedicine', icon: ComputerDesktopIcon, category: 'Pages' },
  { label: 'Blood Bank', href: '/blood-bank', icon: HeartIcon, category: 'Pages' },
  { label: 'Analytics', href: '/analytics', icon: Bars3Icon, category: 'Pages' },
  { label: 'AI Assistant', href: '/ai-assistant', icon: CommandLineIcon, category: 'Pages' },
  { label: 'Bed Management', href: '/bed-management', icon: Bars3Icon, category: 'Pages' },
  { label: 'Pharmacy', href: '/pharmacy', icon: BeakerIcon, category: 'Pages' },
  { label: 'Insurance Claims', href: '/insurance-claims', icon: DocumentTextIcon, category: 'Pages' },
  { label: 'OT Management', href: '/ot-management', icon: ClockIcon, category: 'Pages' },
];

const ACTIONS = [
  { label: 'Add New Patient', href: '/patients', icon: PlusIcon, category: 'Actions' },
  { label: 'Schedule Appointment', href: '/appointments', icon: PlusIcon, category: 'Actions' },
  { label: 'Create Invoice', href: '/billing', icon: PlusIcon, category: 'Actions' },
  { label: 'Write Prescription', href: '/prescriptions', icon: PlusIcon, category: 'Actions' },
  { label: 'Add Doctor', href: '/doctors', icon: PlusIcon, category: 'Actions' },
];

const ALL_ITEMS = [...PAGES, ...ACTIONS];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? ALL_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : ALL_ITEMS.slice(0, 8);

  const navigate = useCallback((href: string) => {
    router.push(href);
    setOpen(false);
    setQuery('');
    setSelected(0);
  }, [router]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      navigate(filtered[selected].href);
    }
  };

  if (!open) return null;

  const grouped: Record<string, typeof ALL_ITEMS> = {};
  filtered.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  let globalIdx = 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl mx-4 bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <MagnifyingGlassIcon className="w-5 h-5 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, patients, actions..."
            className="flex-1 bg-transparent text-text-primary text-base outline-none placeholder:text-text-muted"
          />
          <kbd className="px-2 py-1 rounded-md bg-bg-primary text-text-muted text-xs font-mono border border-border">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-text-muted">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">{category}</p>
                {items.map(item => {
                  const idx = globalIdx++;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href + item.label}
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => setSelected(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer border-none text-left ${selected === idx ? 'bg-accent-primary text-white' : 'text-text-primary hover:bg-bg-primary'}`}
                    >
                      <div className={`p-1.5 rounded-lg ${selected === idx ? 'bg-white/20' : 'bg-bg-primary'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      <ArrowRightIcon className={`w-4 h-4 opacity-0 group-hover:opacity-100 ${selected === idx ? 'opacity-100' : ''}`} />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-border bg-bg-primary">
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border font-mono">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border font-mono">↵</kbd> Open
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border font-mono">Ctrl K</kbd> Toggle
          </span>
        </div>
      </div>
    </div>
  );
}

// Floating trigger button for mobile
export function CommandPaletteTrigger() {
  const [, setOpen] = useState(false);

  const trigger = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  return (
    <button
      onClick={trigger}
      title="Command Palette (Ctrl+K)"
      className="hidden md:flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-xl text-text-muted text-sm hover:border-accent-primary/40 hover:text-text-primary transition-all cursor-pointer"
    >
      <MagnifyingGlassIcon className="w-4 h-4" />
      <span>Search...</span>
      <kbd className="px-1.5 py-0.5 rounded bg-bg-primary border border-border text-xs font-mono">⌘K</kbd>
    </button>
  );
}
