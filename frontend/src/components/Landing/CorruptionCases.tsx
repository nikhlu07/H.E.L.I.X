import { useState } from 'react';
import { AlertTriangle, FileX, Users, Building, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export function CorruptionCases() {
  const [expandedCase, setExpandedCase] = useState<string | null>('nato');
  const [showAll, setShowAll] = useState<boolean>(false);

  const cases = [
    {
      id: 'nato',
      title: '🌍 NATO Procurement Probe',
      amount: 'Multi-million EUR',
      timeframe: '2025',
      impact: 'Global military contracts compromised',
      icon: Building,
      color: 'slate',
      details: {
        what: 'UK, Belgian, Luxembourg authorities investigate alleged irregularities in drone and ammunition contracts awarded by NATO Purchase Agency. Leaked insider info suspected.',
        why: 'Even large multilateral systems suffer from opaque contractor vetting and insider collusion, affecting global security.',
        clearProcureHelps: 'Vendor histories, bid transparency, and chain-of-command logs all public and auditable. No more backroom deals.'
      }
    },
    {
      id: 'pci',
      title: '🇮🇳 Pharmacy Council of India Scam',
      amount: '₹5,400 Crore',
      timeframe: '2023-24',
      impact: '870 fake colleges approved in 13 days',
      icon: Building,
      color: 'red',
      details: {
        what: 'PCI Chairman Montu Patel allegedly approved 870 pharmacy colleges in just 13 days without physical inspections. Virtual approvals done in minutes in exchange for bribes.',
        why: 'Enabled unqualified institutions to operate, risking student safety and public health. Created a network of credential mills.',
        clearProcureHelps: 'Immutable audit trail requires on-chain justification for any bulk approvals. Public challenge system catches fake credentials instantly.'
      }
    },
    {
      id: 'naac',
      title: '🎓 NAAC Ratings Bribery Case',
      amount: 'Gold, Cash, Electronics',
      timeframe: 'February 2025',
      impact: '900+ peer reviewers removed',
      icon: Users,
      color: 'amber',
      details: {
        what: 'NAAC inspection committee chair and six members arrested by CBI for accepting bribes in exchange for inflated "A++" ratings to universities, including KL University.',
        why: 'Misleads students & employers; perpetuates low-quality education infrastructure and destroys trust in accreditation.',
        clearProcureHelps: 'Accreditation records stored transparently on-chain. Fraud detection engine catches rating-based irregularities and unusual approval patterns.'
      }
    },
    {
      id: 'fiitjee',
      title: '📚 FIITJEE Coaching Chain Fraud',
      amount: 'Unknown (Multi-crore)',
      timeframe: 'January 2025',
      impact: 'Thousands of students stranded',
      icon: FileX,
      color: 'orange',
      details: {
        what: 'FIITJEE abruptly shut centers in Noida, Delhi, and Ranchi over unpaid salaries and franchise disputes. FIRs filed for breach of trust and financial mismanagement.',
        why: 'Private education scams impact vulnerable students with no public recourse. Parents lose life savings with zero accountability.',
        clearProcureHelps: 'Vendor accountability system requires contract performance proof before releasing fees. Public reputation tracking prevents repeat offenders.'
      }
    },
    {
      id: 'chhattisgarh',
      title: '📰 Chhattisgarh Road Scam Murder',
      amount: '₹56 Cr → ₹120 Cr inflation',
      timeframe: '2023-24',
      impact: '1 Journalist killed for exposing truth',
      icon: AlertTriangle,
      color: 'red',
      details: {
        what: 'A journalist was murdered after exposing massive cost inflation in road construction projects. The project cost mysteriously doubled from ₹56 crore to ₹120 crore.',
        why: 'Whistleblowers and journalists face life threats when exposing corruption. Truth-telling becomes dangerous, enabling more corruption.',
        clearProcureHelps: 'Anonymous challenge system protects citizen reporters. Cost inflation detection flags suspicious budget changes automatically.'
      }
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Why We Built CorruptGuard
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            These aren't just headlines—they're symptoms of a broken system where opacity enables corruption.
            <span className="block mt-2 text-emerald-600 font-semibold">
              Every case below could have been prevented with transparent, blockchain-based procurement.
            </span>
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {(showAll ? cases : cases.slice(0, 3)).map((case_) => {
            const Icon = case_.icon;
            const isExpanded = expandedCase === case_.id;
            
            return (
              <div
                key={case_.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                  isExpanded ? 'border-emerald-300 shadow-xl' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setExpandedCase(isExpanded ? null : case_.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        case_.color === 'red' ? 'bg-red-100' :
                        case_.color === 'amber' ? 'bg-amber-100' :
                        case_.color === 'orange' ? 'bg-orange-100' :
                        'bg-slate-100'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          case_.color === 'red' ? 'text-red-600' :
                          case_.color === 'amber' ? 'text-amber-600' :
                          case_.color === 'orange' ? 'text-orange-600' :
                          'text-slate-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{case_.title}</h3>
                        <p className="text-slate-600">{case_.impact}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold mb-1 ${
                        case_.color === 'red' ? 'text-red-600' :
                        case_.color === 'amber' ? 'text-amber-600' :
                        case_.color === 'orange' ? 'text-orange-600' :
                        'text-slate-600'
                      }`}>
                        {case_.amount}
                      </div>
                      <div className="text-sm text-slate-500">{case_.timeframe}</div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400 mt-2" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400 mt-2" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-slate-100">
                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>What Happened</span>
                        </h4>
                        <p className="text-sm text-slate-600">{case_.details.what}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                          <Users className="h-4 w-4 text-amber-500" />
                          <span>Why It Matters</span>
                        </h4>
                        <p className="text-sm text-slate-600">{case_.details.why}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                          <Building className="h-4 w-4 text-emerald-500" />
                          <span>CorruptGuard Solution</span>
                        </h4>
                        <p className="text-sm text-emerald-700 font-medium">{case_.details.clearProcureHelps}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://github.com/nikhlu07/Corruptguard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <span>View on GitHub</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>

        {/* Common Pattern Section */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 max-w-4xl mx-auto border border-red-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
            The Common Pattern
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileX className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Opaque Approvals</h4>
              <p className="text-sm text-slate-600">Decisions made in secret without public oversight</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Rapid Processing</h4>
              <p className="text-sm text-slate-600">Abnormally fast approvals bypass proper checks</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Fake Credentials</h4>
              <p className="text-sm text-slate-600">Unverified entities receive approvals and funding</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building className="h-6 w-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">No Accountability</h4>
              <p className="text-sm text-slate-600">Victims have no recourse when scandals emerge</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-slate-600 mb-6">
            CorruptGuard stops this pattern by making every approval, every payment, and every decision
            <span className="text-emerald-600 font-semibold"> publicly visible and immutable</span>.
          </p>
          <a
            href="https://github.com/nikhlu07/Corruptguard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <span>View on GitHub</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}