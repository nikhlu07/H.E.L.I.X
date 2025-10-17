import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Folder, File } from 'lucide-react';

const FileStructure = ({ items }) => (
    <div className="bg-gray-800 text-gray-300 p-4 rounded-lg font-mono text-sm">
        {items.map((item, index) => (
            <div key={index} className={`flex items-center ${item.level === 1 ? 'ml-4' : item.level === 2 ? 'ml-8' : ''}`}>
                <span className="mr-2">{item.type === 'folder' ? <Folder size={16} /> : <File size={16} />}</span>
                <span>{item.name}</span>
            </div>
        ))}
    </div>
);

export const FrontendSection = () => (
    <Card id="frontend" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24">
        <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center"><Code className="mr-3 h-7 w-7" /> Frontend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <section id="frontend-structure" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Directory Structure</h3>
                <FileStructure items={[{ name: 'src', type: 'folder', level: 0 }, { name: 'components', type: 'folder', level: 1 }, { name: 'Dashboard', type: 'folder', level: 2 }, { name: 'auth', type: 'folder', level: 1 }, { name: 'internetIdentity.ts', type: 'file', level: 2 }, { name: 'services', type: 'folder', level: 1 }]} />
            </section>
            <section id="frontend-auth" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentication</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre>{`import { AuthClient } from '@dfinity/auth-client';\nconst authClient = await AuthClient.create();\nawait authClient.login({\n  identityProvider: 'https://identity.ic0.app',\n  onSuccess: () => { /* ... */ }\n});`}</pre>
                </div>
            </section>
        </CardContent>
    </Card>
);