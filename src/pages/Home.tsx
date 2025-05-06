
import React from 'react';
import { DashboardLayout } from '@/components/layout';
import { DashboardHome } from '@/components/dashboard';

export default function HomePage() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}
