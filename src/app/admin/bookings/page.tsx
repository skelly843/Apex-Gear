'use client';

import { useEffect, useState } from 'react';

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  service_name: string;
  start_time: string;
  end_time: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'HOLD';
};

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockBookings: Booking[] = [
      { id: 1, customer_name: 'John Doe', customer_email: 'john@example.com', service_name: 'Oil Change', start_time: '2024-08-15T09:00:00Z', end_time: '2024-08-15T09:30:00Z', status: 'CONFIRMED' },
      { id: 2, customer_name: 'Jane Smith', customer_email: 'jane@example.com', service_name: 'Brake Inspection', start_time: '2024-08-15T10:00:00Z', end_time: '2024-08-15T10:45:00Z', status: 'CONFIRMED' },
      { id: 3, customer_name: 'Bob Johnson', customer_email: 'bob@example.com', service_name: 'Diagnostic Check', start_time: '2024-08-16T11:00:00Z', end_time: '2024-08-16T12:00:00Z', status: 'CANCELLED' },
      { id: 4, customer_name: 'Alice Williams', customer_email: 'alice@example.com', service_name: 'Oil Change', start_time: '2024-08-16T14:00:00Z', end_time: '2024-08-16T14:30:00Z', status: 'HOLD' },
    ];
    setBookings(mockBookings);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Manual Booking
        </button>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.service_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleTimeString()}
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
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">Details</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
