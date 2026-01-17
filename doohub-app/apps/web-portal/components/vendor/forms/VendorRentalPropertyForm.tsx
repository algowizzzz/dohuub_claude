"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface RentalPropertyFormData {
  title: string;
  propertyType: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  maxGuests: string;
  parkingSpaces: string;
  pricePerNight: string;
  cleaningFee: string;
  securityDeposit: string;
  minimumStay: string;
  amenities: string[];
  availableFrom: string;
  availableTo: string;
  status: string;
  features: string[];
  images: File[];
}

interface VendorRentalPropertyFormProps {
  initialData?: Partial<RentalPropertyFormData>;
  onSubmit: (data: RentalPropertyFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Condo",
  "Townhouse",
  "Studio",
  "Room",
  "Vacation Home",
  "Commercial Space",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const AMENITIES_OPTIONS = [
  "WiFi",
  "Kitchen",
  "Air Conditioning",
  "Heating",
  "Washer/Dryer",
  "TV",
  "Parking",
  "Pool",
  "Gym",
  "Pet Friendly",
  "Wheelchair Accessible",
];

const STATUSES = ["Active", "Inactive", "Booked"];

const DEFAULT_FEATURES = [
  "Clean and sanitized",
  "Self check-in available",
  "24/7 support",
];

export function VendorRentalPropertyForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: VendorRentalPropertyFormProps) {
  const [formData, setFormData] = useState<RentalPropertyFormData>({
    title: initialData?.title || "",
    propertyType: initialData?.propertyType || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    bedrooms: initialData?.bedrooms || "",
    bathrooms: initialData?.bathrooms || "",
    squareFootage: initialData?.squareFootage || "",
    maxGuests: initialData?.maxGuests || "",
    parkingSpaces: initialData?.parkingSpaces || "",
    pricePerNight: initialData?.pricePerNight || "",
    cleaningFee: initialData?.cleaningFee || "",
    securityDeposit: initialData?.securityDeposit || "",
    minimumStay: initialData?.minimumStay || "1",
    amenities: initialData?.amenities || [],
    availableFrom: initialData?.availableFrom || "",
    availableTo: initialData?.availableTo || "",
    status: initialData?.status || "Active",
    features: initialData?.features || [...DEFAULT_FEATURES],
    images: initialData?.images || [],
  });

  const [newFeature, setNewFeature] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const updateFormData = (updates: Partial<RentalPropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities;
    if (current.includes(amenity)) {
      updateFormData({ amenities: current.filter((a) => a !== amenity) });
    } else {
      updateFormData({ amenities: [...current, amenity] });
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      updateFormData({
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      updateFormData({
        features: formData.features.filter((_, i) => i !== index),
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

    if (!formData.title || !formData.propertyType || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert("Please fill in the complete address.");
      return;
    }

    if (!formData.pricePerNight || !formData.bedrooms || !formData.bathrooms || !formData.maxGuests) {
      alert("Please fill in property specs and pricing.");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Property Title <span className="text-red-600">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Cozy Downtown Apartment"
              maxLength={100}
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">
              Property Type <span className="text-red-600">*</span>
            </Label>
            <select
              id="propertyType"
              className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.propertyType}
              onChange={(e) => updateFormData({ propertyType: e.target.value })}
              required
            >
              <option value="">Select property type</option>
              {PROPERTY_TYPES.map((type) => (
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
              placeholder="Describe the property in detail..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              required
            />
            <p className="text-sm text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Address <span className="text-red-600">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Street address"
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-red-600">*</span>
              </Label>
              <Input
                id="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                State <span className="text-red-600">*</span>
              </Label>
              <select
                id="state"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.state}
                onChange={(e) => updateFormData({ state: e.target.value })}
                required
              >
                <option value="">Select</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">
                ZIP Code <span className="text-red-600">*</span>
              </Label>
              <Input
                id="zipCode"
                placeholder="12345"
                pattern="[0-9]{5}"
                maxLength={5}
                value={formData.zipCode}
                onChange={(e) => updateFormData({ zipCode: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Property Specs */}
      <Card>
        <CardHeader>
          <CardTitle>Property Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">
                Bedrooms <span className="text-red-600">*</span>
              </Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                placeholder="0"
                value={formData.bedrooms}
                onChange={(e) => updateFormData({ bedrooms: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">
                Bathrooms <span className="text-red-600">*</span>
              </Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={formData.bathrooms}
                onChange={(e) => updateFormData({ bathrooms: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                min="0"
                placeholder="e.g., 1200"
                value={formData.squareFootage}
                onChange={(e) => updateFormData({ squareFootage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGuests">
                Max Guests <span className="text-red-600">*</span>
              </Label>
              <Input
                id="maxGuests"
                type="number"
                min="1"
                placeholder="1"
                value={formData.maxGuests}
                onChange={(e) => updateFormData({ maxGuests: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingSpaces">Parking Spaces</Label>
              <Input
                id="parkingSpaces"
                type="number"
                min="0"
                placeholder="0"
                value={formData.parkingSpaces}
                onChange={(e) => updateFormData({ parkingSpaces: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AMENITIES_OPTIONS.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerNight">
                Price per Night <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="pricePerNight"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.pricePerNight}
                  onChange={(e) => updateFormData({ pricePerNight: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cleaningFee">Cleaning Fee</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="cleaningFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.cleaningFee}
                  onChange={(e) => updateFormData({ cleaningFee: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.securityDeposit}
                  onChange={(e) => updateFormData({ securityDeposit: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumStay">Minimum Stay (nights)</Label>
              <Input
                id="minimumStay"
                type="number"
                min="1"
                placeholder="1"
                value={formData.minimumStay}
                onChange={(e) => updateFormData({ minimumStay: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableFrom">
                Available From <span className="text-red-600">*</span>
              </Label>
              <Input
                id="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={(e) => updateFormData({ availableFrom: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableTo">Available To (Optional)</Label>
              <Input
                id="availableTo"
                type="date"
                value={formData.availableTo}
                onChange={(e) => updateFormData({ availableTo: e.target.value })}
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
        </CardContent>
      </Card>

      {/* Section 5: Features */}
      <Card>
        <CardHeader>
          <CardTitle>Property Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a feature..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button
              type="button"
              onClick={addFeature}
              disabled={!newFeature.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-900">{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length === 1}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Property Images */}
      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Upload property photos (PNG, JPG, or WEBP, max 5MB each)
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
