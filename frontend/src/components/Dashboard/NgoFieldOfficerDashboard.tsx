import { useRef, useState } from 'react';
import { MapPin, CheckSquare, Users, List, Map, FilePlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { useToast } from '../common/Toast';

export function NgoFieldOfficerDashboard() {
    const dashboardRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [reportNotes, setReportNotes] = useState('');

    const tasks = [
        { id: 1, description: "Deliver supplies to Site A", status: "Completed", priority: "High" },
        { id: 2, description: "Conduct survey at Site B", status: "Pending", priority: "High" },
        { id: 3, description: "Assess needs at new location", status: "Pending", priority: "Medium" },
        { id: 4, description: "Follow-up with community leaders", status: "Completed", priority: "Low" },
    ];

    const sites = [
        { id: 'A', name: 'Community Center A', contact: 'Mr. John Doe', phone: '123-456-7890' },
        { id: 'B', name: 'Local School B', contact: 'Ms. Jane Smith', phone: '098-765-4321' },
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
        sitesVisited: 27,
        tasksCompleted: tasks.filter(t => t.status === 'Completed').length,
        pendingTasks: tasks.filter(t => t.status === 'Pending').length,
        peopleAssisted: 345,
    };

    const handleOpenReportDialog = (task: any) => {
        setSelectedTask(task);
        setReportNotes('');
    };

    const handleCloseReportDialog = () => {
        setSelectedTask(null);
        setReportNotes('');
    };

    const handleSubmitReport = () => {
        if (!reportNotes) {
            showToast('Please enter some notes for the report.', 'warning');
            return;
        }
        showToast(`Report for task "${selectedTask.description}" submitted.`, 'success');
        handleCloseReportDialog();
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
                            Field Officer Dashboard
                        </VerticalCutReveal>
                    </h1>
                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={dashboardRef as React.RefObject<HTMLElement>}
                        customVariants={revealVariants}
                        className="text-gray-600 text-lg"
                    >
                        Track your on-the-ground activities and impact.
                    </TimelineContent>
                </article>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Field Report</CardTitle>
                                    <CardDescription>Your key performance indicators in the field.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                        <MapPin className="h-6 w-6 text-gray-500 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Sites Visited</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.sitesVisited}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                                        <CheckSquare className="h-6 w-6 text-green-500 mb-2" />
                                        <p className="text-sm font-medium text-green-600">Tasks Completed</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.tasksCompleted}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                                        <List className="h-6 w-6 text-yellow-500 mb-2" />
                                        <p className="text-sm font-medium text-yellow-600">Pending Tasks</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-500 mb-2" />
                                        <p className="text-sm font-medium text-blue-600">People Assisted</p>
                                        <p className="text-2xl font-bold text-blue-600">{stats.peopleAssisted}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TimelineContent>

                        <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Today's Tasks</CardTitle>
                                    <CardDescription>Your assigned tasks for the day.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Task</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Priority</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tasks.map((task) => (
                                                <TableRow key={task.id}>
                                                    <TableCell className="font-medium">{task.description}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={task.status === 'Completed' ? 'secondary' : 'default'}>{task.status}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={task.priority === 'High' ? 'destructive' : 'outline'}>{task.priority}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleOpenReportDialog(task)}>
                                                            <FilePlus className="mr-1 h-4 w-4" /> Report
                                                        </Button>
                                                    </TableCell>
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
                                    <CardTitle className="text-xl font-bold">Site Locations</CardTitle>
                                    <CardDescription>Map of your assigned sites.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                                        <img src="https://www.google.com/maps/d/u/0/thumbnail?mid=1_0-R_3-Q1gZgG3-cK8r_a_g8X_s&hl=en" alt="Map of sites" className="w-full h-full object-cover" />
                                        <div className="absolute top-10 left-10 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                                        <div className="absolute top-20 right-16 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                                        <div className="absolute bottom-12 left-24 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TimelineContent>
                        <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Site Details</CardTitle>
                                    <CardDescription>Contact info for your sites.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {sites.map(site => (
                                        <div key={site.id} className="p-3 bg-gray-50 rounded-lg border">
                                            <p className="font-semibold">{site.name}</p>
                                            <p className="text-sm text-gray-600">Contact: {site.contact}</p>
                                            <p className="text-sm text-gray-600">Phone: {site.phone}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TimelineContent>
                    </div>
                </div>
                {selectedTask && (
                    <Dialog open={!!selectedTask} onOpenChange={handleCloseReportDialog}>
                        <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                                <DialogTitle>Report on Task</DialogTitle>
                                <DialogDescription>{selectedTask.description}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div>
                                    <label htmlFor="report-notes" className="text-sm font-medium">Notes</label>
                                    <textarea
                                        id="report-notes"
                                        value={reportNotes}
                                        onChange={(e) => setReportNotes(e.target.value)}
                                        placeholder="Add your notes, observations, or issues..."
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Update Status</label>
                                    <div className="flex gap-2 mt-1">
                                        <Button variant="outline" onClick={() => showToast('Status updated to In Progress', 'info')}>In Progress</Button>
                                        <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => showToast('Status updated to Completed', 'success')}>Completed</Button>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={handleCloseReportDialog}>Cancel</Button>
                                <Button onClick={handleSubmitReport}>Submit Report</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </main>
        </section>
    );
}
