# 🍯 Bee's Treatz - Nigerian Food Ordering Platform (UK)

A production-ready, decoupled full-stack food ordering platform designed for **Bee's Treatz**, an authentic Nigerian kitchen and catering business operating in the United Kingdom.

---

## 🏗 System Architecture

The project is structured into two completely independent services:

```
bees-treatz/
├── backend/            # Standalone Node.js + Express + TypeScript + Prisma API
└── frontend/           # Modern Next.js 14 App Router + Tailwind CSS (shadcn-ready)
```

### Key Highlights:
1. **UK Food & Localization**:
   - Currency: **GBP (£)** across prices, cart totals, and Stripe checkout sessions.
   - UK Postcode Validation & Radius Delivery via [Postcodes.io](https://postcodes.io) API (calculating radial distance in miles from the restaurant's base postcode e.g. `SE15 5BA`).
   - UK Natasha's Law compliance: clear allergen disclosures on every dish (Fish, Crustaceans, Peanuts, Gluten, Eggs).
2. **Authentic Nigerian Menu Modifiers**:
   - Traditional soups (Egusi, Efo Riro, Ogbono) paired with customizable swallow choices (*Pounded Yam, Eba, Amala, Semo*) and protein selections (*Assorted Meats, Goat Meat, Fried Fish*).
   - Party Jollof Rice, Ofada Rice with Ayamase stew, fiery Suya skewers, Peppered Asun, and Puff-Puff.
3. **Decoupled Backend API**:
   - Express + TypeScript + Prisma ORM (configured for PostgreSQL / Neon).
   - Secure Stripe Checkout Session generation + webhook handling (`checkout.session.completed`).
   - Built-in simulation fallback for testing payments instantly before Stripe test keys are configured.
   - Server-side price recalculation to prevent client-side cart tampering.
4. **Decoupled Next.js Frontend**:
   - Next.js 14 App Router with customer and admin route groups.
   - Pre-configured for manual `shadcn/ui` installation (`components.json`, `@/*` path aliases, CSS variables).

---

## 🚀 Getting Started

### 1. Backend Service (`backend/`)

#### Configuration (`backend/.env`)
```env
PORT=5000
FRONTEND_URL=http://localhost:3000

# PostgreSQL URL (e.g. Neon Serverless Postgres, Render, or Local)
DATABASE_URL="postgresql://username:password@ep-cool-butterfly.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Stripe Keys (from Stripe Dashboard -> Developers -> API Keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# UK Postcode Delivery Configuration
RESTAURANT_POSTCODE="SE15 5BA"
MAX_DELIVERY_DISTANCE_MILES=6.0
BASE_DELIVERY_FEE=3.50
PER_MILE_FEE=0.80
FREE_DELIVERY_THRESHOLD=50.00
```

#### Run Database Migration & Seeds
```bash
cd backend
npx prisma generate
npx prisma db push
npm run prisma:seed
```

#### Start Backend API
```bash
npm run dev
```
API runs on `http://localhost:5000`.

---

### 2. Frontend Application (`frontend/`)

#### Configuration (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Adding shadcn UI Components Manually
The frontend is already configured with `components.json`. You can install components directly:
```bash
cd frontend
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add input
```

#### Start Frontend
```bash
cd frontend
npm run dev
```
Client runs on `http://localhost:3000`.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check, status, and restaurant postcode |
| `GET` | `/api/menu` | Full categorized menu with swallow and protein modifier groups |
| `GET` | `/api/menu/:id` | Single dish details |
| `PATCH` | `/api/menu/:id/availability` | Toggle item in/out of stock (*Admin*) |
| `POST` | `/api/delivery/validate-postcode` | Validates UK postcode and calculates radial delivery fee |
| `POST` | `/api/orders` | Create a new delivery or collection order |
| `GET` | `/api/orders/:id` | Fetch order details and live status by ID or `BT-xxxx` number |
| `GET` | `/api/orders` | List all orders (*Admin*) |
| `PATCH` | `/api/orders/:id/status` | Update kitchen status (`PREPARING`, `OUT_FOR_DELIVERY`, etc.) (*Admin*) |
| `POST` | `/api/payments/create-checkout-session` | Create Stripe checkout session in GBP |
| `POST` | `/api/payments/webhook` | Stripe webhook listener |
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/auth/me` | Current authenticated admin profile |
