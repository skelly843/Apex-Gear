'use client';

import { useEffect, useState } from 'react';
import { ZoneForm, Zone } from './ZoneForm';

export default function ZonesAdminPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/zones');
      if (!response.ok) throw new Error('Failed to fetch zones');
      const data = await response.json();
      setZones(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleOpenModal = (zone: Zone | null = null) => {
    setSelectedZone(zone);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedZone(null);
  };

  const handleSave = async (zone: Zone) => {
    const method = zone.id ? 'PUT' : 'POST';
    const url = zone.id ? `/api/admin/zones/${zone.id}` : '/api/admin/zones';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zone),
      });
      if (!response.ok) throw new Error('Failed to save zone');
      await fetchZones(); // Refresh the list
      handleCloseModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      try {
        const response = await fetch(`/api/admin/zones/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete zone');
        await fetchZones(); // Refresh the list
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading zones...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Zones</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Zone
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {zones.map((zone) => (
              <tr key={zone.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {zone.type === 'zip_list' ? zone.zip_codes?.join(', ') : `${zone.radius_miles} mi @ ${zone.center_lat},${zone.center_lng}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${zone.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {zone.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleOpenModal(zone)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(zone.id!)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ZoneForm
          zone={selectedZone}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
