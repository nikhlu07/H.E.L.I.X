import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Shield, Eye, AlertCircle, GitBranch, Code } from 'lucide-react';

const FeatureHighlight = ({ icon, title, description, color }) => {
    const Icon = icon;
    return (
        <div className={`bg-white/50 border-2 ${color} rounded-lg shadow-sm p-4 text-center`}>
            <Icon className={`mx-auto h-8 w-8 ${color.replace('border-', 'text-')}`} />
            <h4 className="font-semibold mt-2 text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
};

const TechStackItem = ({ title, techs, color }) => (
    <div className={`bg-white/50 border-2 ${color} rounded-lg shadow-sm p-4`}>
        <h3 className={`text-md font-semibold mb-2 ${color.replace('border-', 'text-')}`}>{title}</h3>
        <ul className="space-y-1 text-sm text-gray-700">
            {techs.map((tech, index) => <li key={index}>{tech}</li>)}
        </ul>
    </div>
);


export const OverviewSection = () => (
    <Card id="overview" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24">
        <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center"><Cpu className="mr-3 h-7 w-7" /> Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
            <section id="introduction" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcome to H.E.L.I.X.</h3>
                <p className="text-gray-700 leading-relaxed mb-6"><strong>H.E.L.I.X.</strong> is a revolutionary Web3-powered transparency platform designed to eliminate corruption in public procurement and fund distribution. It's an ecosystem where technology enforces integrity.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <FeatureHighlight icon={Cpu} title="AI-Driven Intelligence" description="Detects fraud and anomalies in real-time." color="border-blue-500" />
                    <FeatureHighlight icon={Shield} title="Blockchain Immutability" description="Ensures every transaction is permanent and tamper-proof." color="border-purple-500" />
                    <FeatureHighlight icon={Eye} title="Radical Transparency" description="Provides auditable data for all stakeholders." color="border-green-500" />
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p className="text-red-900"><strong>The Problem:</strong> Public funds are lost to corruption, leading to devastating consequences.</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <p className="text-green-900"><strong>The Solution:</strong> A platform that makes corruption difficult and transparency the default.</p>
                    </div>
                </div>
            </section>

            <section id="mission" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Mission Statement</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <p className="text-blue-900 font-semibold text-lg">Our Mission: Prevent future tragedies through technological transparency.</p>
                </div>
            </section>

            <section id="features" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-lg border flex items-start">
                        <AlertCircle className="h-7 w-7 text-orange-500 mr-3 shrink-0" />
                        <div>
                            <h4 className="text-lg font-semibold">AI-Powered Fraud Detection</h4>
                            <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                                <li>Hybrid RAG with rules engine</li>
                                <li>87%+ accuracy</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border flex items-start">
                        <Shield className="h-7 w-7 text-purple-500 mr-3 shrink-0" />
                        <div>
                            <h4 className="text-lg font-semibold">Blockchain Immutability</h4>
                            <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                                <li>Internet Computer Protocol</li>
                                <li>Permanent on-chain records</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border flex items-start">
                        <GitBranch className="h-7 w-7 text-green-500 mr-3 shrink-0" />
                        <div>
                            <h4 className="text-lg font-semibold">Hierarchical Data Flow</h4>
                            <p className="text-sm text-gray-700">End-to-end tracking from government to citizen.</p>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border flex items-start">
                        <Code className="h-7 w-7 text-blue-500 mr-3 shrink-0" />
                        <div>
                            <h4 className="text-lg font-semibold">Multi-Role Dashboards</h4>
                            <p className="text-sm text-gray-700">Tailored interfaces for 6 stakeholder roles.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tech-stack" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <TechStackItem title="Frontend" techs={['React 19 + TS', 'Tailwind CSS', 'Vite']} color="border-blue-500" />
                    <TechStackItem title="Backend" techs={['FastAPI', 'PostgreSQL', 'Ollama']} color="border-green-500" />
                    <TechStackItem title="Blockchain & AI" techs={['Internet Computer', 'Motoko', 'Gemma 3']} color="border-purple-500" />
                </div>
            </section>
        </CardContent>
    </Card>
);