'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

function OutOfZoneContent() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/booking-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit request');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (submitted) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4 text-green-700">Request Received!</h2>
        <p>Thank you for your interest. We have received your request and will get back to you shortly to discuss potential arrangements.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4">
        Please fill out the form below, and we will contact you to discuss if a special arrangement can be made.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Your Name" required className="w-full rounded-md border-gray-300"/>
        <input type="email" name="email" placeholder="Your Email" required className="w-full rounded-md border-gray-300"/>
        <input type="tel" name="phone" placeholder="Your Phone (Optional)" className="w-full rounded-md border-gray-300"/>
        <input type="text" name="address" placeholder="Service Address" required className="w-full rounded-md border-gray-300"/>
        <textarea name="service_details" placeholder="Tell us what you need (e.g., 'Brake check for 2018 Honda Civic')" className="w-full rounded-md border-gray-300"></textarea>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white">Submit Request</button>
      </form>
    </div>
  );
}

export default function AddressPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('serviceId');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOutOfZone, setIsOutOfZone] = useState(false);
  const [address, setAddress] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setIsOutOfZone(false);

    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'An unknown error occurred.');
      }

      const { zone, lat, lng } = await response.json();

      if (zone) {
        const params = new URLSearchParams({
            serviceId: serviceId!,
            zoneId: zone.id,
            lat: lat.toString(),
            lng: lng.toString(),
            address,
        });
        router.push(`/book/availability?${params.toString()}`);
      } else {
        setIsOutOfZone(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isOutOfZone) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Outside Our Service Area</h2>
        <p className="mb-4">
          Unfortunately, the address you entered is outside of our online booking area.
          You can contact us directly or fill out the form below.
        </p>
        <div className="space-y-2 mb-6">
          <p><a href="tel:+1234567890" className="text-indigo-600 hover:underline">Click to Call: (123) 456-7890</a></p>
          <p><a href="sms:+1234567890" className="text-indigo-600 hover:underline">Click to Text: (123) 456-7890</a></p>
          <p><a href="mailto:contact@mobilemechanic.com" className="text-indigo-600 hover:underline">Email Us: contact@mobilemechanic.com</a></p>
        </div>
        <OutOfZoneContent />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Enter Your Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
            Street Address or ZIP Code
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="123 Main St, Anytown, USA"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400"
        >
          {loading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>
    </div>
  );
}
