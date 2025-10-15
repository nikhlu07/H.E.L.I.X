import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, AlertTriangle, Mail, Phone, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

function DeputyProfileHeader({ deputyName }) {
  useEffect(() => {
    const header = document.getElementById('deputy-profile-header');
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header?.classList.add('bg-white/80', 'backdrop-blur-sm', 'border-b', 'border-neutral-200', 'shadow-lg');
      } else {
        header?.classList.remove('bg-white/80', 'backdrop-blur-sm', 'border-b', 'border-neutral-200', 'shadow-lg');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header id="deputy-profile-header" className="fixed top-0 left-0 w-full z-50 transition-all bg-white duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard/state-head" className="flex items-center">
              <img src="/logo.svg" alt="Helix Logo" className="h-8 w-auto" />
              <span className="ml-3 text-2xl font-bold tracking-tighter text-gray-900">Helix</span>
            </Link>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-800">Deputy Profile</span>
            <Button variant="outline" onClick={() => window.history.back()} className="ml-4 bg-white border-2 border-primary">Back to Dashboard</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function DeputyProfile() {
  const [selectedDeputyData, setSelectedDeputyData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('selectedDeputy');
    if (data) {
      setSelectedDeputyData(JSON.parse(data));
    }
  }, []);

  // Mock data for regional alerts, as it's not in selectedDeputyData
  const regionalAlerts = [
    { id: 'alert-001', type: 'corruption', description: 'Unusual vendor pattern in Mumbai Central', severity: 'high', deputy: 'Rajesh Kumar' },
    { id: 'alert-002', type: 'budget', description: 'Budget utilization above 90% in Pune East', severity: 'medium', deputy: 'Priya Sharma' },
    { id: 'alert-003', type: 'timeline', description: 'Project delays reported in Nagpur North', severity: 'low', deputy: 'Amit Patel' }
  ];

  const copyAddress = () => {
    if (selectedDeputyData?.id) {
      navigator.clipboard.writeText(selectedDeputyData.id);
      setCopied(true);
      toast.success('Deputy ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!selectedDeputyData) {
    return <div>Loading...</div>; // Or some other loading state
  }

  return (
    <>
      <DeputyProfileHeader deputyName={selectedDeputyData.name} />
      <section className="pt-32 px-4 bg-white w-full relative min-h-screen flex items-start">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
          <main className="max-w-7xl mx-auto w-full z-10">
              <article className="text-center mb-12">
                  <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                      {selectedDeputyData.name}
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      Deputy at {selectedDeputyData.district}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <code className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700">
                      {selectedDeputyData.id}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyAddress} className="text-gray-600 hover:text-black">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-8">
                      <Tabs defaultValue="projects">
                          <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="projects">Managed Projects</TabsTrigger>
                          <TabsTrigger value="performance">Performance History</TabsTrigger>
                          <TabsTrigger value="alerts">Regional Alerts</TabsTrigger>
                          </TabsList>
                          <TabsContent value="projects" className="mt-4">
                          <Card>
                              <CardContent className="p-0">
                              <Table>
                                  <TableHeader>
                                  <TableRow>
                                      <TableHead>Project Name</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead className="text-right">Budget</TableHead>
                                  </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                  {selectedDeputyData.managedProjects && selectedDeputyData.managedProjects.length > 0 ? (
                                      selectedDeputyData.managedProjects.map((project) => (
                                      <TableRow key={project.id}>
                                          <TableCell className="font-medium">{project.name}</TableCell>
                                          <TableCell>
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                              project.status === 'Planning' ? 'bg-gray-100 text-gray-800' :
                                              'bg-red-100 text-red-800'
                                          }`}>
                                              {project.status}
                                          </span>
                                          </TableCell>
                                          <TableCell className="text-right font-mono">₹{project.budget.toLocaleString()}</TableCell>
                                      </TableRow>
                                      ))
                                  ) : (
                                      <TableRow>
                                      <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                                          No managed projects for this deputy.
                                      </TableCell>
                                      </TableRow>
                                  )}
                                  </TableBody>
                              </Table>
                              </CardContent>
                          </Card>
                          </TabsContent>
                          <TabsContent value="performance" className="mt-4">
                          <Card>
                              <CardContent className="p-6 space-y-4">
                              {selectedDeputyData.performanceHistory && selectedDeputyData.performanceHistory.length > 0 ? (
                                  selectedDeputyData.performanceHistory.map((record) => (
                                  <div key={record.month} className="flex justify-between items-center text-sm">
                                      <span className="text-gray-600 font-medium"><TrendingUp className="h-4 w-4 mr-2 inline-block"/>{record.month}</span>
                                      <div className="flex items-center space-x-1">
                                      <span className="font-semibold text-base">{record.score}</span>
                                      <span className="text-yellow-500">★</span>
                                      </div>
                                  </div>
                                  ))
                              ) : (
                                  <p className="text-sm text-gray-500 text-center py-2">No performance history available.</p>
                              )}
                              </CardContent>
                          </Card>
                          </TabsContent>
                          <TabsContent value="alerts" className="mt-4">
                          <Card>
                              <CardContent className="p-6 space-y-3">
                              {regionalAlerts.filter((alert) => alert.deputy === selectedDeputyData.name).length > 0 ? (
                                  regionalAlerts
                                  .filter((alert) => alert.deputy === selectedDeputyData.name)
                                  .map((alert) => (
                                      <div key={alert.id} className="rounded-lg border p-3 flex justify-between items-center bg-red-50/50">
                                      <div>
                                          <p className="font-medium text-gray-800 text-sm">{alert.description}</p>
                                          <p className="text-xs text-gray-600">Severity: 
                                          <span className={`ml-1 font-semibold ${
                                              alert.severity === 'high' ? 'text-red-600' :
                                              alert.severity === 'medium' ? 'text-yellow-600' :
                                              'text-blue-600'
                                          }`}>
                                              {alert.severity}
                                          </span>
                                          </p>
                                      </div>
                                      <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${ 
                                          alert.severity === 'high' ? 'text-red-500' :
                                          'text-yellow-500'
                                      }`} />
                                      </div>
                                  ))
                                  ) : (
                                  <div className="text-sm text-gray-500 text-center py-4 rounded-lg border bg-gray-50/50">No regional alerts for this deputy.</div>
                              )}
                              </CardContent>
                          </Card>
                          </TabsContent>
                      </Tabs>
                  </div>
                  <div className="space-y-8">
                      <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                              <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
                              <CardDescription>Details to get in touch with the deputy.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="flex items-center">
                                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                                  <span className="text-gray-800">{selectedDeputyData.email}</span>
                              </div>
                              <div className="flex items-center">
                                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                                  <span className="text-gray-800">{selectedDeputyData.phone}</span>
                              </div>
                          </CardContent>
                      </Card>
                      <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                              <CardTitle className="text-xl font-bold">Statistics</CardTitle>
                              <CardDescription>Key performance indicators.</CardDescription>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                  <CardTitle className="text-sm font-medium text-gray-600">Performance</CardTitle>
                                  <p className="text-2xl font-bold text-gray-900">{selectedDeputyData.performance} <span className="text-yellow-500">★</span></p>
                              </div>
                              <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                  <CardTitle className="text-sm font-medium text-gray-600">Risk Score</CardTitle>
                                  <p className={`text-2xl font-bold ${
                                      selectedDeputyData.riskScore < 30 ? 'text-green-600' :
                                      selectedDeputyData.riskScore < 50 ? 'text-yellow-600' :
                                      'text-red-600'
                                  }`}>{selectedDeputyData.riskScore}</p>
                              </div>
                              <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                  <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
                                  <p className="text-2xl font-bold text-gray-900">{selectedDeputyData.projects}</p>
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              </div>
          </main>
      </section>
    </>
  );
}
