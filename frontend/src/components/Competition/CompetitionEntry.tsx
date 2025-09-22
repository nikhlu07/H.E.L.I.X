import React from 'react';

export function CompetitionEntry() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">H.E.L.I.X. Competition Entry</h1>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
            <h2 className="text-xl font-semibold mb-2">Build the Future of Anti-Corruption</h2>
            <p className="text-blue-100">
              Join our competition to develop innovative solutions for transparent governance and fraud prevention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🏆 Prizes</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• $10,000 Grand Prize</li>
                <li>• Incubation Support</li>
                <li>• Government Partnerships</li>
                <li>• Global Recognition</li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">📅 Timeline</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Registration: Open</li>
                <li>• Submission Deadline: March 31, 2024</li>
                <li>• Finals: April 15, 2024</li>
                <li>• Results: April 30, 2024</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Competition Tracks</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Blockchain Solutions</h4>
                <p className="text-sm text-gray-600">ICP-based transparency systems</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">AI & ML Detection</h4>
                <p className="text-sm text-gray-600">Advanced fraud pattern recognition</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Citizen Engagement</h4>
                <p className="text-sm text-gray-600">Public participation platforms</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
              Register Now
            </button>
            
            <p className="text-sm text-gray-600 mt-4">
              Already registered? <a href="#" className="text-primary-600 hover:underline">Access your submission</a>
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
            <p className="text-sm text-blue-700">
              Contact us at <a href="mailto:competition@helix.gov" className="underline">competition@helix.gov</a> for any questions about the competition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}