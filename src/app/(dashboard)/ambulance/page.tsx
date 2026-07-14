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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Ambulance Fleet</h1>
          <p className="text-sm text-text-muted mt-1">Manage hospital vehicles and driver assignments</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm border-none">
          <PlusIcon className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-indigo-500">
          <span className="text-2xl font-bold text-indigo-500">{ambulances.length}</span>
          <span className="text-xs text-text-muted font-medium">Total Fleet</span>
        </div>
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-success">
          <span className="text-2xl font-bold text-success">{available}</span>
          <span className="text-xs text-text-muted font-medium">Available Now</span>
        </div>
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-warning">
          <span className="text-2xl font-bold text-warning">{onTrip}</span>
          <span className="text-xs text-text-muted font-medium">On Trip</span>
        </div>
        <div className="glass-panel p-5 flex flex-col gap-1 border-l-4 border-danger">
          <span className="text-2xl font-bold text-danger">{maintenance}</span>
          <span className="text-xs text-text-muted font-medium">In Maintenance</span>
        </div>
      </div>

      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by vehicle no or driver..." 
              className="flex-1 bg-transparent border-none text-text-primary outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary outline-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-2">
          {filteredAmbulances.length > 0 ? (
            filteredAmbulances.map((amb) => (
              <div key={amb.id} className="bg-bg-primary border border-border rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-lg hover:border-accent-light group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      amb.status === 'Available' ? 'bg-success-light text-success' :
                      amb.status === 'On Trip' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger'
                    }`}>
                      <TruckIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-text-primary tracking-wide">{amb.vehicleNo}</h3>
                      <p className="text-xs text-text-muted">{amb.type}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    amb.status === 'Available' ? 'bg-success-light text-success' :
                    amb.status === 'On Trip' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger'
                  }`}>{amb.status}</span>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-6 flex justify-center text-text-muted"><PhoneIcon className="w-4 h-4" /></span>
                    <span className="text-text-primary font-medium">{amb.driverName}</span>
                    <span className="text-text-muted ml-auto">{amb.driverPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-6 flex justify-center text-accent-primary"><MapPinIcon className="w-4 h-4" /></span>
                    <span className="text-text-secondary truncate">{amb.currentLocation}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4">
                  {amb.status !== 'Available' && (
                    <button onClick={() => toggleStatus(amb.id, 'Available')} className="flex-1 py-2 bg-success-light text-success text-xs font-semibold rounded-lg hover:bg-success hover:text-white transition-colors cursor-pointer border-none">
                      Mark Available
                    </button>
                  )}
                  {amb.status === 'Available' && (
                    <button onClick={() => toggleStatus(amb.id, 'On Trip')} className="flex-1 py-2 bg-warning-light text-warning text-xs font-semibold rounded-lg hover:bg-warning hover:text-white transition-colors cursor-pointer border-none">
                      Dispatch
                    </button>
                  )}
                  {amb.status !== 'Maintenance' && (
                    <button onClick={() => toggleStatus(amb.id, 'Maintenance')} className="px-3 py-2 bg-bg-secondary text-text-muted text-xs font-semibold rounded-lg border border-border hover:bg-danger-light hover:text-danger hover:border-danger/30 transition-colors cursor-pointer">
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
