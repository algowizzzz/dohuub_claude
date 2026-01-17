# Category-Specific Listing Forms - Implementation Guide

**Date Created:** January 14, 2026
**Status:** 1 of 9 forms complete (Cleaning Services)
**Template Location:** `/components/vendor/forms/VendorCleaningServiceForm.tsx`

---

## Overview

This guide provides detailed specifications for implementing 9 category-specific listing forms that match the approved wireframes. Each form has unique fields tailored to its service category.

### Completed Forms
- ✅ **VendorCleaningServiceForm.tsx** - Template for all other forms

### Pending Forms (8 remaining)
- [ ] **VendorHandymanServiceForm.tsx**
- [ ] **VendorBeautyServiceForm.tsx**
- [ ] **VendorBeautyProductForm.tsx**
- [ ] **VendorGroceryForm.tsx**
- [ ] **VendorFoodForm.tsx**
- [ ] **VendorRentalPropertyForm.tsx**
- [ ] **VendorRideAssistanceForm.tsx**
- [ ] **VendorCompanionshipSupportForm.tsx**

---

## Form Structure Pattern

All forms follow the same 4-section structure:

### Section 1: Service/Product Details
- Title (required, max 100 chars)
- Type/Category dropdown (required, category-specific options)
- Description (required, textarea, max 500 chars)

### Section 2: Pricing & Additional Details
- 2-column grid on desktop, stacked on mobile
- Price fields (required)
- Category-specific fields (duration, capacity, etc.)
- Status dropdown (Active/Inactive)

### Section 3: What's Included / Features
- Dynamic list with add/remove functionality
- Minimum 1 item required
- Default items provided for new listings
- Enter key adds item
- Trash icon removes item (red color: #DC2626)

### Section 4: Images
- Drag & drop upload zone
- Max 5 images, 5MB each
- Accepted formats: PNG, JPG, WEBP
- Preview grid (120×120px thumbnails)
- Remove button on hover (black overlay)

---

## Form 2: Handyman Services

### File: `VendorHandymanServiceForm.tsx`

#### Unique Fields (Section 1 & 2)

**Service Type** (select, required)
```typescript
const HANDYMAN_SERVICE_TYPES = [
  "General Repair",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting & Drywall",
  "Appliance Installation",
  "Furniture Assembly",
  "Home Improvement",
  "Emergency Repairs"
];
```

**Pricing Fields**
- Price Type: select (Fixed Price | Hourly Rate | Per Job)
- Hourly Rate: number ($, required if Hourly Rate selected)
- Minimum Charge: number ($, optional)
- Estimated Job Duration: number (hours, 0.5 step, optional)

**Additional Fields**
- Service Radius: number (miles, optional, placeholder: "e.g., 25")
- Emergency Service Available: checkbox (boolean)
- Status: select (Active | Inactive)

**Default Included Items**
```typescript
[
  "All tools and equipment provided",
  "Cleanup after job completion",
  "Satisfaction guarantee"
]
```

---

## Form 3: Beauty Services

### File: `VendorBeautyServiceForm.tsx`

#### Unique Fields

**Beauty Service Type** (select, required)
```typescript
const BEAUTY_SERVICE_TYPES = [
  "Hair Styling",
  "Hair Coloring",
  "Manicure & Pedicure",
  "Facial Treatment",
  "Massage Therapy",
  "Makeup Application",
  "Waxing & Hair Removal",
  "Skincare Treatment",
  "Spa Package"
];
```

**Pricing & Details**
- Base Price: number ($, required)
- Service Duration: number (minutes, options: 30, 45, 60, 90, 120, 180)
- Home Service Available: checkbox (boolean)
- Travel Fee (if applicable): number ($, optional)

**Additional Fields**
- Suitable For: multi-select checkboxes
  - Men
  - Women
  - Children
  - Seniors
- Requires Booking: checkbox (default: true)
- Status: select (Active | Inactive)

**Default Included Items**
```typescript
[
  "Professional products used",
  "Consultation included",
  "After-care instructions provided"
]
```

---

## Form 4: Beauty Products

### File: `VendorBeautyProductForm.tsx`

#### Unique Fields

**Product Category** (select, required)
```typescript
const BEAUTY_PRODUCT_CATEGORIES = [
  "Skincare",
  "Haircare",
  "Makeup",
  "Fragrance",
  "Bath & Body",
  "Tools & Accessories",
  "Men's Grooming",
  "Natural & Organic"
];
```

**Product Details**
- Product Name: text (required, max 100)
- Brand: text (required, max 50)
- Product Type: text (e.g., "Moisturizer", "Shampoo")

**Pricing & Inventory**
- Price: number ($, required)
- Sale Price: number ($, optional)
- SKU: text (optional, max 50)
- In Stock Quantity: number (required, min 0)
- Low Stock Alert: number (optional, "Alert when quantity below...")

**Product Specifications**
- Size/Volume: text (e.g., "50ml", "2oz")
- Ingredients: textarea (optional, max 500)
- Skin/Hair Type: select
  - All Types
  - Dry
  - Oily
  - Combination
  - Sensitive
  - Normal

**Default Features** (instead of "What's Included")
```typescript
[
  "Authentic product guarantee",
  "Sealed packaging",
  "Fast shipping available"
]
```

---

## Form 5: Grocery

### File: `VendorGroceryForm.tsx`

#### Unique Fields

**Product Category** (select, required)
```typescript
const GROCERY_CATEGORIES = [
  "Fresh Produce",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Pantry Staples",
  "Frozen Foods",
  "Beverages",
  "Snacks & Sweets",
  "Health & Wellness"
];
```

**Product Details**
- Product Name: text (required, max 100)
- Brand: text (optional, max 50)
- Product Description: textarea (required, max 500)

**Pricing & Quantity**
- Price: number ($, required)
- Unit Type: select (required)
  - Each
  - Pound (lb)
  - Kilogram (kg)
  - Ounce (oz)
  - Liter (L)
  - Gallon (gal)
  - Dozen
  - Pack
- Stock Quantity: number (required, min 0)
- Max Per Order: number (optional, "Maximum quantity per order")

**Product Info**
- Organic: checkbox (boolean)
- Locally Sourced: checkbox (boolean)
- Gluten-Free: checkbox (boolean)
- Expiration Date: date picker (optional)
- Storage Instructions: text (optional, placeholder: "e.g., Refrigerate after opening")

**Default Features**
```typescript
[
  "Fresh daily selection",
  "Quality guaranteed",
  "Same-day delivery available"
]
```

---

## Form 6: Food Services

### File: `VendorFoodForm.tsx`

#### Unique Fields

**Food Service Type** (select, required)
```typescript
const FOOD_SERVICE_TYPES = [
  "Restaurant Dine-In",
  "Takeout",
  "Delivery",
  "Catering",
  "Meal Prep",
  "Food Truck",
  "Private Chef",
  "Bakery Items"
];
```

**Menu Item Details**
- Item Name: text (required, max 100)
- Cuisine Type: select
  - American
  - Italian
  - Mexican
  - Asian
  - Mediterranean
  - Indian
  - Middle Eastern
  - Fusion
  - Other
- Description: textarea (required, max 500)

**Pricing & Portions**
- Price: number ($, required)
- Portion Size: select
  - Individual
  - Serves 2
  - Serves 4
  - Serves 6+
  - Family Size
- Preparation Time: number (minutes, required)

**Dietary Information** (checkboxes)
- Vegetarian
- Vegan
- Gluten-Free
- Dairy-Free
- Nut-Free
- Halal
- Kosher
- Spicy

**Availability**
- Available Days: multi-select checkboxes (Mon-Sun)
- Available Times: text (e.g., "11:00 AM - 9:00 PM")
- Status: select (Active | Inactive | Sold Out)

**Default Included Items**
```typescript
[
  "Professionally prepared",
  "Fresh ingredients",
  "Contactless delivery available"
]
```

---

## Form 7: Rental Properties

### File: `VendorRentalPropertyForm.tsx`

#### Unique Fields

**Property Type** (select, required)
```typescript
const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Condo",
  "Townhouse",
  "Studio",
  "Room",
  "Vacation Home",
  "Commercial Space"
];
```

**Property Details**
- Property Title: text (required, max 100)
- Description: textarea (required, max 500)
- Address: text (required)
- City: text (required)
- State: select (US states)
- ZIP Code: text (required, pattern: 5 digits)

**Property Specs** (2-column grid)
- Bedrooms: number (required, min 0)
- Bathrooms: number (required, min 0, step 0.5)
- Square Footage: number (optional)
- Max Guests: number (required, min 1)
- Parking Spaces: number (optional, min 0)

**Pricing**
- Price per Night: number ($, required)
- Cleaning Fee: number ($, optional)
- Security Deposit: number ($, optional)
- Minimum Stay: number (nights, default: 1)

**Amenities** (multi-select checkboxes)
- WiFi
- Kitchen
- Air Conditioning
- Heating
- Washer/Dryer
- TV
- Parking
- Pool
- Gym
- Pet Friendly
- Wheelchair Accessible

**Availability**
- Available From: date picker (required)
- Available To: date picker (optional, for temporary rentals)
- Status: select (Active | Inactive | Booked)

**Default Features** (not "What's Included")
```typescript
[
  "Clean and sanitized",
  "Self check-in available",
  "24/7 support"
]
```

---

## Form 8: Ride Assistance

### File: `VendorRideAssistanceForm.tsx`

#### Unique Fields

**Service Type** (select, required)
```typescript
const RIDE_SERVICE_TYPES = [
  "Standard Ride",
  "Premium Ride",
  "Shared Ride",
  "Wheelchair Accessible",
  "Airport Transfer",
  "Hourly Charter",
  "Medical Transport",
  "Pet-Friendly Ride"
];
```

**Service Details**
- Service Name: text (required, max 100)
- Description: textarea (required, max 500)
- Vehicle Type: select (Sedan | SUV | Van | Luxury | Other)

**Pricing**
- Base Fare: number ($, required)
- Per Mile Rate: number ($, required)
- Per Minute Rate: number ($, optional)
- Minimum Fare: number ($, required)
- Airport Fee (if applicable): number ($, optional)

**Vehicle & Capacity**
- Max Passengers: number (required, 1-15)
- Luggage Capacity: select (Small | Medium | Large | Extra Large)
- Child Seat Available: checkbox (boolean)
- Pet Friendly: checkbox (boolean)

**Service Area**
- Service Radius: number (miles, required)
- Available Cities: textarea (comma-separated, optional)

**Availability**
- Available 24/7: checkbox (boolean)
- Operating Hours: text (if not 24/7, e.g., "6:00 AM - 10:00 PM")
- Status: select (Active | Inactive)

**Default Included Items**
```typescript
[
  "Professional licensed driver",
  "Clean and maintained vehicle",
  "Real-time tracking"
]
```

---

## Form 9: Companionship Support

### File: `VendorCompanionshipSupportForm.tsx`

#### Unique Fields

**Service Type** (select, required)
```typescript
const COMPANIONSHIP_TYPES = [
  "In-Home Companionship",
  "Errands & Shopping",
  "Transportation Assistance",
  "Meal Preparation",
  "Light Housekeeping",
  "Medication Reminders",
  "Social Activities",
  "Overnight Care",
  "Respite Care"
];
```

**Service Details**
- Service Name: text (required, max 100)
- Description: textarea (required, max 500)
- Care Level: select
  - Basic Companionship
  - Light Assistance
  - Moderate Care
  - Specialized Care

**Pricing**
- Hourly Rate: number ($, required)
- Minimum Hours: number (required, min 2)
- Overnight Rate: number ($, optional)
- Weekend Rate Adjustment: number (%, optional, e.g., "+10%")

**Caregiver Qualifications** (checkboxes)
- CPR Certified
- First Aid Certified
- CNA License
- Background Checked
- Dementia Care Training
- Bilingual
- Pet Friendly

**Service Details**
- Languages Spoken: text (comma-separated, e.g., "English, Spanish")
- Experience Years: number (optional)
- Service Radius: number (miles, required)

**Availability**
- Available Days: multi-select checkboxes (Mon-Sun)
- Available for Overnight: checkbox (boolean)
- Available for Live-In: checkbox (boolean)
- Status: select (Active | Inactive | Temporarily Unavailable)

**Default Included Items**
```typescript
[
  "Background check completed",
  "References available",
  "Flexible scheduling"
]
```

---

## Implementation Checklist

### For Each Form (2 hours per form)

**Step 1: Create Form Component** (45 min)
- [ ] Copy `VendorCleaningServiceForm.tsx` as template
- [ ] Update component name and interface
- [ ] Replace service types with category-specific options
- [ ] Update form fields per specifications above
- [ ] Update validation logic

**Step 2: Update Form State** (15 min)
- [ ] Define `FormData` interface with all category fields
- [ ] Set default values
- [ ] Update `updateFormData` function if needed
- [ ] Add any category-specific state (e.g., checkboxes)

**Step 3: Styling & Layout** (30 min)
- [ ] Verify all inputs match wireframe specs
- [ ] Test responsive layout (mobile/tablet/desktop)
- [ ] Ensure proper spacing (Card padding: 24px)
- [ ] Test focus states (ring-2 ring-primary)

**Step 4: Integration** (30 min)
- [ ] Import form in `/vendor/listings/new/page.tsx`
- [ ] Add category routing logic
- [ ] Connect to API endpoint
- [ ] Test form submission
- [ ] Add error handling
- [ ] Test image upload

---

## Styling Specifications

All forms must match these exact specs:

### Card Container
```tsx
border-radius: 20px;
border: 1px solid #E5E7EB;
padding: 24px;
```

### Inputs & Selects
```tsx
height: 48px (h-12);
padding: 0 16px (px-4);
border: 1px solid #E5E7EB;
border-radius: 12px (rounded-xl);
font-size: 15px (text-base);

// Focus
ring: 2px;
ring-color: primary (#030213);
```

### Textarea
```tsx
padding: 12px 16px;
border-radius: 12px;
font-size: 15px;
resize: none;
```

### Buttons
```tsx
Primary Button:
  height: 44px;
  padding: 0 24px;
  background: #030213;
  color: #ffffff;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;

Outline Button:
  height: 44px;
  padding: 0 24px;
  border: 1px solid #E5E7EB;
  background: #ffffff;
  color: #1F2937;
  border-radius: 10px;

Icon Button:
  width: 40px;
  height: 40px;
  icon-size: 16px;
```

### Image Upload Zone
```tsx
border: 2px dashed #E5E7EB;
border-radius: 12px;
padding: 48px;
background: #F9FAFB;
text-align: center;
```

### Image Preview
```tsx
width: 120px;
height: 120px;
border-radius: 8px;
object-fit: cover;

Remove Button:
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  border-radius: 4px;
```

---

## Testing Checklist

For each form, verify:

### Functionality
- [ ] All required fields enforce validation
- [ ] Optional fields can be left empty
- [ ] Dropdowns show correct options
- [ ] Add/remove dynamic items works
- [ ] Image upload accepts correct formats
- [ ] Image upload rejects files > 5MB
- [ ] Max 5 images enforced
- [ ] Form submits with valid data
- [ ] Error messages display correctly

### Responsive Design
- [ ] Mobile: single column, full width
- [ ] Tablet: appropriate grid breakpoints
- [ ] Desktop: 2-column grid where specified
- [ ] All touch targets ≥ 44px

### Accessibility
- [ ] All inputs have labels
- [ ] Required fields marked with asterisk
- [ ] Error messages associated with inputs
- [ ] Keyboard navigation works
- [ ] Focus indicators visible

---

## API Integration Pattern

Each form should POST to its respective endpoint:

```typescript
// Example for Cleaning Services
const handleSubmit = async (data: CleaningServiceFormData) => {
  try {
    const payload = {
      title: data.title,
      cleaningType: data.serviceType,
      description: data.description,
      priceType: data.priceType,
      basePrice: parseFloat(data.price),
      duration: data.estimatedDuration ? parseFloat(data.estimatedDuration) * 60 : null,
      areaSize: data.typicalAreaSize ? parseInt(data.typicalAreaSize) : null,
      frequency: data.serviceFrequency,
      includedItems: data.includedItems,
      status: data.status,
      images: [], // Upload images separately
    };

    await api.post(ENDPOINTS.SERVICES.CLEANING, payload);
    toast({ title: "Success", description: "Listing created" });
    router.push("/vendor/listings");
  } catch (err) {
    toast({ title: "Error", description: "Failed to create listing", variant: "destructive" });
  }
};
```

---

## Next Steps

1. **Prioritize forms based on usage:**
   - High: Handyman, Beauty Services, Food Services
   - Medium: Grocery, Rental Properties
   - Low: Beauty Products, Ride Assistance, Companionship Support

2. **Parallel development:**
   - Assign 2-3 forms per developer
   - Use Cleaning Services form as reference
   - Code review before integration

3. **Testing:**
   - Create test listings for each category
   - Verify API payload structure
   - Test on mobile devices

**Estimated Total Time:** 16 hours (8 forms × 2 hours each)

---

**Last Updated:** January 14, 2026
**Completed Forms:** 1 of 9 (11%)
**Remaining Work:** 16 hours
