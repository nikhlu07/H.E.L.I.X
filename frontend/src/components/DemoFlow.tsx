import React from 'react';
import { Database, Server, Globe, ArrowRight, CheckCircle, Clock, Activity } from 'lucide-react';

interface DemoFlowProps {
  isVisible: boolean;
  onClose: () => void;
}

export function DemoFlow({ isVisible, onClose }: DemoFlowProps) {
  if (!isVisible) return null;

  const flowSteps = [
    {
      title: "🔐 Authentication",
      description: "Internet Identity or Demo Mode",
      status: "✅ Complete",
      details: ["User authenticated", "Role assigned", "Session created"]
    },
    {
      title: "📊 Data Processing",
      description: "Frontend → Backend → Blockchain",
      status: "🔄 Active",
      details: ["API calls made", "Fraud detection", "Blockchain storage"]
    },
    {
      title: "🌐 Real-time Sync",
      description: "Live updates across all components",
      status: "⏳ Ready",
      details: ["WebSocket connections", "State management", "UI updates"]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-blue-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <span>System Data Flow Demo</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {flowSteps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status.includes('✅') ? 'bg-green-500' :
                    step.status.includes('🔄') ? 'bg-blue-500 animate-pulse' :
                    'bg-gray-600'
                  }`}>
                    {step.status.includes('✅') && <CheckCircle className="w-6 h-6 text-white" />}
                    {step.status.includes('🔄') && <Clock className="w-6 h-6 text-white" />}
                    {step.status.includes('⏳') && <Database className="w-6 h-6 text-white" />}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <span className="text-sm text-gray-400">{step.status}</span>
                  </div>

                  <p className="text-gray-300 mb-3">{step.description}</p>

                  <div className="space-y-1">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-400">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {index < flowSteps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-700"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-semibold mb-2">🎯 Demo Features:</h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-300">
            <div>• Real Internet Identity authentication</div>
            <div>• Mock authentication for presentations</div>
            <div>• Backend API integration</div>
            <div>• Blockchain data storage</div>
            <div>• Real-time UI updates</div>
            <div>• Fraud detection simulation</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
