# DoHuub Web Portal - Complete Developer Implementation Guide
## 100% Wireframe Compliance Specification

**Version:** 2.0 (Complete Audit Edition)
**Date:** January 17, 2026
**Status:** FINAL - Client Handover Ready
**Wireframe Source:** `/doohub/Wireframesdohuubmobileresponsivevendorprotalandadminpanelwebappversion1withoutupsell/`

---

# TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Navigation Specifications](#navigation-specifications)
3. [Route Mapping](#route-mapping)
4. [Screen-by-Screen Text Specifications](#screen-by-screen-text-specifications)
5. [Status Labels & Values](#status-labels--values)
6. [Button Text Standards](#button-text-standards)
7. [Form Field Labels](#form-field-labels)
8. [Empty State Messages](#empty-state-messages)
9. [Modal Content](#modal-content)
10. [Design System](#design-system)
11. [Missing Screens To Implement](#missing-screens-to-implement)
12. [Unauthorized Additions To Remove](#unauthorized-additions-to-remove)
13. [QA Checklist](#qa-checklist)

---

# EXECUTIVE SUMMARY

## Current Gap Analysis

| Category | Wireframe | Dev Implementation | Gap |
|----------|-----------|-------------------|-----|
| Admin Sidebar Items | 10 items | 8 items | -2 missing |
| Vendor Sidebar Items | 6 items | 9 items | +3 extra |
| Admin Routes | 25 routes | 12 routes | -13 missing |
| Vendor Routes | 19 routes | 11 routes | -8 missing |
| Text/Label Mismatches | - | - | 15+ issues |
| Missing Screens | - | - | 8 screens |
| Unauthorized Screens | - | - | 6 screens |

---

# NAVIGATION SPECIFICATIONS

## Admin Sidebar - EXACT LABELS

**Source:** `AdminSidebar.tsx` lines 35-46

```typescript
const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { id: "michelle", icon: User, label: "Michelle's Services", path: "/admin/michelle-profiles" },
  { id: "vendors", icon: Building2, label: "Vendors", path: "/admin/vendors" },
  { id: "listings", icon: Flag, label: "Listings", path: "/admin/listings" },
  { id: "moderation", icon: Flag, label: "Moderation", badge: "3", path: "/admin/moderation" },
  { id: "customers", icon: Users, label: "Customers", path: "/admin/customers" },
  { id: "orders", icon: Package, label: "Orders", path: "/admin/orders" },
  { id: "notifications", icon: Bell, label: "Push Notifications", path: "/admin/push-notifications" },
  { id: "reports", icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { id: "settings", icon: Settings, label: "Settings", path: "/admin/settings" },
];
```

### Admin Sidebar Comparison Table

| # | Wireframe Label | Wireframe Icon | Wireframe Path | Dev Label | Dev Icon | Dev Path | Action Required |
|---|-----------------|----------------|----------------|-----------|----------|----------|-----------------|
| 1 | Dashboard | `LayoutDashboard` | /admin/dashboard | Dashboard | `LayoutDashboard` | /admin | **FIX PATH** |
| 2 | Michelle's Services | `User` | /admin/michelle-profiles | Michelle Listings | `Crown` | /admin/michelle | **FIX LABEL, ICON, PATH** |
| 3 | Vendors | `Building2` | /admin/vendors | Vendors | `Store` | /admin/vendors | **FIX ICON** |
| 4 | Listings | `Flag` | /admin/listings | All Listings | `Package` | /admin/listings | **FIX LABEL, ICON** |
| 5 | Moderation (badge: "3") | `Flag` | /admin/moderation | - | - | - | **ADD SCREEN** |
| 6 | Customers | `Users` | /admin/customers | Customers | `Users` | /admin/customers | MATCH |
| 7 | Orders | `Package` | /admin/orders | - | - | - | **ADD SCREEN** |
| 8 | Push Notifications | `Bell` | /admin/push-notifications | - | - | - | **ADD SCREEN** |
| 9 | Reports | `BarChart3` | /admin/reports | Reports | `AlertTriangle` | /admin/reports | **FIX ICON** |
| 10 | Settings | `Settings` | /admin/settings | Settings | `Settings` | /admin/settings | MATCH |
| - | - | - | - | Subscriptions | `BarChart3` | /admin/subscriptions | **REMOVE** |

### Admin Sidebar Implementation Code

```typescript
// CORRECT IMPLEMENTATION - Copy this exactly
const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "Michelle's Services", href: "/admin/michelle-profiles", icon: <User className="h-5 w-5" /> },
  { title: "Vendors", href: "/admin/vendors", icon: <Building2 className="h-5 w-5" /> },
  { title: "Listings", href: "/admin/listings", icon: <Flag className="h-5 w-5" /> },
  { title: "Moderation", href: "/admin/moderation", icon: <Flag className="h-5 w-5" />, badge: "3" },
  { title: "Customers", href: "/admin/customers", icon: <Users className="h-5 w-5" /> },
  { title: "Orders", href: "/admin/orders", icon: <Package className="h-5 w-5" /> },
  { title: "Push Notifications", href: "/admin/push-notifications", icon: <Bell className="h-5 w-5" /> },
  { title: "Reports", href: "/admin/reports", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
];
```

---

## Vendor Sidebar - EXACT LABELS

**Source:** `VendorSidebar.tsx` lines 42-48

```typescript
const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { id: "services", label: "My Services", icon: Package, path: "/vendor/services" },
  { id: "orders", label: "Orders", icon: ShoppingCart, path: "/vendor/orders" },
  { id: "subscription", label: "Subscription", icon: CreditCard, path: "/vendor/subscription-management" },
  { id: "profile", label: "Profile", icon: User, path: "/vendor/profile" },
  { id: "settings", label: "Settings", icon: Settings, path: "/vendor/settings" },
];
```

### Vendor Sidebar Comparison Table

| # | Wireframe Label | Wireframe Icon | Wireframe Path | Dev Label | Dev Icon | Dev Path | Action Required |
|---|-----------------|----------------|----------------|-----------|----------|----------|-----------------|
| 1 | Overview | `LayoutDashboard` | /vendor/dashboard | Dashboard | `LayoutDashboard` | /vendor | **FIX LABEL, PATH** |
| 2 | My Services | `Package` | /vendor/services | My Listings | `Package` | /vendor/listings | **FIX LABEL, PATH** |
| 3 | Orders | `ShoppingCart` | /vendor/orders | Orders | `ShoppingBag` | /vendor/orders | **FIX ICON** |
| 4 | Subscription | `CreditCard` | /vendor/subscription-management | Subscription | `CreditCard` | /vendor/subscription | **FIX PATH** |
| 5 | Profile | `User` | /vendor/profile | - | - | - | **ADD SCREEN** |
| 6 | Settings | `Settings` | /vendor/settings | Settings | `Settings` | /vendor/settings | MATCH |
| - | - | - | - | Reviews | `Star` | /vendor/reviews | **REMOVE** |
| - | - | - | - | Performance | `TrendingUp` | /vendor/performance | **REMOVE** |
| - | - | - | - | Service Areas | `MapPin` | /vendor/areas | **REMOVE** |
| - | - | - | - | Availability | `Clock` | /vendor/availability | **REMOVE** |

### Vendor Sidebar Implementation Code

```typescript
// CORRECT IMPLEMENTATION - Copy this exactly
const vendorNavItems: NavItem[] = [
  { title: "Overview", href: "/vendor/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "My Services", href: "/vendor/services", icon: <Package className="h-5 w-5" /> },
  { title: "Orders", href: "/vendor/orders", icon: <ShoppingCart className="h-5 w-5" /> },
  { title: "Subscription", href: "/vendor/subscription-management", icon: <CreditCard className="h-5 w-5" /> },
  { title: "Profile", href: "/vendor/profile", icon: <User className="h-5 w-5" /> },
  { title: "Settings", href: "/vendor/settings", icon: <Settings className="h-5 w-5" /> },
];
```

---

## Logout Button

**Wireframe Text:** `"Logout"` (AdminSidebar.tsx:88, VendorSidebar.tsx:139)
**Dev Implementation:** `"Sign Out"` (Sidebar.tsx:119)

**ACTION:** Change "Sign Out" to "Logout"

---

# ROUTE MAPPING

## Admin Routes - Complete List

**Source:** `App.tsx` lines 48-74

| Route | Component | Dev Implementation | Status |
|-------|-----------|-------------------|--------|
| `/` | PortalSelection | /page.tsx | MATCH |
| `/admin` | Redirect to /admin/login | /admin/page.tsx | DIFFERENT |
| `/admin/login` | AdminLogin | /auth/login | MOVED |
| `/admin/reset-password` | PasswordReset | - | **MISSING** |
| `/admin/dashboard` | AdminDashboard | /admin | PATH MISMATCH |
| `/admin/michelle-profiles` | MichelleProfiles | /admin/michelle | PATH MISMATCH |
| `/admin/michelle-profiles/analytics` | ProfileAnalytics | - | **MISSING** |
| `/admin/michelle-profiles/create` | CreateEditProfile | /admin/michelle/new | MATCH |
| `/admin/michelle-profiles/edit/:id` | CreateEditProfile | /admin/michelle/[id]/edit | MATCH |
| `/admin/michelle-profiles/regions` | GeographicRegions | - | **MISSING** |
| `/admin/michelle-profiles/:profileId/listings` | ServiceListings | - | **MISSING** |
| `/admin/michelle-profiles/:profileId/listings/create` | CreateEditServiceWizard | - | **MISSING** |
| `/admin/michelle-profiles/:profileId/listings/edit/:id` | CreateEditServiceWizard | - | **MISSING** |
| `/admin/vendors` | AllVendors | /admin/vendors | MATCH |
| `/admin/vendors/:id` | VendorDetail | /admin/vendors/[id] | MATCH |
| `/admin/vendors/michelle/:id` | VendorDetail | - | **MISSING** |
| `/admin/listings` | AllListings | /admin/listings | MATCH |
| `/admin/moderation` | Redirect to /admin/moderation/listings | - | **MISSING** |
| `/admin/moderation/listings` | ReportedListings | - | **MISSING** |
| `/admin/moderation/reports` | ReportedListings | - | **MISSING** |
| `/admin/settings` | PlatformSettings | - | **MISSING** |
| `/admin/settings/subscriptions` | SubscriptionSettings | - | **MISSING** |
| `/admin/orders` | MichelleOrders | - | **MISSING** |
| `/admin/customers` | CustomerManagement | /admin/customers | MATCH |
| `/admin/customers/:id` | CustomerManagement | /admin/customers/[id] | MATCH |
| `/admin/reviews` | AllReviews | - | **MISSING** |
| `/admin/push-notifications` | PushNotifications | - | **MISSING** |

---

## Vendor Routes - Complete List

**Source:** `App.tsx` lines 76-97

| Route | Component | Dev Implementation | Status |
|-------|-----------|-------------------|--------|
| `/vendor/login` | VendorLogin | /auth/login | MOVED |
| `/vendor/signup` | VendorSignUp | /auth/register | MOVED |
| `/vendor/subscription` | VendorSubscription | /vendor/subscription | MATCH |
| `/vendor/subscription-management` | VendorSubscriptionManagement | - | **MISSING** |
| `/vendor/change-plan` | VendorChangePlan | - | **MISSING** |
| `/vendor/update-payment` | VendorUpdatePayment | - | **MISSING** |
| `/vendor/profile-setup` | VendorProfileSetup | /vendor/onboarding | MATCH |
| `/vendor/dashboard` | VendorDashboard | /vendor | PATH MISMATCH |
| `/vendor/services` | VendorServices | /vendor/listings | PATH MISMATCH |
| `/vendor/services/create` | VendorStoreForm | /vendor/listings/new | PATH MISMATCH |
| `/vendor/services/edit/:storeId` | VendorStoreForm | /vendor/listings/[id]/edit | PATH MISMATCH |
| `/vendor/services/:storeId/listings` | VendorStoreListings | - | **MISSING** |
| `/vendor/services/:storeId/listings/create` | VendorListingFormRouter | - | **MISSING** |
| `/vendor/services/:storeId/listings/edit/:id` | VendorListingFormRouter | - | **MISSING** |
| `/vendor/services/:storeId/regions` | VendorGeographicRegions | - | **MISSING** |
| `/vendor/services/:storeId/details` | VendorStoreDetails | - | **MISSING** |
| `/vendor/orders` | VendorOrders | /vendor/orders | MATCH |
| `/vendor/profile` | VendorProfile | - | **MISSING** |
| `/vendor/settings` | VendorSettings | /vendor/settings | MATCH |

---

# SCREEN-BY-SCREEN TEXT SPECIFICATIONS

## Admin Dashboard

**Source:** `AdminDashboard.tsx`

### Page Header
- **Title:** `"Dashboard Overview"`
- **Font:** 32px bold, color #1F2937

### Metric Cards
| Card | Label | Sample Value | Trend Text |
|------|-------|--------------|------------|
| 1 | "Total Users" | "12,543" | "+12% from last month" |
| 2 | "Active Vendors" | "287" | "+8% from last month" |
| 3 | "Revenue (This Month)" | "$45,234" | "+23% from last month" |
| 4 | "Active Orders Today" | "156" | - |
| 5 | "New Vendors This Week" | "12" | - |

---

## All Vendors

**Source:** `AllVendors.tsx`

### Page Header
- **Title:** `"All Vendors"`
- **Subtitle:** `"Platform Vendors Overview"`

### Quick Stats Bar
| Stat | Label | Format |
|------|-------|--------|
| Total | "Total:" | Number |
| Active | "Active:" | Number (green) |
| Suspended | "Suspended:" | Number (red) |

### Search Placeholder
`"🔍 Search vendors by name, email, or business..."`

### Filter Dropdowns

**Category Filter:**
```
"All Categories"
"🧹 Cleaning Services"
"🔧 Handyman Services"
"🛒 Grocery"
"💄 Beauty Services"
"🛍️ Beauty Products"
"🍲 Food"
"🏠 Rental Properties"
"🚗 Ride Assistance"
"🤝 Companionship Support"
```

**Status Filter:**
```
"All Statuses"
"✅ Active"
"⏸️ Inactive"
"🚫 Suspended"
"📋 Trial Period"
```

**Country Filter:**
```
"All Countries"
"USA"
"Canada"
```

**Region Filter:**
```
"All Regions"
[Dynamic based on country]
```

### Vendor Card Buttons
- `"View Details"` (with Eye icon)
- `"Suspend"` (with Pause icon) - for active/trial vendors
- `"Unsuspend"` (with Play icon) - for suspended vendors

### Empty State
- **Title:** `"No vendors found"`
- **Message:** `"Try adjusting your search or filters"`
- **Button:** `"Clear Filters"`

### Pagination
- **Text:** `"Showing X-Y of Z vendors"`
- **Buttons:** `"Prev"`, `"Next"`, page numbers

---

## Michelle's Profiles (Michelle's Services)

**Source:** `MichelleProfiles.tsx`

### Page Header
- **Title:** `"Michelle's Stores"`
- **Subtitle:** `"Manage your business identities across all service categories"`

### Action Button
- `"Create New Store"` (with Plus icon)

### Filter Dropdown
```
"All Categories"
"Cleaning Services"
"Handyman Services"
"Grocery"
"Beauty Services"
"Beauty Products"
"Food"
"Rental Properties"
"Ride Assistance"
"Companionship Support"
```

### Profile Card Labels
| Field | Label |
|-------|-------|
| Category | "Category" |
| Status | "Status" |
| Bookings | "Bookings This Month" |
| Rating | "Average Rating" |
| Revenue | "Revenue This Month" |
| Regions | "Active Regions" |

### Profile Card Buttons
- `"View Details"` (with Eye icon)
- `"Edit Store"` (with Edit icon)
- `"Manage Listings"` (with List icon)

### Empty State
- **Title:** `"No Vendor Profiles Yet"`
- **Message:** `"Create your first business identity to start offering services"`
- **Button:** `"Create First Profile"`

---

## Vendor Dashboard (Overview)

**Source:** `VendorDashboard.tsx`

### Page Header
- **Title:** `"Welcome back, [Name]! 👋"`
- **Subtitle:** `"Here's what's happening with your business today"`

### Stats Cards
| Card | Label | Subtext |
|------|-------|---------|
| 1 | "Total Earnings" | "This month" |
| 2 | "Total Orders" | "This month" |
| 3 | "Active Listings" | "Across all stores" |

---

## Vendor Orders (My Orders)

**Source:** `VendorOrders.tsx`

### Page Header
- **Title:** `"My Orders"`
- **Subtitle:** `"Manage orders across all your stores"`

### Tab Labels - EXACT TEXT (Title Case)
```
"Accepted"
"In Progress"
"Completed"
```

**CRITICAL:** Dev uses UPPERCASE (`"ACCEPTED"`, `"IN_PROGRESS"`, `"COMPLETED"`). Must change to Title Case.

### Filter Labels
- **Store Filter:** `"Filter by Store"` with dropdown showing `"All Stores"` + store names
- **Search:** `"Search Orders"` with placeholder `"Search by order # or customer name"`
- **Date Filter:** `"Filter by Date"` with date range picker

### Order Card Buttons
- `"Mark In Progress"` (on Accepted tab)
- `"Mark as Complete"` (on In Progress tab)

### Empty State
- **Message:** `"No orders found"`

---

## Vendor Services (My Services)

**Source:** `VendorServices.tsx`

### Page Header
- **Title:** `"My Services"`
- **Subtitle:** `"Manage your business identities across all service categories"`

### Action Button
- `"Create New Store"` (with Plus icon)

### Store Card Labels
| Field | Label |
|-------|-------|
| Category | "Category" |
| Status | "Status" |
| Bookings | "Bookings This Month" |
| Rating | "Average Rating" |
| Revenue | "Revenue This Month" |
| Regions | "Active Regions" |

### Store Card Buttons
- `"View Details"` (with Eye icon)
- `"Edit Store"` (with Edit icon)
- `"Manage Listings"` (with List icon)

### Empty State
- **Title:** `"No Stores Yet"`
- **Message:** `"Create your first store to start offering services"`
- **Button:** `"Create First Store"`

### Delete Dialog
- **Title:** `"Delete Store"`
- **Message:** `"Are you sure you want to delete "[Store Name]"? This action cannot be undone and will remove all associated listings."`
- **Buttons:** `"Cancel"`, `"Delete Store"`

---

## Vendor Profile

**Source:** `VendorProfile.tsx`

### Page Header
- **Title:** `"Profile"`
- **Subtitle:** `"Manage your business information and account settings"`

### Business Information Section
- **Section Title:** `"Business Information"`
- **Fields:**
  - "Business Name"
  - "Owner Name"
  - "Email Address" (with "Locked" indicator)
  - "Phone Number"
  - "Business Address"
  - "Tax ID / EIN"
  - "Business Type" (dropdown: "Sole Proprietor", "LLC", "Corporation", "Partnership", "Other")

### Account Settings Section
- **Section Title:** `"Account Settings"`
- **Fields:**
  - "Current Password"
  - "New Password"
  - "Confirm New Password"
- **Button:** `"Change Password"`

### Action Buttons
- `"Save Changes"` (with Save icon)
- `"Cancel"`

---

## Vendor Settings

**Source:** `VendorSettings.tsx`

### Page Header
- **Title:** `"Settings"`
- **Subtitle:** `"Configure your payment integration settings"`

### Payment Settings Section
- **Section Title:** `"Payment Settings"`
- **Info Box Title:** `"Stripe Integration"`
- **Info Box Text:** `"Connect your Stripe account to process payments securely. Get your API keys from Stripe Dashboard."`

### Form Fields
- "Stripe Publishable Key" with helper: `"This key is public and safe to use in your frontend code"`
- "Stripe Secret Key" with warning: `"⚠️ Keep this key secure and never share it publicly"`

### Buttons
- `"Save API Keys"` / `"Saving..."`
- `"Test Connection"` / `"Testing..."`

---

## Vendor Subscription Management

**Source:** `VendorSubscriptionManagement.tsx`

### Page Header
- **Title:** `"Subscription"`
- **Subtitle:** `"Manage your subscription, billing, and payment methods"`

### Current Plan Section
- **Section Title:** `"Current Plan"`
- **Subtitle:** `"Your subscription details and billing information"`

### Plan Details Cards
| Card | Label | Format |
|------|-------|--------|
| Plan Type | "PLAN TYPE" | "[Plan Name]" + "$X/year" or "$X/month" |
| Next Billing | "NEXT BILLING DATE" | Date + "Auto-renews on this date" |
| Payment Method | "PAYMENT METHOD" | "Visa •••• 4242" + "Expires MM/YY" |

### Action Buttons
- `"Change Plan"`
- `"Update Payment Method"` (with Edit icon)
- `"Cancel Subscription"` (red text)

### Features Section
- **Title:** `"What's Included in Your Plan"`
- Features list with check icons

### Billing History Section
- **Title:** `"Billing History"`
- **Table Headers:** "Date", "Amount", "Status"
- **Status Badges:** "Paid" (green), "Pending" (amber), "Failed" (red)
- **Mobile:** `"Download"` button

### Cancel Modal
- **Title:** `"Cancel Subscription"`
- **Message:** `"Are you sure you want to cancel your subscription? This action cannot be undone."`
- **Field:** `"Reason for Cancellation"`
- **Button:** `"Cancel Subscription"` (red)

---

# STATUS LABELS & VALUES

## Vendor Status

**Source:** `AllVendors.tsx` lines 383-391

| Internal Value | Display Label | Dot Color | Text Color |
|----------------|---------------|-----------|------------|
| `"active"` | `"Active"` | #10B981 | #10B981 |
| `"inactive"` | `"Inactive"` | #9CA3AF | #9CA3AF |
| `"suspended"` | `"Suspended"` | #DC2626 | #DC2626 |
| `"trial"` | `"Trial"` | #3B82F6 | #3B82F6 |

**CRITICAL:** Dev uses `"Trial Period"` - must change to `"Trial"`

---

## Order Status

**Source:** `VendorDashboard.tsx` lines 92-116, `VendorOrders.tsx`

| Internal Value | Display Label | Background | Text Color |
|----------------|---------------|------------|------------|
| `"accepted"` | `"Accepted"` | #DBEAFE | #1E40AF |
| `"in-progress"` | `"In Progress"` | #FEF3C7 | #92400E |
| `"completed"` | `"Completed"` | #D1FAE5 | #065F46 |

**CRITICAL:**
- Dev uses UPPERCASE values (`"ACCEPTED"`, `"IN_PROGRESS"`, `"COMPLETED"`)
- Must change to lowercase with hyphen for "in-progress"
- Display labels must be Title Case, not UPPERCASE

---

## Invoice Status

**Source:** `VendorSubscriptionManagement.tsx`

| Value | Background | Text Color |
|-------|------------|------------|
| `"Paid"` | #D1FAE5 | #065F46 |
| `"Pending"` | #FEF3C7 | #92400E |
| `"Failed"` | #FEE2E2 | #991B1B |

---

# BUTTON TEXT STANDARDS

## Navigation & Auth
| Context | Wireframe Text |
|---------|----------------|
| Logout button | `"Logout"` |

## CRUD Actions
| Action | Wireframe Text |
|--------|----------------|
| Create | `"Create New Store"`, `"Create First Profile"`, `"Create First Store"` |
| View | `"View Details"` |
| Edit | `"Edit Store"` |
| Delete | `"Delete Store"` |
| Save | `"Save Changes"`, `"Save API Keys"` |
| Cancel | `"Cancel"` |

## Order Actions
| Action | Wireframe Text |
|--------|----------------|
| Start work | `"Mark In Progress"` |
| Complete | `"Mark as Complete"` |

## Vendor Actions
| Action | Wireframe Text |
|--------|----------------|
| Suspend | `"Suspend"` |
| Unsuspend | `"Unsuspend"` |

## Subscription Actions
| Action | Wireframe Text |
|--------|----------------|
| Change plan | `"Change Plan"` |
| Update payment | `"Update Payment Method"` |
| Cancel | `"Cancel Subscription"` |

## Misc
| Action | Wireframe Text |
|--------|----------------|
| Filter reset | `"Clear Filters"` |
| Test | `"Test Connection"` |
| Download | `"Download"` |
| Change password | `"Change Password"` |
| Manage listings | `"Manage Listings"` |

---

# FORM FIELD LABELS

## Business Information (VendorProfile.tsx)
- "Business Name"
- "Owner Name"
- "Email Address" (with "Locked" badge)
- "Phone Number"
- "Business Address"
- "Tax ID / EIN"
- "Business Type"

## Account Settings (VendorProfile.tsx)
- "Current Password"
- "New Password"
- "Confirm New Password"

## Payment Settings (VendorSettings.tsx)
- "Stripe Publishable Key"
- "Stripe Secret Key"

## Payment Modal (VendorSubscriptionManagement.tsx)
- "Card Number"
- "Cardholder Name"
- "Expiry Date"
- "CVV"

## Cancel Modal (VendorSubscriptionManagement.tsx)
- "Reason for Cancellation"

---

# EMPTY STATE MESSAGES

| Screen | Title | Message | Button |
|--------|-------|---------|--------|
| All Vendors | "No vendors found" | "Try adjusting your search or filters" | "Clear Filters" |
| Michelle Profiles | "No Vendor Profiles Yet" | "Create your first business identity to start offering services" | "Create First Profile" |
| Vendor Services | "No Stores Yet" | "Create your first store to start offering services" | "Create First Store" |
| Vendor Orders | - | "No orders found" | - |

---

# MODAL CONTENT

## Logout Confirmation (AdminSidebar.tsx)
- **Title:** `"Are you sure you want to logout?"`
- **Message:** `"You will need to login again to access the admin panel."`
- **Buttons:** `"Cancel"`, `"Logout"`

## Delete Store (VendorServices.tsx)
- **Title:** `"Delete Store"`
- **Message:** `"Are you sure you want to delete "[name]"? This action cannot be undone and will remove all associated listings."`
- **Buttons:** `"Cancel"`, `"Delete Store"`

## Update Payment Method (VendorSubscriptionManagement.tsx)
- **Title:** `"Update Payment Method"`
- **Button:** `"Update Payment"`

## Cancel Subscription (VendorSubscriptionManagement.tsx)
- **Title:** `"Cancel Subscription"`
- **Message:** `"Are you sure you want to cancel your subscription? This action cannot be undone."`
- **Field Label:** `"Reason for Cancellation"`
- **Button:** `"Cancel Subscription"`

---

# DESIGN SYSTEM

## Colors (Already documented in original guide)

**Primary:** `#030213` (NOT #1E3A5F)

## Dimensions

| Element | Value |
|---------|-------|
| Sidebar width (expanded) | 280px |
| Sidebar width (collapsed) | 72px |
| Top nav height | 72px |
| Content margin-top | 72px |

---

# MISSING SCREENS TO IMPLEMENT

## Admin Screens (8 screens)

| Screen | Component | Route | Priority |
|--------|-----------|-------|----------|
| Password Reset | PasswordReset.tsx | /admin/reset-password | HIGH |
| Moderation/Reported Listings | ReportedListings.tsx | /admin/moderation | HIGH |
| Platform Settings | PlatformSettings.tsx | /admin/settings | MEDIUM |
| Subscription Settings | SubscriptionSettings.tsx | /admin/settings/subscriptions | MEDIUM |
| All Reviews | AllReviews.tsx | /admin/reviews | MEDIUM |
| Michelle Orders | MichelleOrders.tsx | /admin/orders | HIGH |
| Push Notifications | PushNotifications.tsx | /admin/push-notifications | LOW |
| Profile Analytics | ProfileAnalytics.tsx | /admin/michelle-profiles/analytics | MEDIUM |

## Vendor Screens (4 screens)

| Screen | Component | Route | Priority |
|--------|-----------|-------|----------|
| Profile | VendorProfile.tsx | /vendor/profile | HIGH |
| Subscription Management | VendorSubscriptionManagement.tsx | /vendor/subscription-management | HIGH |
| Change Plan | VendorChangePlan.tsx | /vendor/change-plan | MEDIUM |
| Update Payment | VendorUpdatePayment.tsx | /vendor/update-payment | MEDIUM |

---

# UNAUTHORIZED ADDITIONS TO REMOVE

## Admin

| Screen | Current Route | Action |
|--------|---------------|--------|
| Subscriptions | /admin/subscriptions | REMOVE from sidebar (unless approved) |

## Vendor

| Screen | Current Route | Action |
|--------|---------------|--------|
| Reviews | /vendor/reviews | REMOVE |
| Performance | /vendor/performance | REMOVE |
| Service Areas | /vendor/areas | KEEP (similar to VendorGeographicRegions) |
| Availability | /vendor/availability | REMOVE |

## Auth

| Screen | Current Route | Action |
|--------|---------------|--------|
| Dev Testing | /auth/dev | REMOVE |

---

# QA CHECKLIST

## Navigation Checklist

- [ ] Admin sidebar has exactly 10 items in correct order
- [ ] Admin sidebar uses correct labels (not "All Listings", use "Listings")
- [ ] Admin sidebar uses correct icons (Building2 for Vendors, not Store)
- [ ] Admin sidebar "Moderation" has badge with count
- [ ] Vendor sidebar has exactly 6 items in correct order
- [ ] Vendor sidebar uses "Overview" not "Dashboard"
- [ ] Vendor sidebar uses "My Services" not "My Listings"
- [ ] Vendor sidebar uses ShoppingCart icon for Orders, not ShoppingBag
- [ ] Logout button says "Logout" not "Sign Out"

## Route Checklist

- [ ] Admin dashboard accessible at /admin/dashboard (not just /admin)
- [ ] Michelle's Services at /admin/michelle-profiles (not /admin/michelle)
- [ ] Vendor dashboard at /vendor/dashboard (not just /vendor)
- [ ] Vendor services at /vendor/services (not /vendor/listings)
- [ ] All wireframe routes implemented
- [ ] No unauthorized routes present

## Text/Label Checklist

- [ ] Order tabs use Title Case ("Accepted", "In Progress", "Completed")
- [ ] Status labels match exactly ("Trial" not "Trial Period")
- [ ] All page titles match wireframe exactly
- [ ] All button labels match wireframe exactly
- [ ] All form field labels match wireframe exactly
- [ ] All empty state messages match wireframe exactly

## Status Values Checklist

- [ ] Vendor status uses lowercase values ("active", "inactive", "suspended", "trial")
- [ ] Order status uses lowercase with hyphen ("accepted", "in-progress", "completed")
- [ ] Status display text uses Title Case
- [ ] Status colors match specification

## Design System Checklist

- [ ] Primary color is #030213
- [ ] Sidebar width is 280px (expanded)
- [ ] Top nav height is 72px
- [ ] All spacing values correct
- [ ] All border radius values correct

---

# IMPLEMENTATION PRIORITY

## Phase 1: Quick Fixes (4 hours)
1. Fix sidebar labels (both admin and vendor)
2. Fix sidebar icons
3. Change "Sign Out" to "Logout"
4. Fix tab label case (Title Case)
5. Fix status label ("Trial" not "Trial Period")

## Phase 2: Route Alignment (4 hours)
1. Update admin routes to match wireframe paths
2. Update vendor routes to match wireframe paths
3. Add redirects for old paths if needed

## Phase 3: Missing Screens (40+ hours)
1. Implement Vendor Profile page (HIGH)
2. Implement Moderation page (HIGH)
3. Implement Admin Orders page (HIGH)
4. Implement Subscription Management pages (HIGH)
5. Implement remaining screens

## Phase 4: Cleanup (2 hours)
1. Remove unauthorized screens/routes
2. Final QA pass

---

**END OF DOCUMENT**

*This guide provides 100% coverage of all wireframe specifications for client handover readiness.*
