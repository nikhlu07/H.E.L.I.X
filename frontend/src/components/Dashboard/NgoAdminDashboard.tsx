import { useRef, useState } from 'react';
import { Settings, Users, FileText, UserPlus, Shield, Megaphone, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useToast } from '../common/Toast';

export function NgoAdminDashboard() {
    const dashboardRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const [announcement, setAnnouncement] = useState('');

    const users = [
        { id: 1, name: "Alice Johnson", role: "Program Manager", status: "Active" },
        { id: 2, name: "Bob Williams", role: "Field Officer", status: "Active" },
        { id: 3, name: "Charlie Brown", role: "Volunteer", status: "Pending" },
        { id: 4, name: "David Miller", role: "Field Officer", status: "Inactive" },
    ];

    const auditLogs = [
        { id: 1, user: "Alice Johnson", action: "Created new program: 'Community Health'", timestamp: "2024-07-21 10:00 AM" },
        { id: 2, user: "Admin", action: "Approved new volunteer: 'Charlie Brown'", timestamp: "2024-07-21 09:30 AM" },
        { id: 3, user: "Bob Williams", action: "Submitted field report for 'Site A'", timestamp: "2024-07-20 05:00 PM" },
    ];

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.2,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    const stats = {
        totalUsers: users.length,
        pendingApprovals: users.filter(u => u.status === 'Pending').length,
        activeUsers: users.filter(u => u.status === 'Active').length,
    };

    const handlePostAnnouncement = () => {
        if (!announcement) {
            showToast('Please enter an announcement to post.', 'warning');
            return;
        }
        showToast('Announcement posted successfully!', 'success');
        setAnnouncement('');
    };

    return (
        <section
            className="py-16 px-4 bg-white w-full relative min-h-screen flex items-start"
            ref={dashboardRef}
        >
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
            <main className="max-w-7xl mx-auto w-full z-10">
                <article className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                        <VerticalCutReveal
                            splitBy="words"
                            staggerDuration={0.15}
                            staggerFrom="first"
                            reverse={true}
                            containerClassName="justify-center"
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 40,
                                delay: 0,
                            }}
                        >
                            NGO Admin Dashboard
                        </VerticalCutReveal>
                    </h1>
                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={dashboardRef as React.RefObject<HTMLElement>}
                        customVariants={revealVariants}
                        className="text-gray-600 text-lg"
                    >
                        Manage administrative tasks and user access for the NGO.
                    </TimelineContent>
                </article>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Admin Overview</CardTitle>
                                    <CardDescription>Key metrics for administrative oversight.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                        <Users className="h-6 w-6 text-gray-500 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                                        <UserPlus className="h-6 w-6 text-yellow-500 mb-2" />
                                        <p className="text-sm font-medium text-yellow-600">Pending Approvals</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                                        <Users className="h-6 w-6 text-green-500 mb-2" />
                                        <p className="text-sm font-medium text-green-600">Active Users</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TimelineContent>

                        <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">User Management</CardTitle>
                                    <CardDescription>Manage user roles and access.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.name}</TableCell>
                                                    <TableCell>{user.role}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={user.status === 'Active' ? 'default' : user.status === 'Pending' ? 'outline' : 'destructive'}>{user.status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">Edit</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TimelineContent>

                        <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Audit Log</CardTitle>
                                    <CardDescription>Recent system activities.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Action</TableHead>
                                                <TableHead>Timestamp</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {auditLogs.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell>{log.user}</TableCell>
                                                    <TableCell>{log.action}</TableCell>
                                                    <TableCell>{log.timestamp}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TimelineContent>
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">System Settings</CardTitle>
                                    <CardDescription>Manage system-wide settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button className="w-full justify-start gap-2">
                                        <UserPlus className="h-5 w-5" />
                                        <span>Invite New User</span>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Shield className="h-5 w-5" />
                                        <span>Manage Roles & Permissions</span>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Settings className="h-5 w-5" />
                                        <span>General Settings</span>
                                    </Button>
                                </CardContent>
                            </Card>
                        </TimelineContent>
                        <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Post Announcement</CardTitle>
                                    <CardDescription>Create a system-wide announcement.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <textarea
                                        value={announcement}
                                        onChange={(e) => setAnnouncement(e.target.value)}
                                        placeholder="Type your announcement here..."
                                        className="w-full p-2 border-gray-300 rounded-md shadow-sm"
                                    />
                                    <Button onClick={handlePostAnnouncement} className="w-full">
                                        <Megaphone className="mr-2 h-4 w-4" />
                                        Post Announcement
                                    </Button>
                                </CardContent>
                            </Card>
                        </TimelineContent>
                    </div>
                </div>
            </main>
        </section>
    );
}
