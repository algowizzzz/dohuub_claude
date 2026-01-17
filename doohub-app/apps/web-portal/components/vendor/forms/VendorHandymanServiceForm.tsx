"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface HandymanServiceFormData {
  title: string;
  serviceType: string;
  description: string;
  priceType: string;
  hourlyRate: string;
  minimumCharge: string;
  estimatedDuration: string;
  serviceRadius: string;
  emergencyService: boolean;
  status: string;
  includedItems: string[];
  images: File[];
}

interface VendorHandymanServiceFormProps {
  initialData?: Partial<HandymanServiceFormData>;
  onSubmit: (data: HandymanServiceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SERVICE_TYPES = [
  "General Repair",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting & Drywall",
  "Appliance Installation",
  "Furniture Assembly",
  "Home Improvement",
  "Emergency Repairs",
];

const PRICE_TYPES = ["Fixed Price", "Hourly Rate", "Per Job"];
const STATUSES = ["Active", "Inactive"];

const DEFAULT_INCLUDED_ITEMS = [
  "All tools and equipment provided",
  "Cleanup after job completion",
  "Satisfaction guarantee",
];

export function VendorHandymanServiceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: VendorHandymanServiceFormProps) {
  const [formData, setFormData] = useState<HandymanServiceFormData>({
    title: initialData?.title || "",
    serviceType: initialData?.serviceType || "",
    description: initialData?.description || "",
    priceType: initialData?.priceType || "Hourly Rate",
    hourlyRate: initialData?.hourlyRate || "",
    minimumCharge: initialData?.minimumCharge || "",
    estimatedDuration: initialData?.estimatedDuration || "",
    serviceRadius: initialData?.serviceRadius || "",
    emergencyService: initialData?.emergencyService || false,
    status: initialData?.status || "Active",
    includedItems: initialData?.includedItems || [...DEFAULT_INCLUDED_ITEMS],
    images: initialData?.images || [],
  });

  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const updateFormData = (updates: Partial<HandymanServiceFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addIncludedItem = () => {
    if (newIncludedItem.trim()) {
      updateFormData({
        includedItems: [...formData.includedItems, newIncludedItem.trim()],
      });
      setNewIncludedItem("");
    }
  };

  const removeIncludedItem = (index: number) => {
    if (formData.includedItems.length > 1) {
      updateFormData({
        includedItems: formData.includedItems.filter((_, i) => i !== index),
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        file.type.match(/^image\/(png|jpeg|webp)$/) &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      alert("Some files were skipped. Only PNG, JPG, and WEBP files under 5MB are allowed.");
    }

    const totalImages = formData.images.length + validFiles.length;
    if (totalImages > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }

    updateFormData({
      images: [...formData.images, ...validFiles],
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    updateFormData({
      images: formData.images.filter((_, i) => i !== index),
    });
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.serviceType || !formData.description) {
      alert("Please fill in all required fields (Title, Service Type, Description).");
      return;
    }

    if (formData.priceType === "Hourly Rate" && !formData.hourlyRate) {
      alert("Please enter an hourly rate.");
      return;
    }

    if (formData.includedItems.length === 0) {
      alert("Please add at least one included item.");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Service Details */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Service Title <span className="text-red-600">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., General Home Repairs"
              maxLength={100}
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">
              Service Type <span className="text-red-600">*</span>
            </Label>
            <select
              id="serviceType"
              className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.serviceType}
              onChange={(e) => updateFormData({ serviceType: e.target.value })}
              required
            >
              <option value="">Select a service type</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-600">*</span>
            </Label>
            <textarea
              id="description"
              rows={5}
              maxLength={500}
              placeholder="Describe your handyman service in detail..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              required
            />
            <p className="text-sm text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Pricing & Service Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceType">
                Price Type <span className="text-red-600">*</span>
              </Label>
              <select
                id="priceType"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.priceType}
                onChange={(e) => updateFormData({ priceType: e.target.value })}
                required
              >
                {PRICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                Hourly Rate {formData.priceType === "Hourly Rate" && <span className="text-red-600">*</span>}
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.hourlyRate}
                  onChange={(e) => updateFormData({ hourlyRate: e.target.value })}
                  required={formData.priceType === "Hourly Rate"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumCharge">Minimum Charge</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="minimumCharge"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.minimumCharge}
                  onChange={(e) => updateFormData({ minimumCharge: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Job Duration (hours)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                min="0.5"
                step="0.5"
                placeholder="e.g., 2.5"
                value={formData.estimatedDuration}
                onChange={(e) => updateFormData({ estimatedDuration: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
              <Input
                id="serviceRadius"
                type="number"
                min="0"
                placeholder="e.g., 25"
                value={formData.serviceRadius}
                onChange={(e) => updateFormData({ serviceRadius: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-600">*</span>
              </Label>
              <select
                id="status"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.status}
                onChange={(e) => updateFormData({ status: e.target.value })}
                required
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emergencyService}
                onChange={(e) => updateFormData({ emergencyService: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-900">Emergency Service Available</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: What's Included */}
      <Card>
        <CardHeader>
          <CardTitle>What&apos;s Included</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Add items that are included in this service
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add an included item..."
              value={newIncludedItem}
              onChange={(e) => setNewIncludedItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addIncludedItem();
                }
              }}
            />
            <Button
              type="button"
              onClick={addIncludedItem}
              disabled={!newIncludedItem.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {formData.includedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-900">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIncludedItem(index)}
                  disabled={formData.includedItems.length === 1}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Service Images */}
      <Card>
        <CardHeader>
          <CardTitle>Service Images</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Upload photos of your work (PNG, JPG, or WEBP, max 5MB each)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 bg-gray-50 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-base text-gray-600 mb-2">
              Drag and drop your images here
            </p>
            <p className="text-sm text-gray-400 mb-4">OR</p>
            <label htmlFor="image-upload">
              <Button
                type="button"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                Choose Files
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Maximum 5 images, 5MB each
            </p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-[120px] object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/70 hover:bg-black/90 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Listing"}
        </Button>
      </div>
    </form>
  );
}
