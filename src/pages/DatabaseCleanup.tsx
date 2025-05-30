
import React from 'react';
import { CleanupUtility } from '../components/admin/CleanupUtility';

const DatabaseCleanup = () => {
  return (
    <div className="min-h-screen bg-healz-cream py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-healz-brown mb-8 text-center">
          Database Cleanup
        </h1>
        <CleanupUtility />
      </div>
    </div>
  );
};

export default DatabaseCleanup;
