"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";
import api, { ENDPOINTS } from "@/lib/api";
import { ArrowLeft, Upload, Plus, Trash2, Loader2, Crown } from "lucide-react";
import Link from "next/link";

const categories = [
  { id: "CLEANING", name: "Cleaning", endpoint: ENDPOINTS.SERVICES.CLEANING },
  { id: "HANDYMAN", name: "Handyman", endpoint: ENDPOINTS.SERVICES.HANDYMAN },
  { id: "BEAUTY", name: "Beauty", endpoint: ENDPOINTS.SERVICES.BEAUTY },
  { id: "GROCERIES", name: "Groceries", endpoint: ENDPOINTS.SERVICES.GROCERIES },
  { id: "RENTALS", name: "Rentals", endpoint: ENDPOINTS.SERVICES.RENTALS },
  { id: "CAREGIVING", name: "Caregiving", endpoint: ENDPOINTS.SERVICES.CAREGIVING },
];

interface ListingData {
  id: string;
  title: string;
  description?: string;
  basePrice?: number;
  price?: number;
  duration?: number;
  features?: string[];
  includes?: string[];
  images?: string[];
  isPriority?: boolean;
}

export default function EditMichelleListingPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "60",
    images: [] as string[],
    features: [""],
    includes: [""],
    isPriority: true,
  });

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      setError(null);

      for (const cat of categories) {
        try {
          const response = await api.get(`${cat.endpoint}/${params.id}`);
          const listing: ListingData = response.data.data;

          setCategory(cat.id);
          setFormData({
            title: listing.title || "",
            description: listing.description || "",
            price: String(listing.basePrice || listing.price || ""),
            duration: String(listing.duration || 60),
            images: listing.images || [],
            features: listing.features?.length ? listing.features : [""],
            includes: listing.includes?.length ? listing.includes : [""],
            isPriority: listing.isPriority ?? true,
          });
          setIsLoading(false);
          return;
        } catch {
          // Try next category
        }
      }

      setError("Listing not found");
      setIsLoading(false);
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

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

    if (!formData.title || !formData.price) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const cat = categories.find((c) => c.id === category);
      if (!cat) throw new Error("Invalid category");

      await api.put(`${cat.endpoint}/${params.id}`, {
        title: formData.title,
        description: formData.description,
        basePrice: parseFloat(formData.price),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        features: formData.features.filter((f) => f.trim()),
        includes: formData.includes.filter((i) => i.trim()),
        isPriority: formData.isPriority,
      });

      toast({ title: "Success", description: "DoHuub Official listing updated successfully" });
      router.push("/admin/michelle");
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.error || "Failed to update listing", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PortalLayout title="Edit DoHuub Listing" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout title="Edit DoHuub Listing" subtitle="Error">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/admin/michelle">
              <Button>Back to DoHuub Listings</Button>
            </Link>
          </CardContent>
        </Card>
      </PortalLayout>
    );
  }

  const categoryName = categories.find((c) => c.id === category)?.name || category;

  return (
    <PortalLayout title="Edit DoHuub Listing" subtitle={`Update ${categoryName} service`}>
      <div className="max-w-3xl">
        <Link href="/admin/michelle" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to DoHuub Listings
        </Link>

        {/* Official Badge */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">DoHuub Official Listing</p>
              <p className="text-sm text-blue-600">Editing platform-owned service listing</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Category (Read-only) */}
            <Card>
              <CardHeader>
                <CardTitle>Service Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg border-2 border-blue-600 bg-blue-50">
                  <p className="font-medium">{categoryName}</p>
                  <p className="text-sm text-gray-500 mt-1">Category cannot be changed</p>
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
                    placeholder="e.g., Premium Deep Cleaning by DoHuub"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe this official DoHuub service..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Priority Toggle */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isPriority"
                    checked={formData.isPriority}
                    onChange={(e) => updateFormData({ isPriority: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPriority" className="flex-1">
                    <p className="font-medium">Priority Listing</p>
                    <p className="text-sm text-gray-500">Display this listing at the top of search results</p>
                  </label>
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
                      placeholder="e.g., Premium quality guaranteed"
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
                      placeholder="e.g., All supplies provided"
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
              <Link href="/admin/michelle">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
