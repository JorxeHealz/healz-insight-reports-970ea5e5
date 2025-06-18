
import React from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { UpcomingConsultations } from '../components/dashboard/UpcomingConsultations';
import { WeeklyStats } from '../components/dashboard/WeeklyStats';
import { RecentActivity } from '../components/dashboard/RecentActivity';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-healz-brown">Dashboard</h1>
        <p className="text-healz-brown/70 mt-1">
          Resumen de tus pacientes y actividades
        </p>
      </div>

      {/* Header Stats */}
      <DashboardHeader />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingConsultations />
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          <WeeklyStats />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
