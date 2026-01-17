"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface FoodServiceFormData {
  title: string;
  serviceType: string;
  cuisineType: string;
  description: string;
  price: string;
  portionSize: string;
  preparationTime: string;
  dietaryInfo: string[];
  availableDays: string[];
  availableTimes: string;
  status: string;
  includedItems: string[];
  images: File[];
}

interface VendorFoodServiceFormProps {
  initialData?: Partial<FoodServiceFormData>;
  onSubmit: (data: FoodServiceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SERVICE_TYPES = [
  "Restaurant Dine-In",
  "Takeout",
  "Delivery",
  "Catering",
  "Meal Prep",
  "Food Truck",
  "Private Chef",
  "Bakery Items",
];

const CUISINE_TYPES = [
  "American",
  "Italian",
  "Mexican",
  "Asian",
  "Mediterranean",
  "Indian",
  "Middle Eastern",
  "Fusion",
  "Other",
];

const PORTION_SIZES = [
  "Individual",
  "Serves 2",
  "Serves 4",
  "Serves 6+",
  "Family Size",
];

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Halal",
  "Kosher",
  "Spicy",
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

const STATUSES = ["Active", "Inactive", "Sold Out"];

const DEFAULT_INCLUDED_ITEMS = [
  "Professionally prepared",
  "Fresh ingredients",
  "Contactless delivery available",
];

export function VendorFoodServiceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: VendorFoodServiceFormProps) {
  const [formData, setFormData] = useState<FoodServiceFormData>({
    title: initialData?.title || "",
    serviceType: initialData?.serviceType || "",
    cuisineType: initialData?.cuisineType || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    portionSize: initialData?.portionSize || "Individual",
    preparationTime: initialData?.preparationTime || "",
    dietaryInfo: initialData?.dietaryInfo || [],
    availableDays: initialData?.availableDays || [],
    availableTimes: initialData?.availableTimes || "",
    status: initialData?.status || "Active",
    includedItems: initialData?.includedItems || [...DEFAULT_INCLUDED_ITEMS],
    images: initialData?.images || [],
  });

  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const updateFormData = (updates: Partial<FoodServiceFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleDietaryInfo = (option: string) => {
    const current = formData.dietaryInfo;
    if (current.includes(option)) {
      updateFormData({ dietaryInfo: current.filter((o) => o !== option) });
    } else {
      updateFormData({ dietaryInfo: [...current, option] });
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

    if (!formData.title || !formData.serviceType || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!formData.price || !formData.preparationTime) {
      alert("Please enter price and preparation time.");
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
      {/* Section 1: Menu Item Details */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Item Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Item Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Classic Margherita Pizza"
              maxLength={100}
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">
                Food Service Type <span className="text-red-600">*</span>
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
              <Label htmlFor="cuisineType">
                Cuisine Type <span className="text-red-600">*</span>
              </Label>
              <select
                id="cuisineType"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.cuisineType}
                onChange={(e) => updateFormData({ cuisineType: e.target.value })}
                required
              >
                <option value="">Select cuisine type</option>
                {CUISINE_TYPES.map((type) => (
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
              placeholder="Describe your menu item in detail..."
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

      {/* Section 2: Pricing & Portions */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Portions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.price}
                  onChange={(e) => updateFormData({ price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portionSize">
                Portion Size <span className="text-red-600">*</span>
              </Label>
              <select
                id="portionSize"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.portionSize}
                onChange={(e) => updateFormData({ portionSize: e.target.value })}
                required
              >
                {PORTION_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparationTime">
                Preparation Time (minutes) <span className="text-red-600">*</span>
              </Label>
              <Input
                id="preparationTime"
                type="number"
                min="1"
                placeholder="e.g., 30"
                value={formData.preparationTime}
                onChange={(e) => updateFormData({ preparationTime: e.target.value })}
                required
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

          <div className="mt-4 space-y-2">
            <Label>Dietary Information</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.dietaryInfo.includes(option)}
                    onChange={() => toggleDietaryInfo(option)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Availability */}
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

          <div className="space-y-2">
            <Label htmlFor="availableTimes">Available Times</Label>
            <Input
              id="availableTimes"
              placeholder="e.g., 11:00 AM - 9:00 PM"
              value={formData.availableTimes}
              onChange={(e) => updateFormData({ availableTimes: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4: What's Included */}
      <Card>
        <CardHeader>
          <CardTitle>What&apos;s Included</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Add items that come with this menu item
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

      {/* Section 5: Food Images */}
      <Card>
        <CardHeader>
          <CardTitle>Food Images</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Upload photos of your food (PNG, JPG, or WEBP, max 5MB each)
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
