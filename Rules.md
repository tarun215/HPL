Create `RULES.md` in the root of your repository to protect the codebase during team edits:

```markdown
# 🛡️ VajraYield Development & Agent Guardrails (RULES.md)

This file sets the development rules for the **VajraYield** codebase for **HPL 2026 PS 02 (Build For Udupi!)**. 

Any team member or AI coding assistant (Antigravity, Cursor, Claude Code, Copilot) editing this repository **must read and follow these rules** to preserve our core logic, mathematical accuracy, and UI layout.

---

## 🚫 1. Absolute Invariants (DO NOT TOUCH OR MODIFY)

### Rule 1.1: Do Not Alter the Net Return Mathematical Formula
* File: `src/lib/calculator.ts`
* The formula for `calculateNetReturns()` matches the official HPL 2026 prompt specification:
  $$\text{Net Return} = \text{Gross Revenue} - \text{Transport Cost} - \text{Mandi Statutory Fees} - \text{Perishability Spoilage}$$
* **DO NOT** remove vehicle roundtrip calculation (`distanceKm * 2 * FUEL_PER_KM`).
* **DO NOT** remove the shared pooling logic (`pooledTransitCost = soloTransitCost / 2.8`).
* **DO NOT** alter the coastal decay formula ($k_{\text{decay}} \times \text{transitHours}$).

### Rule 1.2: Do Not Revert to Maharashtra / Generic Datasets
* File: `src/data/ruralMarketData.ts`
* Origin points must remain focused on **Bantakal (SMVITM Hub)**, **Shirva**, and surrounding areas.
* Mandis must remain: **Adi Udupi APMC**, **Mangaluru Central Bunder**, **Kundapura APMC**, and **Karkala Santhe**.
* Commodities must include regional staples: **Tomato**, **Mattu Gulla (GI)**, **Shankarapura Jasmine**, and **Arecanut**.
* **DO NOT** re-introduce Nashik, Lasalgaon, Pimpalgaon, or non-coastal crops.

### Rule 1.3: Do Not Introduce Router 404s in the Header
* File: `src/components/Header.tsx`
* Top navigation buttons (`Arbitrage & Mandi Intelligence`, `Net Revenue Maximizer`, and `Pooling Cluster Radar`) use **custom window event triggers (`switch_dashboard_tab`)** and smooth scroll (`scrollIntoView`).
* **DO NOT** replace these with React Router links (`<Link to="/net-revenue">` or `<Link to="/pooling">`), as these routes do not exist and will trigger a 404 page.

---

## 🎨 2. Frontend Layout & UI Protection

### Rule 2.1: Maintain Tailwind and Radix Integrity
* Do not introduce heavy alternative CSS frameworks (e.g., Bootstrap, Material UI).
* Respect the existing dark/light mode setup using CSS variables in `src/index.css`.
* All newly added badges or alerts must use the established color system:
  * Optimal profit / Success: `emerald-600` / `emerald-500`
  * Warning / Deceptive Spreads: `amber-500` / `amber-600`
  * Action / Pooling: `blue-600`

### Rule 2.2: Preserve Branding Elements
* Brand name: **VajraYield**.
* Logo location: `public/vajrayield.jpeg` and `public/logo.png`.
* Tagline: `Rural Market Intelligence · Build For Udupi! (SMVITM Bantakal)`.
* Do not revert to generic titles such as "Krishi Rates" or "Agri Marketplace".

---

## 🛠️ 3. Safe Areas for Enhancement

Teammates and AI agents are permitted to work in the following designated areas:

1. **Weather Component Integration (`src/pages/Weather.tsx`):**
   * You may add coastal rainfall metrics, humidity gauges, or alerts for the Udupi region.
   * If adding an external weather API (e.g., OpenWeatherMap), include safe mock fallbacks so the app renders properly without an API key.
2. **Crop Care Expansion (`src/pages/CropCare.tsx`):**
   * You may add localized care routines for Mattu Gulla and Shankarpura Jasmine.
3. **Vernacular Translation Strings (`src/utils/translations.ts` & `src/utils/marketTranslations.ts`):**
   * You may expand the Kannada and Tulu translation dictionaries.
   * Keep existing translation keys intact to prevent blank string errors.

---

## 🧪 4. Required Verification Workflow

Before pushing any commit to the remote repository, you must run the following validation pipeline:

```bash
# Step 1: Run the full test suite (must pass 27/27)
npm run test

# Step 2: Confirm TypeScript compilation succeeds with 0 errors
npm run build

# Step 3: Run the local dev server and test in the browser
npm run dev

