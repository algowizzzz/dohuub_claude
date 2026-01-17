"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";
import api, { ENDPOINTS } from "@/lib/api";
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const categories = [
  { id: "CLEANING", name: "Cleaning", endpoint: ENDPOINTS.SERVICES.CLEANING },
  { id: "HANDYMAN", name: "Handyman", endpoint: ENDPOINTS.SERVICES.HANDYMAN },
  { id: "BEAUTY", name: "Beauty", endpoint: ENDPOINTS.SERVICES.BEAUTY },
  { id: "GROCERIES", name: "Groceries", endpoint: ENDPOINTS.SERVICES.GROCERIES },
  { id: "RENTALS", name: "Rentals", endpoint: ENDPOINTS.SERVICES.RENTALS },
  { id: "CAREGIVING", name: "Caregiving", endpoint: ENDPOINTS.SERVICES.CAREGIVING },
];

export default function NewListingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "60",
    images: [] as string[],
    features: [""],
    includes: [""],
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addArrayItem = (field: "features" | "includes") => {
    updateFormData({ [field]: [...formData[field], ""] });
  };

  const updateArrayItem = (field: "features" | "includes", index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    updateFormData({ [field]: newArray });
  };

  const removeArrayItem = (field: "features" | "includes", index: number) => {
    updateFormData({ [field]: formData[field].filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast({ title: "Error", description: "Please select a category", variant: "destructive" });
      return;
    }

    if (!formData.title || !formData.price) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const category = categories.find((c) => c.id === selectedCategory);
      if (!category) throw new Error("Invalid category");

      const price = parseFloat(formData.price);
      const duration = parseInt(formData.duration);
      const extras = [...formData.features, ...formData.includes].filter((x) => x.trim());

      // The backend has category-specific listing schemas. Keep this form simple by mapping
      // the generic fields into required backend fields with safe defaults.
      let payload: any = {
        title: formData.title,
        description: formData.description,
        images: [],
      };

      switch (category.id) {
        case "CLEANING":
          payload = {
            title: formData.title,
            description: formData.description,
            cleaningType: "DEEP_CLEANING",
            basePrice: price,
            duration,
            images: [],
          };
          break;
        case "HANDYMAN":
          payload = {
            title: formData.title,
            description: formData.description,
            handymanType: "GENERAL_REPAIR",
            basePrice: price,
            hourlyRate: price,
            services: extras,
            images: [],
          };
          break;
        case "BEAUTY":
          payload = {
            title: formData.title,
            description: formData.description,
            beautyType: "WELLNESS",
            basePrice: price,
            duration,
            services: extras,
            images: [],
          };
          break;
        case "GROCERIES":
          payload = {
            name: formData.title,
            description: formData.description,
            category: "General",
            price,
            unit: "each",
            image: null,
            inStock: true,
          };
          break;
        case "RENTALS":
          payload = {
            title: formData.title,
            description: formData.description,
            propertyType: "Apartment",
            address: "TBD",
            city: "TBD",
            state: "TBD",
            zipCode: "00000",
            bedrooms: 1,
            bathrooms: 1,
            maxGuests: 2,
            amenities: [],
            images: [],
            pricePerNight: price,
            cleaningFee: 0,
          };
          break;
        case "CAREGIVING":
          payload = {
            title: formData.title,
            description: formData.description,
            caregivingType: "COMPANIONSHIP_SUPPORT",
            basePrice: price,
            services: extras,
            qualifications: [],
            serviceArea: ["00000"],
            images: [],
          };
          break;
      }

      await api.post(category.endpoint, payload);

      toast({ title: "Success", description: "Listing created successfully", variant: "success" });
      router.push("/vendor/listings");
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.error || "Failed to create listing", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalLayout title="Create New Listing" subtitle="Add a new service to your catalog">
      <div className="max-w-3xl">
        <Link href="/vendor/listings" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Link>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Service Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedCategory === cat.id
                          ? "border-primary bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Deep Cleaning Service"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe your service in detail..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => updateFormData({ price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <select
                      id="duration"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      value={formData.duration}
                      onChange={(e) => updateFormData({ duration: e.target.value })}
                    >
                      <option value="30">30 min</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                      <option value="180">3 hours</option>
                      <option value="240">4 hours</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Drag and drop images here, or click to browse</p>
                  <Button type="button" variant="outline" className="mt-4">
                    Upload Images
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Professional equipment included"
                      value={feature}
                      onChange={(e) => updateArrayItem("features", index, e.target.value)}
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("features", index)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayItem("features")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., All cleaning supplies"
                      value={item}
                      onChange={(e) => updateArrayItem("includes", index, e.target.value)}
                    />
                    {formData.includes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("includes", index)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayItem("includes")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Link href="/vendor/listings">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" loading={isSubmitting}>
                Create Listing
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}

