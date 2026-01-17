"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface RideAssistanceFormData {
  serviceName: string;
  serviceType: string;
  vehicleType: string;
  description: string;
  baseFare: string;
  perMileRate: string;
  perMinuteRate: string;
  minimumFare: string;
  airportFee: string;
  maxPassengers: string;
  luggageCapacity: string;
  childSeatAvailable: boolean;
  petFriendly: boolean;
  serviceRadius: string;
  availableCities: string;
  available24_7: boolean;
  operatingHours: string;
  status: string;
  includedItems: string[];
  images: File[];
}

interface VendorRideAssistanceFormProps {
  initialData?: Partial<RideAssistanceFormData>;
  onSubmit: (data: RideAssistanceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SERVICE_TYPES = [
  "Standard Ride",
  "Premium Ride",
  "Shared Ride",
  "Wheelchair Accessible",
  "Airport Transfer",
  "Hourly Charter",
  "Medical Transport",
  "Pet-Friendly Ride",
];

const VEHICLE_TYPES = ["Sedan", "SUV", "Van", "Luxury", "Other"];

const LUGGAGE_CAPACITIES = ["Small", "Medium", "Large", "Extra Large"];

const STATUSES = ["Active", "Inactive"];

const DEFAULT_INCLUDED_ITEMS = [
  "Professional licensed driver",
  "Clean and maintained vehicle",
  "Real-time tracking",
];

export function VendorRideAssistanceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: VendorRideAssistanceFormProps) {
  const [formData, setFormData] = useState<RideAssistanceFormData>({
    serviceName: initialData?.serviceName || "",
    serviceType: initialData?.serviceType || "",
    vehicleType: initialData?.vehicleType || "",
    description: initialData?.description || "",
    baseFare: initialData?.baseFare || "",
    perMileRate: initialData?.perMileRate || "",
    perMinuteRate: initialData?.perMinuteRate || "",
    minimumFare: initialData?.minimumFare || "",
    airportFee: initialData?.airportFee || "",
    maxPassengers: initialData?.maxPassengers || "",
    luggageCapacity: initialData?.luggageCapacity || "Medium",
    childSeatAvailable: initialData?.childSeatAvailable || false,
    petFriendly: initialData?.petFriendly || false,
    serviceRadius: initialData?.serviceRadius || "",
    availableCities: initialData?.availableCities || "",
    available24_7: initialData?.available24_7 || false,
    operatingHours: initialData?.operatingHours || "",
    status: initialData?.status || "Active",
    includedItems: initialData?.includedItems || [...DEFAULT_INCLUDED_ITEMS],
    images: initialData?.images || [],
  });

  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const updateFormData = (updates: Partial<RideAssistanceFormData>) => {
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

    if (!formData.serviceName || !formData.serviceType || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!formData.baseFare || !formData.perMileRate || !formData.minimumFare) {
      alert("Please enter all required pricing fields.");
      return;
    }

    if (!formData.maxPassengers || !formData.serviceRadius) {
      alert("Please enter vehicle capacity and service radius.");
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
              placeholder="e.g., City Airport Transfer"
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
              <Label htmlFor="vehicleType">
                Vehicle Type <span className="text-red-600">*</span>
              </Label>
              <select
                id="vehicleType"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.vehicleType}
                onChange={(e) => updateFormData({ vehicleType: e.target.value })}
                required
              >
                <option value="">Select vehicle type</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
              placeholder="Describe your ride service in detail..."
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
              <Label htmlFor="baseFare">
                Base Fare <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="baseFare"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.baseFare}
                  onChange={(e) => updateFormData({ baseFare: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perMileRate">
                Per Mile Rate <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="perMileRate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.perMileRate}
                  onChange={(e) => updateFormData({ perMileRate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perMinuteRate">Per Minute Rate</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="perMinuteRate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.perMinuteRate}
                  onChange={(e) => updateFormData({ perMinuteRate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumFare">
                Minimum Fare <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="minimumFare"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.minimumFare}
                  onChange={(e) => updateFormData({ minimumFare: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="airportFee">Airport Fee (if applicable)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="airportFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.airportFee}
                  onChange={(e) => updateFormData({ airportFee: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Vehicle & Capacity */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle & Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPassengers">
                Max Passengers <span className="text-red-600">*</span>
              </Label>
              <Input
                id="maxPassengers"
                type="number"
                min="1"
                max="15"
                placeholder="4"
                value={formData.maxPassengers}
                onChange={(e) => updateFormData({ maxPassengers: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="luggageCapacity">Luggage Capacity</Label>
              <select
                id="luggageCapacity"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.luggageCapacity}
                onChange={(e) => updateFormData({ luggageCapacity: e.target.value })}
              >
                {LUGGAGE_CAPACITIES.map((capacity) => (
                  <option key={capacity} value={capacity}>
                    {capacity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.childSeatAvailable}
                onChange={(e) => updateFormData({ childSeatAvailable: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-900">Child Seat Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.petFriendly}
                onChange={(e) => updateFormData({ petFriendly: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-900">Pet Friendly</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Service Area */}
      <Card>
        <CardHeader>
          <CardTitle>Service Area</CardTitle>
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
              placeholder="e.g., 50"
              value={formData.serviceRadius}
              onChange={(e) => updateFormData({ serviceRadius: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableCities">Available Cities (comma-separated)</Label>
            <Input
              id="availableCities"
              placeholder="e.g., Boston, Cambridge, Somerville"
              value={formData.availableCities}
              onChange={(e) => updateFormData({ availableCities: e.target.value })}
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.available24_7}
              onChange={(e) => updateFormData({ available24_7: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm text-gray-900">Available 24/7</span>
          </label>

          {!formData.available24_7 && (
            <div className="space-y-2">
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Input
                id="operatingHours"
                placeholder="e.g., 6:00 AM - 10:00 PM"
                value={formData.operatingHours}
                onChange={(e) => updateFormData({ operatingHours: e.target.value })}
              />
            </div>
          )}

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

      {/* Section 7: Vehicle Images */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Upload photos of your vehicle (PNG, JPG, or WEBP, max 5MB each)
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
