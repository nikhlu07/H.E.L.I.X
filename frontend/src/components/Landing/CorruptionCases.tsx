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

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            The Trust Deficit in Legacy Systems
          </h2>
          <p className="text-xl text-helix-gray-300 max-w-3xl mx-auto">
            From global security to local education, legacy systems are failing. Opaque processes, backroom deals, and a lack of accountability create a breeding ground for corruption.
            <span className="block mt-2 text-primary font-semibold">
              Every case below highlights a problem that H.E.L.I.X. is designed to solve.
            </span>
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {cases.map((case_) => {
            const Icon = case_.icon;
            const isExpanded = expandedCase === case_.id;
            
            return (
              <div
                key={case_.id}
                className={`bg-helix-gray-900 rounded-2xl shadow-md border-2 transition-all duration-300 ${
                  isExpanded ? 'border-primary' : 'border-helix-gray-800 hover:border-helix-gray-700'
                }`}
              >
                <button
                  onClick={() => setExpandedCase(isExpanded ? null : case_.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-primary">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{case_.title}</h3>
                        <p className="text-helix-gray-400">{case_.impact}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-helix-gray-400 mt-2" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-helix-gray-400 mt-2" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-helix-gray-800">
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">What Happened</h4>
                        <p className="text-sm text-helix-gray-400">{case_.details.problem}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-primary mb-2">The H.E.L.I.X. Solution</h4>
                        <p className="text-sm text-helix-gray-300 font-medium">{case_.details.solution}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}