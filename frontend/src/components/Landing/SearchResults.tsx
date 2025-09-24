import React, { useState } from 'react';
import { Calendar, DollarSign, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'procurement' | 'vendor' | 'fraud';
  status: 'active' | 'completed' | 'flagged' | 'investigating';
  amount?: number;
  date: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
}

interface SearchResultsProps {
  query: string;
  type: string;
  onClose: () => void;
}

export function SearchResults({ query, type, onClose }: SearchResultsProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'flagged' | 'completed'>('all');

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 'PR-2024-001',
      title: 'Road Construction Project - Phase 1',
      type: 'procurement',
      status: 'active',
      amount: 2500000,
      date: '2024-01-15',
      description: 'Highway maintenance and construction project for District A',
      risk: 'medium'
    },
    {
      id: 'PR-2024-002',
      title: 'Medical Equipment Supply Contract',
      type: 'procurement',
      status: 'flagged',
      amount: 1800000,
      date: '2024-01-10',
      description: 'Hospital equipment procurement - potential price inflation detected',
      risk: 'high'
    },
    {
      id: 'VEN-2024-001',
      title: 'ABC Construction Ltd.',
      type: 'vendor',
      status: 'investigating',
      amount: 4500000,
      date: '2024-01-08',
      description: 'Multiple contract awards in short timeframe - under investigation',
      risk: 'high'
    },
    {
      id: 'FRAUD-2024-001',
      title: 'Duplicate Invoice Detection',
      type: 'fraud',
      status: 'investigating',
      date: '2024-01-12',
      description: 'AI detected duplicate invoices from same vendor',
      risk: 'high'
    },
    {
      id: 'PR-2024-003',
      title: 'School Building Renovation',
      type: 'procurement',
      status: 'completed',
      amount: 3200000,
      date: '2023-12-20',
      description: 'Educational facility upgrade project - completed on time',
      risk: 'low'
    }
  ];

  const filteredResults = mockResults.filter(result => {
    if (filter === 'all') return true;
    return result.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'investigating': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
              <p className="text-gray-600">Found {filteredResults.length} results for "{query}" in {type}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            {[
              { key: 'all', label: 'All Results' },
              { key: 'active', label: 'Active' },
              { key: 'flagged', label: 'Flagged' },
              { key: 'completed', label: 'Completed' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as 'all' | 'procurement' | 'vendor' | 'fraud')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredResults.map((result) => (
            <div key={result.id} className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(result.status)}
                    <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(result.risk)}`}>
                      {result.risk.toUpperCase()} RISK
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{result.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{result.date}</span>
                    </div>
                    {result.amount && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${result.amount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className="capitalize">{result.type}</span>
                    </div>
                  </div>
                </div>
                
                <a 
                  href="https://github.com/nikhlu07/Corruptguard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center space-x-1"
                >
                  <span>View on GitHub</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredResults.length} of {mockResults.length} results
            </p>
            <a 
              href="https://github.com/nikhlu07/Corruptguard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors inline-flex items-center space-x-2"
            >
              <span>View on GitHub</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
