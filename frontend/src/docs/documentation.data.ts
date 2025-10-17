import { Home, Cpu, Code, Database, Shield, AlertCircle, Rocket, FileText, Book } from 'lucide-react';

export const navigation = [
    { id: 'overview', title: 'Project Overview', icon: Home, subsections: [{ id: 'introduction', title: 'Introduction' }, { id: 'mission', title: 'Mission' }, { id: 'features', title: 'Key Features' }, { id: 'tech-stack', title: 'Tech Stack' }] },
    { id: 'architecture', title: 'System Architecture', icon: Cpu, subsections: [{ id: 'high-level', title: 'High-Level' }, { id: 'data-flow', title: 'Data Flow' }] },
    { id: 'frontend', title: 'Frontend', icon: Code, subsections: [{ id: 'frontend-structure', title: 'Structure' }, { id: 'frontend-auth', title: 'Auth' }, { id: 'frontend-dashboards', title: 'Dashboards' }] },
    { id: 'backend', title: 'Backend', icon: Database, subsections: [] },
    { id: 'blockchain', title: 'Blockchain/ICP', icon: Shield, subsections: [] },
    { id: 'ai-ml', title: 'AI/ML', icon: AlertCircle, subsections: [] },
    { id: 'deployment', title: 'Deployment', icon: Rocket, subsections: [] },
    { id: 'api', title: 'API Reference', icon: FileText, subsections: [] },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: Book, subsections: [] },
];
