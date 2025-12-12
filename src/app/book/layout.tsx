export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Book a Service</h1>
      {children}
    </div>
  );
}
