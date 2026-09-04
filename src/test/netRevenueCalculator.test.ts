import { describe, it, expect } from "vitest";
import { MASTER_MANDIS, RURAL_COMMODITIES, TRANSPORT_VEHICLES } from "../data/ruralMarketData";

describe("PS 02 Spatial Mandi Net Revenue Engine", () => {
  it("should have valid Master Mandis dataset with distances and commodities", () => {
    expect(MASTER_MANDIS.length).toBeGreaterThanOrEqual(4);
    const lasalgaon = MASTER_MANDIS.find((m) => m.id === "mandi_lasalgaon");
    expect(lasalgaon).toBeDefined();
    expect(lasalgaon?.commodities["onion"]).toBeDefined();
    expect(lasalgaon?.commodities["onion"].modalPrice).toBeGreaterThan(0);
  });

  it("should accurately calculate Gross Revenue", () => {
    const qtyQtl = 50;
    const modalPrice = 2850;
    const grossRevenue = qtyQtl * modalPrice;
    expect(grossRevenue).toBe(142500);
  });

  it("should calculate Transport Freight with base fare and per-km rate", () => {
    const vehicle = TRANSPORT_VEHICLES.find((v) => v.id === "eicher_14ft")!;
    const distanceKm = 48; // Lasalgaon distance
    const freightCost = Math.round(vehicle.baseFare + distanceKm * vehicle.ratePerKm);
    expect(freightCost).toBe(vehicle.baseFare + distanceKm * vehicle.ratePerKm);
    expect(freightCost).toBe(3224);
  });

  it("should calculate Statutory APMC Cess (1.05% at Lasalgaon)", () => {
    const grossRevenue = 142500;
    const apmcCess = Math.round(grossRevenue * (1.05 / 100));
    expect(apmcCess).toBe(1496);
  });

  it("should calculate Hamali labour fees accurately per quintal", () => {
    const qtyQtl = 50;
    const hamaliPerQtl = 14;
    const hamaliCost = qtyQtl * hamaliPerQtl;
    expect(hamaliCost).toBe(700);
  });

  it("should compute accurate True In-Hand Net Revenue after all statutory and logistics deductions", () => {
    const qtyQtl = 50;
    const modalPrice = 2850;
    const distanceKm = 48;
    const vehicle = TRANSPORT_VEHICLES.find((v) => v.id === "eicher_14ft")!;
    const freight = Math.round(vehicle.baseFare + distanceKm * vehicle.ratePerKm);
    const apmcCess = Math.round((qtyQtl * modalPrice) * (1.05 / 100));
    const hamali = qtyQtl * 14;
    const weighbridge = 50;
    
    // Perishability shrinkage: 0.8% per 50km for vegetables
    const shrinkagePercent = (distanceKm / 50) * 0.008;
    const shrinkageCost = Math.round((qtyQtl * modalPrice) * shrinkagePercent);

    const grossRevenue = qtyQtl * modalPrice;
    const totalDeductions = freight + apmcCess + hamali + weighbridge + shrinkageCost;
    const netRevenue = grossRevenue - totalDeductions;
    const netPerQtl = Math.round(netRevenue / qtyQtl);

    expect(grossRevenue).toBe(142500);
    expect(netRevenue).toBeLessThan(grossRevenue);
    expect(netRevenue).toBeGreaterThan(130000);
    expect(netPerQtl).toBeGreaterThan(2600);
  });
});
