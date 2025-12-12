'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const slot = searchParams.get('slot');
  const zoneId = searchParams.get('zoneId');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const address = searchParams.get('address');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const customerDetails = {
      customer_name: formData.get('name'),
      customer_email: formData.get('email'),
      customer_phone: formData.get('phone'),
      address,
      zone_id: zoneId ? parseInt(zoneId) : null,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
    };

    try {
      // 1. Create a hold
      const holdResponse = await fetch('/api/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          startTime: slot,
          customerDetails,
        }),
      });

      if (!holdResponse.ok) {
        const { error } = await holdResponse.json();
        throw new Error(error || 'Could not place a hold on this slot.');
      }

      const { booking } = await holdResponse.json();

      // 2. "Process Payment" (stubbed)
      const confirmResponse = await fetch('/api/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: booking.id }),
      });

      if (!confirmResponse.ok) {
        const { error } = await confirmResponse.json();
        throw new Error(error || 'Payment failed.');
      }

      router.push('/book/confirmation');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Confirm Your Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input type="text" name="name" id="name" required className="block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input type="email" name="email" id="email" required className="block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
          <input type="tel" name="phone" id="phone" className="block w-full rounded-md border-gray-300 shadow-sm" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 disabled:bg-gray-400">
          {loading ? 'Processing...' : 'Confirm & Pay'}
        </button>
      </form>
    </div>
  );
}
