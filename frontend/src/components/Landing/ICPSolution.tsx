import { Shield, Lock, Eye, Zap, CheckCircle, Globe } from 'lucide-react';

export function ICPSolution() {
  const features = [
    {
      icon: Lock,
      title: 'Immutable Records',
      description: 'Once data is written to the blockchain, it cannot be changed or deleted',
      example: 'No more "lost" approval documents or mysteriously altered contracts',
      color: 'emerald'
    },
    {
      icon: Eye,
      title: 'Public Transparency',
      description: 'Every transaction, approval, and payment is visible to everyone',
      example: 'Citizens can audit government spending in real-time, not years later',
      color: 'amber'
    },
    {
      icon: Zap,
      title: 'Real-time Detection',
      description: 'AI monitors patterns and flags suspicious activities instantly',
      example: 'Catch 870 college approvals in 13 days before damage is done',
      color: 'red'
    },
    {
      icon: Shield,
      title: 'Unstoppable System',
      description: 'Runs on decentralized network, cannot be shut down by corrupt officials',
      example: 'Journalists stay safe while exposing corruption through anonymous tips',
      color: 'purple'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Every Action Recorded',
      description: 'When any government official approves a contract, makes a payment, or selects a vendor, it\'s automatically recorded on the Internet Computer blockchain with timestamp and digital signature.',
      icon: CheckCircle
    },
    {
      step: '2',
      title: 'Public Verification',
      description: 'Citizens, journalists, and auditors can instantly verify any transaction. No RTI requests needed—everything is transparent by default.',
      icon: Eye
    },
    {
      step: '3',
      title: 'AI Fraud Detection',
      description: 'Smart algorithms continuously analyze patterns to detect anomalies like bulk approvals, cost inflation, or suspicious vendor relationships.',
      icon: Zap
    },
    {
      step: '4',
      title: 'Community Challenges',
      description: 'Anyone can challenge suspicious transactions with evidence. Valid challenges trigger automatic investigations and public notifications.',
      icon: Globe
    }
  ];

  return (
    <section id="transparency" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900">
              How Internet Computer Protocol Powers Transparency
            </h2>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Built on the most advanced blockchain technology, CorruptGuard makes corruption impossible to hide
          </p>
        </div>

        {/* Core Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  feature.color === 'emerald' ? 'bg-emerald-100' :
                  feature.color === 'amber' ? 'bg-amber-100' :
                  feature.color === 'red' ? 'bg-red-100' :
                  'bg-purple-100'
                }`}>
                  <Icon className={`h-8 w-8 ${
                    feature.color === 'emerald' ? 'text-emerald-600' :
                    feature.color === 'amber' ? 'text-amber-600' :
                    feature.color === 'red' ? 'text-red-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 mb-3">{feature.description}</p>
                <div className={`text-sm font-medium p-3 rounded-xl ${
                  feature.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                  feature.color === 'amber' ? 'bg-amber-50 text-amber-700' :
                  feature.color === 'red' ? 'bg-red-50 text-red-700' :
                  'bg-purple-50 text-purple-700'
                }`}>
                  {feature.example}
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            How CorruptGuard Prevents Corruption
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">{item.step}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-emerald-600" />
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real Examples */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Real Examples: How This Would Have Stopped Recent Scams
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-emerald-100">
              <h4 className="font-bold text-slate-900 mb-2">PCI College Scam</h4>
              <p className="text-sm text-slate-600 mb-3">
                870 colleges approved in 13 days would have triggered immediate fraud alerts.
              </p>
              <div className="text-emerald-600 font-semibold text-sm">
                ✓ Bulk approval detection
                <br />✓ Time-based anomaly flagging
                <br />✓ Public verification required
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-emerald-100">
              <h4 className="font-bold text-slate-900 mb-2">NAAC Bribery</h4>
              <p className="text-sm text-slate-600 mb-3">
                Rating changes would be publicly visible with justifications required.
              </p>
              <div className="text-emerald-600 font-semibold text-sm">
                ✓ Rating history immutable
                <br />✓ Reviewer actions logged
                <br />✓ Pattern analysis alerts
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-emerald-100">
              <h4 className="font-bold text-slate-900 mb-2">Road Project Murder</h4>
              <p className="text-sm text-slate-600 mb-3">
                Cost inflation from ₹56Cr to ₹120Cr would be flagged automatically.
              </p>
              <div className="text-emerald-600 font-semibold text-sm">
                ✓ Anonymous reporting safe
                <br />✓ Cost change detection
                <br />✓ Public audit trail
              </div>
            </div>
          </div>
        </div>

        {/* Technical Benefits */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">
            Why Internet Computer Protocol?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">True Decentralization</h4>
              <p className="text-slate-600">No single government or entity can control or manipulate the data</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Lightning Fast</h4>
              <p className="text-slate-600">Real-time updates and instant fraud detection, not batch processing</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Military-Grade Security</h4>
              <p className="text-slate-600">Cryptographic proofs ensure data integrity and authenticity</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}