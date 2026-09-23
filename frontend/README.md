# Bee's Treatz - Frontend (Next.js App Router)

This is the decoupled frontend web application for **Bee's Treatz** Nigerian Kitchen in the UK.

## Ready for shadcn/ui Installation

The folder structure, Tailwind configuration, CSS variables, and path aliases (`@/*`) have been pre-configured for your manual shadcn setup.

### How to install shadcn components:

You can install any component you need directly via the shadcn CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add input
npx shadcn@latest add toast
```

Components will automatically be placed into `src/components/ui/`.

---

## Directory Structure

```
frontend/
├── components.json             # shadcn configuration file
├── package.json                # Next.js 14, Tailwind, Lucide React
├── tailwind.config.ts          # Tailwind with CSS variables
├── src/
│   ├── app/
│   │   ├── (customer)/         # Customer routes
│   │   │   ├── layout.tsx      # Customer header & footer
│   │   │   ├── page.tsx        # Menu / Home
│   │   │   ├── checkout/       # Checkout & delivery form
│   │   │   └── order-status/   # Order status tracking
│   │   ├── admin/              # Kitchen Admin routes
│   │   │   ├── layout.tsx      # Admin sidebar navigation
│   │   │   ├── page.tsx        # Live Orders Kitchen feed
│   │   │   └── menu/           # Out-of-stock toggles
│   │   ├── globals.css         # Tailwind + Bee's Treatz color variables
│   │   └── layout.tsx          # Root layout & metadata
│   ├── components/
│   │   ├── ui/                 # Reserved for your shadcn components
│   │   ├── customer/           # Customer components (Menu, Cart, Postcode)
│   │   └── admin/              # Kitchen display components
│   ├── lib/
│   │   ├── api.ts              # Typed API client connecting to backend
│   │   └── utils.ts            # Standard cn() utility for shadcn
│   └── types/
│       └── index.ts            # Shared TypeScript domain types
```

---

## Environment Variables

Check `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Running the Frontend

```bash
npm install
npm run dev
```
Runs at `http://localhost:3000`.
