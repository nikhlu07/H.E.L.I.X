import { useRef, useState } from 'react';
import { Users, Calendar, Heart, UserPlus, Award, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useToast } from '../common/Toast';

export function NgoVolunteerCoordinatorDashboard() {
    const dashboardRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const [broadcastMessage, setBroadcastMessage] = useState('');

    const upcomingEvents = [
        { id: 1, name: "Charity Run", date: "2024-08-15", required: 50, assigned: 35 },
        { id: 2, name: "Beach Cleanup", date: "2024-08-22", required: 30, assigned: 28 },
        { id: 3, name: "Fundraising Gala", date: "2024-09-05", required: 20, assigned: 10 },
    ];

    const topVolunteers = [
        { id: 1, name: "Alice Johnson", hours: 120 },
        { id: 2, name: "Bob Williams", hours: 115 },
        { id: 3, name: "Charlie Brown", hours: 105 },
    ];

    const newApplicants = [
        { id: 1, name: "Eve Davis", skills: "First Aid, Driving" },
        { id: 2, name: "Frank Miller", skills: "Event Planning" },
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
        totalVolunteers: 150,
        activeEvents: upcomingEvents.length,
        hoursContributed: 2400,
        newApplicants: newApplicants.length,
    };

    const handleSendBroadcast = () => {
        if (!broadcastMessage) {
            showToast('Please enter a message to send.', 'warning');
            return;
        }
        showToast('Broadcast message sent to all volunteers!', 'success');
        setBroadcastMessage('');
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
                            Volunteer Coordinator Dashboard
                        </VerticalCutReveal>
                    </h1>
                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={dashboardRef as React.RefObject<HTMLElement>}
                        customVariants={revealVariants}
                        className="text-gray-600 text-lg"
                    >
                        Manage and track volunteer activities and engagement.
                    </TimelineContent>
                </article>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Volunteer Stats</CardTitle>
                                    <CardDescription>Key metrics for volunteer engagement.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                        <Users className="h-6 w-6 text-gray-500 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                                        <UserPlus className="h-6 w-6 text-blue-500 mb-2" />
                                        <p className="text-sm font-medium text-blue-600">New Applicants</p>
                                        <p className="text-2xl font-bold text-blue-600">{stats.newApplicants}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                        <Calendar className="h-6 w-6 text-gray-500 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Active Events</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                                        <Heart className="h-6 w-6 text-green-500 mb-2" />
                                        <p className="text-sm font-medium text-green-600">Hours Contributed</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.hoursContributed}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TimelineContent>

                        <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">New Applicants</CardTitle>
                                    <CardDescription>Review and approve new volunteer applications.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Skills</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {newApplicants.map((applicant) => (
                                                <TableRow key={applicant.id}>
                                                    <TableCell className="font-medium">{applicant.name}</TableCell>
                                                    <TableCell>{applicant.skills}</TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">Approve</Button>
                                                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
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
                                    <CardTitle className="text-xl font-bold">Upcoming Events</CardTitle>
                                    <CardDescription>Manage volunteer needs for upcoming events.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Event</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Required</TableHead>
                                                <TableHead>Assigned</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {upcomingEvents.map((event) => (
                                                <TableRow key={event.id}>
                                                    <TableCell className="font-medium">{event.name}</TableCell>
                                                    <TableCell>{event.date}</TableCell>
                                                    <TableCell>{event.required}</TableCell>
                                                    <TableCell>{event.assigned}</TableCell>
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
                                    <CardTitle className="text-xl font-bold">Broadcast Message</CardTitle>
                                    <CardDescription>Send a message to all volunteers.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <textarea
                                        value={broadcastMessage}
                                        onChange={(e) => setBroadcastMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="w-full p-2 border-gray-300 rounded-md shadow-sm"
                                    />
                                    <Button onClick={handleSendBroadcast} className="w-full">
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Broadcast
                                    </Button>
                                </CardContent>
                            </Card>
                        </TimelineContent>
                        <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Top Volunteers</CardTitle>
                                    <CardDescription>Recognize your most dedicated volunteers.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {topVolunteers.map(volunteer => (
                                            <li key={volunteer.id} className="flex items-center">
                                                <div className="p-2 bg-yellow-100 rounded-full mr-4">
                                                    <Award className="h-5 w-5 text-yellow-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{volunteer.name}</p>
                                                    <p className="text-sm text-gray-500">{volunteer.hours} hours contributed</p>
                                                </div>
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
