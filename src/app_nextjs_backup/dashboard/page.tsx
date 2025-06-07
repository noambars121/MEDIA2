import React from 'react';
import { Card } from '@/components/ui/Card'; // Use alias now

export default function DashboardPage() {
  return (
      <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">
              Dashboard
          </h1>
          <Card>
              <div className="p-6 text-xl">
                  Welcome to MediaHand - Your AI-Powered Business Assistant 👋
                  {/* Future features will be implemented here */}
              </div>
          </Card>
          {/* Add more dashboard widgets/components here */}
      </div>
  );
} 