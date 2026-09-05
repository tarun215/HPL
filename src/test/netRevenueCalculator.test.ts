/**
 * VajraYield — Vitest Unit Tests
 * HPL 2026 | PS 02 | Build For Udupi! (SMVITM Bantakal)
 *
 * Tests:
 *  1. 500 kg Tomato: Adi Udupi net > Mangaluru Bunder net (Solo mode)
 *  2. Cluster Pooling: pooledTransitCost < soloTransitCost by >= 60%
 *  3. Boundary: ≤0 and non-finite quantity throws RangeError
 *  4. Data integrity: 4 Udupi mandis loaded with correct IDs
 *  5. Arecanut: zero spoilage on non-perishable crop
 *  6. Gross revenue formula verification
 */
import { describe, it, expect } from "vitest";
import { calculateNetReturns, validateAndConvertQuantity } from "../lib/calculator";
import { MASTER_MANDIS, RURAL_COMMODITIES } from "../data/ruralMarketData";

// ─────────────────────────────────────────────────────────────
// Test 1: 500 kg Tomato — Adi Udupi net > Mangaluru (Solo)
// ─────────────────────────────────────────────────────────────
describe("VajraYield 500 kg Tomato Reference Scenario", () => {
  it("should confirm Adi Udupi APMC yields higher net return than Mangaluru Bunder in Solo mode", () => {
    const results = calculateNetReturns(
      "tomato",
      500,
      "Bantakal",
      MASTER_MANDIS,
      false,  // Solo mode
      true    // Apply coastal perishability
    );

    const adiUdupi = results.find((r) => r.id === "mandi_adi_udupi");
    const mangaluru = results.find((r) => r.id === "mandi_mangaluru");

    expect(adiUdupi).toBeDefined();
    expect(mangaluru).toBeDefined();
    expect(adiUdupi!.netCashSolo).toBeGreaterThan(mangaluru!.netCashSolo);
  });

  it("should mark Adi Udupi as the isWinningSolo mandi for 500 kg Tomato", () => {
    const results = calculateNetReturns("tomato", 500, "Bantakal", MASTER_MANDIS, false, true);
    const adiUdupi = results.find((r) => r.id === "mandi_adi_udupi");
    expect(adiUdupi?.isWinningSolo).toBe(true);
  });

  it("should compute Adi Udupi net cash > ₹9,000 for 500 kg Tomato", () => {
    const results = calculateNetReturns("tomato", 500, "Bantakal", MASTER_MANDIS, false, true);
    const adiUdupi = results.find((r) => r.id === "mandi_adi_udupi");
    expect(adiUdupi!.netCashSolo).toBeGreaterThan(9000);
  });
});

// ─────────────────────────────────────────────────────────────
// Test 2: Cluster Pooling — freight reduction >= 60%
// ─────────────────────────────────────────────────────────────
describe("Cluster Freight Pooling (Bantakal–Shirva Network)", () => {
  it("should reduce Mangaluru pooled transit by ≥60% compared to solo transit", () => {
    const results = calculateNetReturns("tomato", 500, "Bantakal", MASTER_MANDIS, true, true);
    const mangaluru = results.find((r) => r.id === "mandi_mangaluru");

    expect(mangaluru).toBeDefined();

    const freightReduction =
      (mangaluru!.soloTransitCost - mangaluru!.pooledTransitCost) /
      mangaluru!.soloTransitCost;

    expect(freightReduction).toBeGreaterThanOrEqual(0.6); // >= 60% savings
  });

  it("should yield higher net cash pooled than solo for Mangaluru (long distance benefits pooling)", () => {
    const soloResults = calculateNetReturns("tomato", 500, "Bantakal", MASTER_MANDIS, false, true);
    const pooledResults = calculateNetReturns("tomato", 500, "Bantakal", MASTER_MANDIS, true, true);

    const mangaluruSolo = soloResults.find((r) => r.id === "mandi_mangaluru");
    const mangaluruPooled = pooledResults.find((r) => r.id === "mandi_mangaluru");

    expect(mangaluruPooled!.netCashPooled).toBeGreaterThan(mangaluruSolo!.netCashSolo);
  });

  it("should have pooledTransitCost = soloTransitCost / 2.8 (rounded)", () => {
    const results = calculateNetReturns("arecanut", 1000, "Bantakal", MASTER_MANDIS, true, false);
    for (const r of results) {
      const expected = Math.round(r.soloTransitCost / 2.8);
      expect(r.pooledTransitCost).toBe(expected);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// Test 3: Boundary — zero, negative, and invalid quantity
// ─────────────────────────────────────────────────────────────
describe("Boundary: Invalid Quantity Inputs", () => {
  it("should throw RangeError for zero quantity", () => {
    expect(() => validateAndConvertQuantity(0)).toThrow(RangeError);
  });

  it("should throw RangeError for negative quantity", () => {
    expect(() => validateAndConvertQuantity(-100)).toThrow(RangeError);
  });

  it("should throw RangeError for Infinity", () => {
    expect(() => validateAndConvertQuantity(Infinity)).toThrow(RangeError);
  });

  it("should throw RangeError for NaN", () => {
    expect(() => validateAndConvertQuantity(NaN)).toThrow(RangeError);
  });

  it("calculateNetReturns should throw for quantity 0 kg (propagates RangeError)", () => {
    expect(() =>
      calculateNetReturns("tomato", 0, "Bantakal", MASTER_MANDIS, false, true)
    ).toThrow(RangeError);
  });
});

// ─────────────────────────────────────────────────────────────
// Test 4: Data Integrity — 4 Udupi mandis with correct IDs
// ─────────────────────────────────────────────────────────────
describe("Data Layer: MASTER_MANDIS Integrity", () => {
  it("should have exactly 4 Udupi-belt mandis", () => {
    expect(MASTER_MANDIS).toHaveLength(4);
  });

  it("should contain all 4 required mandi IDs", () => {
    const ids = MASTER_MANDIS.map((m) => m.id);
    expect(ids).toContain("mandi_adi_udupi");
    expect(ids).toContain("mandi_mangaluru");
    expect(ids).toContain("mandi_kundapura");
    expect(ids).toContain("mandi_karkala");
  });

  it("should have correct distance for Adi Udupi APMC (14.5 km from Bantakal)", () => {
    const m = MASTER_MANDIS.find((m) => m.id === "mandi_adi_udupi");
    expect(m?.distanceKm).toBe(14.5);
  });

  it("should have Hejamadi toll (₹120) on Mangaluru route", () => {
    const m = MASTER_MANDIS.find((m) => m.id === "mandi_mangaluru");
    expect(m?.tolls).toBe(120);
  });

  it("should have exactly 4 Coastal Karnataka crops", () => {
    expect(RURAL_COMMODITIES).toHaveLength(4);
    const ids = RURAL_COMMODITIES.map((c) => c.id);
    expect(ids).toContain("tomato");
    expect(ids).toContain("mattu_gulla");
    expect(ids).toContain("jasmine");
    expect(ids).toContain("arecanut");
  });
});

// ─────────────────────────────────────────────────────────────
// Test 5: Arecanut — zero spoilage (non-perishable)
// ─────────────────────────────────────────────────────────────
describe("Arecanut: Non-perishable Zero Spoilage", () => {
  it("should have zero spoilage loss for arecanut even with perishability enabled", () => {
    const results = calculateNetReturns("arecanut", 1000, "Bantakal", MASTER_MANDIS, false, true);
    for (const r of results) {
      expect(r.spoilageLoss).toBe(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// Test 6: Gross Revenue Formula Verification
// ─────────────────────────────────────────────────────────────
describe("Gross Revenue Formula: rate × (kg/100) = gross", () => {
  it("should compute gross revenue correctly for 500 kg @ ₹2200/Qtl", () => {
    const results = calculateNetReturns("tomato", 500, "Bantakal", MASTER_MANDIS, false, false);
    const adiUdupi = results.find((r) => r.id === "mandi_adi_udupi");
    // 500 kg = 5 Qtl; rate = ₹2200 → gross = ₹11,000
    expect(adiUdupi?.grossRevenue).toBe(11000);
  });

  it("should compute gross revenue correctly for arecanut 200 kg @ ₹46500/Qtl", () => {
    const results = calculateNetReturns("arecanut", 200, "Bantakal", MASTER_MANDIS, false, false);
    const adiUdupi = results.find((r) => r.id === "mandi_adi_udupi");
    // 200 kg = 2 Qtl; rate = ₹46500 → gross = ₹93,000
    expect(adiUdupi?.grossRevenue).toBe(93000);
  });
});
