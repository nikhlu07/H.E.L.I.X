import { useState } from 'react';
import { PackageSearch, CircleDollarSign, ClipboardCheck, ChevronDown, ChevronUp } from 'lucide-react';

export function CorruptionCases() {
  const [expandedCase, setExpandedCase] = useState<string | null>('nato-procurement-probe');

  const cases = [
    {
      id: 'nato-procurement-probe',
      title: 'NATO Procurement Probe',
      impact: 'Global military contracts compromised',
      icon: PackageSearch,
      details: {
        problem: 'UK, Belgian, Luxembourg authorities investigate alleged irregularities in drone and ammunition contracts awarded by NATO Purchase Agency. Leaked insider info suspected. Even large multilateral systems suffer from opaque contractor vetting and insider collusion, affecting global security.',
        solution: 'Vendor histories, bid transparency, and chain-of-command logs all public and auditable. No more backroom deals.'
      }
    },
    {
      id: 'pci-scam',
      title: 'Pharmacy Council of India Scam',
      impact: '870 fake colleges approved in 13 days',
      icon: ClipboardCheck,
      details: {
        problem: 'PCI Chairman Montu Patel allegedly approved 870 pharmacy colleges in just 13 days without physical inspections. Virtual approvals done in minutes in exchange for bribes. Enabled unqualified institutions to operate, risking student safety and public health. Created a network of credential mills.',
        solution: 'Immutable audit trail requires on-chain justification for any bulk approvals. Public challenge system catches fake credentials instantly.'
      }
    },
    {
      id: 'naac-bribery-case',
      title: 'NAAC Ratings Bribery Case',
      impact: '900+ peer reviewers removed',
      icon: CircleDollarSign,
      details: {
        problem: 'NAAC inspection committee chair and six members arrested by CBI for accepting bribes in exchange for inflated "A++" ratings to universities, including KL University. Misleads students & employers; perpetuates low-quality education infrastructure and destroys trust in accreditation.',
        solution: 'Accreditation records stored transparently on-chain. Fraud detection engine catches rating-based irregularities and unusual approval patterns.'
      }
    },
  ];

  const toggleCase = (id: string) => {
    if (expandedCase === id) {
      setExpandedCase(null);
    } else {
      setExpandedCase(id);
    }
  };

  return (
    <section id="problem" className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">Corruption is a Systemic Failure.</h2>
          <p className="text-lg text-gray-600 mb-12">From defense contracts to educational accreditations, opaque systems are vulnerable to manipulation. We need a new foundation of transparency to restore trust.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {cases.map((caseItem) => (
              <div key={caseItem.id} className="card bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-yellow-500 hover:shadow-lg">
                <button
                  onClick={() => toggleCase(caseItem.id)}
                  className="w-full text-left p-6 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                      <caseItem.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{caseItem.title}</h3>
                      <p className="text-sm text-gray-500">{caseItem.impact}</p>
                    </div>
                  </div>
                  <div className="ml-6">
                    {expandedCase === caseItem.id ? <ChevronUp className="w-6 h-6 text-gray-500" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
                  </div>
                </button>
                {expandedCase === caseItem.id && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">The Problem</h4>
                        <p className="text-gray-600 text-sm">{caseItem.details.problem}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-600 mb-2">The Blockchain Solution</h4>
                        <p className="text-gray-600 text-sm">{caseItem.details.solution}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}