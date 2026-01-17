"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface CompanionshipSupportFormData {
  serviceName: string;
  serviceType: string;
  careLevel: string;
  description: string;
  hourlyRate: string;
  minimumHours: string;
  overnightRate: string;
  weekendRateAdjustment: string;
  qualifications: string[];
  languagesSpoken: string;
  experienceYears: string;
  serviceRadius: string;
  availableDays: string[];
  availableForOvernight: boolean;
  availableForLiveIn: boolean;
  status: string;
  includedItems: string[];
  images: File[];
}

interface VendorCompanionshipSupportFormProps {
  initialData?: Partial<CompanionshipSupportFormData>;
  onSubmit: (data: CompanionshipSupportFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SERVICE_TYPES = [
  "In-Home Companionship",
  "Errands & Shopping",
  "Transportation Assistance",
  "Meal Preparation",
  "Light Housekeeping",
  "Medication Reminders",
  "Social Activities",
  "Overnight Care",
  "Respite Care",
];

const CARE_LEVELS = [
  "Basic Companionship",
  "Light Assistance",
  "Moderate Care",
  "Specialized Care",
];

const QUALIFICATION_OPTIONS = [
  "CPR Certified",
  "First Aid Certified",
  "CNA License",
  "Background Checked",
  "Dementia Care Training",
  "Bilingual",
  "Pet Friendly",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const STATUSES = ["Active", "Inactive", "Temporarily Unavailable"];

const DEFAULT_INCLUDED_ITEMS = [
  "Background check completed",
  "References available",
  "Flexible scheduling",
];

export function VendorCompanionshipSupportForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: VendorCompanionshipSupportFormProps) {
  const [formData, setFormData] = useState<CompanionshipSupportFormData>({
    serviceName: initialData?.serviceName || "",
    serviceType: initialData?.serviceType || "",
    careLevel: initialData?.careLevel || "",
    description: initialData?.description || "",
    hourlyRate: initialData?.hourlyRate || "",
    minimumHours: initialData?.minimumHours || "2",
    overnightRate: initialData?.overnightRate || "",
    weekendRateAdjustment: initialData?.weekendRateAdjustment || "",
    qualifications: initialData?.qualifications || [],
    languagesSpoken: initialData?.languagesSpoken || "",
    experienceYears: initialData?.experienceYears || "",
    serviceRadius: initialData?.serviceRadius || "",
    availableDays: initialData?.availableDays || [],
    availableForOvernight: initialData?.availableForOvernight || false,
    availableForLiveIn: initialData?.availableForLiveIn || false,
    status: initialData?.status || "Active",
    includedItems: initialData?.includedItems || [...DEFAULT_INCLUDED_ITEMS],
    images: initialData?.images || [],
  });

  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const updateFormData = (updates: Partial<CompanionshipSupportFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleQualification = (qual: string) => {
    const current = formData.qualifications;
    if (current.includes(qual)) {
      updateFormData({ qualifications: current.filter((q) => q !== qual) });
    } else {
      updateFormData({ qualifications: [...current, qual] });
    }
  };

  const toggleAvailableDay = (day: string) => {
    const current = formData.availableDays;
    if (current.includes(day)) {
      updateFormData({ availableDays: current.filter((d) => d !== day) });
    } else {
      updateFormData({ availableDays: [...current, day] });
    }
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

    if (!formData.serviceName || !formData.serviceType || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!formData.hourlyRate || !formData.minimumHours || !formData.serviceRadius) {
      alert("Please enter hourly rate, minimum hours, and service radius.");
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
            <Label htmlFor="serviceName">
              Service Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="serviceName"
              placeholder="e.g., Senior Companion Care"
              maxLength={100}
              value={formData.serviceName}
              onChange={(e) => updateFormData({ serviceName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="">Select service type</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="careLevel">
                Care Level <span className="text-red-600">*</span>
              </Label>
              <select
                id="careLevel"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.careLevel}
                onChange={(e) => updateFormData({ careLevel: e.target.value })}
                required
              >
                <option value="">Select care level</option>
                {CARE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-600">*</span>
            </Label>
            <textarea
              id="description"
              rows={5}
              maxLength={500}
              placeholder="Describe your companionship services in detail..."
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

      {/* Section 2: Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                Hourly Rate <span className="text-red-600">*</span>
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumHours">
                Minimum Hours <span className="text-red-600">*</span>
              </Label>
              <Input
                id="minimumHours"
                type="number"
                min="2"
                placeholder="2"
                value={formData.minimumHours}
                onChange={(e) => updateFormData({ minimumHours: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overnightRate">Overnight Rate</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="overnightRate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.overnightRate}
                  onChange={(e) => updateFormData({ overnightRate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekendRateAdjustment">Weekend Rate Adjustment (%)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  +
                </span>
                <Input
                  id="weekendRateAdjustment"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 10"
                  className="pl-8"
                  value={formData.weekendRateAdjustment}
                  onChange={(e) => updateFormData({ weekendRateAdjustment: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Caregiver Qualifications */}
      <Card>
        <CardHeader>
          <CardTitle>Caregiver Qualifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Qualifications</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {QUALIFICATION_OPTIONS.map((qual) => (
                <label
                  key={qual}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.qualifications.includes(qual)}
                    onChange={() => toggleQualification(qual)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">{qual}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="languagesSpoken">Languages Spoken</Label>
              <Input
                id="languagesSpoken"
                placeholder="e.g., English, Spanish"
                value={formData.languagesSpoken}
                onChange={(e) => updateFormData({ languagesSpoken: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceYears">Years of Experience</Label>
              <Input
                id="experienceYears"
                type="number"
                min="0"
                placeholder="0"
                value={formData.experienceYears}
                onChange={(e) => updateFormData({ experienceYears: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Service Area */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceRadius">
              Service Radius (miles) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="serviceRadius"
              type="number"
              min="0"
              placeholder="e.g., 25"
              value={formData.serviceRadius}
              onChange={(e) => updateFormData({ serviceRadius: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Available Days</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.availableDays.includes(day)}
                    onChange={() => toggleAvailableDay(day)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availableForOvernight}
                onChange={(e) => updateFormData({ availableForOvernight: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-900">Available for Overnight</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availableForLiveIn}
                onChange={(e) => updateFormData({ availableForLiveIn: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-900">Available for Live-In</span>
            </label>
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
        </CardContent>
      </Card>

      {/* Section 6: What's Included */}
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

      {/* Section 7: Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Service Photos</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Upload photos (PNG, JPG, or WEBP, max 5MB each)
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
