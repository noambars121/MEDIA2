import React from 'react';
import Link from 'next/link';
// Import icons as needed, e.g., from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-e border-border bg-background p-4 space-y-6">
      {/* Logo/Brand */}
      <div className="flex items-center h-16">
        <Link href="/dashboard" className="text-xl font-semibold text-foreground">
          Mediahand
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {/* <LayoutDashboard className="h-4 w-4" /> */} {/* Example Icon */}
          Dashboard
        </Link>
        {/* Add other links (Content, Assistant, Chat, Billing, Settings) */}
         <Link
          href="/dashboard/settings" // Example link
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {/* <Settings className="h-4 w-4" /> */} {/* Example Icon */}
          Settings
        </Link>
      </nav>

      {/* Optional Footer */}
      <div>{/* Maybe user profile link or logout */}</div>
    </aside>
  );
} 