# CIVITAS PROPTECH v2.0
### Enterprise Property Management, Solar Micro-Grids & Impact Investing Platform

Civitas v2.0 is Ghana's premier integrated PropTech platform, built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Supabase (PostgreSQL + PostGIS + pgvector)**.

---

## 🌟 Key Features

1. **Multi-Tenant Architecture**: Complete Row Level Security (RLS) isolation for Property Owners, Tenants, Technicians, and Diaspora Investors.
2. **Ghana Post GPS Integration**: Automated digital address validation and spatial GIST indexing.
3. **Ghana Rent Act (Act 220) Escrow Compliance**: Enforces 6-month advance rent deposit caps with automated Bank of Ghana escrow holding and release rules.
4. **Mobile Money Multi-Rail Payments**: Supports MTN MoMo, Telecel Cash, AT Money, Paystack, and Wise USD transfers.
5. **Solar Micro-Grid Telemetry & ESG Carbon Ledger**: Real-time kWh solar output tracking, lithium battery health gauges, and Verra VCS Carbon Offset Certificate generation.
6. **24/7 SLA Maintenance Dispatch**: Guaranteed 2-hour emergency repair dispatch with artisan rating systems.
7. **PWA (Progressive Web App)**: Installable on iOS & Android with offline-first service worker caching for field technicians in low-connectivity areas.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Change to Next.js application directory
cd civitas-next

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment Guide (Vercel)

### Option A: Deploy via Vercel CLI

```bash
cd civitas-next
npx vercel
```

### Option B: Deploy via GitHub / GitLab

1. Push your repository to GitHub.
2. Import the `civitas-next` directory into Vercel.
3. Add Environment Variables from `.env.production.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

---

## 🗄️ Database Setup (Supabase)

To initialize the PostgreSQL database schema:

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor**.
3. Paste and run the complete SQL schema from `automation/layer1-supabase-schema.sql`.

---

## 📜 License & Copyright

© 2025 Civitas Estate & Maintenance Ltd. All rights reserved.
