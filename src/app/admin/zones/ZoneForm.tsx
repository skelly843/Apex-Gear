'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Zone } from '@/lib/types';

export type { Zone };

type Props = {
  zone: Zone | null;
  onSave: (zone: Zone) => void;
  onClose: () => void;
};

export function ZoneForm({ zone, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<Zone>(
    zone || {
      name: '',
      type: 'zip_list',
      zip_codes: [],
      center_lat: null,
      center_lng: null,
      radius_miles: null,
      active: true,
    }
  );

  useEffect(() => {
    if (zone) {
      setFormData(zone);
    }
  }, [zone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked :
             ['center_lat', 'center_lng', 'radius_miles'].includes(name) ? (value === '' ? null : Number(value)) :
             name === 'zip_codes' ? value.split(',').map(zip => zip.trim()) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{zone ? 'Edit Zone' : 'Add Zone'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium">Type</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="zip_list">ZIP Code List</option>
              <option value="radius">Radius</option>
            </select>
          </div>
          {formData.type === 'zip_list' ? (
            <div>
              <label htmlFor="zip_codes" className="block text-sm font-medium">ZIP Codes (comma-separated)</label>
              <input type="text" name="zip_codes" id="zip_codes" value={formData.zip_codes?.join(', ') || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="center_lat" className="block text-sm font-medium">Latitude</label>
                <input type="number" step="any" name="center_lat" id="center_lat" value={formData.center_lat ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="center_lng" className="block text-sm font-medium">Longitude</label>
                <input type="number" step="any" name="center_lng" id="center_lng" value={formData.center_lng ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="radius_miles" className="block text-sm font-medium">Radius (miles)</label>
                <input type="number" name="radius_miles" id="radius_miles" value={formData.radius_miles ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
          )}
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
