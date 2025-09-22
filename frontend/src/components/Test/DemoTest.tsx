import React from 'react';

export function DemoTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo Test Mode</h1>
          <p className="text-gray-600 mb-6">
            This is a demonstration mode for testing H.E.L.I.X. features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Authentication</h3>
              <p className="text-blue-700 text-sm">Test user authentication flows</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Role Management</h3>
              <p className="text-green-700 text-sm">Test different user roles</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Dashboard Features</h3>
              <p className="text-purple-700 text-sm">Explore dashboard functionality</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">Multi-country</h3>
              <p className="text-orange-700 text-sm">Test international scalability</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Use the navigation to explore different features or return to the main application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}