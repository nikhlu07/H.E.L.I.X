import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import { Input } from '../ui/input.tsx';
import { Label } from '../ui/label.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Copy, Check, User, Shield, Bell, Settings as SettingsIcon, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.tsx';
import { Switch } from '../ui/switch.tsx';
import { toast } from 'sonner';

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
            <Button onClick={() => navigate('/login')} className="mt-6 cta-gradient font-semibold">
              Go to Login
            </Button>
        </main>
      </>
    );
  }

  // Mock data for stats, as it's not in the auth user object
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
      <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background: #F7FAFC;
        }
        .card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            transition: all 0.3s ease;
            border-radius: 0.75rem;
        }
        .card:hover {
            border-color: #FBBF24; /* yellow-400 */
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.1), 0 8px 10px -6px rgba(251, 191, 36, 0.1);
        }
        .cta-gradient {
            background: linear-gradient(90deg, #FBBF24, #F59E0B); /* yellow-400 to yellow-500 */
            color: black;
            transition: opacity 0.3s ease;
        }
        .cta-gradient:hover {
            opacity: 0.9;
        }
        ::selection {
            background-color: #FBBF24; /* yellow-400 */
            color: white;
        }
        .profile-tab-trigger[data-state=active] {
            background-color: #FBBF24; /* yellow-400 */
            color: black;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />

        <main className="container mx-auto max-w-7xl px-4 pt-28 pb-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex rounded-full bg-yellow-100 p-4">
                <User className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
              {user.name}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
             {user.title}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <code className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700">
                {user.principal_id}
              </code>
              <Button variant="ghost" size="sm" onClick={copyAddress} className="text-gray-600 hover:text-yellow-600">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-4">
                <div className="font-semibold text-yellow-600">{user.role.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
                <User className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalProducts}</div>
                <p className="text-xs text-gray-500">Managed by you</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Transfers</CardTitle>
                <User className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalTransfers}</div>
                <p className="text-xs text-gray-500">Across all projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg. Completion</CardTitle>
                <User className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.avgDeliveryTime} days</div>
                <p className="text-xs text-gray-500">For your projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Trust Score</CardTitle>
                <Shield className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.trustScore}/100</div>
                <p className="text-xs text-gray-500">Based on network activity</p>
              </CardContent>
            </Card>
          </div>

          {/* Settings Tabs */}
          <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Settings</CardTitle>
                <CardDescription className="text-gray-600">Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="personal" className="profile-tab-trigger">
                            <User className="mr-2 h-4 w-4" />
                            Personal
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="profile-tab-trigger">
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="security" className="profile-tab-trigger">
                            <Shield className="mr-2 h-4 w-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="profile-tab-trigger">
                            <SettingsIcon className="mr-2 h-4 w-4" />
                            Integrations
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information */}
                    <TabsContent value="personal">
                        <div className="space-y-4 mt-6">
                            <div>
                                <Label htmlFor="org-name" className="text-gray-700">Display Name</Label>
                                <Input id="org-name" defaultValue={user.name} className="mt-1"/>
                            </div>
                            <div>
                                <Label htmlFor="title" className="text-gray-700">Title</Label>
                                <Input id="title" defaultValue={user.title} className="mt-1"/>
                            </div>
                            <div>
                                <Label htmlFor="wallet" className="text-gray-700">Principal ID (Read-only)</Label>
                                <Input id="wallet" value={user.principal_id} readOnly className="mt-1 bg-gray-100"/>
                            </div>
                            <Button className="w-full sm:w-auto cta-gradient font-semibold">
                                <Edit className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Notifications */}
                    <TabsContent value="notifications">
                        <div className="space-y-6 mt-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <div className="font-medium text-gray-900">Email Notifications</div>
                                    <div className="text-sm text-gray-600">Receive updates via email</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <div className="font-medium text-gray-900">SMS Alerts</div>
                                    <div className="text-sm text-gray-600">Get critical alerts via SMS</div>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <div className="font-medium text-gray-900">Browser Notifications</div>
                                    <div className="text-sm text-gray-600">Real-time browser alerts</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Button className="w-full sm:w-auto cta-gradient font-semibold">
                                Save Preferences
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Security */}
                    <TabsContent value="security">
                        <div className="space-y-6 mt-6">
                            <div>
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div>
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <Button className="cta-gradient font-semibold">Change Password</Button>

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
                            <div className="rounded-lg border p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">IoT Temperature Sensors</div>
                                    <div className="text-sm text-gray-600">Connect temperature monitoring devices</div>
                                </div>
                                <Button variant="outline">Configure</Button>
                            </div>
                            <div className="rounded-lg border p-4 flex items-center justify-between">
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
        </main>

      </div>
    </>
  );
};

export default Profile;
