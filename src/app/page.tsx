import Link from 'next/link';

const featuredServices = [
  {
    id: 2, // Corresponds to 'Diagnostics' in the seed script
    name: 'Diagnostics',
    description: 'Full system diagnostic to identify any issues with your vehicle.',
    price: '$100',
  },
  {
    id: 3, // Corresponds to 'Service 1'
    name: 'Service 1',
    description: 'Includes an oil change, new oil filter, new air filter, and a full diagnostic.',
    price: '$240 (plus cost of supplies)',
  },
  {
    id: 4, // Corresponds to 'Service 2'
    name: 'Service 2',
    description: 'Includes oil/filter, air filter, carb clean, coolant flush, front and rear differential fluid, brake fluid, cable lube, chain clean, grease fittings flushed and filled, spark plugs, diagnostics and inspection.',
    price: '$480 (plus cost of supplies)',
  },
  {
    id: 5, // Corresponds to 'Service 3'
    name: 'Service 3',
    description: 'Top-end engine rebuild.',
    price: '$320 (plus cost of supplies)',
  },
  {
    id: 6, // Corresponds to 'Service 4'
    name: 'Service 4',
    description: 'Low-end/transmission rebuild.',
    price: '$640 (plus cost of supplies)',
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
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {featuredServices.map((service) => (
              <div key={service.name} className="flex flex-col border rounded-lg p-6 shadow-sm">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  {service.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{service.description}</p>
                  <p className="mt-4 font-semibold text-gray-800">{service.price}</p>
                  <Link
                    href={`/book/address?serviceId=${service.id}`}
                    className="mt-6 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 text-center"
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
                <a href="tel:9415649798" className="text-lg font-semibold text-indigo-600">
                    Call or Text: (941) 564-9798
                </a>
            </p>
        </div>
      </div>
    </div>
  );
}
