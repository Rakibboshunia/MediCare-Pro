'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, TruckIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

type Ambulance = {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  type: 'Basic Life Support' | 'Advanced Life Support' | 'Patient Transport';
  status: 'Available' | 'On Trip' | 'Maintenance';
  currentLocation?: string;
};

const initialAmbulances: Ambulance[] = [
  { id: 'AMB-001', vehicleNo: 'DHA-11-2233', driverName: 'Abdul Malek', driverPhone: '+880 1711-123456', type: 'Advanced Life Support', status: 'Available', currentLocation: 'Hospital Parking' },
  { id: 'AMB-002', vehicleNo: 'DHA-11-4455', driverName: 'Kalam Mia', driverPhone: '+880 1812-987654', type: 'Basic Life Support', status: 'On Trip', currentLocation: 'Gulshan 2, Road 14' },
  { id: 'AMB-003', vehicleNo: 'DHA-11-6677', driverName: 'Ripon Ali', driverPhone: '+880 1913-456789', type: 'Patient Transport', status: 'Available', currentLocation: 'Hospital Parking' },
  { id: 'AMB-004', vehicleNo: 'DHA-12-1122', driverName: 'Monir Hossain', driverPhone: '+880 1614-567123', type: 'Advanced Life Support', status: 'Maintenance', currentLocation: 'Garage' },
  { id: 'AMB-005', vehicleNo: 'DHA-12-3344', driverName: 'Jamal Uddin', driverPhone: '+880 1715-678234', type: 'Basic Life Support', status: 'On Trip', currentLocation: 'Dhanmondi 27' },
];

export default function Ambulance() {
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredAmbulances = ambulances.filter(amb => {
    const matchSearch = amb.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        amb.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'All' || amb.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const available = ambulances.filter(a => a.status === 'Available').length;
  const onTrip = ambulances.filter(a => a.status === 'On Trip').length;
  const maintenance = ambulances.filter(a => a.status === 'Maintenance').length;

  const handleAddAmbulance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAmb: Ambulance = {
      id: `AMB-${String(ambulances.length + 1).padStart(3, '0')}`,
      vehicleNo: formData.get('vehicleNo') as string,
      driverName: formData.get('driverName') as string,
      driverPhone: formData.get('driverPhone') as string,
      type: formData.get('type') as Ambulance['type'],
      status: 'Available',
      currentLocation: 'Hospital Parking',
    };
    setAmbulances([newAmb, ...ambulances]);
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string, newStatus: Ambulance['status']) => {
    setAmbulances(ambulances.map(a => a.id === id ? { 
      ...a, 
      status: newStatus,
      currentLocation: newStatus === 'Available' ? 'Hospital Parking' : newStatus === 'Maintenance' ? 'Garage' : 'On Route' 
    } : a));
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-2xl border border-indigo-500/20 shadow-sm">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Ambulance Fleet</h1>
          <p className="text-sm text-text-muted mt-2 font-medium">Manage hospital vehicles, live tracking, and driver assignments</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30 cursor-pointer flex items-center gap-2 text-sm border-none">
          <PlusIcon className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-colors"></div>
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">{ambulances.length}</span>
          <span className="text-sm text-text-secondary font-semibold uppercase tracking-wider">Total Fleet</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">{available}</span>
          <span className="text-sm text-text-secondary font-semibold uppercase tracking-wider">Available Now</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors"></div>
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">{onTrip}</span>
          <span className="text-sm text-text-secondary font-semibold uppercase tracking-wider">On Trip</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-colors"></div>
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-rose-600">{maintenance}</span>
          <span className="text-sm text-text-secondary font-semibold uppercase tracking-wider">Maintenance</span>
        </div>
      </div>

      <div className="glass-panel p-8 flex flex-col gap-8 min-h-[400px] border-t-4 border-t-indigo-500">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-bg-primary/50 backdrop-blur-md border border-border focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-xl text-text-muted flex-1 min-w-[200px] transition-all shadow-sm">
            <MagnifyingGlassIcon className="w-5 h-5 text-indigo-500" />
            <input 
              type="text" 
              placeholder="Search by vehicle no or driver..." 
              className="flex-1 bg-transparent border-none text-text-primary outline-none placeholder:text-text-muted/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-5 py-3.5 bg-bg-primary/50 backdrop-blur-md border border-border focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-text-primary outline-none cursor-pointer transition-all shadow-sm font-medium"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
          {filteredAmbulances.length > 0 ? (
            filteredAmbulances.map((amb) => (
              <div key={amb.id} className="bg-bg-primary/40 backdrop-blur-sm border border-border rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/30 group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`p-3.5 rounded-xl transition-colors ${
                      amb.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20' :
                      amb.status === 'On Trip' ? 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20' : 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20'
                    }`}>
                      <TruckIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-text-primary tracking-wide">{amb.vehicleNo}</h3>
                      <p className="text-xs font-semibold text-indigo-500/80">{amb.type}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] px-3 py-1.5 rounded-full font-bold shadow-sm ${
                    amb.status === 'Available' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                    amb.status === 'On Trip' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}>{amb.status}</span>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-indigo-500 shadow-sm"><PhoneIcon className="w-4 h-4" /></span>
                    <div className="flex flex-col">
                      <span className="text-text-primary font-bold">{amb.driverName}</span>
                      <span className="text-text-muted text-xs">{amb.driverPhone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-purple-500 shadow-sm"><MapPinIcon className="w-4 h-4" /></span>
                    <span className="text-text-secondary font-medium truncate">{amb.currentLocation}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto pt-5">
                  {amb.status !== 'Available' && (
                    <button onClick={() => toggleStatus(amb.id, 'Available')} className="flex-1 py-2.5 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-[1.02] cursor-pointer border border-emerald-500/20 shadow-sm">
                      Mark Available
                    </button>
                  )}
                  {amb.status === 'Available' && (
                    <button onClick={() => toggleStatus(amb.id, 'On Trip')} className="flex-1 py-2.5 bg-amber-500/10 text-amber-600 text-xs font-bold rounded-xl hover:bg-amber-500 hover:text-white transition-all transform hover:scale-[1.02] cursor-pointer border border-amber-500/20 shadow-sm">
                      Dispatch
                    </button>
                  )}
                  {amb.status !== 'Maintenance' && (
                    <button onClick={() => toggleStatus(amb.id, 'Maintenance')} className="px-4 py-2.5 bg-bg-secondary text-text-muted text-xs font-bold rounded-xl border border-border hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all transform hover:scale-[1.02] cursor-pointer shadow-sm">
                      Maint.
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 text-text-muted">No vehicles found.</div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Ambulance">
        <form onSubmit={handleAddAmbulance}>
          <div className={formStyles.formGroup}>
            <label>Vehicle Number Plate</label>
            <input type="text" name="vehicleNo" required placeholder="e.g. DHA-11-2233" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Ambulance Type</label>
            <select name="type" required>
              <option value="Basic Life Support">Basic Life Support</option>
              <option value="Advanced Life Support">Advanced Life Support</option>
              <option value="Patient Transport">Patient Transport</option>
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label>Driver Name</label>
            <input type="text" name="driverName" required placeholder="e.g. Abdul Malek" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Driver Phone Number</label>
            <input type="text" name="driverPhone" required placeholder="+880 1711-000000" />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Add Vehicle</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
