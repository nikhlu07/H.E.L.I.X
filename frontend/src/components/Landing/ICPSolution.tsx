import { Shield, Lock, Eye, Zap, CheckCircle, Globe } from 'lucide-react';
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ICPSolution() {
  const main = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tlSolution = gsap.timeline({
        scrollTrigger: {
          trigger: "#solution",
          start: "top 80%",
          toggleActions: "play none none none",
        }
      });
      tlSolution.from("#solution .text-center.max-w-3xl", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      })
      .from(gsap.utils.toArray('#solution .how-it-works-item'), {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
      }, "-=0.5");

      const tlFeatures = gsap.timeline({
        scrollTrigger: {
          trigger: "#features",
          start: "top 80%",
          toggleActions: "play none none none",
        }
      });
      tlFeatures.from("#features .text-center.max-w-3xl", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      })
      .from(gsap.utils.toArray('#features .feature-item'), {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      }, "-=0.5");

    }, main);

    return () => ctx.revert();
  }, []);

  const howItWorks = [
    {
      step: '1',
      title: 'Register on the Blockchain',
      description: 'Manufacturers register each batch on-chain, minting a unique digital twin for every item. A secure QR links the physical product to its immutable record.',
      image: '/images/blockchain.jpeg',
      points: [
        'Item-level digital twin',
        'Secure QR linked to on-chain batch'
      ]
    },
    {
      step: '2',
      title: 'Track in Real-Time',
      description: 'As products move, each handoff is captured as a signed event. Live telemetry and custody updates show exactly where items are and who touched them.',
      image: '/images/real-time.jpeg',
      points: [
        'Proof of custody at every step',
        'Live condition and location tracking'
      ]
    },
    {
      step: '3',
      title: 'Verify with a Scan',
      description: 'Scan once with any smartphone to instantly see provenance, custody, and integrity checks—before it is dispensed or used.',
      image: '/images/scan.jpeg',
      points: [
        'Transparent history for all stakeholders',
        'Trust at the point of use'
      ]
    }
  ];

  const features = [
    {
      icon: Lock,
      title: 'Blockchain Integrity',
      description: 'Built on Polkadot for security and interoperability—every event is tamper-evident and auditable.',
    },
    {
      icon: Eye,
      title: 'Instant QR Verification',
      description: 'Dynamic QR binds the physical item to its digital twin for instant, reliable authenticity checks.',
    },
    {
      icon: Zap,
      title: 'Real-Time Alerts',
      description: 'Connect IoT and policy rules to trigger proactive alerts on anomalies, routes, temperature, and more.',
    },
    {
      icon: Shield,
      title: 'Decentralized Storage',
      description: 'Metadata anchored to IPFS to ensure permanence, resilience, and censorship resistance.',
    },
    {
      icon: Globe,
      title: 'Advanced Analytics',
      description: 'Turn supply-chain data into decisions—predict risk, optimize routes, and eliminate blind spots.',
    },
    {
      icon: CheckCircle,
      title: 'Enterprise Scalability',
      description: 'Modern, cloud-ready architecture sized for national programs and high-volume transactions.',
    }
  ];

  return (
    <div ref={main}>
      <section id="solution" className="py-20 lg:py-32 bg-white relative">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">
                An Immutable Chain of Trust.
            </h2>
            <p className="text-lg text-gray-600">
                H.E.L.I.X. gives every critical product a verifiable, end-to-end record—from origin to last-mile delivery—so anyone can trust what is in their hands.
            </p>
          </div>
          <div className="space-y-16">
            {howItWorks.map((item, index) => (
              <div className="how-it-works-item" key={index}>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div className={index % 2 !== 0 ? 'md:order-last' : ''}>
                    <span className="inline-block border-primary border-2 text-black font-semibold px-4 py-1 rounded-full mb-4">Step {item.step}</span>
                    <h3 className="text-3xl font-extrabold text-primary mb-4">{item.title}</h3>
                    <p className="text-gray-600 mb-6">{item.description}</p>
                    <ul className="space-y-2 text-gray-700">
                      {item.points.map((point, pIndex) => (
                        <li key={pIndex} className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl p-8">
                    <img src={item.image} alt={item.title} className="rounded-lg shadow-lg border border-gray-200 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 lg:py-32 bg-white relative">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">
                Built for Trust and Scale.
            </h2>
            <p className="text-lg text-gray-600">
                An architecture that marries blockchain assurances with modern cloud primitives—reliable, fast, and ready for scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div className="feature-item" key={index}>
                    <div className="flex items-start ">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 text-primary">
                                <Icon className="h-7 w-7" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg leading-6 font-bold text-gray-900">{feature.title}</h3>
                            <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
