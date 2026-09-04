# 🌾 Vajrayeild– Rural Market Intelligence & Price Discovery Platform

<p align="center">
  <img src="https://img.shields.io/badge/PS%2002-Rural%20Market%20Intelligence-22c55e?style=for-the-badge&logo=target" alt="PS 02" />
  <img src="https://img.shields.io/badge/React%2018-TypeScript-blue?style=for-the-badge&logo=react" alt="React 18 TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Tests-14%20Passing-brightgreen?style=for-the-badge&logo=vitest" alt="Tests" />
  <img src="https://img.shields.io/badge/Gov%20APMC-AGMARKNET%20%26%20eNAM-FF9933?style=for-the-badge" alt="APMC AGMARKNET" />
</p>

---

## 📖 Overview

**Krishi Rates** is an enterprise-grade, data-driven agricultural intelligence and market discovery platform built for Indian farmers, Farmer Producer Organizations (FPOs), and rural agri-entrepreneurs. 

Developed strictly aligned with **Problem Statement 02 (Rural Market Intelligence & Price Discovery)**, the platform eliminates middleman opacity, enables spatial APMC mandi arbitrage, and empowers farmers with true net in-hand cash realization calculation, 14-day price forecasting, WDRA warehouse discovery, and multi-language voice accessibility.

---

## ✨ Key Platform Modules & Innovations

### 1️⃣ 📊 Real-Time APMC Price Discovery & Benchmark Engine
* **Multi-Commodity Tracking:** Live modal, minimum, and maximum rates across 15+ major crops (Wheat, Soybean, Cotton, Onion, Tomato, Basmati Paddy, Maize, Mustard, Chana, Turmeric, Garlic, etc.).
* **Government MSP Spread Benchmark:** Real-time calculation comparing prevailing mandi prices against Central Minimum Support Price floors (e.g. `+₹205 Above MSP`).
* **🔊 Voice Audio Accessibility:** Integrated HTML5 Web Speech API delivering crystal-clear readouts in **Hindi (`hi-IN`)**, **Marathi (`mr-IN`)**, and **English (`en-IN`)**.
* **Sparklines & Historical Trends:** 7-day sparkline mini-charts and 6-month comparative price trend visualizer.

### 2️⃣ 📍 Nearby Mandi Comparisons & Spatial Arbitrage
* **Radius-Based Hub Search:** Filter mandis by customizable distance bands (25 km, 50 km, 100 km, and 350 km interstate).
* **Multi-Mandi Matrix:** Direct side-by-side analysis of distance (km), estimated transit time (hrs), daily arrival volume (Tonnes), and price differentials (+/- ₹/Qtl).
* **Gate Queue Monitoring:** Real-time mandi yard congestion indicators (*Smooth <30m*, *Moderate 1-2h*, *Heavy Queue 3+h*).
* **Direct APMC Control Contact:** Instant one-tap calling to market committee secretariats.

### 3️⃣ 💰 Net Revenue Calculator & True Cash Realization
* **The Core Problem Solved:** Eliminates misleading headline prices by calculating actual net in-hand cash after all logistics, statutory levies, and transit losses.
* **Granular Cost Deductions:**
  * **Transport Logistics:** Vehicle-specific rates (Tata Ace, Bolero Maxi, Tractor Trolley, Eicher 14ft, 10-T 6-Wheeler).
  * **Statutory Mandi Cess:** Official state APMC cess (1.0% – 1.5%).
  * **Handling & Hamali:** Labor loading/unloading rates per quintal.
  * **Weighbridge Charges:** Standard electronic weigh slip fees.
  * **Transit Shrinkage:** Moisture loss and perishable spoilage factors.
* **🏆 Highest Net Profit Crown:** Highlights the most profitable market destination.
* **Shareable Insights:** One-click CSV export and instant WhatsApp summary generator.

### 4️⃣ 🔮 14-Day Demand Forecasting & Heuristic Advisory
* **Predictive Price Bands:** Visual confidence interval charts with projected modal rates, upside targets, and downside support floors.
* **Actionable Advisories:** Dynamic recommendations (`HOLD STOCK`, `SELL IMMEDIATELY`, `DIVERT SHIPMENT`).
* **Supply-Demand Balance Index:** Regional market supply categorization (Deficit / Balanced / Surplus).
* **Verified Corporate & FPO Bids:** Direct contract procurement listings (ITC e-Choupal, Sahyadri Farms, Adani Wilmar) with floor price offers and guaranteed payment terms.

### 5️⃣ 🚚 Supply Chain Transparency & Post-Harvest Finance
* **0% Farmer Commission Audit:** Transparent breakdown of gazetted market charges protecting farmers from illegal deductions.
* **WDRA Accredited Warehouse Locator:** Cold storage and dry warehouse directory with real-time capacity and rental rates.
* **e-NWR Pledge Loan Calculator:** Instant collateralized credit eligibility estimator (up to 70% LTV at 7% p.a.).
* **Rural Logistics Transporter Fleet:** Direct transporter contacts with transparent per-km freight pricing.

### 6️⃣ 🚜 Farm Machinery & Custom Hiring Centers (CHC)
* **Equipment Rentals:** Search and book tractors, rotavators, combined harvesters, laser levelers, and boom sprayers from local CHCs.
* **Government Subsidy Guides:** Direct guidance on **SMAM (Sub-Mission on Agricultural Mechanization)** and **DBT Agriculture** schemes (40%–50% subsidy).

### 7️⃣ 🌾 Crop Care & Diagnostic Support
* **Disease & Pest Prevention:** Step-by-step guidance for fungal blights, stem borers, rusts, and leaf spots.
* **Chemical & Bio Mixture Guidelines:** Compatible tank-mix recommendations, dosages, and safety intervals.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Core** | React 18, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS, Radix UI Primitives, Lucide Icons, Glassmorphic Design System |
| **Data Visualization** | Recharts (Responsive Line, Bar, and Area charts) |
| **Accessibility** | Web Speech Synthesis API (`en-IN`, `hi-IN`, `mr-IN`), Semantic HTML5, ARIA labels |
| **Internationalization** | Context-driven multi-language support (`en`, `hi`, `mr`, `gu`, `te`) |
| **Testing** | Vitest, React Testing Library, JSDOM (14 automated tests) |
| **Build & Tooling** | Vite, PostCSS, Autoprefixer, TypeScript Compiler (`tsc`) |

---

## 🏗️ System Architecture

```text
                     🌾 FARMER / FPO / RURAL AGRI-USER
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │   React 18 + TypeScript + Responsive Glassmorphic UI   │
       │   (Web Speech Synthesis • Multi-Lingual Context)       │
       └────────────────────────────┬───────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Mandi Price     │      │ Spatial Arbitrage│      │  Net Revenue     │
│  Discovery Engine│      │ & Radius Matrix  │      │  Profit Engine   │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         │                          │                          │
         ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ 14-Day Demand    │      │ WDRA Warehouses  │      │ CHC Machinery    │
│ & Price Forecast │      │ & e-NWR Loans    │      │ & Crop Care      │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/tarun215/HPL.git
cd HPL

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be accessible at: **`http://localhost:8080/`**

---

## 🧪 Testing & Verification

Run the automated test suite with Vitest and React Testing Library:

```bash
# Run all unit and integration tests
npm test -- --run

# Run tests in watch mode
npm test

# Build production bundle
npm run build
```

---

## ♿ Accessibility & Inclusivity

- **High Contrast Ratios:** Designed for outdoor sunlight readability in rural environments.
- **Audio Readouts:** Native text-to-speech engine reading commodity modal rates in English, Hindi, and Marathi.
- **Low-Bandwidth Optimized:** Lightweight bundle footprint with responsive SVG charts and instant offline caching.
- **Full Keyboard & Screen Reader Support:** Semantic HTML markup and Radix UI ARIA-compliant primitives.


<p align="center">
  🌾 <i>Empowering Indian Farmers with Transparent Real-Time Data & Maximized Net Realization</i>
</p>
