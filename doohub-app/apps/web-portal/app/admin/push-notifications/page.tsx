"use client";

import { useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Bell,
  Send,
  Clock,
  CheckCircle,
  Users,
  Smartphone,
  Plus,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  audience: string;
  audienceCount: number;
  status: "sent" | "scheduled" | "draft";
  sentAt?: string;
  scheduledFor?: string;
  delivered: number;
  opened: number;
  clicked: number;
  link?: string;
}

export default function PushNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Mock notification history
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Year Special Offers!",
      message: "Celebrate 2026 with exclusive deals on all services. Up to 50% off!",
      audience: "All Customers",
      audienceCount: 12450,
      status: "sent",
      sentAt: "2026-01-07T10:00:00",
      delivered: 11980,
      opened: 8456,
      clicked: 3245,
      link: "/offers",
    },
    {
      id: "2",
      title: "Your order is on the way",
      message: "Your order #CLN-12345 will arrive in 30 minutes",
      audience: "All Customers",
      audienceCount: 12450,
      status: "sent",
      sentAt: "2026-01-07T09:30:00",
      delivered: 234,
      opened: 198,
      clicked: 156,
    },
    {
      id: "3",
      title: "Rate your recent experience",
      message: "How was your service with CleanCo? Leave a review and help others!",
      audience: "All Customers",
      audienceCount: 12450,
      status: "sent",
      sentAt: "2026-01-06T18:00:00",
      delivered: 550,
      opened: 412,
      clicked: 189,
      link: "/reviews",
    },
    {
      id: "4",
      title: "Weekend Flash Sale!",
      message: "Limited time offer on beauty services. Book now!",
      audience: "All Customers",
      audienceCount: 12450,
      status: "sent",
      sentAt: "2026-01-06T08:00:00",
      delivered: 3398,
      opened: 2145,
      clicked: 876,
      link: "/beauty",
    },
    {
      id: "5",
      title: "New vendors in your area",
      message: "Discover 5 new service providers near you",
      audience: "All Customers",
      audienceCount: 12450,
      status: "sent",
      sentAt: "2026-01-05T14:00:00",
      delivered: 8765,
      opened: 5234,
      clicked: 2134,
    },
  ]);

  const handleSend = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setTitle("");
      setMessage("");
      setShowSuccessModal(false);
      setActiveTab("history");
    }, 2000);
  };

  const getAudienceCount = () => 12450;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <PortalLayout title="Push Notifications" subtitle="Send targeted notifications to your customers">
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "compose" | "history")}>
        <TabsList className="w-full justify-start bg-white border border-gray-200 rounded-t-2xl h-[52px] p-0 mb-0">
          <TabsTrigger
            value="compose"
            className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-white"
          >
            <Clock className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="m-0">
          <Card className="border-t-0 rounded-t-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">
                      Notification Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter notification title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={50}
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {title.length}/50 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={150}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {message.length}/150 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="audience" className="text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </Label>
                    <div className="h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>All Customers ({getAudienceCount().toLocaleString()})</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSend}
                      disabled={!title || !message}
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Notification
                    </Button>
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Users className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          Estimated Reach
                        </h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {getAudienceCount().toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">customers</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          Best Practices
                        </h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>Keep titles under 40 characters</li>
                          <li>Messages should be clear and actionable</li>
                          <li>Test with preview before sending</li>
                          <li>Avoid sending too frequently</li>
                          <li>Include relevant links when applicable</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          Delivery Info
                        </h3>
                        <p className="text-xs text-gray-600">
                          Notifications are delivered instantly to all devices where customers have enabled push notifications.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="m-0">
          <Card className="border-t-0 rounded-t-none">
            {/* Notifications List */}
            <div className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {notif.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {notif.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{notif.audience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(notif.sentAt!)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No notifications found</p>
                </CardContent>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Notification Sent!
            </h3>
            <p className="text-sm text-gray-500">
              Your notification has been successfully sent to {getAudienceCount().toLocaleString()} customers
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
