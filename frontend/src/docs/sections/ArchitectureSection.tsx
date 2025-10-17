import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Users, Database, AlertCircle, Shield, ArrowDown, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const ArchLayer = ({ icon, title, tech, color }) => {
    const Icon = icon;
    return (
        <div className="text-center">
            <div className={`bg-white border-2 ${color} rounded-lg shadow-md p-4 w-full mx-auto`}>
                <Icon className={`mx-auto h-8 w-8 ${color.replace('border-', 'text-')}`} />
                <h4 className="font-semibold mt-2 text-gray-900">{title}</h4>
                <p className="text-xs text-gray-600">{tech}</p>
            </div>
        </div>
    );
};

export const ArchitectureSection = () => (
    <Card id="architecture" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24">
        <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center"><Cpu className="mr-3 h-7 w-7" /> System Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            <section id="high-level" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">High-Level Architecture</h3>
                <div className="flex flex-col items-center space-y-2">
                    <ArchLayer icon={Users} title="Presentation Layer" tech="React, Tailwind, Internet Identity" color="border-blue-500" />
                    <ArrowDown className="text-gray-400" />
                    <ArchLayer icon={Database} title="Application Layer" tech="FastAPI, PostgreSQL, Redis" color="border-green-500" />
                    <ArrowDown className="text-gray-400" />
                    <ArchLayer icon={AlertCircle} title="AI/ML Layer" tech="Ollama, LangChain, RAG, Rules Engine" color="border-orange-500" />
                    <ArrowDown className="text-gray-400" />
                    <ArchLayer icon={Shield} title="Data & Blockchain Layer" tech="ICP, Motoko Canisters" color="border-purple-500" />
                </div>
            </section>
            <section id="data-flow" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Transaction Data Flow</h3>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                    <span className="p-2 bg-gray-100 rounded-md">User</span>
                    <ArrowRight className="text-gray-400" />
                    <span className="p-2 bg-gray-100 rounded-md">Frontend</span>
                    <ArrowRight className="text-gray-400" />
                    <span className="p-2 bg-gray-100 rounded-md">Backend</span>
                    <ArrowRight className="text-gray-400" />
                    <span className="p-2 bg-orange-100 rounded-md">Fraud Engine</span>
                    <ArrowRight className="text-gray-400" />
                    <div className="flex flex-col gap-1 text-center">
                        <div className="flex items-center gap-2">
                            <ArrowRight className="text-gray-400 -mr-1" />
                            <CheckCircle className="text-green-500 h-5 w-5" />
                            <span className="p-2 bg-green-100 rounded-md">Approve &rarr; Blockchain</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowRight className="text-gray-400 -mr-1" />
                            <XCircle className="text-red-500 h-5 w-5" />
                            <span className="p-2 bg-red-100 rounded-md">Flag &rarr; Manual Review</span>
                        </div>
                    </div>
                </div>
            </section>
        </CardContent>
    </Card>
);