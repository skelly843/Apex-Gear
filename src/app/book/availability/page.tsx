'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parseISO } from 'date-fns';

export default function AvailabilityPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('serviceId');
  const zoneId = searchParams.get('zoneId');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const address = searchParams.get('address');

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate && serviceId && zoneId) {
      const fetchSlots = async () => {
        setLoading(true);
        setError(null);
        try {
          const dateString = format(selectedDate, 'yyyy-MM-dd');
          const response = await fetch(`/api/availability?date=${dateString}&serviceId=${serviceId}&zoneId=${zoneId}`);
          if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || 'Failed to fetch slots.');
          }
          const { slots } = await response.json();
          setSlots(slots);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDate, serviceId, zoneId]);

  const handleSlotSelection = (slot: string) => {
    const params = new URLSearchParams({
      serviceId: serviceId!,
      slot,
      zoneId: zoneId!,
      lat: lat!,
      lng: lng!,
      address: address!,
    });
    router.push(`/book/checkout?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={{ before: new Date() }}
          className="border rounded-lg"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Available Times for {selectedDate ? format(selectedDate, 'PPP') : '...'}
        </h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-2">
            {slots.length > 0 ? (
              slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleSlotSelection(slot)}
                  className="rounded-md bg-indigo-100 px-3.5 py-2.5 text-sm font-semibold text-indigo-800 shadow-sm hover:bg-indigo-200"
                >
                  {format(parseISO(slot), 'p')}
                </button>
              ))
            ) : (
              <p>No available slots for this day.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
