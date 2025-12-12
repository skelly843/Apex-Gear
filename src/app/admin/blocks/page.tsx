'use client';

import { useEffect, useState } from 'react';
import { BlockForm, Block } from './BlockForm';

export default function BlocksAdminPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blocks');
      if (!response.ok) throw new Error('Failed to fetch blocks');
      const data = await response.json();
      setBlocks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleOpenModal = (block: Block | null = null) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlock(null);
  };

  const handleSave = async (block: Block) => {
    const method = block.id ? 'PUT' : 'POST';
    const url = block.id ? `/api/admin/blocks/${block.id}` : '/api/admin/blocks';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(block),
      });
      if (!response.ok) throw new Error('Failed to save block');
      await fetchBlocks(); // Refresh the list
      handleCloseModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      try {
        const response = await fetch(`/api/admin/blocks/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete block');
        await fetchBlocks(); // Refresh the list
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading blocks...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Blocks</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Block
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blocks.map((block) => (
              <tr key={block.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{block.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(block.start_time).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(block.end_time).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleOpenModal(block)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(block.id!)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <BlockForm
          block={selectedBlock}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
