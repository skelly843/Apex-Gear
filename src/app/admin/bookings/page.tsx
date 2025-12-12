'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  service_types: { name: string };
  start_time: string;
  end_time: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'HOLD' | 'EXPIRED';
};

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`/api/admin/bookings/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CANCELLED' }),
        });
        if (!response.ok) throw new Error('Failed to cancel booking');
        await fetchBookings();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        {/* Manual booking form could be added here */}
      </div>
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                  <div className="text-sm text-gray-500">{booking.customer_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.service_types.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(booking.start_time), 'PPP p')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {booking.status === 'CONFIRMED' && (
                    <button onClick={() => handleCancelBooking(booking.id)} className="text-red-600 hover:text-red-900">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
