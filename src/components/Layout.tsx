
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-healz-cream">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-healz-brown">
              Healz Reports
            </h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link 
              to="/reports" 
              className="text-healz-brown hover:text-healz-red transition-colors"
            >
              Reports
            </Link>
            <Link 
              to="/reports/new" 
              className="bg-healz-red text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 transition-colors"
            >
              New Report
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {title && (
          <h1 className="text-2xl font-semibold mb-6 text-healz-brown">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
