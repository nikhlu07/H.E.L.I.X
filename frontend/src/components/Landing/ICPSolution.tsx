import { Shield, Lock, Eye, Zap, CheckCircle, Globe } from 'lucide-react';
import React from "react";

export function ICPSolution() {
  const features = [
    {
      icon: Lock,
      title: 'Immutable Records',
      description: 'Once aid data is on the blockchain, it cannot be altered or deleted.',
      example: 'No more \"lost\" shipping manifests or altered delivery confirmations.',
    },
    {
      icon: Eye,
      title: 'Radical Transparency',
      description: 'Every step of the aid journey is visible to all stakeholders.',
      example: 'Donors can track their contributions directly to the communities in need.',
    },
    {
      icon: Zap,
      title: 'Real-time Analytics',
      description: 'AI monitors the supply chain to flag bottlenecks and inefficiencies.',
      example: 'Instantly identify a stalled shipment and reroute supplies.',
    },
    {
      icon: Shield,
      title: 'Unstoppable & Sovereign',
      description: 'Runs on a decentralized network, immune to local interference.',
      example: 'Ensures aid delivery continues even in unstable environments.',
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Digital Twinning',
      description: 'Physical aid is assigned a unique digital identity on the blockchain, creating an immutable link from the start of its journey.',
      icon: CheckCircle
    },
    {
      step: '2',
      title: 'Real-Time Tracking',
      description: 'As aid moves through the supply chain, every scan and handover is recorded, providing a live, end-to-end view of its location.',
      icon: Globe
    },
    {
      step: '3',
      title: 'Automated Verification',
      description: 'Smart contracts automatically verify and process customs, vendor payments, and other logistical steps, reducing delays and human error.',
      icon: Zap
    },
    {
      step: '4',
      title: 'Proof of Delivery',
      description: 'Recipients confirm arrival with a secure digital signature, closing the loop and providing undeniable proof that aid reached its destination.',
      icon: Eye
    }
  ];

  return (
    <section id="protocol" className="py-20 bg-helix-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <h2 className="text-4xl font-bold text-white">
              The H<span className="text-primary">.</span>E<span className="text-primary">.</span>L<span className="text-primary">.</span>I<span className="text-primary">.</span>X<span className="text-primary">.</span> Protocol
            </h2>
          </div>
          <p className="text-xl text-helix-gray-300 max-w-3xl mx-auto">
            Built on the Internet Computer, H.E.L.I.X. makes aid delivery transparent and accountable.
          </p>
        </div>

        {/* Core Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center bg-background p-6 rounded-lg border border-helix-gray-800">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-primary">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-helix-gray-400 mb-3">{feature.description}</p>
                <div className="text-sm font-medium p-3 rounded-lg bg-primary text-black">
                  {feature.example}
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            How H.E.L.I.X. Ensures Integrity
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">{item.step}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-helix-gray-400">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Benefits */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            Why the Internet Computer?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary-foreground" />
              </div>
              <h4 className="font-bold text-primary mb-2">True Decentralization</h4>
              <p className="text-helix-gray-400">No single entity can control the data, ensuring neutrality.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h4 className="font-bold text-primary mb-2">Web Speed</h4>
              <p className="text-helix-gray-400">Real-time updates and instant analytics at scale.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h4 className="font-bold text-primary mb-2">Chain-Key Cryptography</h4>
              <p className="text-helix-gray-400">Airtight security that ensures data integrity and authenticity.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
