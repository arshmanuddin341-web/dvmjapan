# ROUTING SYSTEM DOCUMENTATION
## Complete Route Map for DVM JAPAN Platform

---

## 📍 ROUTE STRUCTURE

### Public Routes

#### Home
- **Path:** `/`
- **Component:** `app/page.tsx`
- **Description:** Main landing page with hero, featured vehicles, and key sections

#### Inventory
- **Path:** `/inventory`
- **Component:** `app/inventory/page.tsx`
- **Description:** Vehicle inventory listing with filters and search
- **Query Params:** `make`, `model`, `bodyType`, `fuel`, `minYear`, `maxYear`, `location`, `stockId`

#### Vehicle Detail
- **Path:** `/vehicles/[id]`
- **Component:** `app/vehicles/[id]/page.tsx`
- **Description:** Individual vehicle detail page with gallery, specs, and documents
- **Dynamic:** `[id]` - Vehicle ID or stock ID

#### Destinations
- **Path:** `/destinations`
- **Component:** `app/destinations/page.tsx`
- **Description:** Countries/destinations listing page

#### Country Detail
- **Path:** `/destinations/[country]`
- **Component:** `app/destinations/[country]/page.tsx`
- **Description:** Specific country import information
- **Dynamic:** `[country]` - Country slug (e.g., `new-zealand`, `kenya`)

#### How It Works
- **Path:** `/how-it-works`
- **Component:** `app/how-it-works/page.tsx`
- **Description:** Step-by-step guide to the import process

#### Live Auctions
- **Path:** `/live-auctions`
- **Component:** `app/live-auctions/page.tsx`
- **Description:** Live auction listings and information

#### Pricing
- **Path:** `/pricing`
- **Component:** `app/pricing/page.tsx`
- **Description:** Pricing information and cost breakdown

#### Cost Calculator
- **Path:** `/cost-calculator`
- **Component:** `app/cost-calculator/page.tsx`
- **Description:** Interactive cost calculator tool

#### Verification
- **Path:** `/verification`
- **Component:** `app/verification/page.tsx`
- **Description:** Vehicle verification service information

#### Shipping
- **Path:** `/shipping`
- **Component:** `app/shipping/page.tsx`
- **Description:** Shipping information and process

#### Documentation
- **Path:** `/documentation`
- **Component:** `app/documentation/page.tsx`
- **Description:** Documentation center with guides and resources

#### Success Stories
- **Path:** `/success-stories`
- **Component:** `app/success-stories/page.tsx`
- **Description:** Customer success stories and testimonials

#### About
- **Path:** `/about`
- **Component:** `app/about/page.tsx`
- **Description:** About us main page

#### Our Story
- **Path:** `/about/our-story`
- **Component:** `app/about/our-story/page.tsx`
- **Description:** Company history and story

#### Global Network
- **Path:** `/about/global-network`
- **Component:** `app/about/global-network/page.tsx`
- **Description:** Global network and partnerships

#### FAQ
- **Path:** `/faq`
- **Component:** `app/faq/page.tsx`
- **Description:** Frequently asked questions

#### Blog
- **Path:** `/blog`
- **Component:** `app/blog/page.tsx`
- **Description:** Blog listing page
- **Query Params:** `category`, `tag`, `search`, `page`

#### Blog Post
- **Path:** `/blog/[slug]`
- **Component:** `app/blog/[slug]/page.tsx`
- **Description:** Individual blog post page
- **Dynamic:** `[slug]` - Blog post slug

#### Contact
- **Path:** `/contact`
- **Component:** `app/contact/page.tsx`
- **Description:** Contact page with form and information

#### Terms
- **Path:** `/terms`
- **Component:** `app/terms/page.tsx`
- **Description:** Terms and conditions

#### Privacy
- **Path:** `/privacy`
- **Component:** `app/privacy/page.tsx`
- **Description:** Privacy policy

#### 404
- **Path:** `/not-found`
- **Component:** `app/not-found.tsx`
- **Description:** 404 error page

---

### Authentication Routes

#### Login
- **Path:** `/login`
- **Component:** `app/login/page.tsx`
- **Description:** User login page

#### Register
- **Path:** `/register`
- **Component:** `app/register/page.tsx`
- **Description:** User registration page

---

### Dashboard Routes

#### Dashboard
- **Path:** `/dashboard`
- **Component:** `app/dashboard/page.tsx`
- **Description:** User dashboard home
- **Protected:** Yes

#### Profile
- **Path:** `/dashboard/profile`
- **Component:** `app/dashboard/profile/page.tsx`
- **Description:** User profile management
- **Protected:** Yes

#### Settings
- **Path:** `/dashboard/settings`
- **Component:** `app/dashboard/settings/page.tsx`
- **Description:** User settings
- **Protected:** Yes

---

### Admin Routes

#### Admin Dashboard
- **Path:** `/admin`
- **Component:** `app/admin/page.tsx`
- **Description:** Admin dashboard
- **Protected:** Yes (Admin only)

#### Admin Vehicles
- **Path:** `/admin/vehicles`
- **Component:** `app/admin/vehicles/page.tsx`
- **Description:** Vehicle management
- **Protected:** Yes (Admin only)

#### Admin Listings
- **Path:** `/admin/listings`
- **Component:** `app/admin/listings/page.tsx`
- **Description:** Listing management
- **Protected:** Yes (Admin only)

#### Admin Pricing
- **Path:** `/admin/pricing`
- **Component:** `app/admin/pricing/page.tsx`
- **Description:** Pricing management
- **Protected:** Yes (Admin only)

#### Admin Blog
- **Path:** `/admin/blog`
- **Component:** `app/admin/blog/page.tsx`
- **Description:** Blog management
- **Protected:** Yes (Admin only)

#### Admin SEO
- **Path:** `/admin/seo`
- **Component:** `app/admin/seo/page.tsx`
- **Description:** SEO management
- **Protected:** Yes (Admin only)

#### Admin Inquiries
- **Path:** `/admin/inquiries`
- **Component:** `app/admin/inquiries/page.tsx`
- **Description:** Inquiry management
- **Protected:** Yes (Admin only)

---

## 🔗 NAVIGATION MAPPING

### Header Navigation Links

All header links are mapped to their respective routes:

- **Home** → `/`
- **Inventory** → `/inventory`
- **Destinations** → `/destinations` (with dropdown)
  - New Zealand → `/destinations/new-zealand`
  - Kenya → `/destinations/kenya`
  - UK → `/destinations/uk`
  - Uganda → `/destinations/uganda`
  - Ireland → `/destinations/ireland`
  - Tanzania → `/destinations/tanzania`
  - Jamaica → `/destinations/jamaica`
  - South Africa → `/destinations/south-africa`
  - Trinidad & Tobago → `/destinations/trinidad-tobago`
  - Mauritius → `/destinations/mauritius`
- **How It Works** → `/how-it-works`
- **Live Auctions** → `/live-auctions`
- **Pricing** → `/pricing`
- **About** → `/about` (with dropdown)
  - Our Story → `/about/our-story`
  - Global Network → `/about/global-network`
  - Success Stories → `/success-stories`
- **Blog** → `/blog`
- **Contact** → `/contact`

### Footer Navigation Links

#### Company Section
- About Us → `/about`
- Our Story → `/about/our-story`
- Global Network → `/about/global-network`
- Success Stories → `/success-stories`

#### Services Section
- How It Works → `/how-it-works`
- Verification → `/verification`
- Shipping → `/shipping`
- Documentation → `/documentation`

#### Resources Section
- Blog → `/blog`
- FAQ → `/faq`
- Cost Calculator → `/cost-calculator`
- Documentation → `/documentation`

#### Legal Section
- Terms & Conditions → `/terms`
- Privacy Policy → `/privacy`

---

## 🎯 ROUTE USAGE

### Using Routes in Components

```typescript
import { routes } from '@/config/routes';
import Link from 'next/link';

// Static route
<Link href={routes.home}>Home</Link>

// Dynamic route
<Link href={routes.vehicleDetail('12345')}>View Vehicle</Link>

// Using getRoute helper
import { getRoute } from '@/config/routes';
<Link href={getRoute('vehicleDetail', '12345')}>View Vehicle</Link>
```

### Navigation Component Usage

```typescript
import { headerNavigation, isNavItemActive } from '@/config/navigation';
import { usePathname } from 'next/navigation';

const pathname = usePathname();

headerNavigation.map(item => (
  <Link
    key={item.href}
    href={item.href}
    className={isNavItemActive(pathname, item) ? 'active' : ''}
  >
    {item.label}
  </Link>
));
```

---

## ✅ ROUTING CHECKLIST

- [x] All public routes defined
- [x] All authentication routes defined
- [x] All dashboard routes defined
- [x] All admin routes defined
- [x] Dynamic routes configured
- [x] Query parameters documented
- [x] Navigation mapping complete
- [x] Route helpers created
- [x] TypeScript types defined

---

**ROUTING SYSTEM COMPLETE ✅**
