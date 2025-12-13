'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Block } from '@/lib/types';

export type { Block };

type Props = {
  block: Block | null;
  onSave: (block: Block) => void;
  onClose: () => void;
};

export function BlockForm({ block, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<Block>(
    block || {
      start_time: '',
      end_time: '',
      reason: '',
    }
  );

  useEffect(() => {
    if (block) {
      setFormData({
        ...block,
        start_time: new Date(block.start_time).toISOString().slice(0, 16),
        end_time: new Date(block.end_time).toISOString().slice(0, 16),
      });
    }
  }, [block]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{block ? 'Edit Block' : 'Add Block'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium">Reason</label>
            <input type="text" name="reason" id="reason" value={formData.reason} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium">Start Time</label>
              <input type="datetime-local" name="start_time" id="start_time" value={formData.start_time} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="end_time" className="block text-sm font-medium">End Time</label>
              <input type="datetime-local" name="end_time" id="end_time" value={formData.end_time} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
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
