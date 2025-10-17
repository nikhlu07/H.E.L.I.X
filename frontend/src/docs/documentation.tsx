import { useState, useRef } from 'react';
import { Search, Book, Code, Shield, Rocket, Cpu, Database, GitBranch, AlertCircle, FileText, Home, Eye, Users, ArrowDown, ArrowRight, CheckCircle, XCircle, Folder, File } from 'lucide-react';
import { BackendSection } from './sections/BackendSection';
import { BlockchainSection } from './sections/BlockchainSection';
import { AIMLSection } from './sections/AIMLSection';
import { DeploymentSection } from './sections/DeploymentSection';
import { APISection } from './sections/APISection';
import { TroubleshootingSection } from './sections/TroubleshootingSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { navigation } from './documentation.data';
import { OverviewSection } from './sections/OverviewSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { FrontendSection } from './sections/FrontendSection';

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const docRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
      visible: (i: number) => ({ y: 0, opacity: 1, filter: "blur(0px)", transition: { delay: i * 0.1, duration: 0.5 } }),
      hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setActiveSection(sectionId.split('-')[0]);
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-16 px-4 bg-white w-full relative min-h-screen flex items-start" ref={docRef}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        <main className="max-w-7xl mx-auto w-full z-10">
            <article className="text-center mb-12"><h1 className="text-5xl font-extrabold text-gray-900 mb-4"><VerticalCutReveal splitBy="words" staggerDuration={0.15} containerClassName="justify-center" transition={{ type: "spring", stiffness: 250, damping: 40 }}>H.E.L.I.X. Documentation</VerticalCutReveal></h1><TimelineContent as="p" animationNum={0} timelineRef={docRef} customVariants={revealVariants} className="text-gray-600 text-lg">Version 2.1.0 (MVP) - Your guide to the H.E.L.I.X. ecosystem.</TimelineContent></article>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-8"><TimelineContent as="div" animationNum={1} timelineRef={docRef} customVariants={revealVariants}><Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg"><CardHeader><CardTitle className="text-xl font-bold">Navigation</CardTitle></CardHeader><CardContent><div className="relative mb-2"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"/></div><nav className="space-y-1 pt-2 max-h-[60vh] overflow-y-auto">{navigation.map((section) => ( <div key={section.id}> <button onClick={() => scrollToSection(section.id)} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100/50' }`}> <section.icon className="h-5 w-5 mr-3" /> {section.title} </button> {activeSection === section.id && section.subsections.length > 0 && ( <div className="pl-8 mt-1 space-y-1"> {section.subsections.map((subsection) => ( <button key={subsection.id} onClick={() => scrollToSection(subsection.id)} className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"> {subsection.title} </button> ))} </div> )} </div> ))}</nav></CardContent></Card></TimelineContent></div>
                <div className="lg:col-span-3 space-y-8">
                    <TimelineContent as="div" animationNum={1.5} timelineRef={docRef} customVariants={revealVariants}><OverviewSection /></TimelineContent>
                    <TimelineContent as="div" animationNum={2} timelineRef={docRef} customVariants={revealVariants}><ArchitectureSection /></TimelineContent>
                    <TimelineContent as="div" animationNum={2.5} timelineRef={docRef} customVariants={revealVariants}><FrontendSection /></TimelineContent>
                    <TimelineContent as="div" animationNum={3} timelineRef={docRef} customVariants={revealVariants}><Card id="backend" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24"><CardHeader><CardTitle className="text-2xl font-bold flex items-center"><Database className="mr-3 h-7 w-7" /> Backend</CardTitle></CardHeader><CardContent><BackendSection /></CardContent></Card></TimelineContent>
                    <TimelineContent as="div" animationNum={3.5} timelineRef={docRef} customVariants={revealVariants}><Card id="blockchain" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24"><CardHeader><CardTitle className="text-2xl font-bold flex items-center"><Shield className="mr-3 h-7 w-7" /> Blockchain/ICP</CardTitle></CardHeader><CardContent><BlockchainSection /></CardContent></Card></TimelineContent>
                    <TimelineContent as="div" animationNum={4} timelineRef={docRef} customVariants={revealVariants}><Card id="ai-ml" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24"><CardHeader><CardTitle className="text-2xl font-bold flex items-center"><AlertCircle className="mr-3 h-7 w-7" /> AI/ML</CardTitle></CardHeader><CardContent><AIMLSection /></CardContent></Card></TimelineContent>
                    <TimelineContent as="div" animationNum={4.5} timelineRef={docRef} customVariants={revealVariants}><Card id="deployment" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24"><CardHeader><CardTitle className="text-2xl font-bold flex items-center"><Rocket className="mr-3 h-7 w-7" /> Deployment</CardTitle></CardHeader><CardContent><DeploymentSection /></CardContent></Card></TimelineContent>
                    <TimelineContent as="div" animationNum={5} timelineRef={docRef} customVariants={revealVariants}><Card id="api" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24"><CardHeader><CardTitle className="text-2xl font-bold flex items-center"><FileText className="mr-3 h-7 w-7" /> API Reference</CardTitle></CardHeader><CardContent><APISection /></CardContent></Card></TimelineContent>
                    <TimelineContent as="div" animationNum={5.5} timelineRef={docRef} customVariants={revealVariants}><Card id="troubleshooting" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24"><CardHeader><CardTitle className="text-2xl font-bold flex items-center"><Book className="mr-3 h-7 w-7" /> Troubleshooting</CardTitle></CardHeader><CardContent><TroubleshootingSection /></CardContent></Card></TimelineContent>
                    <TimelineContent as="footer" animationNum={6} timelineRef={docRef} customVariants={revealVariants} className="text-center text-gray-600/80 text-sm"><p><strong>H.E.L.I.X.</strong> - Built for transparent governance.</p><p>Last Updated: October 2025</p></TimelineContent>
                </div>
            </div>
        </main>
    </section>
  );
};

export default Documentation;
