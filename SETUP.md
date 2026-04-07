# BethMedic Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database (Render, Supabase, Railway, or local)

## Quick Start

### 1. Configure Database
Edit `.env.local` and set your PostgreSQL connection string:
```
DATABASE_URL="postgresql://user:password@host:5432/bethmedic?sslmode=require"
```

**If using Render (same as FinVault):** Copy your DATABASE_URL from the Render dashboard.

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Database
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Create tables in PostgreSQL
```

### 4. Seed Sample Data
```bash
npm run db:seed
```
This creates:
- Admin: `admin@bethmedic.com` / `admin123`
- Customer: `customer@example.com` / `customer123`
- 12 sample products

### 5. Start Development
```bash
npm run dev
# or double-click start.bat
```

Open http://localhost:3000

---

## Pages
| URL | Description |
|-----|-------------|
| `/` | Landing page with 3D hero |
| `/products` | Product catalog |
| `/products/[id]` | Product detail |
| `/login` | Sign in |
| `/signup` | Register |
| `/cart` | Shopping cart |
| `/checkout` | Place order |
| `/admin` | Admin dashboard |
| `/admin/products` | Manage products |
| `/admin/products/new` | Add product |
| `/admin/orders` | Manage orders |
| `/admin/chat` | Customer chat |

## Admin Features
- Add/edit/delete products (name, price, stock, image URL, category)
- Toggle product visibility
- View and update order statuses
- Real-time chat with customers

## Customer Features
- Browse products by category/search
- Product detail with gallery
- Cart with quantity management
- Checkout with shipping form
- Live chat with Beth (founder/admin)
- Account signup/login
