'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, BeakerIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';

const initialInventory = [
  { id: 'MED-001', name: 'Napa 500mg (Paracetamol)', category: 'Painkiller', stock: 3200, unit: 'Tablets', status: 'In Stock', expiry: '2026-06-30' },
  { id: 'MED-002', name: 'Amoxil 250mg (Amoxicillin)', category: 'Antibiotic', stock: 38, unit: 'Capsules', status: 'Low Stock', expiry: '2025-12-15' },
  { id: 'MED-003', name: 'Seclo 20mg (Omeprazole)', category: 'Antacid', stock: 950, unit: 'Capsules', status: 'In Stock', expiry: '2026-03-20' },
  { id: 'MED-004', name: 'Tusi Syrup (Cough)', category: 'Syrup', stock: 0, unit: 'Bottles', status: 'Out of Stock', expiry: '2025-09-10' },
  { id: 'MED-005', name: 'Vitamin C 500mg', category: 'Supplement', stock: 1800, unit: 'Tablets', status: 'In Stock', expiry: '2027-01-01' },
  { id: 'MED-006', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 620, unit: 'Tablets', status: 'In Stock', expiry: '2026-09-18' },
  { id: 'MED-007', name: 'Amlodipine 5mg', category: 'Cardiac', stock: 22, unit: 'Tablets', status: 'Low Stock', expiry: '2025-11-25' },
];

export default function Pharmacy() {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = inventory.length;
  const lowStock = inventory.filter(i => i.status === 'Low Stock').length;
  const outOfStock = inventory.filter(i => i.status === 'Out of Stock').length;

  const handleAddMedicine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const stock = Number(formData.get('stock'));
    let status = 'In Stock';
    if (stock === 0) status = 'Out of Stock';
    else if (stock < 50) status = 'Low Stock';

    const newItem = {
      id: `MED-00${inventory.length + 1}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      stock,
      unit: formData.get('unit') as string,
      status,
      expiry: formData.get('expiry') as string,
    };
    
    setInventory([newItem, ...inventory]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Pharmacy & Inventory</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" /> Add Medicine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-success">
          <div className="p-3 bg-success-light rounded-xl text-success">
            <BeakerIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">Total Items</p>
            <p className="text-2xl font-bold text-text-primary">{totalItems}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-warning">
          <div className="p-3 bg-warning-light rounded-xl text-warning">
            <ExclamationTriangleIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">Low Stock Items</p>
            <p className="text-2xl font-bold text-warning">{lowStock}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-danger">
          <div className="p-3 bg-danger-light rounded-xl text-danger">
            <ExclamationTriangleIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">Out of Stock</p>
            <p className="text-2xl font-bold text-danger">{outOfStock}</p>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl text-text-muted">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search medicine by name, ID, or category..." 
            className="flex-1 bg-transparent border-none text-text-primary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 text-text-muted font-medium border-b border-border">Medicine ID</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Name</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Category</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Stock Level</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Expiry Date</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Status</th>
                <th className="p-4 text-text-muted font-medium border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-bg-primary/50">
                    <td className="p-4 border-b border-border text-text-muted font-medium align-middle">{item.id}</td>
                    <td className="p-4 border-b border-border text-text-primary font-semibold align-middle">{item.name}</td>
                    <td className="p-4 border-b border-border text-text-secondary align-middle">{item.category}</td>
                    <td className="p-4 border-b border-border text-text-primary align-middle font-medium">
                      {item.stock} {item.unit}
                    </td>
                    <td className="p-4 border-b border-border text-text-secondary align-middle">{item.expiry}</td>
                    <td className="p-4 border-b border-border align-middle">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'In Stock' ? 'bg-success-light text-success' : 
                        item.status === 'Low Stock' ? 'bg-warning-light text-warning' : 
                        'bg-danger-light text-danger'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-border align-middle">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-text-muted hover:text-danger hover:bg-danger-light rounded-md transition-colors"
                        title="Delete Medicine"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-text-muted">No medicines found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Medicine">
        <form onSubmit={handleAddMedicine}>
          <div className={formStyles.formGroup}>
            <label>Medicine Name</label>
            <input type="text" name="name" required placeholder="e.g. Paracetamol 500mg" />
          </div>
          <div className={formStyles.formGroup}>
            <label>Category</label>
            <input type="text" name="category" required placeholder="e.g. Painkiller" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={formStyles.formGroup}>
              <label>Initial Stock</label>
              <input type="number" name="stock" required min="0" placeholder="0" />
            </div>
            <div className={formStyles.formGroup}>
              <label>Unit</label>
              <select name="unit" required>
                <option value="Tablets">Tablets</option>
                <option value="Capsules">Capsules</option>
                <option value="Bottles">Bottles</option>
                <option value="Injections">Injections</option>
                <option value="Boxes">Boxes</option>
              </select>
            </div>
          </div>
          <div className={formStyles.formGroup}>
            <label>Expiry Date</label>
            <input type="date" name="expiry" required />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className={formStyles.submitBtn}>Add Medicine</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
