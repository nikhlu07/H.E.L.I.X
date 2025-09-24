import React, { useState, useEffect } from 'react';
import { Database, Server, Globe, ArrowRight, CheckCircle, Clock } from 'lucide-react';

interface DataFlowDemoProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function DataFlowDemo({ isVisible, onComplete }: DataFlowDemoProps) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "User Authentication",
      description: "User logs in with Internet Identity",
      icon: Globe,
      color: "bg-blue-500",
      details: ["WebAuthn verification", "Principal ID generated", "Session established"]
    },
    {
      title: "Frontend Processing",
      description: "React app processes user data",
      icon: Database,
      color: "bg-green-500",
      details: ["Role assignment", "Token generation", "UI state updated"]
    },
    {
      title: "Backend API Call",
      description: "Data sent to FastAPI backend",
      icon: Server,
      color: "bg-purple-500",
      details: ["Authentication verified", "Data validation", "Fraud detection"]
    },
    {
      title: "Blockchain Interaction",
      description: "Data stored on Internet Computer",
      icon: Globe,
      color: "bg-orange-500",
      details: ["ICP canister called", "Transaction recorded", "Immutable storage"]
    },
    {
      title: "Response Processing",
      description: "Results returned to user",
      icon: CheckCircle,
      color: "bg-emerald-500",
      details: ["Success confirmation", "UI updated", "Real-time sync"]
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setStep(0);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsAnimating(false);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-helix-gray-900 rounded-2xl p-8 max-w-4xl w-full mx-4 border border-primary">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          🔄 Data Flow Demonstration
        </h2>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {steps.map((stepData, index) => {
            const Icon = stepData.icon;
            const isActive = index <= step;
            const isCompleted = index < step;

            return (
              <div
                key={index}
                className={`relative p-4 rounded-xl transition-all duration-500 ${
                  isActive ? 'bg-helix-gray-800 scale-105' : 'bg-helix-gray-900'
                } border-2 ${
                  isCompleted ? 'border-green-500' : isActive ? 'border-primary' : 'border-helix-gray-700'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-3 rounded-full ${stepData.color} ${isActive ? 'animate-pulse' : ''}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="font-semibold text-white text-sm">
                    {stepData.title}
                  </h3>

                  <p className="text-xs text-helix-gray-400">
                    {stepData.description}
                  </p>

                  {isActive && (
                    <div className="space-y-1 mt-2">
                      {stepData.details.map((detail, i) => (
                        <div key={i} className="flex items-center space-x-1 text-xs">
                          <Clock className="w-3 h-3 text-primary" />
                          <span className="text-helix-gray-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className={`w-4 h-4 ${isCompleted ? 'text-green-500' : 'text-helix-gray-600'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-helix-gray-800 px-4 py-2 rounded-lg">
            <div className="flex space-x-1">
              {Array.from({ length: steps.length }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= step ? 'bg-primary' : 'bg-helix-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-helix-gray-300 text-sm">
              Step {step + 1} of {steps.length}
            </span>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            Skip Demo
          </button>
        </div>
      </div>
    </div>
  );
}
