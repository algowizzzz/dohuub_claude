"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/ui/toaster";
import api, { ENDPOINTS } from "@/lib/api";
import { Check, Building2, User, MapPin, Clock, CreditCard, Rocket } from "lucide-react";

const steps = [
  { id: 1, title: "Business Info", icon: Building2 },
  { id: 2, title: "Profile", icon: User },
  { id: 3, title: "Service Areas", icon: MapPin },
  { id: 4, title: "Availability", icon: Clock },
  { id: 5, title: "Payment", icon: CreditCard },
  { id: 6, title: "Launch", icon: Rocket },
];

const categories = [
  { id: "CLEANING", name: "Cleaning", icon: "🧹" },
  { id: "HANDYMAN", name: "Handyman", icon: "🔧" },
  { id: "BEAUTY", name: "Beauty", icon: "💅" },
  { id: "GROCERIES", name: "Groceries", icon: "🛒" },
  { id: "RENTALS", name: "Rentals", icon: "📦" },
  { id: "CAREGIVING", name: "Caregiving", icon: "❤️" },
];

const timeSlots = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function VendorOnboarding() {
  const router = useRouter();
  const { toast } = useToast();
  const { fetchVendor } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    categories: [] as string[],

    // Step 2: Profile
    firstName: "",
    lastName: "",
    logo: "",

    // Step 3: Service Areas
    serviceAreas: [] as string[],
    newArea: "",

    // Step 4: Availability
    availability: days.reduce((acc, day) => ({
      ...acc,
      [day.toLowerCase()]: { enabled: day !== "Sunday", start: "9:00 AM", end: "5:00 PM" },
    }), {} as Record<string, { enabled: boolean; start: string; end: string }>),

    // Step 5: Payment
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = formData.categories.includes(categoryId)
      ? formData.categories.filter((c) => c !== categoryId)
      : [...formData.categories, categoryId];
    updateFormData({ categories: newCategories });
  };

  const addServiceArea = () => {
    if (formData.newArea.trim() && !formData.serviceAreas.includes(formData.newArea.trim())) {
      updateFormData({
        serviceAreas: [...formData.serviceAreas, formData.newArea.trim()],
        newArea: "",
      });
    }
  };

  const removeServiceArea = (area: string) => {
    updateFormData({ serviceAreas: formData.serviceAreas.filter((a) => a !== area) });
  };

  const toggleDay = (day: string) => {
    const key = day.toLowerCase();
    updateFormData({
      availability: {
        ...formData.availability,
        [key]: { ...formData.availability[key], enabled: !formData.availability[key].enabled },
      },
    });
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.businessName || formData.categories.length === 0) {
        toast({ title: "Required", description: "Please fill in business name and select at least one category", variant: "destructive" });
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName) {
        toast({ title: "Required", description: "Please fill in your name", variant: "destructive" });
        return;
      }
    }
    if (currentStep === 3) {
      if (formData.serviceAreas.length === 0) {
        toast({ title: "Required", description: "Please add at least one service area", variant: "destructive" });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create vendor profile
      await api.post(ENDPOINTS.VENDORS, {
        businessName: formData.businessName,
        description: formData.description,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        categories: formData.categories,
        serviceAreas: formData.serviceAreas,
        availability: formData.availability,
      });

      // Refresh vendor data
      await fetchVendor();

      toast({ title: "Success!", description: "Your business profile has been created", variant: "success" });
      router.replace("/vendor");
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.error || "Failed to create profile", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="Your Business Name"
                value={formData.businessName}
                onChange={(e) => updateFormData({ businessName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Tell customers about your business..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@business.com"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Service Categories *</Label>
              <p className="text-sm text-gray-500">Select all categories that apply to your business</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      formData.categories.includes(cat.id)
                        ? "border-primary bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <p className="font-medium mt-2">{cat.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => updateFormData({ firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => updateFormData({ lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Business Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Drag and drop your logo here, or click to browse</p>
                <Button variant="outline" className="mt-4" type="button">
                  Upload Logo
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Service Areas *</Label>
              <p className="text-sm text-gray-500">Add the areas where you provide services</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter city or ZIP code"
                  value={formData.newArea}
                  onChange={(e) => updateFormData({ newArea: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addServiceArea())}
                />
                <Button type="button" onClick={addServiceArea}>
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary text-sm"
                >
                  <MapPin className="h-3 w-3" />
                  {area}
                  <button
                    type="button"
                    onClick={() => removeServiceArea(area)}
                    className="ml-1 hover:text-error"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {formData.serviceAreas.length === 0 && (
              <p className="text-sm text-gray-400 italic">No service areas added yet</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Business Hours</Label>
              <p className="text-sm text-gray-500">Set your availability for each day</p>
            </div>
            <div className="space-y-3">
              {days.map((day) => {
                const key = day.toLowerCase();
                const dayData = formData.availability[key];
                return (
                  <div key={day} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <label className="flex items-center gap-2 w-32">
                      <input
                        type="checkbox"
                        checked={dayData.enabled}
                        onChange={() => toggleDay(day)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className={dayData.enabled ? "font-medium" : "text-gray-400"}>{day}</span>
                    </label>
                    {dayData.enabled && (
                      <div className="flex items-center gap-2">
                        <select
                          className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                          value={dayData.start}
                          onChange={(e) =>
                            updateFormData({
                              availability: {
                                ...formData.availability,
                                [key]: { ...dayData, start: e.target.value },
                              },
                            })
                          }
                        >
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="text-gray-500">to</span>
                        <select
                          className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                          value={dayData.end}
                          onChange={(e) =>
                            updateFormData({
                              availability: {
                                ...formData.availability,
                                [key]: { ...dayData, end: e.target.value },
                              },
                            })
                          }
                        >
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Payment setup is optional during onboarding. You can add payment details later from Settings.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Bank of America"
                value={formData.bankName}
                onChange={(e) => updateFormData({ bankName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="••••••••1234"
                  value={formData.accountNumber}
                  onChange={(e) => updateFormData({ accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  placeholder="021000021"
                  value={formData.routingNumber}
                  onChange={(e) => updateFormData({ routingNumber: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center py-8">
            <div className="mx-auto h-20 w-20 rounded-full bg-success-50 flex items-center justify-center">
              <Rocket className="h-10 w-10 text-success" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">You&apos;re All Set!</h3>
              <p className="text-gray-500 mt-2">
                Your business profile is ready. Start your 30-day free trial and begin adding listings.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h4 className="font-medium text-gray-900 mb-4">Your Profile Summary</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Business:</strong> {formData.businessName}</p>
                <p><strong>Categories:</strong> {formData.categories.map((c) => categories.find((cat) => cat.id === c)?.name).join(", ")}</p>
                <p><strong>Service Areas:</strong> {formData.serviceAreas.join(", ")}</p>
                <p><strong>Owner:</strong> {formData.firstName} {formData.lastName}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > step.id
                        ? "bg-success text-white"
                        : currentStep === step.id
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs mt-2 ${currentStep >= step.id ? "text-primary font-medium" : "text-gray-400"}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-8 mx-2 ${currentStep > step.id ? "bg-success" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              Step {currentStep} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              {currentStep < 6 ? (
                <Button onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={isSubmitting}>
                  Launch My Business
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

