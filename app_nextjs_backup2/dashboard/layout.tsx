import React from 'react';
import { Navbar } from '../../components/ui/Navbar';
import { Sidebar } from '../../components/ui/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children} {/* Page content will be rendered here */}
        </main>
      </div>
    </div>
  );
} 