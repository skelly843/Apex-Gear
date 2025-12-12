'use client';

import { Suspense } from 'react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
