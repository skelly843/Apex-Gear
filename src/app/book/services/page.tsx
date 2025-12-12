'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Service = {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
};

async function getServices(): Promise<Service[]> {
  const res = await fetch('/api/services');
  if (!res.ok) {
    if (res.status === 503) {
      throw new Error('The booking service is temporarily unavailable. Please try again later.');
    }
    throw new Error('Failed to fetch services');
  }
  return res.json();
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const fetchedServices = await getServices();
        setServices(fetchedServices);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) return <div>Loading services...</div>;
  if (error) return (
    <div className="text-center text-red-600">
        <h2 className="text-xl font-bold">An Error Occurred</h2>
        <p>{error}</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
            <p className="mt-2">{service.duration_minutes} minutes - ${(service.price_cents / 100).toFixed(2)}</p>
            <Link
              href={`/book/address?serviceId=${service.id}`}
              className="mt-4 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Select
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
