'use client';

import React, { useState } from 'react';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneXMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  CalendarIcon,
  UserCircleIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { VideoCameraIcon as VideoCameraSolidIcon } from '@heroicons/react/24/solid';
import Modal, { formStyles } from '@/components/Modal';
import toast from 'react-hot-toast';

type ConsultStatus = 'Next' | 'Waiting' | 'Completed';

type Consultation = {
  id: number;
  patient: string;
  time: string;
  type: string;
  status: ConsultStatus;
};

const initialQueue: Consultation[] = [
  { id: 1, patient: 'Abdur Rahman', time: '10:00 AM - 10:30 AM', type: 'Follow Up', status: 'Next' },
  { id: 2, patient: 'Sultana Razia', time: '11:00 AM - 11:30 AM', type: 'Initial Consult', status: 'Waiting' },
  { id: 3, patient: 'Jamal Bhuiyan', time: '12:00 PM - 12:30 PM', type: 'Report Review', status: 'Waiting' },
];

const TYPES = ['Follow Up', 'Initial Consult', 'Report Review', 'Prescription Renewal', 'Mental Health', 'Specialist Referral'];

export default function Telemedicine() {
  const [queue, setQueue] = useState<Consultation[]>(initialQueue);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeSession, setActiveSession] = useState<Consultation | null>(null);
  const [callTimer, setCallTimer] = useState<string>('00:00:00');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const startCall = (consult: Consultation) => {
    setActiveSession(consult);
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      setCallTimer(`${h}:${m}:${s}`);
    }, 1000);
    setTimerInterval(interval);
    toast.success(`Call started with ${consult.patient}`);
  };

  const endCall = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimerInterval(null);
    if (activeSession) {
      setQueue(q => q.map(c => c.id === activeSession.id ? { ...c, status: 'Completed' } : c));
      toast.success(`Call with ${activeSession.patient} ended.`);
    }
    setActiveSession(null);
    setCallTimer('00:00:00');
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newConsult: Consultation = {
      id: Date.now(),
      patient: fd.get('patient') as string,
      time: fd.get('time') as string,
      type: fd.get('type') as string,
      status: 'Waiting',
    };
    setQueue([...queue, newConsult]);
    toast.success('Patient added to queue!');
    setIsAddOpen(false);
  };

  const handleRemove = (id: number) => {
    if (activeSession?.id === id) {
      toast.error('Cannot remove an active session.');
      return;
    }
    setQueue(queue.filter(c => c.id !== id));
    toast.success('Patient removed from queue.');
  };

  const waitingCount = queue.filter(c => c.status === 'Waiting' || c.status === 'Next').length;
  const completedCount = queue.filter(c => c.status === 'Completed').length;

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-9rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Telemedicine</h1>
          <p className="text-text-secondary text-sm mt-1">{waitingCount} patients waiting · {completedCount} completed today</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </div>
          <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-accent-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
            <PlusIcon className="w-4 h-4" /> Add Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Video Call Area */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          <div className="flex-1 bg-black rounded-2xl overflow-hidden relative shadow-xl border border-border group min-h-[300px]">
            {/* Main Stream */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
              {activeSession ? (
                <>
                  <div className="w-28 h-28 rounded-full bg-accent-primary/20 border-2 border-accent-primary/40 flex items-center justify-center mb-4">
                    <UserCircleIcon className="w-20 h-20 text-accent-primary/60" />
                  </div>
                  <p className="text-white text-xl font-bold">{activeSession.patient}</p>
                  <p className="text-gray-400 text-sm mt-1">{activeSession.type}</p>
                </>
              ) : (
                <>
                  <UserCircleIcon className="w-32 h-32 text-gray-700 mb-4" />
                  <p className="text-gray-400 text-lg font-medium">Select a patient to start a call</p>
                  <p className="text-gray-600 text-sm mt-2">Click <strong>"Join Now"</strong> from the queue on the right</p>
                </>
              )}
            </div>

            {/* Self View PIP */}
            <div className="absolute bottom-20 right-4 w-40 h-28 bg-gray-800 rounded-xl border-2 border-gray-600/50 overflow-hidden shadow-2xl hover:scale-105 transition-transform cursor-pointer">
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                {isVideoOn ? <UserCircleIcon className="w-12 h-12 text-gray-500" /> : <span className="text-gray-500 text-xs font-medium">Camera Off</span>}
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-700 shadow-2xl">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-xl text-white transition-colors border ${isMicOn ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-red-500/30 border-red-500/50'}`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-xl text-white transition-colors border ${isVideoOn ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-red-500/30 border-red-500/50'}`}
                title={isVideoOn ? 'Stop Video' : 'Start Video'}
              >
                <VideoCameraIcon className="w-5 h-5" />
              </button>
              <button
                onClick={endCall}
                disabled={!activeSession}
                className="p-3 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white transition-colors shadow-lg shadow-red-500/30 border border-red-400"
                title="End Call"
              >
                <PhoneXMarkIcon className="w-5 h-5" />
              </button>
              <div className="w-px h-8 bg-gray-700" />
              <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition-colors border border-gray-700">
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 border border-gray-700">
              <VideoCameraSolidIcon className={`w-4 h-4 ${activeSession ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
              {callTimer}
            </div>
          </div>
        </div>

        {/* Patient Queue */}
        <div className="glass-panel flex flex-col gap-0 overflow-hidden min-h-[300px]">
          <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
            <h2 className="text-lg font-bold text-text-primary">Patient Queue</h2>
            <span className="bg-accent-primary/10 text-accent-primary px-3 py-1 rounded-full text-xs font-bold border border-accent-primary/20">
              {waitingCount} Waiting
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
            {queue.length > 0 ? queue.map(c => (
              <div
                key={c.id}
                className={`p-4 rounded-xl border transition-all group ${
                  c.status === 'Next' || (activeSession?.id === c.id)
                    ? 'bg-accent-primary/5 border-accent-primary/30'
                    : c.status === 'Completed'
                    ? 'bg-bg-primary/30 border-border opacity-60'
                    : 'bg-bg-primary/50 border-border hover:border-text-muted'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-bold text-sm ${c.status === 'Completed' ? 'text-text-muted line-through' : 'text-text-primary'}`}>{c.patient}</h3>
                    <p className="text-xs text-text-secondary mt-0.5">{c.type}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {c.status !== 'Completed' && !activeSession && (
                      <button
                        onClick={() => startCall(c)}
                        className="text-xs font-bold text-white bg-accent-primary px-2.5 py-1.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                      >
                        <VideoCameraSolidIcon className="w-3 h-3" />
                        {c.status === 'Next' ? 'Join' : 'Start'}
                      </button>
                    )}
                    {c.status === 'Completed' && (
                      <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">Done</span>
                    )}
                    <button onClick={() => handleRemove(c.id)} className="p-1 text-text-muted hover:text-red-500 transition-colors ml-1">
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-muted bg-bg-secondary px-2.5 py-1.5 rounded-lg border border-border">
                  <CalendarIcon className="w-3.5 h-3.5 text-accent-primary" />
                  {c.time}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-text-muted py-8">
                <UserCircleIcon className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm">No patients in queue</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Patient to Queue">
        <form onSubmit={handleAdd}>
          <div className={formStyles.formGroup}>
            <label>Patient Name</label>
            <input type="text" name="patient" required placeholder="e.g. Rahim Uddin" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Consultation Type</label>
            <select name="type" required>
              <option value="">Select Type</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Scheduled Time</label>
            <input type="text" name="time" required placeholder="e.g. 02:00 PM - 02:30 PM" />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Add to Queue</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
