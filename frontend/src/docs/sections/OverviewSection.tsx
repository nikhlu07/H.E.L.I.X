import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Cpu, Shield, Eye, AlertCircle, GitBranch, Code } from 'lucide-react';

export const OverviewSection = () => (
    <Card id="overview" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24">
        <CardHeader className="p-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-8 text-white">
                <h1 className="text-4xl font-bold mb-4">H.E.L.I.X.</h1>
                <p className="text-xl mb-2">Humanitarian Economic Logistics & Integrity Xchange</p>
                <p className="text-blue-100 italic">"Where AI-powered transparency meets blockchain immutability..."</p>
            </div>
        </CardHeader>
        <CardContent className="p-6">
            <section id="introduction" className="mb-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to H.E.L.I.X.</h2>
                <p className="text-gray-700 leading-relaxed mb-6"><strong>H.E.L.I.X.</strong> is a revolutionary Web3-powered transparency platform designed to eliminate corruption in public procurement and fund distribution. It's an ecosystem where technology enforces integrity.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50/50 p-4 rounded-lg border text-center">
                        <Cpu className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">AI-Driven Intelligence</h4>
                        <p className="text-sm text-gray-600">Detects fraud and anomalies in real-time.</p>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border text-center">
                        <Shield className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">Blockchain Immutability</h4>
                        <p className="text-sm text-gray-600">Ensures every transaction is permanent and tamper-proof.</p>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border text-center">
                        <Eye className="mx-auto h-8 w-8 text-green-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">Radical Transparency</h4>
                        <p className="text-sm text-gray-600">Provides auditable data for all stakeholders.</p>
                    </div>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                    <p className="text-red-900"><strong>The Problem:</strong> Public funds are lost to corruption, leading to devastating consequences.</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <p className="text-green-900"><strong>The Solution:</strong> A platform that makes corruption difficult and transparency the default.</p>
                </div>
            </section>
            <section id="mission" className="mb-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Statement</h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <p className="text-blue-900 font-semibold text-lg">Our Mission: Prevent future tragedies through technological transparency.</p>
                </div>
            </section>
            <section id="features" className="mb-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-lg border">
                        <div className="flex items-center mb-2"><AlertCircle className="h-7 w-7 text-orange-500 mr-3" /><h3 className="text-lg font-semibold">AI-Powered Fraud Detection</h3></div>
                        <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside"><li>Hybrid RAG with rules engine</li><li>87%+ accuracy</li></ul>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border">
                        <div className="flex items-center mb-2"><Shield className="h-7 w-7 text-purple-500 mr-3" /><h3 className="text-lg font-semibold">Blockchain Immutability</h3></div>
                        <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside"><li>Internet Computer Protocol</li><li>Permanent on-chain records</li></ul>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border">
                        <div className="flex items-center mb-2"><GitBranch className="h-7 w-7 text-green-500 mr-3" /><h3 className="text-lg font-semibold">Hierarchical Data Flow</h3></div>
                        <p className="text-sm text-gray-700">End-to-end tracking from government to citizen.</p>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border">
                        <div className="flex items-center mb-2"><Code className="h-7 w-7 text-blue-500 mr-3" /><h3 className="text-lg font-semibold">Multi-Role Dashboards</h3></div>
                        <p className="text-sm text-gray-700">Tailored interfaces for 6 stakeholder roles.</p>
                    </div>
                </div>
            </section>
            <section id="tech-stack" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-lg border"><h3 className="text-md font-semibold mb-2 text-blue-600">Frontend</h3><ul className="space-y-1 text-sm text-gray-700"><li>React 19 + TS</li><li>Tailwind CSS</li><li>Vite</li></ul></div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border"><h3 className="text-md font-semibold mb-2 text-green-600">Backend</h3><ul className="space-y-1 text-sm text-gray-700"><li>FastAPI</li><li>PostgreSQL</li><li>Ollama</li></ul></div>
                    <div className="bg-gray-50/50 p-4 rounded-lg border"><h3 className="text-md font-semibold mb-2 text-purple-600">Blockchain & AI</h3><ul className="space-y-1 text-sm text-gray-700"><li>Internet Computer</li><li>Motoko</li><li>Gemma 3</li></ul></div>
                </div>
            </section>
        </CardContent>
    </Card>
);