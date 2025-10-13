import React, { useLayoutEffect, useRef } from 'react';
import { Users, CheckCircle, DollarSign, PackageSearch, Rocket, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function StatsDashboard() {
  const main = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
        const tlStats = gsap.timeline({
            scrollTrigger: {
                trigger: "#stats",
                start: "top 80%",
                toggleActions: "play none none none",
            }
        });
        tlStats.from("#stats .text-center.max-w-3xl", {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
        })
        .from(gsap.utils.toArray('#stats .feature-card'), {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
        }, "-=0.5");

        const tlTech = gsap.timeline({
            scrollTrigger: {
                trigger: "#stats .text-center:last-child",
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
        tlTech.from("#stats .text-center:last-child", {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
        });

        const tlContact = gsap.timeline({
            scrollTrigger: {
                trigger: "#contact",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
        tlContact.from("#contact .cta-gradient", {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
        });

    }, main);

    return () => ctx.revert();
}, []);

  const stats = [
    {
      icon: Users,
      label: 'Partners Onboarded',
      value: 50,
      suffix: '+',
      description: 'Leading NGOs, governments, and logistics partners.'
    },
    {
      icon: CheckCircle,
      label: 'Delivery Success Rate',
      value: 99.8,
      suffix: '%',
      description: 'End-to-end verification of aid reaching its destination.'
    },
    {
      icon: DollarSign,
      label: 'Value Delivered',
      value: 15,
      prefix: '$',
      suffix: 'M+',
      description: 'Total value of aid delivered transparently via H.E.L.I.X.'
    },
    {
      icon: PackageSearch,
      label: 'Supplies Tracked',
      value: 250,
      suffix: 'K+',
      description: 'Individual items tracked from warehouse to recipient.'
    },
    {
      icon: Rocket,
      label: 'Supply Chain Acceleration',
      value: 75,
      suffix: '%',
      description: 'Average reduction in delivery time from source to need.'
    },
    {
      icon: TrendingUp,
      label: 'Donor Trust Index',
      value: 98,
      suffix: '%',
      description: 'Confidence score reported by participating donors.'
    }
  ];

  return (
    <div ref={main}>
      <section id="stats" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">Platform Impact by the Numbers</h2>
            <p className="text-lg text-gray-600">Real-time statistics showing the effectiveness and transparency of the H.E.L.I.X. network.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="feature-card text-center p-8 rounded-xl bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white text-yellow-600 mx-auto mb-4 border-2 border-yellow-200">
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.label}</h3>
                <div className="text-4xl font-bold text-yellow-600 my-4">
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Powered By Enterprise-Grade Technology</h3>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 text-gray-500" title="Internet Computer"><img src="internet-computer-icp-logo.svg" className="h-7 w-7" alt="Internet Computer" /> Internet Computer</div>
              <div className="flex items-center gap-3 text-gray-500" title="React"><img src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg" className="h-7 w-7" alt="React" /> React</div>
              <div className="flex items-center gap-3 text-gray-500" title="Node.js"><img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" className="h-7 w-7" alt="Node.js" /> Node.js</div>
              <div className="flex items-center gap-3 text-gray-500" title="Rust"><img src="https://www.vectorlogo.zone/logos/rust-lang/rust-lang-icon.svg" className="h-7 w-7" alt="Rust" /> Rust</div>
              <div className="flex items-center gap-3 text-gray-500" title="MongoDB"><img src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" className="h-7 w-7" alt="MongoDB" /> MongoDB</div>
              <div className="flex items-center gap-3 text-gray-500" title="IPFS"><img src="ipfs-icon.svg" className="h-7 w-7" alt="IPFS" /> IPFS</div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="cta-gradient rounded-2xl p-10 md:p-16 text-center relative overflow-hidden bg-yellow-400">
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full"></div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-black/10 rounded-full"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-4">Join Us in Building the Future of Aid.</h2>
              <p className="max-w-2xl mx-auto text-lg text-black/70 mb-10">Whether you're a developer, an NGO, or a government entity, your contribution can make a difference. Let's build a more transparent and accountable world together.</p>
              <a href="https://github.com/nikhlu07/H.E.L.I.X." target="_blank" rel="noopener noreferrer" className="bg-black text-yellow-400 font-semibold px-8 py-3.5 rounded-lg text-base hover:bg-opacity-90 transition-all duration-300 inline-block shadow-lg">Get Started</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src="logo.svg" alt="H.E.L.I.X Logo" className="h-7 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-800">H.E.L.I.X</span>
            </div>
            <nav className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-6 text-sm font-medium">
              <a href="#problem" className="text-gray-600 hover:text-yellow-600 transition-colors">The Problem</a>
              <a href="#solution" className="text-gray-600 hover:text-yellow-600 transition-colors">Our Solution</a>
              <a href="#howitworks" className="text-gray-600 hover:text-yellow-600 transition-colors">How It Works</a>
              <a href="#features" className="text-gray-600 hover:text-yellow-600 transition-colors">Features</a>
            </nav>
            <div className="flex justify-center items-center space-x-6 mb-6">
              <a href="https://github.com/nikhlu07/H.E.L.I.X." target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-600 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
            </div>
            <p className="text-sm text-gray-500">&copy; 2025 H.E.L.I.X. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
