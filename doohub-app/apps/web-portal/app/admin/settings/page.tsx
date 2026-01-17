"use client";

import { useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/ui/toaster";
import { User, Bell, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    phone: user?.phone || "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        avatar: user?.profile?.avatar,
      } as any);
      toast({ title: "Success", description: "Profile saved" });
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.error || "Failed to save profile", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortalLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {user?.profile?.firstName?.charAt(0) || "A"}
                    </span>
                  </div>
                  <Button variant="outline">Change Photo</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} disabled />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { id: "new_vendors", label: "New Vendors", description: "Get notified when vendors sign up" },
                  { id: "reports", label: "Reports", description: "Get notified about new reports" },
                  { id: "orders", label: "Orders", description: "Get notified about order updates" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Push</span>
                      </label>
                    </div>
                  </div>
                ))}
                <Button onClick={() => toast({ title: "Saved", description: "Preferences saved" })}>
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                <div className="space-y-2 pt-4 border-t">
                  <Label>Active Sessions</Label>
                  <p className="text-sm text-gray-500">Manage devices where you&apos;re logged in</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Device</p>
                        <p className="text-sm text-gray-500">Chrome on macOS</p>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Active Now</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
