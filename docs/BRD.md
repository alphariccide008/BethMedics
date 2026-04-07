# Business Requirements Document (BRD)
## BethMedic — Premium Medical E-Commerce Platform
**Version:** 1.0  
**Date:** April 2026  
**Prepared By:** AlphaX Development Team  
**Business Owner:** Beth Okafor  
**Status:** Approved

---

## 1. Executive Summary

BethMedic addresses a critical market gap in Nigeria's health sector: the absence of a clinically trusted, professionally curated medical e-commerce platform. The business is founded by Beth Okafor, a licensed healthcare professional with 15+ years of clinical experience, who personally vets every product on the platform.

---

## 2. Business Objectives

1. **Market Position**: Establish BethMedic as Nigeria's #1 trusted medical e-commerce brand within 24 months
2. **Revenue**: Achieve ₦1 billion cumulative GMV within the first year of full operation
3. **Trust**: Eliminate the risk of counterfeit health products for Nigerian consumers
4. **Accessibility**: Make pharmaceutical-grade products available to all 36 Nigerian states
5. **Education**: Provide free, expert-led health guidance through the platform's chat system

---

## 3. Business Context

### Market Opportunity
- Nigeria's health product market: estimated ₦2.5 trillion annually
- E-commerce health & wellness sector growing at 18% YoY (post-COVID)
- NAFDAC reports 30–40% of health products in open markets are substandard or counterfeit
- Middle-class Nigerians (target: 45 million people) increasingly health-conscious

### Competitive Landscape
| Competitor | Weakness | BethMedic Advantage |
|------------|----------|-------------------|
| Jumia Health | No clinical vetting | Expert curation by CMO |
| Health Plus | Physical only, expensive | Online, competitive pricing |
| Konga | Unverified sellers | Single verified supplier chain |
| LifeStore | Limited range | 500+ verified products |

### Revenue Model
| Stream | Description | Projected Share |
|--------|-------------|----------------|
| Product Sales | Direct sales of supplements & devices | 80% |
| Expert Consultation (Phase 2) | Paid 1:1 health consultations | 10% |
| Subscription Box (Phase 3) | Monthly curated health boxes | 7% |
| B2B Wholesale (Phase 3) | Bulk supply to clinics/hospitals | 3% |

---

## 4. Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| Beth Okafor | Founder/CMO/Admin | Platform quality, brand reputation |
| Customers | End users | Product quality, value, convenience |
| AlphaX Dev Team | Technology partner | Successful delivery |
| Suppliers | Product vendors | Consistent orders, compliance |
| NAFDAC | Regulatory body | Compliance with Nigerian drug laws |
| NITDA | Digital economy regulator | Data privacy compliance |

---

## 5. Business Requirements

### BR-001: Product Quality Assurance
**Priority:** Critical  
All products listed must be sourced from NAFDAC-approved, FDA-registered, or ISO 9001-certified suppliers. Beth must personally approve every product before listing. Product CoAs (Certificates of Analysis) must be on file.

### BR-002: Naira Pricing
**Priority:** Critical  
All prices, transactions, and financial reporting must be in Nigerian Naira (₦). No foreign currency display on any customer-facing interface.

### BR-003: Nigerian Address System
**Priority:** High  
Checkout and delivery must support Nigerian states (36 + FCT) and LGA-level addressing. Phone numbers must accept Nigerian format (+234).

### BR-004: Expert Chat Access
**Priority:** High  
Every customer must have direct access to Beth (the founder/CMO) through the chat system, at no additional cost.

### BR-005: Admin Control
**Priority:** Critical  
Beth (sole admin in Phase 1) must have full control over: product listings and pricing, order management, customer chat, and platform content.

### BR-006: Regulatory Compliance
**Priority:** High  
Platform must comply with NAFDAC product listing guidelines, Nigerian Consumer Protection regulations, and NITDA Data Protection Regulation (NDPR).

### BR-007: Free Shipping Incentive
**Priority:** Medium  
Orders above ₦50,000 qualify for free shipping. Standard delivery fee: ₦2,500.

### BR-008: Mobile-First Design
**Priority:** High  
Over 78% of Nigerian internet users access the web via mobile. The platform must be fully functional and optimised for mobile devices.

---

## 6. Business Rules

1. Only authenticated users can place orders
2. Admin (Beth) cannot place orders as a customer
3. Products with 0 stock cannot be added to cart
4. Chat is only available to non-admin users
5. Order cancellation is only permitted before "SHIPPED" status
6. Prices are in Naira; no foreign currency conversion is displayed

---

## 7. Assumptions

- Beth will handle all admin operations personally in Phase 1
- Payment gateway (Paystack) will be integrated in Phase 2
- Logistics partnerships with GIG Logistics / DHL Nigeria in Phase 2
- NAFDAC registration documentation is available for all stocked products

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Counterfeit products entering supply chain | Low | Critical | Strict supplier vetting, CoA requirements |
| Platform downtime during peak demand | Medium | High | Render/Vercel SLA, CDN |
| Data breach (customer info) | Low | High | HTTPS, hashed passwords, NDPR compliance |
| Regulatory action by NAFDAC | Low | Critical | Full compliance documentation |
| High cart abandonment | High | Medium | Free shipping incentive, saved cart |
| Payment gateway failure (Phase 2) | Medium | High | Dual gateway (Paystack + Flutterwave) |

---

## 9. Success Criteria

The project will be considered successful when:
1. Platform is live with 500+ verified products
2. 10,000 registered customers within 90 days of launch
3. Average order value > ₦35,000
4. Customer satisfaction rating ≥ 4.7/5
5. Zero reports of counterfeit products sourced through BethMedic

---

## 10. Timeline

| Phase | Description | Duration |
|-------|-------------|----------|
| Phase 0 | MVP Development (current) | Complete |
| Phase 1 | Launch & User Acquisition | Q2 2026 |
| Phase 2 | Payment Gateway + Logistics Integration | Q3 2026 |
| Phase 3 | Mobile App + B2B + Subscription | Q1 2027 |
