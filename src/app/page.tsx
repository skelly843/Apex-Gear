import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

// Helper to format price
const formatPrice = (priceInCents: number | null) => {
  if (priceInCents === null) return 'N/A';
  return `$${(priceInCents / 100).toFixed(2)}`;
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );
  const { data: services, error } = await supabase
    .from('service_types')
    .select('*')
    .eq('active', true)
    .order('name') as { data: Database['public']['Tables']['service_types']['Row'][] | null; error: any };

  if (error) {
    console.error('Error fetching services:', error);
    // You might want to render an error state here
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-apex-blue-600">Apex Gear LLC</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Apex Gear LLC – Mobile Mechanic & Powersports Service
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Certified. Convenient. Done Right.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {services?.map((service) => (
              <div key={service.id} className="flex flex-col border rounded-lg p-6 shadow-sm">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  {service.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{service.description}</p>
                  <p className="mt-4 font-semibold text-gray-800">{formatPrice(service.price_cents)}</p>
                  <Link
                    href={`/book/address?serviceId=${service.id}`}
                    className="mt-6 rounded-md bg-apex-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-apex-blue-500 text-center"
                  >
                    Book Now
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-16 rounded-2xl bg-gray-50 px-8 py-10 text-center">
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                Need something else?
            </h3>
            <p className="mt-4 text-lg leading-8 text-gray-600">
                Anything specific outside of these services can be requested by contacting customer care.
            </p>
            <p className="mt-6">
                <a href="tel:9415649798" className="text-lg font-semibold text-apex-blue-600">
                    Call or Text: (941) 564-9798
                </a>
            </p>
        </div>
      </div>
    </div>
  );
}
