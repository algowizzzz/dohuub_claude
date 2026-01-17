# DoHuub Web Portal - Developer Implementation Guide
## Screen-by-Screen Specifications for Exact Wireframe Match

**Version:** 1.0
**Date:** January 14, 2026
**Status:** CRITICAL - Client-Approved Wireframes
**Wireframe Source:** https://github.com/maazahmed-tech/Wireframesdohuubmobileresponsivevendorprotalandadminpanelwebappversion1withoutupsell

---

## 🎯 OBJECTIVE

**Create EXACT pixel-perfect match** with client-approved wireframes. Every color, spacing, layout, and component must match precisely. Client has already approved these wireframes - deviation = rejection.

---

## 📐 GLOBAL DESIGN SYSTEM

### Color Palette (EXACT VALUES - DO NOT DEVIATE)

```css
/* Primary Colors */
--primary: #030213;              /* WIREFRAME VALUE - Almost black/very dark navy */
--primary-foreground: oklch(1 0 0); /* Pure white */

/* CURRENT IMPLEMENTATION HAS WRONG COLOR: #1E3A5F - MUST CHANGE! */

/* Backgrounds */
--background: #ffffff;           /* Pure white */
--background-muted: #F8F9FA;     /* Light gray for sidebars */
--background-card: #ffffff;      /* Card backgrounds */

/* Text Colors */
--text-primary: #1F2937;         /* Dark gray for headings/values */
--text-secondary: #6B7280;       /* Medium gray for labels */
--text-muted: #9CA3AF;          /* Light gray for hints */

/* Borders */
--border: #E5E7EB;              /* Light gray borders */
--border-hover: #1F2937;        /* Dark border on hover */

/* Status Colors */
--success: #10B981;             /* Green */
--success-bg: #D1FAE5;          /* Light green background */
--success-text: #065F46;        /* Dark green text */

--warning: #F59E0B;             /* Amber */
--warning-bg: #FEF3C7;          /* Light amber background */
--warning-text: #92400E;        /* Dark amber text */

--error: #DC2626;               /* Red */
--error-bg: #FEE2E2;            /* Light red background */
--error-text: #DC2626;          /* Red text */

--info: #3B82F6;                /* Blue */
--info-bg: #DBEAFE;             /* Light blue background */
--info-text: #1E40AF;           /* Dark blue text */
```

### Typography System

```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 15px;   /* Default body text */
--text-lg: 16px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 28px;
--text-4xl: 32px;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing System

```css
/* Base spacing unit: 4px */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 28px;
--space-8: 32px;

/* Border Radius */
--radius-sm: 8px;
--radius-md: 10px;   /* WIREFRAME USES 10px, NOT 12px! */
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 20px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
```

### Layout Constants

```css
/* Navigation */
--top-nav-height: 72px;
--sidebar-width: 280px;         /* WIREFRAME VALUE, NOT 256px! */
--sidebar-collapsed-width: 72px;

/* Content */
--content-max-width: 1600px;    /* Dashboard */
--form-max-width: 900px;        /* Forms and wizards */
--table-max-width: 1400px;      /* Tables and lists */

/* Responsive Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

---

## 🏗️ LAYOUT COMPONENTS

### Top Navigation Bar

**File:** `components/layouts/Header.tsx` or `AdminTopNav.tsx` / `VendorTopNav.tsx`

```tsx
// EXACT SPECIFICATIONS
height: 72px;
position: fixed;
top: 0;
left: 0;
right: 0;
z-index: 40;
background: #ffffff;
border-bottom: 1px solid #E5E7EB;

// Content Layout
padding: 0 24px; // Horizontal padding
display: flex;
align-items: center;
justify-content: space-between;

// Logo/Title Area (Left)
font-size: 20px;
font-weight: 700;
color: #1F2937;

// Actions Area (Right)
display: flex;
gap: 12px;
align-items: center;

// User Menu Button
height: 40px;
padding: 8px 12px;
border-radius: 8px;
background: #F9FAFB;
border: 1px solid #E5E7EB;
hover: background #E5E7EB;
```

**Implementation Status:** ⚠️ Exists but verify exact dimensions and styling

**Dev Tasks:**
- [ ] Verify height is exactly 72px
- [ ] Ensure border color is #E5E7EB
- [ ] Check user menu button matches specs
- [ ] Test responsive behavior on mobile

---

### Sidebar Navigation

**File:** `components/layouts/Sidebar.tsx` or `AdminSidebar.tsx` / `VendorSidebar.tsx`

```tsx
// EXACT SPECIFICATIONS - ADMIN SIDEBAR
width: 280px; // NOT 256px!
height: calc(100vh - 72px); // Full height minus top nav
position: fixed;
top: 72px;
left: 0;
background: #F8F9FA; // Light gray, NOT white
border-right: 1px solid #E5E7EB;
z-index: 30;

// Navigation Item (Default)
padding: 12px 16px;
border-radius: 8px;
margin: 0 12px 4px 12px;
font-size: 15px;
font-weight: 500;
color: #6B7280;
display: flex;
align-items: center;
gap: 12px;
transition: all 0.2s;

// Navigation Item (Hover)
background: #E5E7EB;
color: #1F2937;

// Navigation Item (Active)
background: #1F2937; // Dark charcoal
color: #ffffff;

// Icon Sizing
width: 20px;
height: 20px;

// Badge (for notifications)
background: #DC2626; // Red
color: #ffffff;
font-size: 11px;
font-weight: 600;
padding: 2px 6px;
border-radius: 10px;
min-width: 18px;
height: 18px;

// Logout Button (Special)
margin-top: auto; // Pushes to bottom
color: #DC2626;
border: 1px solid #FEE2E2;
hover: background #FEE2E2;
```

**Current Implementation Issues:**
- ❌ Width is 256px, should be 280px
- ❌ Background might be white, should be #F8F9FA
- ❌ Active state color might be different

**Dev Tasks:**
- [ ] Change width from `w-64` (256px) to exactly 280px
- [ ] Set background to #F8F9FA
- [ ] Ensure active state uses #1F2937 background
- [ ] Verify icon size is 20×20px
- [ ] Test collapsed state (72px width)
- [ ] Add notification badges on relevant items

---

### Page Container

```tsx
// EXACT SPECIFICATIONS
margin-top: 72px; // Top nav height
margin-left: 280px; // Sidebar width (when expanded)
// OR margin-left: 72px; // Sidebar width (when collapsed)
padding: 32px; // Desktop
padding: 16px; // Mobile (< 640px)
max-width: 1600px; // Dashboard/stats pages
// OR max-width: 900px; // Form pages
// OR max-width: 1400px; // Table/list pages
margin-left-right: auto; // Center content
transition: margin-left 0.3s ease;

// Page Header
margin-bottom: 24px;

// Title
font-size: 32px; // Desktop
font-size: 24px; // Mobile
font-weight: 700;
color: #1F2937;
margin-bottom: 8px;

// Subtitle
font-size: 15px;
color: #6B7280;
display: none; // Hide on mobile
```

---

## 🔴 PRIORITY 1: CRITICAL SCREENS (MAJOR LAYOUT DIFFERENCES)

---

## SCREEN 1: All Vendors (`/admin/vendors`)

### 🚨 CRITICAL ISSUE
**Current:** Table layout
**Wireframe:** Card-based layout with vendor logos
**Impact:** TOTAL MISMATCH - Must rebuild completely

### Wireframe Specifications

#### Page Layout
```tsx
// Container
margin-top: 72px;
margin-left: 280px;
padding: 32px; // Desktop
padding: 16px; // Mobile
max-width: 1400px;

// Page Header
title: "All Vendors"
subtitle: "Platform Vendors Overview" // Hide on mobile
margin-bottom: 32px;
```

#### Quick Stats Bar
```tsx
// Container
background: #F8F9FA;
border: 1px solid #E5E7EB;
border-radius: 12px;
padding: 20px; // Desktop
padding: 16px; // Mobile
margin-bottom: 24px;

// Grid Layout
display: grid;
grid-template-columns: repeat(2, 1fr); // Mobile
grid-template-columns: repeat(4, 1fr); // Desktop (lg:)
gap: 16px;

// Stat Item
Label:
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 4px;

Value:
  font-size: 20px; // Desktop
  font-size: 18px; // Mobile
  font-weight: 700;
  color: #1F2937; // Default
  color: #10B981; // Active count
  color: #DC2626; // Suspended count
```

#### Search & Filters Section
```tsx
// Container
display: flex;
flex-direction: column; // Mobile
flex-direction: row; // Desktop (sm:)
gap: 12px;
margin-bottom: 24px;

// Search Input (Full width row)
width: 100%;
height: 48px;
padding: 0 16px 0 48px; // Left padding for icon
border: 1px solid #E5E7EB;
border-radius: 10px;
font-size: 15px;

Icon:
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #9CA3AF;

// Filter Row (4 dropdowns)
display: flex;
flex-wrap: wrap;
gap: 12px;

Each Dropdown:
  width: 100%; // Mobile
  width: 200px; // Desktop (sm:)
  height: 48px;
  padding: 0 40px 0 16px; // Right padding for arrow
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  font-size: 15px;
  background: #ffffff;
  color: #1F2937;

Dropdown Options:
1. Category Filter:
   - All Categories
   - Cleaning Services
   - Handyman Services
   - Grocery
   - Beauty Services
   - Food Services
   - Rental Properties
   - Ride Assistance
   - Companionship Support

2. Status Filter:
   - All Statuses
   - Active
   - Inactive
   - Suspended
   - Trial Period

3. Country Filter:
   - All Countries
   - USA
   - Canada
   - (Other countries as needed)

4. Region Filter:
   - All Regions
   - (Dynamic based on selected country)
   - California
   - New York
   - Texas
   - Ontario
   - etc.
```

#### Vendor Card Layout (CRITICAL)
```tsx
// Card Container
display: flex;
flex-direction: column; // Mobile
flex-direction: row; // Desktop (lg:)
background: #ffffff;
border: 1px solid #E5E7EB;
border-radius: 16px;
padding: 20px; // Desktop
padding: 16px; // Mobile
margin-bottom: 20px;
transition: all 0.2s ease;

// Hover State
border-color: #1F2937;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
cursor: pointer;

// Logo Section (Left)
flex-shrink: 0;
margin-bottom: 16px; // Mobile
margin-bottom: 0; // Desktop
margin-right: 24px; // Desktop

Logo Container:
  width: 64px; // Mobile
  width: 80px; // Desktop (lg:)
  height: 64px; // Mobile
  height: 80px; // Desktop (lg:)
  border-radius: 12px;
  overflow: hidden;

  // If no logo - fallback
  background: #F8F9FA;
  border: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;

  Icon (Building2):
    width: 32px; // Mobile
    width: 40px; // Desktop
    height: 32px; // Mobile
    height: 40px; // Desktop
    color: #9CA3AF;

// Content Section (Right)
flex: 1;
display: flex;
flex-direction: column;
gap: 16px;

// Header Row
display: flex;
align-items: flex-start;
justify-content: space-between;
margin-bottom: 12px;

Business Name:
  font-size: 18px; // Mobile
  font-size: 20px; // Desktop (lg:)
  font-weight: 700;
  color: #1F2937;
  cursor: pointer;

  // Hover
  color: #3B82F6;
  text-decoration: underline;

Status Badge:
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;

  Dot:
    width: 10px;
    height: 10px;
    border-radius: 50%;

  Colors by Status:
    Active:
      dot: #10B981;
      text: #10B981;

    Inactive:
      dot: #9CA3AF;
      text: #9CA3AF;

    Suspended:
      dot: #DC2626;
      text: #DC2626;

    Trial:
      dot: #3B82F6;
      text: #3B82F6;

// Details Grid (2-column)
display: grid;
grid-template-columns: 1fr; // Mobile
grid-template-columns: repeat(2, 1fr); // Desktop (sm:)
gap: 8px; // Mobile
gap: 12px; // Desktop (sm:)
margin-bottom: 16px;

Detail Item:
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;

  Emoji/Icon:
    font-size: 16px;

  Value:
    color: #1F2937;
    font-weight: 500;

Detail Fields (in order):
1. Category: "🏷️ Cleaning Services" (with emoji)
2. Subscription: "💳 Professional Plan" OR "⏱️ Trial: 15 days left"
3. Regions: "📍 2 regions" (shows first 2, or count if more)
4. Joined: "📅 Jan 8, 2025"
5. Listings: "📦 12 listings"
6. Rating: "⭐ 4.8 (24 reviews)" (if available)

// Action Buttons Row
display: flex;
gap: 12px;
width: 100%; // Mobile
width: auto; // Desktop

"View Details" Button:
  flex: 1; // Mobile
  flex: none; // Desktop (sm:)
  height: 40px;
  padding: 0 20px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #ffffff;
  color: #1F2937;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  // Hover
  background: #F9FAFB;
  border-color: #1F2937;

"Suspend" Button (for Active/Trial):
  flex: 1; // Mobile
  flex: none; // Desktop (sm:)
  height: 40px;
  padding: 0 20px;
  border: 1px solid #FEE2E2;
  border-radius: 8px;
  background: #ffffff;
  color: #DC2626;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  Icon:
    width: 16px;
    height: 16px;

  // Hover
  background: #FEE2E2;

"Unsuspend" Button (for Suspended):
  // Same as Suspend but green
  border: 1px solid #D1FAE5;
  color: #10B981;
  background: #ffffff;

  // Hover
  background: #D1FAE5;
```

#### Pagination
```tsx
// Container
display: flex;
align-items: center;
justify-content: space-between;
margin-top: 32px;
padding: 20px 0;
border-top: 1px solid #E5E7EB;

// Text (Left)
font-size: 14px;
color: #6B7280;
Example: "Showing 1-20 of 156 vendors"

// Controls (Right)
display: flex;
align-items: center;
gap: 8px;

Previous/Next Buttons:
  height: 40px;
  width: 40px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B7280;
  transition: all 0.2s;

  // Hover (if not disabled)
  background: #F9FAFB;
  border-color: #1F2937;
  color: #1F2937;

  // Disabled
  opacity: 0.5;
  cursor: not-allowed;

  Icon:
    width: 16px;
    height: 16px;

Page Number Buttons:
  height: 40px;
  width: 40px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;

  // Active Page
  background: #1F2937;
  color: #ffffff;
  border-color: #1F2937;

  // Hover (non-active)
  background: #F9FAFB;

Mobile Pagination:
  // Hide page numbers on mobile
  // Show only: "Page 2 of 8" text + Previous/Next
  display: none; // Page number buttons
  display: block; // Mobile (< 640px)

  Text:
    font-size: 14px;
    color: #6B7280;
    margin: 0 12px;
```

#### Empty State
```tsx
// Container
padding: 80px 0;
text-align: center;

Icon Container:
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #F8F9FA;
  margin: 0 auto 24px auto;
  display: flex;
  align-items: center;
  justify-content: center;

  Icon (Building2):
    width: 64px;
    height: 64px;
    color: #9CA3AF;

Heading:
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;

Description:
  font-size: 15px;
  color: #6B7280;
  margin-bottom: 24px;

"Clear Filters" Button:
  height: 44px;
  padding: 0 24px;
  background: #1F2937;
  color: #ffffff;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;

  // Hover
  background: #111827;
```

### Implementation Checklist

**Phase 1: Layout Rebuild (8 hours)**
- [ ] Remove table component entirely
- [ ] Create VendorCard component with exact specs above
- [ ] Implement responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Add vendor logo/fallback icon
- [ ] Implement business name as clickable link
- [ ] Add status badge with dot + text

**Phase 2: Filters (6 hours)**
- [ ] Add Category filter dropdown (9 options)
- [ ] Add Status filter dropdown (4 options)
- [ ] Add Country filter dropdown (dynamic)
- [ ] Add Region filter dropdown (depends on country)
- [ ] Wire filters to API
- [ ] Implement filter reset functionality

**Phase 3: Details Grid (2 hours)**
- [ ] Create 2-column grid for card details
- [ ] Add category with emoji
- [ ] Add subscription/trial countdown
- [ ] Add regions (first 2 or count)
- [ ] Add joined date
- [ ] Add listings count
- [ ] Add rating/reviews (if available)

**Phase 4: Actions (4 hours)**
- [ ] Implement "View Details" button navigation
- [ ] Create Suspend vendor API call
- [ ] Create Unsuspend vendor API call
- [ ] Add confirmation modal for suspend/unsuspend
- [ ] Update vendor status after action
- [ ] Show success/error toast

**Phase 5: Pagination (3 hours)**
- [ ] Implement pagination controls
- [ ] Add "Showing X-Y of Z" text
- [ ] Create page number buttons (hide on mobile)
- [ ] Add "Page X of Y" for mobile
- [ ] Wire pagination to API
- [ ] Handle edge cases (first/last page)

**Phase 6: Polish (2 hours)**
- [ ] Add hover effects on cards
- [ ] Test responsive behavior
- [ ] Add loading states
- [ ] Verify empty state
- [ ] Test all filters together
- [ ] QA against wireframe

**Total Estimated Time: 25 hours**

---

## SCREEN 2: Vendor Orders (`/vendor/orders`)

### Issues
**Current:** Missing filters, flat list, extra tabs
**Wireframe:** Store filter, date range, grouped by store, 3 tabs only
**Impact:** HIGH - Missing key functionality

### Wireframe Specifications

#### Tab Navigation
```tsx
// Container
display: flex;
gap: 0;
border-bottom: 1px solid #E5E7EB;
margin-bottom: 24px;

// Tab Button (3 tabs only!)
Tab Labels:
  1. "Accepted"
  2. "In Progress"
  3. "Completed"

// NO "ALL" TAB
// NO "PENDING" TAB

Button Styling:
  padding: 16px 24px; // Desktop
  padding: 12px 16px; // Mobile
  flex: 1; // Mobile (equal width)
  flex: none; // Desktop (auto width)
  font-size: 15px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px; // Overlap with container border
  transition: all 0.2s;

  // Inactive Tab
  color: #6B7280;
  border-bottom-color: transparent;

  // Inactive Hover
  color: #1F2937;

  // Active Tab
  color: #1F2937;
  border-bottom-color: #1F2937;

Badge (Order Count):
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;

  // Active Tab Badge
  background: #FEF3C7;
  color: #92400E;

  // Inactive Tab Badge
  background: #F3F4F6;
  color: #6B7280;
```

#### Filter Section
```tsx
// Container
display: grid;
grid-template-columns: 1fr; // Mobile
grid-template-columns: repeat(3, 1fr); // Desktop (sm:)
gap: 16px;
margin-bottom: 24px;
padding: 24px;
padding-bottom: 16px;
border-bottom: 1px solid #E5E7EB;

// Store Filter Dropdown
width: 100%; // Mobile
width: 240px; // Desktop (sm:)
height: 48px;
padding: 0 40px 0 16px;
border: 1px solid #E5E7EB;
border-radius: 10px;
background: #ffffff;
font-size: 15px;
color: #1F2937;

Options:
  "All Stores"
  "Main Location"
  "Downtown Store"
  "Northside Branch"
  (Dynamic based on vendor's stores)

// Search Input
flex: 1;
height: 48px;
padding: 0 16px 0 48px;
border: 1px solid #E5E7EB;
border-radius: 10px;
font-size: 15px;
placeholder: "Search orders..."

Icon (Search):
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #9CA3AF;

// Date Range Picker
width: 100%; // Mobile
width: 240px; // Desktop (sm:)
height: 48px;
padding: 0 40px 0 16px;
border: 1px solid #E5E7EB;
border-radius: 10px;
background: #ffffff;
font-size: 15px;
color: #1F2937;

// Opens calendar popup on click
// Format: "Jan 1 - Jan 15, 2026"
// Clear button to reset
```

#### Order Grouping by Store (CRITICAL)
```tsx
// Store Group Container
margin-bottom: 32px;

// Store Header
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 16px;

Store Name:
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;

Order Count:
  font-size: 14px;
  color: #6B7280;
  Example: "4 orders"

// Orders List (within group)
display: flex;
flex-direction: column;
gap: 12px;
```

#### Order Card
```tsx
// Card Container
background: #ffffff;
border: 1px solid #E5E7EB;
border-radius: 16px;
padding: 16px; // Mobile
padding: 20px; // Desktop (sm:)
display: flex;
flex-direction: column; // Mobile
flex-direction: row; // Desktop (lg:)
gap: 16px;
transition: all 0.2s;

// Hover
border-color: #9CA3AF;
cursor: pointer;

// Left Section (Order Info)
flex: 1;
display: flex;
flex-direction: column;
gap: 12px;

// Row 1: Order Number + Service Name
Order Number:
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  Example: "CLN-12345"

Separator:
  " • "
  color: #9CA3AF;

Service Name:
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  Example: "Deep Home Cleaning"

// Row 2: Order Metadata
display: grid;
grid-template-columns: 1fr; // Mobile
grid-template-columns: repeat(2, 1fr); // Tablet (md:)
gap: 12px;

Each Metadata Item:
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;

  Icon:
    width: 16px;
    height: 16px;
    color: #9CA3AF;

  Value:
    color: #1F2937;
    font-weight: 500;

Metadata Fields:
1. Customer: User icon + "John Doe"
2. Date/Time: Calendar icon + "Jan 8, 10:00 AM"
3. Price: DollarSign icon + "$125.00" (bold)
4. Items: Package icon + "3 items" (only for delivery orders)

// Right Section (Action Button)
width: 100%; // Mobile
width: auto; // Desktop (sm:)
min-width: 160px; // Desktop

Button Styling:
  height: 40px;
  padding: 0 20px;
  background: #1F2937;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  Icon:
    width: 16px;
    height: 16px;

  // Hover
  background: #111827;

  // Hide text on mobile, show icon + chevron
  span:
    display: none; // Mobile
    display: inline; // Desktop (sm:)

Button Text by Status:
  Accepted: "Mark In Progress" (Clock icon)
  In Progress: "Mark as Complete" (Check icon)
  Completed: "View Receipt" (FileText icon)
```

#### Empty State
```tsx
// Container
padding: 80px 0;
text-align: center;

Icon (Package):
  width: 64px;
  height: 64px;
  color: #9CA3AF;
  margin: 0 auto 16px;

Text:
  font-size: 15px;
  color: #6B7280;
  Example: "No orders found in this status"
```

### Implementation Checklist

**Phase 1: Tab Structure (1 hour)**
- [ ] Remove "ALL" and "PENDING" tabs
- [ ] Keep only: Accepted, In Progress, Completed
- [ ] Style tabs exactly as wireframe
- [ ] Add count badges with correct colors
- [ ] Test tab switching

**Phase 2: Filters (6 hours)**
- [ ] Add Store filter dropdown
  - [ ] Fetch vendor's stores from API
  - [ ] Show "All Stores" option
  - [ ] Filter orders by selected store
- [ ] Add Date Range picker
  - [ ] Implement calendar component
  - [ ] Format: "MMM DD - MMM DD, YYYY"
  - [ ] Filter orders by date range
  - [ ] Add clear button
- [ ] Wire all filters together
- [ ] Test filter combinations

**Phase 3: Grouping by Store (4 hours)**
- [ ] Group orders by store_name
- [ ] Show store header with name + count
- [ ] Display orders under each store
- [ ] Handle "All Stores" view (no grouping)
- [ ] Test with multiple stores
- [ ] Handle single store (no header)

**Phase 4: Order Card Updates (3 hours)**
- [ ] Verify card layout matches wireframe
- [ ] Fix metadata grid (2 columns on tablet+)
- [ ] Ensure icon sizes are 16×16px
- [ ] Update button text per status
- [ ] Test responsive card layout
- [ ] Verify hover effects

**Phase 5: Status-specific Actions (2 hours)**
- [ ] "Accepted" → "Mark In Progress" (Clock icon)
- [ ] "In Progress" → "Mark as Complete" (Check icon)
- [ ] "Completed" → "View Receipt" (FileText icon)
- [ ] Wire buttons to API endpoints
- [ ] Show loading state during update
- [ ] Refresh list after status change

**Phase 6: Badge Colors (1 hour)**
- [ ] Active tab badge: #FEF3C7 bg, #92400E text
- [ ] Inactive tab badge: #F3F4F6 bg, #6B7280 text
- [ ] Verify exact color codes
- [ ] Test in different states

**Total Estimated Time: 17 hours**

---

## SCREEN 3: Vendor Dashboard (`/vendor`)

### Issues
**Current:** Extra stats card, wrong colors, extra quick actions
**Wireframe:** 3 stats cards, specific badge colors
**Impact:** MEDIUM - Extra features added

### Wireframe Specifications

#### Stats Cards Grid
```tsx
// Container
display: grid;
grid-template-columns: 1fr; // Mobile
grid-template-columns: repeat(3, 1fr); // Desktop (md:)
gap: 24px;
margin-bottom: 32px;

// Card (3 cards only!)
Cards:
  1. "Total Earnings"
  2. "Orders This Month"
  3. "Active Listings"

// NO 4th card (remove extra)

// Card Container
background: #ffffff;
border: 1px solid #E5E7EB;
border-radius: 20px; // IMPORTANT: 20px not 12px!
padding: 24px;
min-height: 140px;
display: flex;
flex-direction: column;
justify-content: space-between;

// Icon Badge
width: 48px;
height: 48px;
border-radius: 12px;
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 16px;

Icon:
  width: 24px;
  height: 24px;

Badge Colors by Card:
  Earnings:
    background: #D1FAE5;
    icon-color: #065F46;

  Orders:
    background: #DBEAFE;
    icon-color: #1E40AF;

  Listings:
    background: #FEF3C7;
    icon-color: #92400E;

// Label
font-size: 14px;
color: #6B7280;
margin-bottom: 8px;

// Value
font-size: 32px;
font-weight: 700;
color: #1F2937;
margin-bottom: 8px;

// Trend Badge
display: flex;
align-items: center;
gap: 4px;
padding: 4px 8px;
border-radius: 8px;
font-size: 12px;
font-weight: 600;

Background matches icon badge color
Text color matches icon color

Trend Icon:
  width: 12px;
  height: 12px;

Example: "+12.5% from last month"
```

#### Recent Orders Section
```tsx
// Section Header
font-size: 18px;
font-weight: 700;
color: #1F2937;
margin-bottom: 16px;

// Orders Table/List
// Wireframe shows simplified list, implementation has full table
// Current implementation is acceptable IF styled correctly

// Verify table styling:
Row Height: 64px;
Border: 1px solid #E5E7EB (between rows);
Hover: background #F9FAFB;

Columns:
  1. Order ID (8 chars)
  2. Service (listing title)
  3. Customer (name or email prefix)
  4. Status (badge)
  5. Amount (bold, right-aligned)

Status Badge Colors:
  PENDING: warning (#FEF3C7 bg, #92400E text)
  ACCEPTED: secondary (#DBEAFE bg, #1E40AF text)
  IN_PROGRESS: default (#F3F4F6 bg, #6B7280 text)
  COMPLETED: success (#D1FAE5 bg, #065F46 text)
```

#### Trial Banner (If Trial Active)
```tsx
// Container
background: #FEF3C7;
border: 1px solid #FDE68A;
border-radius: 12px;
padding: 16px;
margin-bottom: 24px;
display: flex;
align-items: center;
gap: 12px;

Icon (Clock):
  width: 20px;
  height: 20px;
  color: #92400E;

// Content
flex: 1;

Title:
  font-size: 15px;
  font-weight: 600;
  color: #92400E;
  margin-bottom: 4px;

Message:
  font-size: 14px;
  color: #92400E;
  Example: "Your free trial ends January 22, 2026"

// CTA Link
font-size: 14px;
font-weight: 500;
color: #92400E;
text-decoration: underline;
hover: opacity 0.8;
```

### Implementation Checklist

**Phase 1: Stats Cards (2 hours)**
- [ ] Remove 4th stats card (keep only 3)
- [ ] Change border-radius to 20px (rounded-2xl)
- [ ] Update icon badge colors:
  - [ ] Earnings: #D1FAE5 bg, #065F46 icon
  - [ ] Orders: #DBEAFE bg, #1E40AF icon
  - [ ] Listings: #FEF3C7 bg, #92400E icon
- [ ] Update trend badge colors (match icon badge)
- [ ] Verify spacing: 24px gap, 24px padding

**Phase 2: Recent Orders (2 hours)**
- [ ] Verify table row height is 64px
- [ ] Add hover state (#F9FAFB background)
- [ ] Update status badge colors:
  - [ ] PENDING: #FEF3C7 bg, #92400E text
  - [ ] ACCEPTED: #DBEAFE bg, #1E40AF text
  - [ ] IN_PROGRESS: #F3F4F6 bg, #6B7280 text
  - [ ] COMPLETED: #D1FAE5 bg, #065F46 text
- [ ] Limit to 5 most recent
- [ ] Add "View all →" link

**Phase 3: Trial Banner (1 hour)**
- [ ] Verify exact colors (#FEF3C7 bg, #92400E text)
- [ ] Show only when subscriptionStatus === "TRIAL"
- [ ] Calculate and display days remaining
- [ ] Link to /vendor/subscription

**Phase 4: Quick Actions (Decision)**
- [ ] **DECISION NEEDED**: Keep or remove quick action cards?
  - Not in wireframe
  - But might be useful
  - Ask client for approval
- [ ] If keeping: verify styling matches
- [ ] If removing: delete component

**Total Estimated Time: 5-7 hours** (depending on quick actions decision)

---

## 🟡 PRIORITY 2: CATEGORY-SPECIFIC LISTING FORMS

### 🚨 CRITICAL ISSUE
**Current:** Generic form for all categories
**Wireframe:** 9 separate forms with category-specific fields
**Impact:** HIGH - Missing key functionality for each service type

### Form Files Needed (9 total)

1. **VendorCleaningServiceForm.tsx**
2. **VendorHandymanServiceForm.tsx**
3. **VendorBeautyServiceForm.tsx**
4. **VendorBeautyProductForm.tsx**
5. **VendorGroceryForm.tsx**
6. **VendorFoodForm.tsx**
7. **VendorRentalPropertyForm.tsx**
8. **VendorRideAssistanceForm.tsx**
9. **VendorCompanionshipSupportForm.tsx**

---

### FORM 1: Cleaning Service Form

**File:** `/vendor/listings/new/cleaning` or route via category param

#### Form Sections

**Section 1: Service Details**
```tsx
// Service Title
label: "Service Title"
required: true
placeholder: "e.g., Deep Home Cleaning"
maxLength: 100

// Service Type
label: "Service Type"
required: true
type: select
options:
  - "Residential Cleaning"
  - "Commercial Cleaning"
  - "Deep Cleaning"
  - "Move-In/Move-Out Cleaning"
  - "Post-Construction Cleaning"
  - "Carpet & Upholstery Cleaning"
  - "Window Cleaning"
  - "Specialty Cleaning"

// Description
label: "Description"
required: true
type: textarea
rows: 5
placeholder: "Describe your cleaning service in detail..."
maxLength: 500
```

**Section 2: Pricing & Service Details**
```tsx
// Layout: 2-column grid on desktop

// Price Type
label: "Price Type"
required: true
type: select
options:
  - "Fixed Price"
  - "Hourly Rate"
  - "Per Square Foot"

// Price
label: "Price"
required: true
type: number
prefix: "$"
min: 0
step: 0.01
placeholder: "0.00"

// Estimated Duration
label: "Estimated Duration (hours)"
required: false
type: number
min: 0.5
step: 0.5
placeholder: "e.g., 2.5"

// Typical Area Size
label: "Typical Area Size (sq ft)"
required: false
type: number
min: 0
placeholder: "e.g., 1500"

// Service Frequency
label: "Service Frequency"
required: false
type: select
options:
  - "One-Time"
  - "Weekly"
  - "Bi-Weekly"
  - "Monthly"
  - "Custom Schedule"

// Status
label: "Status"
required: true
type: select
options:
  - "Active"
  - "Inactive"
default: "Active"
```

**Section 3: What's Included**
```tsx
// Dynamic list component
label: "What's Included"
description: "Add items that are included in this service"

// Default items (for new form)
defaultItems: [
  "All cleaning supplies provided",
  "Trash removal",
  "Vacuum and mop all floors"
]

// Add Item Input
placeholder: "Add an included item..."
button: "Add" (Plus icon)
onEnter: Add item to list

// Item List
Each item:
  - Text display
  - Remove button (Trash icon, color: #DC2626)

minimum: 1 item required
```

**Section 4: Service Images**
```tsx
// Image Upload Area
label: "Service Images"
description: "Upload photos of your work (PNG, JPG, or WEBP, max 5MB each)"

// Upload Zone
border: 2px dashed #E5E7EB
border-radius: 12px
padding: 48px
background: #F9FAFB
text-align: center

Drag & Drop Text:
  "Drag and drop your images here"
  color: #6B7280
  font-size: 15px

OR:
  color: #9CA3AF
  font-size: 14px

"Choose Files" Button:
  height: 40px
  padding: 0 20px
  background: #1F2937
  color: #ffffff
  border-radius: 8px

Max Files: 5
Accepted: image/png, image/jpeg, image/webp
Max Size: 5MB per file

// Preview Grid (after upload)
display: grid
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))
gap: 12px

Preview Item:
  width: 120px
  height: 120px
  border-radius: 8px
  position: relative

  Image:
    width: 100%
    height: 100%
    object-fit: cover

  Remove Button (top-right):
    position: absolute
    top: 4px
    right: 4px
    width: 24px
    height: 24px
    background: rgba(0, 0, 0, 0.7)
    color: #ffffff
    border-radius: 4px
    display: flex
    align-items: center
    justify-content: center

    Icon (X):
      width: 14px
      height: 14px
```

**Form Footer Actions**
```tsx
// Container
display: flex
gap: 12px
justify-content: flex-end
padding-top: 24px
border-top: 1px solid #E5E7EB
margin-top: 32px

// Cancel Button
variant: outline
height: 44px
padding: 0 24px
border: 1px solid #E5E7EB
color: #6B7280
background: #ffffff

hover:
  background: #F9FAFB
  border-color: #1F2937
  color: #1F2937

// Save Button
variant: primary
height: 44px
padding: 0 24px
background: #1F2937
color: #ffffff
font-weight: 500

Loading State:
  disabled: true
  opacity: 0.7
  cursor: not-allowed

  Spinner Icon:
    width: 16px
    height: 16px
    margin-right: 8px
    animation: spin

hover (not loading):
  background: #111827

Button Text:
  Create Mode: "Create Listing"
  Edit Mode: "Save Changes"
```

### Implementation Checklist: Cleaning Form

**Phase 1: Form Structure (3 hours)**
- [ ] Create `/vendor/listings/new/cleaning` route
- [ ] Set up form state management (React Hook Form)
- [ ] Create 4 section layout
- [ ] Add form validation schema (Zod or Yup)

**Phase 2: Service Details Section (2 hours)**
- [ ] Service Title input
- [ ] Service Type dropdown (8 options)
- [ ] Description textarea
- [ ] Wire validation

**Phase 3: Pricing Section (2 hours)**
- [ ] Price Type dropdown
- [ ] Price input with $ prefix
- [ ] Estimated Duration input
- [ ] Typical Area Size input
- [ ] Service Frequency dropdown
- [ ] Status dropdown
- [ ] Implement 2-column grid

**Phase 4: What's Included (3 hours)**
- [ ] Create dynamic list component
- [ ] Add item input with plus button
- [ ] Implement add on Enter key
- [ ] Remove item functionality
- [ ] Default items for new form
- [ ] Minimum 1 item validation

**Phase 5: Image Upload (4 hours)**
- [ ] Implement drag & drop area
- [ ] File selection button
- [ ] File type validation
- [ ] File size validation (5MB max)
- [ ] Image preview grid
- [ ] Remove image functionality
- [ ] Max 5 images validation

**Phase 6: Form Actions (2 hours)**
- [ ] Cancel button (navigate back)
- [ ] Save button with loading state
- [ ] Form submission to API
- [ ] Success/error handling
- [ ] Navigate to listings after save

**Total Time per Form: ~16 hours**

---

### FORM 2: Handyman Service Form

**File:** `/vendor/listings/new/handyman`

#### Unique Fields for Handyman

**Service Type Options** (different from cleaning):
- "Plumbing Repairs"
- "Electrical Work"
- "Carpentry"
- "Painting"
- "Drywall Repair"
- "Furniture Assembly"
- "TV Mounting"
- "General Repairs"
- "Home Maintenance"

**Additional Handyman Fields:**
```tsx
// Emergency Service
label: "Emergency Service Available"
type: checkbox
description: "Check if you offer 24/7 emergency services"

// Service Areas (Specialties)
label: "Service Areas"
type: multi-select
options:
  - "Kitchen"
  - "Bathroom"
  - "Bedroom"
  - "Living Room"
  - "Basement"
  - "Garage"
  - "Outdoor"
  - "Whole House"

// License/Certification
label: "License Number (if applicable)"
type: text
required: false
placeholder: "Enter license or certification number"
```

All other sections same as Cleaning Form.

---

### FORM 3: Beauty Service Form

**File:** `/vendor/listings/new/beauty-service`

#### Unique Fields for Beauty

**Service Type Options:**
- "Haircut & Styling"
- "Hair Coloring"
- "Manicure"
- "Pedicure"
- "Facial Treatment"
- "Makeup Application"
- "Eyelash Extensions"
- "Waxing"
- "Massage Therapy"
- "Skincare Treatment"

**Additional Beauty Fields:**
```tsx
// Service Duration
label: "Service Duration"
required: true
type: number
min: 15
step: 15
suffix: "minutes"
placeholder: "e.g., 60"

// Appointment Type
label: "Appointment Type"
type: select
options:
  - "In-Salon Only"
  - "Mobile Service (I travel to client)"
  - "Both In-Salon and Mobile"

// Products Used
label: "Products/Brands Used"
type: textarea
rows: 3
placeholder: "List the products or brands you use..."

// Certifications
label: "Certifications"
type: textarea
rows: 2
placeholder: "List any relevant certifications or training..."
```

---

### FORM 4: Beauty Product Form

**File:** `/vendor/listings/new/beauty-product`

#### Unique Fields for Products

**Product Type Options:**
- "Haircare"
- "Skincare"
- "Makeup"
- "Nails"
- "Fragrances"
- "Tools & Accessories"
- "Bath & Body"
- "Men's Grooming"

**Additional Product Fields:**
```tsx
// Brand
label: "Brand"
required: true
type: text
placeholder: "Product brand name"

// Size/Quantity
label: "Size/Quantity"
required: true
type: text
placeholder: "e.g., 100ml, 50g, 1 unit"

// Stock Quantity
label: "Stock Quantity"
required: true
type: number
min: 0
placeholder: "Available units"

// SKU/Product Code
label: "SKU/Product Code"
required: false
type: text
placeholder: "Internal product code"

// Ingredients (for skincare/cosmetics)
label: "Key Ingredients"
type: textarea
rows: 3
placeholder: "List main ingredients..."

// Product Condition
label: "Condition"
type: select
options:
  - "New"
  - "Like New"
  - "Gently Used"

// Remove: Duration, Appointment Type
// Change "Price" to "Unit Price"
```

---

### FORM 5: Grocery Form

**File:** `/vendor/listings/new/grocery`

#### Unique Fields for Grocery

**Product Type Options:**
- "Fresh Produce"
- "Dairy & Eggs"
- "Meat & Seafood"
- "Bakery"
- "Pantry Staples"
- "Beverages"
- "Frozen Foods"
- "Snacks"
- "International Foods"

**Additional Grocery Fields:**
```tsx
// Unit of Sale
label: "Unit of Sale"
required: true
type: select
options:
  - "Per Item"
  - "Per Pound (lb)"
  - "Per Kilogram (kg)"
  - "Per Bunch"
  - "Per Dozen"
  - "Per Package"

// Stock Quantity
label: "Stock Quantity"
required: true
type: number
min: 0

// Organic/Certification
label: "Certifications"
type: multi-select
options:
  - "Organic"
  - "Non-GMO"
  - "Gluten-Free"
  - "Vegan"
  - "Kosher"
  - "Halal"
  - "Local"

// Expiration Tracking
label: "Perishable Item"
type: checkbox
description: "Check if this item has an expiration date"

// Storage Instructions
label: "Storage Instructions"
type: textarea
rows: 2
placeholder: "e.g., Keep refrigerated, Store in cool dry place"

// Remove: Duration, Frequency
```

---

### FORM 6: Food (Restaurant) Form

**File:** `/vendor/listings/new/food`

#### Unique Fields for Food/Restaurant

**Meal Type Options:**
- "Breakfast"
- "Lunch"
- "Dinner"
- "Appetizers"
- "Desserts"
- "Beverages"
- "Combo Meals"
- "Catering"

**Cuisine Type Options:**
- "American"
- "Italian"
- "Mexican"
- "Chinese"
- "Indian"
- "Japanese"
- "Thai"
- "Mediterranean"
- "BBQ"
- "Vegan/Vegetarian"

**Additional Food Fields:**
```tsx
// Cuisine Type
label: "Cuisine Type"
required: true
type: select
options: (see above)

// Meal Type
label: "Meal Type"
required: true
type: multi-select
options: (see above)

// Portion Size
label: "Portion Size"
required: true
type: select
options:
  - "Small"
  - "Medium"
  - "Large"
  - "Family Size"
  - "Individual"

// Preparation Time
label: "Preparation Time"
required: true
type: number
min: 5
step: 5
suffix: "minutes"

// Dietary Info
label: "Dietary Information"
type: multi-select
options:
  - "Vegetarian"
  - "Vegan"
  - "Gluten-Free"
  - "Dairy-Free"
  - "Nut-Free"
  - "Halal"
  - "Kosher"
  - "Keto"
  - "Low-Carb"

// Allergen Information
label: "Contains Allergens"
type: multi-select
options:
  - "Nuts"
  - "Dairy"
  - "Eggs"
  - "Soy"
  - "Wheat/Gluten"
  - "Shellfish"
  - "Fish"

// Spice Level
label: "Spice Level"
type: select
options:
  - "Not Spicy"
  - "Mild"
  - "Medium"
  - "Hot"
  - "Extra Hot"

// Customization Options
label: "Customization Available"
type: checkbox
description: "Can customers customize this dish?"

// Minimum Order
label: "Minimum Order Quantity"
type: number
min: 1
default: 1
```

---

### FORM 7: Rental Property Form

**File:** `/vendor/listings/new/rental`

#### Unique Fields for Rentals

**Property Type Options:**
- "Apartment"
- "House"
- "Condo"
- "Townhouse"
- "Studio"
- "Room"
- "Vacation Rental"

**Additional Rental Fields:**
```tsx
// Property Type
label: "Property Type"
required: true
type: select
options: (see above)

// Address
label: "Property Address"
required: true
type: text
placeholder: "Street address"

// City
label: "City"
required: true

// State/Province
label: "State/Province"
required: true

// ZIP/Postal Code
label: "ZIP/Postal Code"
required: true

// Bedrooms
label: "Bedrooms"
required: true
type: number
min: 0
max: 10

// Bathrooms
label: "Bathrooms"
required: true
type: number
min: 0.5
step: 0.5
max: 10

// Square Footage
label: "Square Footage"
required: true
type: number
min: 0

// Rental Period
label: "Rental Period"
required: true
type: select
options:
  - "Daily"
  - "Weekly"
  - "Monthly"
  - "Long-term (6+ months)"
  - "Flexible"

// Minimum Stay
label: "Minimum Stay"
type: number
suffix: "days"
min: 1

// Maximum Stay
label: "Maximum Stay"
type: number
suffix: "months"
min: 1

// Available From
label: "Available From"
type: date
min: today

// Amenities
label: "Amenities"
type: multi-select
options:
  - "WiFi"
  - "Air Conditioning"
  - "Heating"
  - "Parking"
  - "Washer/Dryer"
  - "Dishwasher"
  - "Pool"
  - "Gym"
  - "Elevator"
  - "Balcony/Patio"
  - "Pet-Friendly"
  - "Furnished"

// Utilities Included
label: "Utilities Included"
type: multi-select
options:
  - "Electricity"
  - "Water"
  - "Gas"
  - "Internet"
  - "Cable TV"
  - "Trash"

// Deposit Required
label: "Security Deposit"
type: number
prefix: "$"
min: 0

// Pets Allowed
label: "Pets Allowed"
type: select
options:
  - "No Pets"
  - "Cats Only"
  - "Dogs Only"
  - "Cats & Dogs"
  - "All Pets"

// Smoking Allowed
label: "Smoking"
type: select
options:
  - "No Smoking"
  - "Outside Only"
  - "Allowed"

// Change "Price" to "Monthly Rent" or "Nightly Rate" based on period
// Remove: Duration, Frequency
// Keep: What's Included (for amenities narrative)
```

---

### FORM 8: Ride Assistance Form

**File:** `/vendor/listings/new/ride-assistance`

#### Unique Fields for Ride Assistance

**Service Type Options:**
- "Medical Appointments"
- "Grocery Shopping"
- "Airport Transfers"
- "Social Outings"
- "General Transportation"

**Additional Ride Fields:**
```tsx
// Service Type
label: "Service Type"
required: true
type: select
options: (see above)

// Vehicle Type
label: "Vehicle Type"
required: true
type: select
options:
  - "Sedan"
  - "SUV"
  - "Van"
  - "Wheelchair Accessible Van"
  - "Luxury Vehicle"

// Passenger Capacity
label: "Passenger Capacity"
required: true
type: number
min: 1
max: 15

// Wheelchair Accessible
label: "Wheelchair Accessible"
type: checkbox

// Service Radius
label: "Service Radius"
required: true
type: number
suffix: "miles"
placeholder: "Maximum distance you'll travel"

// Pricing Model
label: "Pricing Model"
required: true
type: select
options:
  - "Per Mile"
  - "Per Hour"
  - "Flat Rate Per Trip"
  - "Custom Quote"

// Base Price
label: "Base Price"
required: true
type: number
prefix: "$"

// Price Per Mile (if applicable)
label: "Price Per Mile"
type: number
prefix: "$"
conditional: show if pricing model = "Per Mile"

// Price Per Hour (if applicable)
label: "Price Per Hour"
type: number
prefix: "$"
conditional: show if pricing model = "Per Hour"

// Wait Time Fee
label: "Wait Time Fee (per 15 min)"
type: number
prefix: "$"
required: false

// Advance Booking Required
label: "Advance Booking Required"
type: select
options:
  - "Same Day OK"
  - "24 Hours"
  - "48 Hours"
  - "1 Week"

// Additional Services
label: "Additional Services"
type: multi-select
options:
  - "Door-to-Door Assistance"
  - "Grocery Carry Help"
  - "Accompaniment Inside"
  - "Round Trip Discount"
  - "Recurring Rides Discount"

// Insurance/License
label: "License Number"
required: true
type: text

// Remove: What's Included section (use Additional Services instead)
// Keep: Images (for vehicle photos)
```

---

### FORM 9: Companionship Support Form

**File:** `/vendor/listings/new/companionship`

#### Unique Fields for Companionship

**Service Type Options:**
- "In-Home Companionship"
- "Social Outings"
- "Meal Preparation"
- "Light Housekeeping"
- "Medication Reminders"
- "Pet Care Assistance"
- "Overnight Care"

**Additional Companionship Fields:**
```tsx
// Service Type
label: "Service Type"
required: true
type: multi-select
options: (see above)

// Experience Level
label: "Experience Level"
required: true
type: select
options:
  - "Entry Level (< 1 year)"
  - "Experienced (1-3 years)"
  - "Very Experienced (3-5 years)"
  - "Expert (5+ years)"

// Certifications
label: "Certifications & Training"
type: multi-select
options:
  - "First Aid/CPR"
  - "CNA (Certified Nursing Assistant)"
  - "Home Health Aide"
  - "Dementia Care Training"
  - "Alzheimer's Care Training"
  - "Hospice Care Training"

// Languages Spoken
label: "Languages Spoken"
type: multi-select
options:
  - "English"
  - "Spanish"
  - "French"
  - "Mandarin"
  - "Cantonese"
  - "Hindi"
  - "Arabic"
  - "Other"

// Availability
label: "Availability"
type: multi-select
options:
  - "Weekday Mornings"
  - "Weekday Afternoons"
  - "Weekday Evenings"
  - "Weekend Mornings"
  - "Weekend Afternoons"
  - "Weekend Evenings"
  - "Overnight"
  - "Live-In Available"

// Minimum Hours
label: "Minimum Hours Per Visit"
type: number
min: 1
max: 24
suffix: "hours"

// Maximum Hours
label: "Maximum Hours Per Visit"
type: number
min: 1
max: 24
suffix: "hours"

// Hourly Rate
label: "Hourly Rate"
required: true
type: number
prefix: "$"
min: 0

// Overnight Rate (if applicable)
label: "Overnight Rate (8+ hours)"
type: number
prefix: "$"
conditional: show if Availability includes "Overnight"

// Background Check
label: "Background Check"
type: checkbox
description: "I have completed a background check"

// References Available
label: "References Available"
type: checkbox

// Special Skills
label: "Special Skills/Experience"
type: textarea
rows: 3
placeholder: "e.g., Diabetes management, mobility assistance, cooking special diets..."

// Remove: Pricing Type dropdown (always hourly)
// Keep: What's Included (for tasks/activities included)
```

---

### Form Router Implementation

**File:** `/vendor/listings/new/page.tsx` or `/vendor/listings/[category]/page.tsx`

```tsx
// Route structure option 1: Dynamic
/vendor/listings/new/[category]

// Route structure option 2: Separate routes
/vendor/listings/new/cleaning
/vendor/listings/new/handyman
/vendor/listings/new/beauty-service
/vendor/listings/new/beauty-product
/vendor/listings/new/grocery
/vendor/listings/new/food
/vendor/listings/new/rental
/vendor/listings/new/ride-assistance
/vendor/listings/new/companionship

// Component Selection
switch (category) {
  case 'cleaning':
    return <VendorCleaningServiceForm />;
  case 'handyman':
    return <VendorHandymanServiceForm />;
  case 'beauty-service':
    return <VendorBeautyServiceForm />;
  case 'beauty-product':
    return <VendorBeautyProductForm />;
  case 'grocery':
    return <VendorGroceryForm />;
  case 'food':
    return <VendorFoodForm />;
  case 'rental':
    return <VendorRentalPropertyForm />;
  case 'ride-assistance':
    return <VendorRideAssistanceForm />;
  case 'companionship':
    return <VendorCompanionshipSupportForm />;
  default:
    // Show category selection screen
}
```

### Total Implementation Time Estimate

| Form | Est. Hours |
|------|------------|
| Cleaning Service | 16h |
| Handyman Service | 14h (reuse base) |
| Beauty Service | 14h |
| Beauty Product | 12h (simpler) |
| Grocery | 13h |
| Food/Restaurant | 15h (complex) |
| Rental Property | 16h (many fields) |
| Ride Assistance | 14h |
| Companionship | 15h |
| Router/Selection | 4h |
| **TOTAL** | **~133 hours** |

**Recommendation:** Create base form component with shared sections, then extend for each category. This could reduce time to ~80-100 hours.

---

## 🔵 PRIORITY 3: ADDITIONAL MISSING SCREENS

### Admin: Geographic Regions Management

**Screen:** `/admin/regions` or `/admin/settings/regions`
**Wireframe:** `GeographicRegions.tsx`
**Status:** ❌ Missing

#### Purpose
Allow admin (Michelle) to define which geographic regions/cities are active in the platform.

#### Specifications

```tsx
// Page Header
title: "Geographic Regions"
subtitle: "Manage active service regions"

// Country Tabs
tabs: ["United States", "Canada", "Other Countries"]
active indicator: underline + bold

// Region List per Country
display: grid
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
gap: 12px

// Region Card
background: #ffffff
border: 1px solid #E5E7EB
border-radius: 12px
padding: 16px
display: flex
align-items: center
justify-content: space-between

Region Name:
  font-size: 15px
  font-weight: 500
  color: #1F2937

Toggle Switch:
  width: 44px
  height: 24px
  background: #D1FAE5 (active) or #E5E7EB (inactive)
  border-radius: 12px

  Handle:
    width: 20px
    height: 20px
    background: #ffffff
    border-radius: 50%
    transition: transform 0.2s

Active Count:
  font-size: 13px
  color: #6B7280
  Example: "12 vendors active"

// Add Region Button
position: fixed or absolute top-right
height: 44px
padding: 0 20px
background: #1F2937
color: #ffffff
border-radius: 8px

Modal for Add Region:
  - Country dropdown
  - State/Province dropdown (if USA/Canada)
  - City name input
  - ZIP code (optional)
  - Save/Cancel buttons
```

**Implementation Time:** 8 hours

---

### Vendor: Service Area Management

**Screen:** `/vendor/areas` or `/vendor/settings/areas`
**Wireframe:** `VendorGeographicRegions.tsx`
**Status:** ❌ Missing

#### Purpose
Allow vendors to select which regions they serve and toggle them on/off.

#### Specifications

```tsx
// Page Header
title: "Service Areas"
subtitle: "Manage where you provide services"

// Active Regions Section
heading: "Your Service Areas"
margin-bottom: 24px

// Region List
display: flex
flex-direction: column
gap: 12px

// Region Card
background: #ffffff
border: 1px solid #E5E7EB
border-radius: 12px
padding: 16px
display: flex
align-items: center
justify-content: space-between

Region Display:
  Icon (MapPin): 20×20px, color #6B7280

  Text Container:
    Region Name:
      font-size: 16px
      font-weight: 600
      color: #1F2937

    ZIP Codes (if any):
      font-size: 14px
      color: #6B7280
      Example: "90001, 90002, 90003"

Status Toggle:
  Active:
    background: #D1FAE5
    text: "Active" (#065F46)
    toggle: ON position

  Paused:
    background: #FEF3C7
    text: "Paused" (#92400E)
    toggle: OFF position

Actions:
  Edit button (Pencil icon)
  Remove button (Trash icon, #DC2626)

// Add Region Button
position: top-right
height: 44px
padding: 0 20px
background: #1F2937
color: #ffffff

Modal for Add Region:
  - Country dropdown (pre-select current)
  - State/Province dropdown
  - City dropdown or input
  - ZIP codes input (comma-separated)
  - Toggle: Active by default
  - Save/Cancel

// Empty State
Icon: MapPin (64×64px, #9CA3AF)
Heading: "No service areas yet"
Description: "Add regions where you provide services"
Button: "Add Your First Region"
```

**Implementation Time:** 8 hours

---

### Vendor: Store Management (for Groceries/Food)

**Screens:**
- `/vendor/stores` (list)
- `/vendor/stores/new` (create)
- `/vendor/stores/[id]` (detail/edit)

**Wireframes:**
- `VendorStoreListings.tsx`
- `VendorStoreForm.tsx`
- `VendorStoreDetails.tsx`

**Status:** ❌ Missing

#### Purpose
Grocery and food vendors can have multiple store locations. Each store can have its own inventory/menu.

#### Store List Specifications

```tsx
// Page Header
title: "My Stores"
subtitle: "Manage your store locations"

// Add Store Button
position: top-right

// Store Card Grid
display: grid
grid-template-columns: 1fr (mobile)
grid-template-columns: repeat(2, 1fr) (tablet)
grid-template-columns: repeat(3, 1fr) (desktop)
gap: 20px

// Store Card
background: #ffffff
border: 1px solid #E5E7EB
border-radius: 16px
padding: 20px
min-height: 200px

Store Image:
  width: 100%
  height: 160px
  border-radius: 12px
  object-fit: cover
  margin-bottom: 16px

  // Fallback
  background: #F9FAFB
  icon: Store (48×48px, #9CA3AF)

Store Name:
  font-size: 18px
  font-weight: 700
  color: #1F2937
  margin-bottom: 8px

Address:
  font-size: 14px
  color: #6B7280
  icon: MapPin (16×16px)
  margin-bottom: 12px

Stats Row:
  display: flex
  gap: 16px
  margin-bottom: 16px

  Each Stat:
    font-size: 13px
    color: #6B7280

    Value:
      font-size: 16px
      font-weight: 600
      color: #1F2937

  Stats:
    - Products/Items count
    - Orders count
    - Status (Open/Closed)

Action Buttons:
  display: flex
  gap: 8px

  "Manage Items" Button:
    flex: 1
    height: 40px
    background: #1F2937
    color: #ffffff

  Edit Button:
    width: 40px
    height: 40px
    border: 1px solid #E5E7EB
    icon: Pencil

  More Menu:
    width: 40px
    height: 40px
    border: 1px solid #E5E7EB
    icon: MoreVertical

    Dropdown:
      - View Details
      - Duplicate Store
      - Pause Listings
      - Delete Store
```

#### Store Form Specifications

```tsx
// Section 1: Store Information
Store Name:
  required: true
  placeholder: "Main Street Location"

Store Type:
  select:
    - "Grocery Store"
    - "Restaurant"
    - "Food Truck"
    - "Bakery"
    - "Butcher Shop"
    - "Farmers Market Stall"

Description:
  textarea
  rows: 3
  placeholder: "Describe this store location..."

// Section 2: Address
Street Address:
  required: true

Apartment/Suite:
  required: false

City:
  required: true

State/Province:
  required: true
  dropdown

ZIP/Postal Code:
  required: true

// Section 3: Contact & Hours
Phone Number:
  required: true
  format: (XXX) XXX-XXXX

Email:
  required: false

Business Hours:
  // Day-by-day editor
  For each day:
    - Checkbox: Open
    - Open time: select
    - Close time: select
    - "Add hours" (for split shifts)

// Section 4: Store Image
  Same as listing image upload

// Section 5: Delivery Options (for food/grocery)
Delivery Available:
  checkbox

Pickup Available:
  checkbox

Delivery Radius:
  number input
  suffix: "miles"
  conditional: show if delivery = true

Delivery Fee:
  number input
  prefix: "$"
  conditional: show if delivery = true

Minimum Order for Delivery:
  number input
  prefix: "$"
  conditional: show if delivery = true

// Save/Cancel buttons
```

#### Store Detail/Management Specifications

```tsx
// Tabs
1. "Overview"
2. "Products/Menu Items"
3. "Orders"
4. "Settings"

// Overview Tab
- Store info display (read-only)
- Quick stats cards
- Recent orders list
- Edit button

// Products Tab
- List of all products/menu items for this store
- Add product button
- Edit/Delete per item
- Toggle active/inactive

// Orders Tab
- Orders for this specific store
- Filter by status
- Same as main orders page but filtered

// Settings Tab
- Edit store details
- Pause all listings
- Delete store (with confirmation)
```

**Implementation Time:** 12 hours

---

## 🎨 COMPONENT LIBRARY UPDATES

### Button Component

**File:** `components/ui/button.tsx`

Ensure button variants match wireframe exactly:

```tsx
// Primary (Default)
background: #1F2937 // NOT #1E3A5F!
color: #ffffff
hover: background #111827
active: background #0F1419

// Outline
background: transparent
border: 1px solid #E5E7EB
color: #1F2937
hover: background #F9FAFB, border #1F2937

// Ghost
background: transparent
color: #6B7280
hover: background #F9FAFB, color #1F2937

// Destructive
background: #DC2626
color: #ffffff
hover: background #B91C1C

// Destructive Outline
background: transparent
border: 1px solid #FEE2E2
color: #DC2626
hover: background #FEE2E2

// Success Outline
background: transparent
border: 1px solid #D1FAE5
color: #10B981
hover: background #D1FAE5

// Sizes
sm: height 36px, padding 0 12px, text 14px
md: height 40px, padding 0 16px, text 14px (default)
lg: height 44px, padding 0 20px, text 15px

// Border Radius
8px for all variants
```

---

### Badge Component

**File:** `components/ui/badge.tsx`

Update badge colors to match wireframe:

```tsx
// Success
background: #D1FAE5
color: #065F46
border: 1px solid #6EE7B7 (optional)

// Warning
background: #FEF3C7
color: #92400E
border: 1px solid #FDE68A (optional)

// Error
background: #FEE2E2
color: #DC2626
border: 1px solid #FECACA (optional)

// Info/Secondary
background: #DBEAFE
color: #1E40AF
border: 1px solid #93C5FD (optional)

// Default/Neutral
background: #F3F4F6
color: #6B7280
border: 1px solid #E5E7EB (optional)

// Size
padding: 4px 10px
font-size: 12px
font-weight: 600
border-radius: 6px (NOT 12px for badges)

// With Dot
.badge-with-dot {
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
```

---

### Card Component

**File:** `components/ui/card.tsx`

Verify card styling:

```tsx
// Default Card
background: #ffffff
border: 1px solid #E5E7EB
border-radius: 12px (default)
// OR 16px for larger cards (rounded-xl)
// OR 20px for feature cards (rounded-2xl)
padding: 20px (default)
// OR 24px for larger cards

// Hover Card (for clickable cards)
hover: {
  border-color: #1F2937
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
  transform: translateY(-2px)
  transition: all 0.2s ease
}

// CardHeader
padding: 20px
border-bottom: 1px solid #E5E7EB (optional)

// CardTitle
font-size: 18px
font-weight: 700
color: #1F2937

// CardDescription
font-size: 14px
color: #6B7280
margin-top: 4px

// CardContent
padding: 20px

// CardFooter
padding: 20px
border-top: 1px solid #E5E7EB (optional)
```

---

## 📱 RESPONSIVE DESIGN CHECKLIST

### Mobile (< 640px)
- [ ] Sidebar hidden by default, opens as overlay
- [ ] Hamburger menu visible
- [ ] Single column layouts
- [ ] Full-width buttons
- [ ] Reduced padding (16px instead of 32px)
- [ ] Smaller font sizes (-2px to -4px)
- [ ] Hide non-essential info (subtitles, secondary text)
- [ ] Stack filter rows vertically
- [ ] Hide page numbers in pagination (show "Page X of Y")

### Tablet (640px - 1024px)
- [ ] 2-column grids
- [ ] Sidebar visible but collapsible
- [ ] Medium padding (24px)
- [ ] Show more info than mobile
- [ ] Keep buttons reasonable width

### Desktop (1024px+)
- [ ] Full layout with expanded sidebar (280px)
- [ ] 3-column grids (or more)
- [ ] Maximum padding (32px)
- [ ] All info visible
- [ ] Hover states active

---

## ✅ QUALITY ASSURANCE CHECKLIST

### Before Submitting to Client

**Visual Verification:**
- [ ] Primary color is #030213 (dark navy), NOT #1E3A5F
- [ ] All card border-radius values match wireframe
- [ ] Sidebar width is 280px, NOT 256px
- [ ] Top nav height is exactly 72px
- [ ] All badge colors match exact hex codes
- [ ] Status badges use correct background colors
- [ ] Icon sizes match wireframe (16×16 small, 20×20 medium, 24×24 large)
- [ ] Font sizes match wireframe
- [ ] Spacing between elements matches wireframe

**Functional Verification:**
- [ ] All filters work and affect results
- [ ] Pagination works correctly
- [ ] Buttons trigger correct actions
- [ ] Forms validate correctly
- [ ] Image uploads work
- [ ] API calls succeed
- [ ] Error states display properly
- [ ] Loading states show during async operations

**Screen-by-Screen Verification:**
- [ ] Print wireframe and implementation side-by-side
- [ ] Check EVERY element matches
- [ ] Measure padding/margins if unsure
- [ ] Use browser DevTools to inspect exact values
- [ ] Test on multiple screen sizes
- [ ] Test on different browsers

---

## 📊 IMPLEMENTATION PRIORITY SUMMARY

### Week 1: Foundation & Critical Fixes
1. ✅ Fix primary color (#030213)
2. ✅ Update sidebar width (280px)
3. ✅ Fix badge colors across site
4. ✅ Rebuild All Vendors page (cards layout)
5. ✅ Add 3 missing filters to vendors page
6. ✅ Implement pagination on vendors

**Time:** ~40 hours

### Week 2: Vendor Orders & Forms
1. ✅ Fix vendor orders tabs (remove ALL/PENDING)
2. ✅ Add store filter and date range to orders
3. ✅ Implement grouping by store
4. ✅ Start category-specific forms (3-4 forms)

**Time:** ~40 hours

### Week 3: Forms Completion
1. ✅ Complete remaining category forms (5-6 forms)
2. ✅ Implement form router
3. ✅ Test all forms end-to-end

**Time:** ~40 hours

### Week 4: Missing Screens & Polish
1. ✅ Geographic regions management (admin)
2. ✅ Service areas management (vendor)
3. ✅ Store management (vendor - groceries/food)
4. ✅ Final QA and adjustments

**Time:** ~30 hours

**TOTAL EFFORT:** ~150 hours (~19 working days at 8 hours/day)

---

## 📞 QUESTIONS FOR CLIENT

Before starting implementation, confirm with client:

1. **Extra Features** - Keep or remove?
   - Quick action cards on dashboards (not in wireframe)
   - 4th stats card on vendor dashboard (not in wireframe)
   - Call/Chat buttons on orders (not in wireframe)
   - Revenue column in vendors table (not in wireframe)

2. **Store Management** - Is this needed?
   - Only for Grocery and Food vendors
   - Adds significant complexity
   - Confirm if required for MVP

3. **Timeline** - Is 3-4 weeks acceptable?
   - 150+ hours of work identified
   - Need dedicated dev resources
   - May delay other features

4. **Budget** - Additional costs for major rebuild?
   - All Vendors page is complete rewrite
   - 9 category forms are new development
   - Store management is new feature

---

## 🚀 GETTING STARTED

### Step 1: Setup
```bash
# Pull latest code
git pull origin main

# Create feature branch
git checkout -b wireframe-alignment-sprint-1

# Update Tailwind config
# File: tailwind.config.js
# Change primary color to #030213
```

### Step 2: Component Updates
```bash
# Update global components first
# This ensures consistency across all screens

1. Update button.tsx
2. Update badge.tsx
3. Update card.tsx
4. Update colors in tailwind.config.js
5. Update sidebar width
6. Test components in isolation
```

### Step 3: Screen Rebuilds
```bash
# Tackle screens in priority order
# Start with highest impact (All Vendors)

1. Create VendorCard component
2. Rebuild /admin/vendors page
3. Test with real data
4. QA against wireframe
5. Move to next screen
```

### Step 4: Forms Development
```bash
# Create base form component
# Extend for each category

1. Create BaseListingForm component
2. Implement shared sections
3. Create category-specific forms
4. Wire to API
5. Test validation
6. Test submission
```

---

**END OF DEVELOPER IMPLEMENTATION GUIDE**

---

## DOCUMENT METADATA

- **Version:** 1.0
- **Date:** January 14, 2026
- **Author:** Development Team Lead
- **Approved By:** [Client Name] - PENDING
- **Wireframe Source:** https://github.com/maazahmed-tech/Wireframesdohuubmobileresponsivevendorprotalandadminpanelwebappversion1withoutupsell
- **Implementation Repo:** /doohub-app/apps/web-portal/
- **Status:** Ready for Development
- **Estimated Completion:** 4 weeks from approval

---

**NEXT STEPS:**
1. Review this document with client
2. Get approval on extra features (keep or remove)
3. Confirm timeline and budget
4. Assign developers to priority 1 tasks
5. Begin implementation

---

*This guide contains exact specifications extracted from client-approved wireframes. Any deviation requires client approval.*
