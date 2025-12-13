import Link from 'next/link';

const featuredServices = [
  {
    id: 2, // Assuming 'Diagnostics' will have ID 2 in the seeded data
    name: 'Diagnostics',
    description: 'Full system diagnostic to identify any issues with your vehicle.',
    price: '$100',
  },
  {
    id: 3, // Assuming 'Service 1' will have ID 3
    name: 'Service 1',
    description: 'Includes an oil change, new oil filter, new air filter, and a full diagnostic.',
    price: '$240 (plus supplies)',
  },
  {
    id: null, // Placeholder for the third service
    name: 'Upcoming Service',
    description: 'Details for our next featured service will be available soon.',
    price: 'Contact for pricing',
  },
];

export default function HomePage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Our Services</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Convenient Mobile Mechanic Services
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get your car serviced at your home or office. Easy online booking for our most popular services.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {featuredServices.map((service) => (
              <div key={service.name} className="flex flex-col border rounded-lg p-6 shadow-sm">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  {service.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{service.description}</p>
                  <p className="mt-4 font-semibold text-gray-800">{service.price}</p>
                  {service.id ? (
                    <Link
                      href={`/book/address?serviceId=${service.id}`}
                      className="mt-6 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 text-center"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="mt-6 rounded-md bg-gray-400 px-3.5 py-2.5 text-sm font-semibold text-white text-center cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
