# Product Backlog
## BethMedic — Premium Medical E-Commerce Platform
**Last Updated:** April 2026  
**Format:** Story Points (SP) | Priority: P1 (Critical) → P4 (Nice-to-have)

---

## ✅ DONE — Phase 0 MVP (Completed)

| ID | Feature | Story Points | Notes |
|----|---------|-------------|-------|
| MVP-01 | User signup / login with NextAuth | 5 | JWT, credentials provider |
| MVP-02 | Product catalog with search & filters | 8 | Category, search, featured |
| MVP-03 | Product detail page | 5 | Image, description, stock, price |
| MVP-04 | Shopping cart (Zustand, persisted) | 8 | Add/remove/update, localStorage |
| MVP-05 | Checkout with Nigerian states | 5 | ₦ pricing, ₦2,500 shipping |
| MVP-06 | Admin dashboard | 8 | Revenue, orders, products, alerts |
| MVP-07 | Admin product management | 8 | Add/edit/delete, images, pricing |
| MVP-08 | Admin order management | 5 | Status updates, customer details |
| MVP-09 | Customer–founder live chat | 8 | Polling-based, per-user rooms |
| MVP-10 | Admin chat panel | 5 | Multi-room, reply to customers |
| MVP-11 | Navbar (purple on scroll) | 3 | Purple gradient when scrolled |
| MVP-12 | Homepage redesign | 13 | Services, Meet Beth, FAQ, Stats |
| MVP-13 | Founder page | 5 | Bio, timeline, values, quotes |
| MVP-14 | Naira (₦) pricing throughout | 3 | All screens updated |
| MVP-15 | Nigerian address system | 3 | 36 states + FCT dropdown |
| MVP-16 | Footer with Nigerian contact | 2 | Lagos address, +234 phone |
| MVP-17 | Admin sidebar fix | 3 | Hides global navbar on /admin |
| MVP-18 | PRD, BRD, Backlog documentation | 5 | This document |

**MVP Total:** 102 Story Points

---

## 🔵 SPRINT 1 — Core Enhancements (Next 4 Weeks)

### P1 — Critical

| ID | Feature | SP | Description |
|----|---------|-----|-------------|
| S1-01 | **Paystack Payment Gateway** | 13 | Integrate Paystack for real Nigerian card/transfer payments |
| S1-02 | **Email Notifications (Transactional)** | 8 | Order confirmation, status updates via NodeMailer or Resend |
| S1-03 | **Product Image Upload (File Storage)** | 8 | Admin can upload images to Cloudinary or AWS S3 |
| S1-04 | **Live Notifications (In-app)** | 8 | Bell icon with new chat/order alerts, polling every 10s |
| S1-05 | **Order Confirmation Email** | 5 | Auto-send on successful order placement |

### P2 — High Priority

| ID | Feature | SP | Description |
|----|---------|-----|-------------|
| S1-06 | **Product Reviews & Ratings** | 8 | Authenticated users can leave reviews; display avg rating |
| S1-07 | **User Account Dashboard** | 5 | "My Orders" page showing order history and status |
| S1-08 | **Search Autocomplete** | 5 | Real-time search suggestions in navbar |
| S1-09 | **WhatsApp Chat Integration** | 5 | Click-to-WhatsApp button linking to Beth's business number |
| S1-10 | **Newsletter Subscription (Backend)** | 3 | Save emails to DB; admin can export list |

---

## 🟡 SPRINT 2 — Growth Features (Weeks 5–8)

### P1 — Critical

| ID | Feature | SP | Description |
|----|---------|-----|-------------|
| S2-01 | **Logistics API Integration** | 13 | GIG Logistics or DHL Nigeria for real-time delivery quotes |
| S2-02 | **SMS Notifications** | 8 | Order status via Termii or Twilio (Nigerian SMS) |
| S2-03 | **WebSocket Chat (Real-time)** | 13 | Replace polling with Socket.io for instant chat |
| S2-04 | **Admin: Customer Management** | 8 | View all registered customers, block/unblock accounts |

### P2 — High Priority

| ID | Feature | SP | Description |
|----|---------|-----|-------------|
| S2-05 | **Wishlist / Saved Products** | 5 | Users can save products to a wishlist |
| S2-06 | **Promo Codes & Discounts** | 8 | Admin creates promo codes; customers apply at checkout |
| S2-07 | **Product Bundles** | 5 | Group products into health bundles with bundle pricing |
| S2-08 | **Recently Viewed Products** | 3 | Track and display last 5 viewed products |
| S2-09 | **Related Products** | 3 | Show products in same category on detail page |

### P3 — Medium Priority

| ID | Feature | SP | Description |
|----|---------|-----|-------------|
| S2-10 | **Blog / Health Articles** | 8 | Beth's health tips; SEO-optimised content |
| S2-11 | **Social Login (Google/Facebook)** | 5 | OAuth via NextAuth |
| S2-12 | **Dark Mode** | 3 | System preference-aware dark mode |
| S2-13 | **Progressive Web App (PWA)** | 5 | Installable on mobile, offline browsing |

---

## 🟠 SPRINT 3 — Scale & Monetisation (Months 3–6)

| ID | Feature | SP | Description |
|----|---------|-----|-------------|
| S3-01 | **Subscription Box** | 21 | Monthly curated health box; recurring billing via Paystack |
| S3-02 | **Expert Consultation Booking** | 21 | Paid 1:1 video/chat session with Beth; calendar integration |
| S3-03 | **Wholesale / B2B Portal** | 13 | Bulk ordering for clinics and hospitals |
| S3-04 | **Loyalty Rewards Programme** | 13 | Points for purchases, redeemable for discounts |
| S3-05 | **Multi-language Support** | 8 | English + Pidgin English (Nigerian dialect) |
| S3-06 | **NAFDAC Product Verification Badge** | 5 | Display NAFDAC registration number on product pages |
| S3-07 | **Analytics Dashboard (Admin)** | 13 | Sales charts, customer insights, top products |
| S3-08 | **Inventory Management** | 8 | Auto-reorder alerts, stock forecast |

---

## ⚪ BACKLOG — Future Phases

| ID | Feature | SP | Phase |
|----|---------|-----|-------|
| F-01 | Native Mobile App (React Native) | 55 | Phase 3 |
| F-02 | Prescription Upload & Verification | 34 | Phase 3 |
| F-03 | Telemedicine Integration | 55 | Phase 4 |
| F-04 | Multi-vendor Marketplace | 89 | Phase 4 |
| F-05 | AI Product Recommendation Engine | 34 | Phase 4 |
| F-06 | Insurance Partnerships | 34 | Phase 4 |
| F-07 | Lab Test Booking | 21 | Phase 3 |
| F-08 | Health Records Storage | 34 | Phase 4 |

---

## Bug Tracker

| ID | Bug | Priority | Status |
|----|-----|----------|--------|
| BUG-01 | Admin sidebar overlapping global Navbar | P1 | ✅ Fixed |
| BUG-02 | Chat widget hooks violation on login | P1 | ✅ Fixed |
| BUG-03 | Cart total showing $ instead of ₦ | P1 | ✅ Fixed |
| BUG-04 | Checkout country dropdown not Nigeria | P1 | ✅ Fixed |
| BUG-05 | Navbar not purple on scroll | P2 | ✅ Fixed |

---

## Definition of Done

A feature is considered "done" when:
- [ ] Code is written and passes TypeScript checks
- [ ] Feature works correctly on mobile and desktop
- [ ] Prices displayed in Naira (₦) where applicable
- [ ] Admin functionality works (if applicable)
- [ ] No console errors in production build
- [ ] Code is committed and pushed to GitHub
