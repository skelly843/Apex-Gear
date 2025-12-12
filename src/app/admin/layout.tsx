import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <nav>
          <ul>
            <li><Link href="/admin/dashboard" className="block py-2 hover:bg-gray-700">Dashboard</Link></li>
            <li><Link href="/admin/bookings" className="block py-2 hover:bg-gray-700">Bookings</Link></li>
            <li><Link href="/admin/schedule" className="block py-2 hover:bg-gray-700">Schedule</Link></li>
            <li><Link href="/admin/services" className="block py-2 hover:bg-gray-700">Services</Link></li>
            <li><Link href="/admin/zones" className="block py-2 hover:bg-gray-700">Zones</Link></li>
            <li><Link href="/admin/blocks" className="block py-2 hover:bg-gray-700">Blocks</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
