import { useState, useRef, useEffect } from 'react';
import { DollarSign, Users, Briefcase, TrendingUp, Eye, ListChecks } from 'lucide-react';
import { useToast } from '../common/Toast';
import { icpCanisterService } from '../../services/icpCanisterService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function NgoProgramManagerDashboard() {
    const { showToast } = useToast();
    const dashboardRef = useRef<HTMLDivElement>(null);

    const programs = [
        { id: 1, name: "Health Camp - Region A", status: "Active", budget: 50000, spent: 25000, volunteers: 25, tasks: 40 },
        { id: 2, name: "Education Drive - City B", status: "Active", budget: 75000, spent: 30000, volunteers: 40, tasks: 60 },
        { id: 3, name: "Food Bank - Downtown", status: "Planning", budget: 40000, spent: 0, volunteers: 15, tasks: 20 },
        { id: 4, name: "Winter Shelter", status: "Completed", budget: 60000, spent: 60000, volunteers: 50, tasks: 80 },
    ];

    const tasks = [
        { id: 1, description: "Finalize venue for Health Camp", program: "Health Camp - Region A", priority: "High", status: "Pending" },
        { id: 2, description: "Recruit 10 more volunteers", program: "Education Drive - City B", priority: "Medium", status: "In Progress" },
        { id: 3, description: "Order food supplies", program: "Food Bank - Downtown", priority: "High", status: "Pending" },
        { id: 4, description: "Submit final report for Winter Shelter", program: "Winter Shelter", priority: "Low", status: "Completed" },
    ];

    const programVolunteers = [
        { id: 1, name: "John Smith", program: "Health Camp - Region A", status: "Active" },
        { id: 2, name: "Emily Jones", program: "Education Drive - City B", status: "Active" },
        { id: 3, name: "Michael Johnson", program: "Health Camp - Region A", status: "Active" },
        { id: 4, name: "Sarah Davis", program: "Food Bank - Downtown", status: "Pending Assignment" },
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

    const totalBudget = programs.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = programs.reduce((sum, p) => sum + p.spent, 0);
    const activeVolunteers = programs.filter(p => p.status === 'Active').reduce((sum, p) => sum + p.volunteers, 0);

    const stats = {
        totalBudget: `$${(totalBudget / 1000).toFixed(1)}K`,
        totalSpent: `$${(totalSpent / 1000).toFixed(1)}K`,
        programsManaged: programs.length,
        activeVolunteers: activeVolunteers,
        pendingTasks: tasks.filter(t => t.status === 'Pending').length,
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
                            Program Manager Dashboard
                        </VerticalCutReveal>
                    </h1>
                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={dashboardRef as React.RefObject<HTMLElement>}
                        customVariants={revealVariants}
                        className="text-gray-600 text-lg"
                    >
                        Manage your programs, budgets, and resources effectively.
                    </TimelineContent>
                </article>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Program Overview</CardTitle>
                                    <CardDescription>Key metrics for your managed programs.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                        <DollarSign className="h-6 w-6 text-gray-500 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Total Program Budgets</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalBudget}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-gray-500 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Total Spending</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalSpent}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                                        <ListChecks className="h-6 w-6 text-yellow-500 mb-2" />
                                        <p className="text-sm font-medium text-yellow-600">Pending Tasks</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                                        <Users className="h-6 w-6 text-green-500 mb-2" />
                                        <p className="text-sm font-medium text-green-600">Active Volunteers</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.activeVolunteers}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TimelineContent>

                        <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Program Details</CardTitle>
                                    <CardDescription>Detailed view of your managed programs.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Program</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Budget</TableHead>
                                                <TableHead>Spent</TableHead>
                                                <TableHead>Volunteers</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {programs.map((program) => (
                                                <TableRow key={program.id}>
                                                    <TableCell className="font-medium">{program.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={program.status === 'Active' ? 'default' : program.status === 'Completed' ? 'secondary' : 'outline'}>
                                                            {program.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>${program.budget.toLocaleString()}</TableCell>
                                                    <TableCell>${program.spent.toLocaleString()}</TableCell>
                                                    <TableCell>{program.volunteers}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="mr-1 h-4 w-4" /> View Details
                                                        </Button>
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
                                    <CardTitle className="text-xl font-bold">Program Tasks</CardTitle>
                                    <CardDescription>Action items across all your programs.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Task</TableHead>
                                                <TableHead>Program</TableHead>
                                                <TableHead>Priority</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tasks.map((task) => (
                                                <TableRow key={task.id}>
                                                    <TableCell className="font-medium">{task.description}</TableCell>
                                                    <TableCell>{task.program}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={task.priority === 'High' ? 'destructive' : 'outline'}>{task.priority}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={task.status === 'Completed' ? 'secondary' : 'default'}>{task.status}</Badge>
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
                                    <CardTitle className="text-xl font-bold">Volunteer Roster</CardTitle>
                                    <CardDescription>Volunteers assigned to your programs.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {programVolunteers.map(v => (
                                            <li key={v.id} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold">{v.name}</p>
                                                    <p className="text-sm text-gray-500">{v.program}</p>
                                                </div>
                                                <Badge variant={v.status === 'Active' ? 'default' : 'outline'}>{v.status}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </TimelineContent>
                    </div>
                </div>
            </main>
        </section>
    );
}
