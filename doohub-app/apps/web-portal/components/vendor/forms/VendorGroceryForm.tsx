"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface GroceryFormData {
  productName: string;
  category: string;
  brand: string;
  description: string;
  price: string;
  unitType: string;
  stockQuantity: string;
  maxPerOrder: string;
  organic: boolean;
  locallySourced: boolean;
  glutenFree: boolean;
  expirationDate: string;
  storageInstructions: string;
  status: string;
  features: string[];
  images: File[];
}

interface VendorGroceryFormProps {
  initialData?: Partial<GroceryFormData>;
  onSubmit: (data: GroceryFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CATEGORIES = [
  "Fresh Produce",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Pantry Staples",
  "Frozen Foods",
  "Beverages",
  "Snacks & Sweets",
  "Health & Wellness",
];

const UNIT_TYPES = [
  "Each",
  "Pound (lb)",
  "Kilogram (kg)",
  "Ounce (oz)",
  "Liter (L)",
  "Gallon (gal)",
  "Dozen",
  "Pack",
];

const STATUSES = ["Active", "Inactive"];

const DEFAULT_FEATURES = [
  "Fresh daily selection",
  "Quality guaranteed",
  "Same-day delivery available",
];

export function VendorGroceryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: VendorGroceryFormProps) {
  const [formData, setFormData] = useState<GroceryFormData>({
    productName: initialData?.productName || "",
    category: initialData?.category || "",
    brand: initialData?.brand || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    unitType: initialData?.unitType || "Each",
    stockQuantity: initialData?.stockQuantity || "",
    maxPerOrder: initialData?.maxPerOrder || "",
    organic: initialData?.organic || false,
    locallySourced: initialData?.locallySourced || false,
    glutenFree: initialData?.glutenFree || false,
    expirationDate: initialData?.expirationDate || "",
    storageInstructions: initialData?.storageInstructions || "",
    status: initialData?.status || "Active",
    features: initialData?.features || [...DEFAULT_FEATURES],
    images: initialData?.images || [],
  });

  const [newFeature, setNewFeature] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const updateFormData = (updates: Partial<GroceryFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
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

    if (!formData.productName || !formData.category || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!formData.price || !formData.stockQuantity) {
      alert("Please enter price and stock quantity.");
      return;
    }

    if (formData.features.length === 0) {
      alert("Please add at least one feature.");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">
              Product Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="productName"
              placeholder="e.g., Organic Fresh Strawberries"
              maxLength={100}
              value={formData.productName}
              onChange={(e) => updateFormData({ productName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Product Category <span className="text-red-600">*</span>
              </Label>
              <select
                id="category"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.category}
                onChange={(e) => updateFormData({ category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Farm Fresh"
                maxLength={50}
                value={formData.brand}
                onChange={(e) => updateFormData({ brand: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Product Description <span className="text-red-600">*</span>
            </Label>
            <textarea
              id="description"
              rows={5}
              maxLength={500}
              placeholder="Describe the product in detail..."
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

      {/* Section 2: Pricing & Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
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
              <Label htmlFor="unitType">
                Unit Type <span className="text-red-600">*</span>
              </Label>
              <select
                id="unitType"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.unitType}
                onChange={(e) => updateFormData({ unitType: e.target.value })}
                required
              >
                {UNIT_TYPES.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">
                Stock Quantity <span className="text-red-600">*</span>
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={(e) => updateFormData({ stockQuantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPerOrder">Maximum Per Order</Label>
              <Input
                id="maxPerOrder"
                type="number"
                min="1"
                placeholder="e.g., 10"
                value={formData.maxPerOrder}
                onChange={(e) => updateFormData({ maxPerOrder: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => updateFormData({ expirationDate: e.target.value })}
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
            <Label htmlFor="storageInstructions">Storage Instructions</Label>
            <Input
              id="storageInstructions"
              placeholder="e.g., Refrigerate after opening"
              value={formData.storageInstructions}
              onChange={(e) => updateFormData({ storageInstructions: e.target.value })}
            />
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.organic}
                onChange={(e) => updateFormData({ organic: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-900">Organic</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.locallySourced}
                onChange={(e) => updateFormData({ locallySourced: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-900">Locally Sourced</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.glutenFree}
                onChange={(e) => updateFormData({ glutenFree: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-900">Gluten-Free</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Features */}
      <Card>
        <CardHeader>
          <CardTitle>Product Features</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Add key features of this product
          </p>
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

      {/* Section 4: Product Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Upload product photos (PNG, JPG, or WEBP, max 5MB each)
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
