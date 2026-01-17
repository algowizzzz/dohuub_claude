"use client";

import { useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Building, User, Mail, Phone, MapPin, FileText, Briefcase, Lock } from "lucide-react";
import { useToast } from "@/components/ui/toaster";

export default function VendorProfilePage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "John's Services",
    ownerName: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    businessAddress: "123 Main Street, San Francisco, CA 94102",
    taxId: "12-3456789",
    businessType: "llc",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }, 1000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Password changed successfully",
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <PortalLayout title="Profile" subtitle="Manage your business information and account settings">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Business Information */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Building className="w-6 h-6 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Business Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div>
                <Label htmlFor="businessName" className="mb-1.5">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="John's Services"
                />
              </div>

              {/* Owner Name */}
              <div>
                <Label htmlFor="ownerName" className="mb-1.5">
                  Owner Name
                </Label>
                <Input
                  id="ownerName"
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange("ownerName", e.target.value)}
                  placeholder="John Smith"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-1.5">
                  Email Address
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-500 font-normal">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="pl-10 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Contact support to update your email address
                </p>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="mb-1.5">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Business Address */}
              <div className="md:col-span-2">
                <Label htmlFor="businessAddress" className="mb-1.5">
                  Business Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="businessAddress"
                    type="text"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    placeholder="123 Main Street, City, State, ZIP"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tax ID */}
              <div>
                <Label htmlFor="taxId" className="mb-1.5">
                  Tax ID / EIN
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                    placeholder="12-3456789"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Business Type */}
              <div>
                <Label htmlFor="businessType" className="mb-1.5">
                  Business Type
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleInputChange("businessType", value)}
                  >
                    <SelectTrigger id="businessType" className="pl-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="currentPassword" className="mb-1.5">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="mb-1.5">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="mb-1.5">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                />
              </div>

              <Button variant="outline" size="sm" onClick={handleChangePassword}>
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
