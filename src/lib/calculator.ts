// VajraYield — Deterministic Net Return Math Engine
// HPL 2026 | PS 02 | Build For Udupi! (SMVITM Bantakal)
// Pure functions only — no side effects, fully testable.

export interface MandiCalculationInput {
  id: string;
  name: string;
  distanceKm: number;
  rates?: Record<string, number>;
  commodities?: Record<
    string,
    {
      modalPrice: number;
      minPrice?: number;
      maxPrice?: number;
      arrivalsTonnes?: number;
    }
  >;
  decayRates?: Record<string, number>;
  baseTransitHire?: number;
  tolls?: number;
}

export interface MandiCalculation {
  id: string;
  name: string;
  distanceKm: number;
  marketRatePerQtl: number;
  grossRevenue: number;
  soloTransitCost: number;
  pooledTransitCost: number;
  spoilageLoss: number;
  statutoryFees: number;
  netCashSolo: number;
  netCashPooled: number;
  isWinningSolo: boolean;
  isWinningPooled: boolean;
}

/**
 * Validates quantity and throws a descriptive error for boundary conditions.
 * Returns the quantity in quintals (kg / 100).
 */
export function validateAndConvertQuantity(quantityKg: number): number {
  if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
    throw new RangeError(
      `Invalid quantity: ${quantityKg} kg. Must be a positive finite number.`
    );
  }
  return quantityKg / 100;
}

/**
 * Calculates net returns for each mandi using the official VajraYield formula:
 *
 * Gross Revenue     = rate(₹/Qtl) × quantity(Qtl)
 * Solo Transit      = baseTransitHire + (distanceKm × 2 × FUEL_PER_KM) + tolls
 * Pooled Transit    = soloTransit / 2.8  (shared with 2 other Shirva smallholders)
 * Spoilage Loss     = grossRevenue × decayRate(%/hr) × transitHours
 * Statutory Fees    = (gross × 1%) + (₹12 × qtl) + ₹30  (APMC Cess + Hamali + Weighbridge)
 * Net Cash (Solo)   = gross - soloTransit - spoilage - statutory
 * Net Cash (Pooled) = gross - pooledTransit - spoilage - statutory
 *
 * @param cropName         Crop ID key (e.g. "tomato", "arecanut")
 * @param quantityKg       Quantity in kilograms (min 1 kg)
 * @param origin           Origin cluster name (informational)
 * @param mandis           Array of MandiInfo-like objects with rates, decayRates, baseTransitHire, tolls
 * @param isPooled         Sort results by pooled net cash if true
 * @param applyPerishability  Whether to factor in coastal humidity spoilage
 */
export function calculateNetReturns(
  cropName: string,
  quantityKg: number,
  origin: string,
  mandis: readonly MandiCalculationInput[] | MandiCalculationInput[],
  isPooled: boolean,
  applyPerishability: boolean
): MandiCalculation[] {
  const FUEL_PER_KM = 14; // ₹/km (coastal Karnataka diesel rate, round-trip factor)
  const qtl = validateAndConvertQuantity(quantityKg);

  const results: MandiCalculation[] = mandis.map((m) => {
    // Step 1: Market rate lookup — from mandi commodity map or fallback
    const commodityData = m.commodities?.[cropName];
    const rate: number = commodityData?.modalPrice ?? m.rates?.[cropName] ?? 2000;
    const gross = Math.round(rate * qtl);

    // Step 2: Transit costs
    const soloTransit = Math.round(
      (m.baseTransitHire ?? 0) +
      (m.distanceKm * 2 * FUEL_PER_KM) +
      (m.tolls ?? 0)
    );
    const pooledTransit = Math.round(soloTransit / 2.8);

    // Step 3: Coastal humidity perishability spoilage
    const transitHours = m.distanceKm / 35; // avg 35 km/hr on coastal NH-66
    const decayRate = applyPerishability
      ? (m.decayRates?.[cropName] ?? 0.02)
      : 0;
    const spoilage = Math.round(gross * decayRate * transitHours);

    // Step 4: Statutory fees = APMC Cess (1%) + Hamali (₹12/qtl) + Weighbridge (₹30)
    const statutory = Math.round(gross * 0.01 + 12 * qtl + 30);

    // Step 5: Net cash
    const netSolo = gross - soloTransit - spoilage - statutory;
    const netPooled = gross - pooledTransit - spoilage - statutory;

    return {
      id: m.id,
      name: m.name,
      distanceKm: m.distanceKm,
      marketRatePerQtl: rate,
      grossRevenue: gross,
      soloTransitCost: soloTransit,
      pooledTransitCost: pooledTransit,
      spoilageLoss: spoilage,
      statutoryFees: statutory,
      netCashSolo: netSolo,
      netCashPooled: netPooled,
      isWinningSolo: false,
      isWinningPooled: false,
    };
  });

  // Mark winners
  const maxSolo = Math.max(...results.map((r) => r.netCashSolo));
  const maxPooled = Math.max(...results.map((r) => r.netCashPooled));

  results.forEach((r) => {
    r.isWinningSolo = r.netCashSolo === maxSolo;
    r.isWinningPooled = r.netCashPooled === maxPooled;
  });

  // Sort by the active mode
  return results.sort((a, b) =>
    isPooled ? b.netCashPooled - a.netCashPooled : b.netCashSolo - a.netCashSolo
  );
}

/**
 * Convenience: compute the 500 kg Tomato reference scenario
 * (the HPL 2026 proof-of-concept scenario from Bantakal → 4 mandis).
 */
export function computeReferenceScenario(
  mandis: readonly MandiCalculationInput[] | MandiCalculationInput[]
): {
  adiUdupiNet: number;
  mangaluruNet: number;
  adiUdupiNetPooled: number;
  mangaluruNetPooled: number;
} {
  const soloResults = calculateNetReturns("tomato", 500, "Bantakal (SMVITM Hub)", mandis, false, true);
  const pooledResults = calculateNetReturns("tomato", 500, "Bantakal (SMVITM Hub)", mandis, false, true);

  const findNet = (results: MandiCalculation[], id: string, pooled: boolean) => {
    const r = results.find((x) => x.id === id);
    return r ? (pooled ? r.netCashPooled : r.netCashSolo) : 0;
  };

  return {
    adiUdupiNet: findNet(soloResults, "mandi_adi_udupi", false),
    mangaluruNet: findNet(soloResults, "mandi_mangaluru", false),
    adiUdupiNetPooled: findNet(pooledResults, "mandi_adi_udupi", true),
    mangaluruNetPooled: findNet(pooledResults, "mandi_mangaluru", true),
  };
}
