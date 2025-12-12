'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type BookingDetails = {
  start_time: string;
  address: string;
  service_types: {
    name: string;
    duration_minutes: number;
    price_cents: number;
  };
};

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      const fetchBooking = async () => {
        try {
          const response = await fetch(`/api/booking-details?id=${bookingId}`);
          if (!response.ok) throw new Error('Failed to fetch booking details');
          const data = await response.json();
          setBooking(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    } else {
      setLoading(false);
      setError('No booking ID provided.');
    }
  }, [bookingId]);

  if (loading) return <div>Loading confirmation...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!booking) return <div>No booking details found.</div>;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Booking Confirmed!</h2>
      <p className="mb-6">Thank you for your booking. A confirmation has been sent to your email.</p>

      <div className="bg-gray-50 p-6 rounded-lg text-left max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
        <div className="space-y-2">
          <p><strong>Service:</strong> {booking.service_types.name}</p>
          <p><strong>Date & Time:</strong> {format(new Date(booking.start_time), 'PPP p')}</p>
          <p><strong>Location:</strong> {booking.address}</p>
          <p><strong>Duration:</strong> {booking.service_types.duration_minutes} minutes</p>
          <p><strong>Price:</strong> ${(booking.service_types.price_cents / 100).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
