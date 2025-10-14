import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import { Input } from '../ui/input.tsx';
import { Label } from '../ui/label.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Copy, Check, User, Shield, Bell, Settings as SettingsIcon, Edit, BarChart3, Clock, Zap } from 'lucide-react'; // Added BarChart3, Clock, Zap
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.tsx';
import { Switch } from '../ui/switch.tsx';
import { Toaster, toast } from 'sonner';

const Profile = () => {
  const { user, loading } = useAuth();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-7xl px-4 pt-28 pb-8 text-center">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </main>
        </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto max-w-7xl px-4 pt-28 pb-8 text-center">
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
              Authentication Required
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Please log in to view your profile.
            </p>
            <Button onClick={() => navigate('/login')} className="mt-6 bg-black text-white hover:bg-gray-800 font-semibold">
              Go to Login
            </Button>
        </main>
      </>
    );
  }

  // Mock data for stats
  const stats = {
    totalProducts: 12,
    totalTransfers: 45,
    avgDeliveryTime: 3,
    trustScore: 88,
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(user.principal_id);
    setCopied(true);
    toast.success('Principal ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Toaster />
      <Header />
      <section className="py-16 px-4 bg-white w-full relative min-h-screen flex items-start">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
          <main className="max-w-7xl mx-auto w-full z-10 mt-12">
              {/* Header */}
              <article className="text-center mb-12">
                  <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                      {user.name}
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                     {user.title}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <code className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700">
                      {user.principal_id}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyAddress} className="text-gray-600 hover:text-black">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                   <div className="mt-2 flex items-center justify-center gap-4">
                      <div className="font-semibold text-black">{user.role.replace('_', ' ')}</div>
                  </div>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column: Settings */}
                  <div className="lg:col-span-2 space-y-8">
                      <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Settings</CardTitle>
                            <CardDescription className="text-gray-600">Manage your account and preferences</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="personal" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="personal">
                                        <User className="mr-2 h-4 w-4" />
                                        Personal
                                    </TabsTrigger>
                                    <TabsTrigger value="notifications">
                                        <Bell className="mr-2 h-4 w-4" />
                                        Notifications
                                    </TabsTrigger>
                                    <TabsTrigger value="security">
                                        <Shield className="mr-2 h-4 w-4" />
                                        Security
                                    </TabsTrigger>
                                    <TabsTrigger value="integrations">
                                        <SettingsIcon className="mr-2 h-4 w-4" />
                                        Integrations
                                    </TabsTrigger>
                                </TabsList>

                                {/* Personal Information */}
                                <TabsContent value="personal">
                                    <div className="space-y-4 mt-6">
                                        <div>
                                            <Label htmlFor="org-name" className="text-gray-700 font-medium">Display Name</Label>
                                            <Input id="org-name" defaultValue={user.name} className="mt-1 bg-white"/>
                                        </div>
                                        <div>
                                            <Label htmlFor="title" className="text-gray-700 font-medium">Title</Label>
                                            <Input id="title" defaultValue={user.title} className="mt-1 bg-white"/>
                                        </div>
                                        <div>
                                            <Label htmlFor="wallet" className="text-gray-700 font-medium">Principal ID (Read-only)</Label>
                                            <Input id="wallet" value={user.principal_id} readOnly className="mt-1 bg-gray-100"/>
                                        </div>
                                        <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 font-semibold">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Notifications */}
                                <TabsContent value="notifications">
                                    <div className="space-y-6 mt-6">
                                        <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
                                            <div>
                                                <div className="font-medium text-gray-900">Email Notifications</div>
                                                <div className="text-sm text-gray-600">Receive updates via email</div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
                                            <div>
                                                <div className="font-medium text-gray-900">SMS Alerts</div>
                                                <div className="text-sm text-gray-600">Get critical alerts via SMS</div>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
                                            <div>
                                                <div className="font-medium text-gray-900">Browser Notifications</div>
                                                <div className="text-sm text-gray-600">Real-time browser alerts</div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 font-semibold">
                                            Save Preferences
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Security */}
                                <TabsContent value="security">
                                    <div className="space-y-6 mt-6">
                                        <div>
                                            <Label htmlFor="current-password"  className="font-medium">Current Password</Label>
                                            <Input id="current-password" type="password" className="bg-white" />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-password"  className="font-medium">New Password</Label>
                                            <Input id="new-password" type="password" className="bg-white" />
                                        </div>
                                        <Button className="bg-black text-white hover:bg-gray-800 font-semibold">Change Password</Button>

                                        <div className="border-t pt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">Two-Factor Authentication</div>
                                                    <div className="text-sm text-gray-600">Add an extra layer of security</div>
                                                </div>
                                                <Switch />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Integrations */}
                                <TabsContent value="integrations">
                                    <div className="space-y-4 mt-6">
                                        <div className="rounded-lg border p-4 flex items-center justify-between bg-white">
                                            <div>
                                                <div className="font-medium">IoT Temperature Sensors</div>
                                                <div className="text-sm text-gray-600">Connect temperature monitoring devices</div>
                                            </div>
                                            <Button variant="outline">Configure</Button>
                                        </div>
                                        <div className="rounded-lg border p-4 flex items-center justify-between bg-white">
                                            <div>
                                                <div className="font-medium">API Access</div>
                                                <div className="text-sm text-gray-600">Generate API keys for custom integrations</div>
                                            </div>
                                            <Button variant="outline">Manage Keys</Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                      </Card>
                  </div>

                  {/* Right Column: Stats */}
                  <div className="space-y-8">
                      <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                              <CardTitle className="text-xl font-bold">Statistics</CardTitle>
                              <CardDescription>Your activity overview.</CardDescription>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                  <BarChart3 className="h-6 w-6 text-gray-500 mb-2" />
                                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                              </div>
                              <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                  <Zap className="h-6 w-6 text-gray-500 mb-2" />
                                  <p className="text-sm font-medium text-gray-600">Total Transfers</p>
                                  <p className="text-2xl font-bold text-gray-900">{stats.totalTransfers}</p>
                              </div>
                              <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                  <Clock className="h-6 w-6 text-gray-500 mb-2" />
                                  <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                                  <p className="text-2xl font-bold text-gray-900">{stats.avgDeliveryTime}d</p>
                              </div>
                              <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                                  <Shield className="h-6 w-6 text-green-500 mb-2" />
                                  <p className="text-sm font-medium text-green-600">Trust Score</p>
                                  <p className="text-2xl font-bold text-green-600">{stats.trustScore}</p>
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              </div>
          </main>
      </section>
    </>
  );
};

export default Profile;
