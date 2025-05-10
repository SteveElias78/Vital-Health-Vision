
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HealthDashboard } from '@/components/dashboard/HealthDashboard';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <HealthDashboard />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
