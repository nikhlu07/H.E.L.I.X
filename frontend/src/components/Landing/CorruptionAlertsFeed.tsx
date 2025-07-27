import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Eye, Clock } from 'lucide-react';
import { corruptionAlerts } from '../../data/mockData';

export function CorruptionAlertsFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % corruptionAlerts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔍';
      case 'low': return '✅';
      default: return '⚡';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'blocked': return <AlertTriangle className="h-4 w-4" />;
      case 'investigating': return <Eye className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Real-Time Corruption Alerts
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Live feed of corruption incidents detected and prevented by CorruptGuard's AI system
          </p>
        </div>

        {/* Live Alert Ticker */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">LIVE ALERTS</span>
              </div>
              <div className="text-white/80 text-sm">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-1 h-16 overflow-hidden">
              {corruptionAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className={`transform transition-all duration-1000 ease-in-out ${
                    index === currentIndex 
                      ? 'translate-y-0 opacity-100' 
                      : index < currentIndex 
                        ? '-translate-y-full opacity-0' 
                        : 'translate-y-full opacity-0'
                  }`}
                  style={{
                    position: index === currentIndex ? 'relative' : 'absolute',
                    width: '100%'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                    <div className="flex-1">
                      <span className="text-lg font-medium text-slate-900">
                        {alert.description}
                      </span>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                        <span>📍 {alert.location}</span>
                        <span>⏰ {alert.timestamp.toLocaleTimeString()}</span>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(alert.status)}
                          <span className="capitalize">{alert.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corruptionAlerts.slice(0, 4).map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 capitalize">
                      {alert.type.replace('-', ' ')}
                    </h3>
                    <p className="text-sm text-slate-600">{alert.location}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </div>
              </div>

              <p className="text-slate-700 mb-4 text-sm leading-relaxed">
                {alert.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(alert.status)}
                  <span className="capitalize font-medium text-slate-600">
                    {alert.status}
                  </span>
                </div>
                <div className="text-slate-500">
                  ${(alert.amount / 1000).toFixed(0)}K at risk
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}