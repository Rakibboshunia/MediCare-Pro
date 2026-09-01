'use client';

import React, { useState } from 'react';
import {
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  ArrowPathRoundedSquareIcon,
  ShoppingCartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Modal, { formStyles } from '@/components/Modal';
import toast from 'react-hot-toast';

type ItemStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

type InventoryItem = {
  id: string;
  item: string;
  category: string;
  stock: number;
  minStock: number;
  status: ItemStatus;
};

const computeStatus = (stock: number, minStock: number): ItemStatus => {
  if (stock === 0) return 'Out of Stock';
  if (stock < minStock) return 'Low Stock';
  return 'In Stock';
};

const initialItems: InventoryItem[] = [
  { id: 'INV-101', item: 'Surgical Gloves (Box)', category: 'Consumables', stock: 450, minStock: 100, status: 'In Stock' },
  { id: 'INV-102', item: 'N95 Masks (Box)', category: 'PPE', stock: 12, minStock: 50, status: 'Low Stock' },
  { id: 'INV-103', item: 'Syringes 5ml (Pack)', category: 'Consumables', stock: 0, minStock: 100, status: 'Out of Stock' },
  { id: 'INV-104', item: 'Hand Sanitizer 5L', category: 'Cleaning', stock: 25, minStock: 10, status: 'In Stock' },
  { id: 'INV-105', item: 'Sterile Bandages', category: 'Wound Care', stock: 30, minStock: 80, status: 'Low Stock' },
];

const CATEGORIES = ['Consumables', 'PPE', 'Cleaning', 'Wound Care', 'Instruments', 'Other'];

const STATUS_STYLES: Record<ItemStatus, string> = {
  'In Stock': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Low Stock': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Out of Stock': 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const filtered = items.filter(it => {
    const q = search.toLowerCase();
    const matchSearch = it.item.toLowerCase().includes(q) || it.id.toLowerCase().includes(q);
    const matchCat = catFilter === 'All' || it.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const stock = Number(fd.get('stock'));
    const minStock = Number(fd.get('minStock'));
    const newItem: InventoryItem = {
      id: `INV-${100 + items.length + 1}`,
      item: fd.get('item') as string,
      category: fd.get('category') as string,
      stock,
      minStock,
      status: computeStatus(stock, minStock),
    };
    setItems([newItem, ...items]);
    toast.success('Item added to inventory!');
    setIsAddOpen(false);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const fd = new FormData(e.currentTarget);
    const stock = Number(fd.get('stock'));
    const minStock = Number(fd.get('minStock'));
    const updated: InventoryItem = {
      ...editItem,
      item: fd.get('item') as string,
      category: fd.get('category') as string,
      stock,
      minStock,
      status: computeStatus(stock, minStock),
    };
    setItems(items.map(it => it.id === editItem.id ? updated : it));
    toast.success('Inventory updated!');
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(it => it.id !== id));
    toast.success('Item removed from inventory.');
  };

  const ItemForm = ({ defaultValues, onSubmit, onClose }: { defaultValues?: InventoryItem; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) => (
    <form onSubmit={onSubmit}>
      <div className={formStyles.formGroup}>
        <label>Item Name</label>
        <input type="text" name="item" required defaultValue={defaultValues?.item} placeholder="e.g. Surgical Gloves (Box)" />
      </div>
      <div className={formStyles.formGroup}>
        <label>Category</label>
        <select name="category" required defaultValue={defaultValues?.category}>
          <option value="">Select Category</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={formStyles.formGroup}>
          <label>Current Stock</label>
          <input type="number" name="stock" required defaultValue={defaultValues?.stock} min="0" placeholder="e.g. 500" />
        </div>
        <div className={formStyles.formGroup}>
          <label>Minimum Stock</label>
          <input type="number" name="minStock" required defaultValue={defaultValues?.minStock} min="1" placeholder="e.g. 100" />
        </div>
      </div>
      <div className={formStyles.formActions}>
        <button type="button" className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="submit" className={formStyles.submitBtn}>{defaultValues ? 'Save Changes' : 'Add Item'}</button>
      </div>
    </form>
  );

  const stats = [
    { title: 'Total Items', value: items.length, icon: ArchiveBoxIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Low Stock', value: items.filter(it => it.status === 'Low Stock').length, icon: ExclamationTriangleIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Out of Stock', value: items.filter(it => it.status === 'Out of Stock').length, icon: ArrowPathRoundedSquareIcon, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'In Stock', value: items.filter(it => it.status === 'In Stock').length, icon: ShoppingCartIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Hospital Inventory</h1>
        <button onClick={() => setIsAddOpen(true)} className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-sm whitespace-nowrap">
          <PlusIcon className="w-5 h-5" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-panel p-5 flex items-center gap-4 hover:border-accent-primary/30 transition-colors group">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">{s.title}</p>
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-muted flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
            <input type="text" placeholder="Search by name or ID..." className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-bg-primary border border-border rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary">
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm">
                {['Item ID', 'Item Name', 'Category', 'Current Stock', 'Min. Required', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 font-medium text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? filtered.map(it => (
                <tr key={it.id} className="hover:bg-bg-primary/50 transition-colors text-sm">
                  <td className="px-5 py-4 font-medium text-text-primary">{it.id}</td>
                  <td className="px-5 py-4 text-text-primary font-semibold whitespace-nowrap">{it.item}</td>
                  <td className="px-5 py-4 whitespace-nowrap"><span className="bg-bg-primary border border-border px-2 py-1 rounded text-xs font-medium text-text-secondary">{it.category}</span></td>
                  <td className="px-5 py-4 font-bold whitespace-nowrap" style={{ color: it.stock <= it.minStock ? 'var(--warning)' : undefined }}>{it.stock}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{it.minStock}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[it.status]}`}>{it.status}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditItem(it)} className="p-1.5 text-text-muted hover:text-accent-primary rounded-lg hover:bg-accent-primary/10 transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(it.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="text-center p-8 text-text-muted">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Inventory Item">
        <ItemForm onSubmit={handleAdd} onClose={() => setIsAddOpen(false)} />
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Item">
        {editItem && <ItemForm defaultValues={editItem} onSubmit={handleEdit} onClose={() => setEditItem(null)} />}
      </Modal>
    </div>
  );
}
