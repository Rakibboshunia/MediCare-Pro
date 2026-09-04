'use client';

import { useState } from 'react';
import { SparklesIcon, ArrowRightIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Symptom {
  id: string;
  label: string;
  emoji: string;
}

const SYMPTOMS: Symptom[] = [
  { id: 'chest_pain', label: 'Chest Pain', emoji: '💔' },
  { id: 'shortness_breath', label: 'Shortness of Breath', emoji: '😮‍💨' },
  { id: 'high_fever', label: 'High Fever', emoji: '🌡️' },
  { id: 'headache', label: 'Severe Headache', emoji: '🤕' },
  { id: 'abdominal_pain', label: 'Abdominal Pain', emoji: '🤢' },
  { id: 'dizziness', label: 'Dizziness / Fainting', emoji: '💫' },
  { id: 'cough', label: 'Persistent Cough', emoji: '🤧' },
  { id: 'joint_pain', label: 'Joint / Bone Pain', emoji: '🦴' },
  { id: 'vision', label: 'Vision Problems', emoji: '👁️' },
  { id: 'numbness', label: 'Numbness / Tingling', emoji: '⚡' },
  { id: 'toothache', label: 'Toothache', emoji: '🦷' },
  { id: 'skin_rash', label: 'Skin Rash', emoji: '🔴' },
];

interface Triage {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  departments: string[];
  message: string;
  waitTime: string;
  color: string;
  bg: string;
  emoji: string;
}

function analyze(symptoms: string[]): Triage | null {
  if (symptoms.length === 0) return null;

  const has = (id: string) => symptoms.includes(id);

  if (has('chest_pain') && has('shortness_breath')) {
    return { priority: 'CRITICAL', departments: ['Cardiology', 'Emergency'], message: 'Possible cardiac event. Seek immediate care.', waitTime: 'Immediate', color: 'text-red-500', bg: 'bg-red-500/10', emoji: '🚨' };
  }
  if (has('numbness') && has('headache') && has('dizziness')) {
    return { priority: 'CRITICAL', departments: ['Neurology', 'Emergency'], message: 'Possible neurological emergency (stroke symptoms).', waitTime: 'Immediate', color: 'text-red-500', bg: 'bg-red-500/10', emoji: '🚨' };
  }
  if (has('chest_pain')) {
    return { priority: 'HIGH', departments: ['Cardiology', 'Emergency'], message: 'Chest pain requires urgent evaluation.', waitTime: '< 15 min', color: 'text-orange-500', bg: 'bg-orange-500/10', emoji: '⚠️' };
  }
  if (has('shortness_breath')) {
    return { priority: 'HIGH', departments: ['Pulmonology', 'Emergency'], message: 'Respiratory distress requires urgent evaluation.', waitTime: '< 30 min', color: 'text-orange-500', bg: 'bg-orange-500/10', emoji: '⚠️' };
  }
  if (has('abdominal_pain') && has('high_fever')) {
    return { priority: 'HIGH', departments: ['General Medicine', 'Gastroenterology'], message: 'Possible abdominal infection or appendicitis.', waitTime: '< 30 min', color: 'text-orange-500', bg: 'bg-orange-500/10', emoji: '⚠️' };
  }
  if (has('headache') || has('dizziness')) {
    return { priority: 'MEDIUM', departments: ['Neurology', 'General Medicine'], message: 'Neurological evaluation recommended.', waitTime: '1–2 hours', color: 'text-yellow-500', bg: 'bg-yellow-500/10', emoji: '🔶' };
  }
  if (has('high_fever') || has('cough')) {
    return { priority: 'MEDIUM', departments: ['General Medicine'], message: 'Infection or respiratory illness likely.', waitTime: '1–2 hours', color: 'text-yellow-500', bg: 'bg-yellow-500/10', emoji: '🔶' };
  }
  if (has('joint_pain')) {
    return { priority: 'LOW', departments: ['Orthopedics', 'Rheumatology'], message: 'Musculoskeletal assessment advised.', waitTime: 'Schedule appointment', color: 'text-blue-500', bg: 'bg-blue-500/10', emoji: '💙' };
  }
  if (has('toothache')) {
    return { priority: 'LOW', departments: ['Dental'], message: 'Dental consultation required.', waitTime: 'Schedule appointment', color: 'text-blue-500', bg: 'bg-blue-500/10', emoji: '💙' };
  }
  if (has('skin_rash')) {
    return { priority: 'LOW', departments: ['Dermatology', 'General Medicine'], message: 'Dermatological evaluation recommended.', waitTime: 'Schedule appointment', color: 'text-blue-500', bg: 'bg-blue-500/10', emoji: '💙' };
  }
  if (has('vision')) {
    return { priority: 'HIGH', departments: ['Ophthalmology', 'Neurology'], message: 'Vision changes require prompt evaluation.', waitTime: '< 1 hour', color: 'text-orange-500', bg: 'bg-orange-500/10', emoji: '⚠️' };
  }

  return { priority: 'LOW', departments: ['General Medicine'], message: 'General check-up recommended for your symptoms.', waitTime: 'Schedule appointment', color: 'text-emerald-500', bg: 'bg-emerald-500/10', emoji: '✅' };
}

export default function SymptomChecker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<Triage | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setResult(null);
  };

  const check = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setResult(analyze(selected));
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-accent-primary" /> AI Symptom Checker
          </h1>
          <p className="text-text-muted text-sm mt-1">Select symptoms to receive instant triage assessment & department routing</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="glass-panel p-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Patient Information</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Patient Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none focus:border-accent-primary/50"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={e => setAge(e.target.value)}
            className="w-full sm:w-32 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary text-sm outline-none focus:border-accent-primary/50"
          />
        </div>
      </div>

      {/* Symptom Grid */}
      <div className="glass-panel p-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          Select Symptoms ({selected.length} selected)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SYMPTOMS.map(s => {
            const isSelected = selected.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer text-left group ${isSelected ? 'border-accent-primary bg-accent-light text-accent-primary' : 'border-border bg-bg-primary text-text-primary hover:border-accent-primary/40 hover:bg-accent-light/30'}`}
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">{s.emoji}</span>
                <span className="text-sm font-medium leading-tight">{s.label}</span>
                {isSelected && <CheckCircleIcon className="w-4 h-4 ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={check}
          disabled={selected.length === 0 || loading}
          className="mt-5 w-full py-3 bg-gradient-to-r from-accent-primary to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/30"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Analyzing symptoms...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" /> Analyze & Triage
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`glass-panel p-6 border-2 ${result.priority === 'CRITICAL' ? 'border-red-500/50 animate-pulse' : result.priority === 'HIGH' ? 'border-orange-500/40' : 'border-border'}`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl ${result.bg} text-3xl`}>{result.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className={`text-xl font-black ${result.color}`}>{result.priority} PRIORITY</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.bg} ${result.color}`}>
                  Wait: {result.waitTime}
                </span>
              </div>
              <p className="text-text-secondary text-sm mt-2">{result.message}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Recommended Departments</p>
            <div className="flex flex-wrap gap-2">
              {result.departments.map(d => (
                <button key={d} className="flex items-center gap-2 px-4 py-2 bg-accent-light text-accent-primary rounded-xl text-sm font-semibold hover:bg-accent-primary hover:text-white transition-colors cursor-pointer border-none">
                  {d} <ArrowRightIcon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {result.priority === 'CRITICAL' && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-400 text-sm font-medium">⚠ Emergency! Contact the on-call team immediately at Ext. 911</p>
            </div>
          )}

          <p className="mt-4 text-xs text-text-muted">⚠ This is an AI-assisted triage tool. Final diagnosis must be made by a qualified medical professional.</p>
        </div>
      )}
    </div>
  );
}
