import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Shield, Eye, AlertCircle, GitBranch, Code, LucideIcon } from 'lucide-react';

interface FeatureHighlightProps {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
}

const FeatureHighlight = ({ icon, title, description, color }: FeatureHighlightProps) => {
    const Icon = icon;
    return (
        <div className={`bg-white/50 border-2 ${color} rounded-lg shadow-sm p-4 text-center`}>
            <Icon className={`mx-auto h-8 w-8 ${color.replace('border-', 'text-')}`} />
            <h4 className="font-semibold mt-2 text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
};


export const OverviewSection = () => (
    <Card id="overview" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24">
        <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center"><Cpu className="mr-3 h-7 w-7" /> Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
            <section id="introduction" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcome to H.E.L.I.X.</h3>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>H.E.L.I.X.</strong> (Humanitarian Economic Logistics & Integrity Xchange) is a revolutionary Web3-powered transparency platform 
                        designed to eliminate corruption in public procurement and fund distribution. Born from the tragedy of the Jhalawar school collapse, 
                        where ₹4.28 crore of diverted funds led to seven deaths, H.E.L.I.X. represents a technological solution to systemic corruption.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700">
                            <strong>💡 Core Philosophy:</strong> Technology alone cannot eliminate corruption, but it can make corruption so difficult, 
                            transparent, and risky that honest governance becomes the rational choice.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <FeatureHighlight icon={Cpu} title="AI-Driven Intelligence" description="90%+ accuracy with hybrid RAG pipeline and 10 fraud patterns" color="border-blue-500" />
                    <FeatureHighlight icon={Shield} title="Blockchain Immutability" description="Tamper-proof records on Internet Computer Protocol" color="border-purple-500" />
                    <FeatureHighlight icon={Eye} title="Radical Transparency" description="Public verification and citizen oversight tools" color="border-green-500" />
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-lg border border-red-200 mb-4">
                    <h4 className="font-semibold text-red-900 mb-3">⚠️ The Jhalawar Tragedy</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-red-800 mb-2"><strong>December 2022, Rajasthan</strong></p>
                            <ul className="space-y-1 text-red-700">
                                <li>• 7 children killed in school collapse</li>
                                <li>• ₹4.28 crore diverted (71% of budget)</li>
                                <li>• Substandard materials used</li>
                                <li>• Justice delayed by bureaucracy</li>
                            </ul>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-red-200">
                            <p className="text-green-900 font-semibold mb-2">H.E.L.I.X. Would Have Prevented This:</p>
                            <ul className="space-y-1 text-green-700 text-xs">
                                <li>✓ Real-time fraud detection</li>
                                <li>✓ Immutable audit trail</li>
                                <li>✓ Public transparency</li>
                                <li>✓ Instant alerts on anomalies</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p className="text-red-900"><strong>The Problem:</strong> Governments lose billions to corruption annually. Traditional systems are opaque, 
                        paper-based, and easily manipulated. Corruption evidence disappears in bureaucracy.</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <p className="text-green-900"><strong>The Solution:</strong> H.E.L.I.X. makes corruption difficult through AI detection, 
                        impossible to hide with blockchain immutability, and risky with public transparency.</p>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌟 Core Features</h3>
                
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-lg border-2 border-orange-200">
                        <div className="flex items-start mb-3">
                            <AlertCircle className="h-8 w-8 text-orange-500 mr-3 shrink-0" />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">AI-Powered Fraud Detection</h4>
                                <p className="text-xs text-gray-600">Hybrid architecture with multiple detection layers</p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                <span><strong>Rules Engine (70%):</strong> 10 fraud patterns, 95%+ precision</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                <span><strong>ML Models (30%):</strong> Isolation Forest, 87% accuracy</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                <span><strong>LLM Analysis:</strong> Gemma3/GPT-4 with RAG pipeline</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                <span><strong>Real-time:</strong> Complete analysis in &lt;3 seconds</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-lg border-2 border-purple-200">
                        <div className="flex items-start mb-3">
                            <Shield className="h-8 w-8 text-purple-500 mr-3 shrink-0" />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">Blockchain Immutability</h4>
                                <p className="text-xs text-gray-600">Internet Computer Protocol integration</p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span>
                                <span><strong>Tamper-proof:</strong> Records cannot be altered or deleted</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span>
                                <span><strong>Decentralized:</strong> No single point of failure</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span>
                                <span><strong>Public Verification:</strong> Anyone can audit transactions</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span>
                                <span><strong>Performance:</strong> 1,000+ tx/sec, 99.9% uptime</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border-2 border-green-200">
                        <div className="flex items-start mb-3">
                            <GitBranch className="h-8 w-8 text-green-500 mr-3 shrink-0" />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">Hierarchical Data Flow</h4>
                                <p className="text-xs text-gray-600">End-to-end transaction tracking</p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span><strong>6 Levels:</strong> Government → State → Deputy → Vendor → Supplier → Citizen</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span><strong>Complete Audit Trail:</strong> Every transaction tracked</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span><strong>Role-Based Access:</strong> Permissions by hierarchy level</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-lg border-2 border-blue-200">
                        <div className="flex items-start mb-3">
                            <Code className="h-8 w-8 text-blue-500 mr-3 shrink-0" />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">Multi-Role Dashboards</h4>
                                <p className="text-xs text-gray-600">Specialized interfaces for all stakeholders</p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span><strong>6 Dashboards:</strong> Tailored for each user role</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span><strong>Real-time Updates:</strong> Live data synchronization</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span><strong>Mobile-First:</strong> Optimized for smartphones</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="tech-stack" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🛠️ Technology Stack</h3>
                
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-lg border border-gray-200 mb-4">
                    <p className="text-sm text-gray-700 mb-4">
                        H.E.L.I.X. is built with modern, production-ready technologies chosen for performance, security, and scalability.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                            <h4 className="text-md font-semibold mb-3 text-blue-600">Frontend</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• <strong>React 18</strong> - UI library</li>
                                <li>• <strong>TypeScript</strong> - Type safety</li>
                                <li>• <strong>Vite</strong> - Build tool</li>
                                <li>• <strong>Tailwind CSS</strong> - Styling</li>
                                <li>• <strong>shadcn/ui</strong> - Components</li>
                                <li>• <strong>React Router</strong> - Navigation</li>
                            </ul>
                        </div>
                        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                            <h4 className="text-md font-semibold mb-3 text-green-600">Backend</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• <strong>FastAPI</strong> - REST API</li>
                                <li>• <strong>Python 3.9+</strong> - Language</li>
                                <li>• <strong>PostgreSQL</strong> - Database</li>
                                <li>• <strong>SQLAlchemy</strong> - ORM</li>
                                <li>• <strong>Pydantic</strong> - Validation</li>
                                <li>• <strong>JWT</strong> - Authentication</li>
                            </ul>
                        </div>
                        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                            <h4 className="text-md font-semibold mb-3 text-purple-600">Blockchain & AI</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• <strong>Internet Computer</strong> - Blockchain</li>
                                <li>• <strong>Motoko</strong> - Smart contracts</li>
                                <li>• <strong>Gemma3</strong> - LLM (via Ollama)</li>
                                <li>• <strong>LangChain</strong> - RAG pipeline</li>
                                <li>• <strong>FAISS</strong> - Vector store</li>
                                <li>• <strong>scikit-learn</strong> - ML models</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-gray-900 mb-2">📊 Performance Metrics</h5>
                    <div className="grid md:grid-cols-4 gap-3 text-sm">
                        <div className="bg-white p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">&lt;3s</div>
                            <div className="text-xs text-gray-600">Fraud Analysis</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">90%+</div>
                            <div className="text-xs text-gray-600">Detection Accuracy</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">99.9%</div>
                            <div className="text-xs text-gray-600">Uptime</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">1000+</div>
                            <div className="text-xs text-gray-600">Requests/sec</div>
                        </div>
                    </div>
                </div>
            </section>
        </CardContent>
    </Card>
);