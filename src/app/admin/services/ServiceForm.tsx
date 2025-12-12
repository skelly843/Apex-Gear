'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Service } from './page';

type Props = {
  service: Service | null;
  onSave: (service: Service) => void;
  onClose: () => void;
};

export function ServiceForm({ service, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<Service>(
    service || {
      name: '',
      description: '',
      duration_minutes: 30,
      price_cents: 5000,
      deposit_cents: null,
      active: true,
    }
  );

  useEffect(() => {
    if (service) {
      setFormData(service);
    }
  }, [service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked :
             ['duration_minutes', 'price_cents', 'deposit_cents'].includes(name) ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{service ? 'Edit Service' : 'Add Service'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration_minutes" className="block text-sm font-medium">Duration (minutes)</label>
              <input type="number" name="duration_minutes" id="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="price_cents" className="block text-sm font-medium">Price (cents)</label>
              <input type="number" name="price_cents" id="price_cents" value={formData.price_cents} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="deposit_cents" className="block text-sm font-medium">Deposit (cents, optional)</label>
            <input type="number" name="deposit_cents" id="deposit_cents" value={formData.deposit_cents ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label htmlFor="active" className="ml-2 block text-sm">Active</label>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
