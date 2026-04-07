# Product Requirements Document (PRD)
## BethMedic — Premium Medical E-Commerce Platform
**Version:** 1.0  
**Date:** April 2026  
**Owner:** Beth Okafor (Founder & CMO)  
**Status:** Active Development

---

## 1. Product Overview

BethMedic is Nigeria's first clinically vetted medical e-commerce platform, founded by a licensed healthcare professional. The platform provides Nigerians with access to pharmaceutical-grade supplements, certified medical devices, and expert health consultation — all in one place.

**Mission:** Make premium, clinically verified health products accessible to every Nigerian family.

**Vision:** Become Nigeria's most trusted healthcare product platform, setting the gold standard for quality assurance and patient care in digital health commerce.

---

## 2. Problem Statement

Nigerian consumers face a critical health crisis:
- **Counterfeit supplements** are rampant on open marketplaces (Jumia, roadside vendors)
- **No clinical vetting** — most platforms list any product without quality checks
- **Zero expert guidance** — customers have no access to healthcare professionals when buying health products
- **Trust deficit** — consumers can't verify product authenticity or efficacy

**Impact:** Patients spend ₦50–200 billion annually on ineffective or harmful health products in Nigeria (estimate based on NAFDAC reports).

---

## 3. Goals & Success Metrics

| Goal | KPI | Target (12 months) |
|------|-----|-------------------|
| User acquisition | Registered accounts | 100,000 users |
| Revenue | Monthly GMV | ₦500M/month |
| Quality | Product return rate | < 2% |
| Engagement | Chat interactions/month | 10,000+ |
| Satisfaction | NPS score | > 70 |
| Retention | 90-day repeat purchase rate | > 40% |

---

## 4. Target Users

### Primary — Health-Conscious Nigerian Consumer
- Age: 25–55
- Location: Lagos, Abuja, Port Harcourt, Kano
- Income: Middle to upper-middle class
- Behaviour: Research-oriented, values quality over price
- Pain point: Cannot trust supplement quality from existing platforms

### Secondary — Healthcare Professionals
- Doctors, pharmacists, nurses recommending products to patients
- Institutional buyers (clinics, hospitals)

### Admin — Beth (Founder)
- Manages all product listings, pricing, and quality approvals
- Responds to customer chats and provides expert guidance
- Reviews and manages orders

---

## 5. Core Features

### 5.1 Customer-Facing Features

#### Authentication & Accounts
- Email/password signup and login
- JWT-based session management (NextAuth.js)
- Role-based access: CUSTOMER and ADMIN
- Profile management

#### Product Catalog
- Browse all products with search and category filtering
- Featured products section
- Product detail pages with full descriptions, specifications, stock status
- Category pages: Supplements, Medical Devices, First Aid, Personal Care, Diagnostics, Monitoring
- Discount pricing with compare price display (₦ Naira)

#### Shopping Cart
- Persistent cart (Zustand + localStorage)
- Add/remove/update quantity
- Free shipping threshold: ₦50,000
- Standard shipping: ₦2,500

#### Checkout
- Shipping address form (Nigerian states)
- Nigerian phone number format (+234)
- Order summary with Naira pricing
- Demo mode (orders saved to database, no payment gateway)

#### Real-Time Chat
- Customer-to-founder live chat widget
- Persistent chat rooms per customer
- 3-second polling for real-time feel
- Chat visible to admin in dashboard

#### Founder Page
- Beth's full biography and journey
- Credentials and clinical background
- Patient testimonials
- Company values and mission

### 5.2 Admin Features (Beth)

#### Dashboard
- Revenue overview (₦ Naira)
- Total products, orders, pending orders
- Recent orders feed
- Low stock alerts

#### Product Management
- Add/edit/delete products
- Set price and compare price (₦ Naira)
- Set stock quantity
- Toggle featured/active status
- Upload product images

#### Order Management
- View all orders with customer details
- Update order status (Pending → Processing → Shipped → Delivered → Cancelled)
- View shipping addresses (Nigerian states/cities)
- Revenue tracking

#### Customer Chat Management
- View all active chat rooms
- Reply to customer messages
- See all conversation history

---

## 6. Technical Requirements

### Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS v3, GSAP animations |
| 3D/Animation | Three.js (via @react-three/fiber), GSAP ScrollTrigger |
| State | Zustand (cart, persisted to localStorage) |
| Auth | NextAuth.js (credentials provider, JWT) |
| Database | PostgreSQL (Render hosted) |
| ORM | Raw `pg` Pool (Prisma Client disabled — SSL incompatibility on Windows) |
| Deployment | Vercel (planned) |

### Architecture Decisions
- **No Prisma Client**: Uses raw `pg` Pool due to Windows SSL binary issue with Render PostgreSQL
- **Polling chat**: 3-second interval polling instead of WebSockets (Phase 1)
- **Demo payments**: No payment gateway in Phase 1; orders are saved for admin review

### Performance Requirements
- Page load: < 2s on 4G
- Lighthouse score: > 85
- Mobile-first responsive design

### Security Requirements
- HTTPS enforced
- Password hashing (bcryptjs)
- Protected admin routes via NextAuth middleware
- SQL injection prevention via parameterised queries

---

## 7. Design Requirements

- **Brand colours**: Purple `#7C3AED` + Orange `#F97316`
- **Typography**: Poppins (headings) + Inter (body)
- **Style**: Premium telehealth platform aesthetic (clean, professional, trustworthy)
- **Responsive**: Mobile, tablet, desktop
- **Accessibility**: WCAG 2.1 AA compliance (target)

---

## 8. Constraints & Assumptions

- Prices are displayed in Nigerian Naira (₦)
- Nigerian addresses only (36 states + FCT)
- Single admin user (Beth) in Phase 1
- No payment gateway in Phase 1 (demo mode)
- Images hosted externally (Unsplash/product URLs)

---

## 9. Out of Scope (Phase 1)

- Payment gateway integration (Paystack/Flutterwave)
- Prescription management
- Multi-vendor marketplace
- Mobile app (iOS/Android)
- Loyalty/rewards programme
- Product reviews and ratings (dynamic)
- Inventory management system
- Email notifications (transactional)
- SMS notifications
