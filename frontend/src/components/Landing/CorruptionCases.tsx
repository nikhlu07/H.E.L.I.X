import { useLayoutEffect, useRef, useState } from 'react';
import { PackageSearch, CircleDollarSign, ClipboardCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function CorruptionCases() {
  const [selectedCase, setSelectedCase] = useState<string>('nato-procurement-probe');
  const main = useRef<HTMLElement>(null);

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

  const selectedCaseDetails = cases.find(c => c.id === selectedCase);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: main.current,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      });

      tl.from(".text-center.max-w-3xl", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      })
      .from(".cases-grid", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      }, "-=0.7");
    }, main);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" className="py-20 lg:py-32 bg-white" ref={main}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">Corruption is a Systemic Failure.</h2>
          <p className="text-lg text-gray-600 mb-12">From defense contracts to educational accreditations, opaque systems are vulnerable to manipulation. We need a new foundation of transparency to restore trust.</p>
        </div>
        
        <div className="cases-grid max-w-6xl mx-auto grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <button
                  key={caseItem.id}
                  onClick={() => setSelectedCase(caseItem.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center ${
                    selectedCase === caseItem.id
                      ? 'bg-white shadow-lg border border-yellow-500'
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center ${
                    selectedCase === caseItem.id ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <caseItem.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-bold text-gray-900">{caseItem.title}</h3>
                    <p className="text-xs text-gray-500">{caseItem.impact}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedCaseDetails && (
              <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                    <selectedCaseDetails.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCaseDetails.title}</h3>
                    <p className="text-md text-gray-500">{selectedCaseDetails.impact}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-lg">The Problem</h4>
                    <p className="text-gray-600">{selectedCaseDetails.details.problem}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-700 mb-2 text-lg">The Blockchain Solution</h4>
                    <p className="text-yellow-900">{selectedCaseDetails.details.solution}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
