// VajraYield — Rural Market Intelligence Platform
// HPL 2026 | PS 02 | Build For Udupi! (SMVITM Bantakal)
// Data: Verified Coastal Karnataka Datasets

export interface CommodityRecord {
  id: string;
  name: string;
  category: "Cereals" | "Pulses" | "Oilseeds" | "Cash Crops" | "Vegetables" | "Spices";
  variety: string;
  grade: "FAQ (Fair Average Quality)" | "Grade A" | "Super" | "Medium";
  unit: string;
  msp: number; // Minimum Support Price per quintal (₹)
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  dailyChange: number; // percentage
  dailyChangeAmount: number; // in ₹
  trend: "up" | "down" | "stable";
  arrivalVolume: number; // in Tonnes
  historical7Days: { date: string; price: number; arrivals: number }[];
  forecast14Days: { day: string; predictedPrice: number; lowerBound: number; upperBound: number }[];
  demandIndex: "High" | "Moderate" | "Low";
  supplyStatus: "Deficit" | "Balanced" | "Surplus";
  recommendation: {
    action: "HOLD" | "SELL NOW" | "DIVERT";
    confidence: number;
    reasoningEn: string;
    reasoningHi: string;
    reasoningMr: string;
    optimalWindowDays: number;
  };
}

export interface MandiInfo {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number;
  travelTimeHours: number;
  apmcCessPercent: number;
  hamaliPerQtl: number;
  weighbridgeCharge: number;
  dailyArrivalsTotalTonnes: number;
  congestionStatus: "Smooth" | "Moderate" | "Heavy Queue";
  phone: string;
  timing: string;
  commodities: Record<string, { modalPrice: number; minPrice: number; maxPrice: number; arrivalsTonnes: number }>;
  decayRates?: Record<string, number>; // %/hr perishability per crop
  baseTransitHire?: number; // ₹ fixed vehicle hire from Bantakal
  tolls?: number; // ₹ toll charges
}

export interface TransportVehicle {
  id: string;
  name: string;
  capacityTonnes: number;
  capacityQuintals: number;
  baseFare: number;
  ratePerKm: number;
  perTonneKmRate: number;
  recommendedFor: string;
  icon: string;
}

export interface WarehouseFacility {
  id: string;
  name: string;
  type: "Cold Storage" | "Dry Warehouse" | "Silo";
  location: string;
  district: string;
  state: string;
  distanceKm: number;
  capacityTonnes: number;
  availableCapacityTonnes: number;
  monthlyRentPerQtl: number;
  tempRange: string;
  wdraAccredited: boolean;
  eNwrLoanEligible: boolean;
  contactNumber: string;
  rating: number;
}

export interface BuyerRequisition {
  id: string;
  buyerName: string;
  buyerType: "FPO" | "Corporate Buyer" | "Food Processor" | "Exporter" | "Government / NAFED";
  commodity: string;
  requiredQuintals: number;
  offeredPricePerQtl: number;
  deliveryMandi: string;
  paymentTerms: "Instant Bank Transfer" | "24 Hours T+1" | "Letter of Credit";
  qualitySpec: string;
  expiryDate: string;
  verified: boolean;
}

// ============================================================
// VajraYield: Origin Clusters (Farmer Locations)
// ============================================================
export const ORIGIN_CLUSTERS = [
  { id: "bantakal",   name: "Bantakal (SMVITM Hub)",  distanceFromHubKm: 0 },
  { id: "shirva",     name: "Shirva Cluster",          distanceFromHubKm: 5 },
  { id: "brahmavara", name: "Brahmavara Agro Belt",    distanceFromHubKm: 12 },
  { id: "karkala",    name: "Karkala Foothills",       distanceFromHubKm: 21 },
  { id: "kaup",       name: "Kaup Coastal Pocket",     distanceFromHubKm: 18 },
];

// ============================================================
// VajraYield: Coastal Karnataka Crop Catalogue
// ============================================================
export const RURAL_COMMODITIES: CommodityRecord[] = [
  {
    id: "tomato",
    name: "Tomato (Hybrid Local)",
    category: "Vegetables",
    variety: "Local Hybrid / Deshi",
    grade: "Grade A",
    unit: "₹/Quintal",
    msp: 0,
    modalPrice: 2200,
    minPrice: 1800,
    maxPrice: 2700,
    dailyChange: 2.3,
    dailyChangeAmount: 50,
    trend: "up",
    arrivalVolume: 320,
    historical7Days: [
      { date: "Day -6", price: 2050, arrivals: 280 },
      { date: "Day -5", price: 2080, arrivals: 295 },
      { date: "Day -4", price: 2110, arrivals: 300 },
      { date: "Day -3", price: 2130, arrivals: 310 },
      { date: "Day -2", price: 2160, arrivals: 315 },
      { date: "Yesterday", price: 2180, arrivals: 318 },
      { date: "Today", price: 2200, arrivals: 320 },
    ],
    forecast14Days: [
      { day: "+1d", predictedPrice: 2240, lowerBound: 2180, upperBound: 2300 },
      { day: "+3d", predictedPrice: 2290, lowerBound: 2220, upperBound: 2360 },
      { day: "+5d", predictedPrice: 2340, lowerBound: 2260, upperBound: 2420 },
      { day: "+7d", predictedPrice: 2400, lowerBound: 2310, upperBound: 2490 },
      { day: "+10d", predictedPrice: 2460, lowerBound: 2360, upperBound: 2560 },
      { day: "+14d", predictedPrice: 2520, lowerBound: 2400, upperBound: 2640 },
    ],
    demandIndex: "High",
    supplyStatus: "Balanced",
    recommendation: {
      action: "SELL NOW",
      confidence: 82,
      reasoningEn: "Coastal humidity accelerates spoilage 2.5%/hr in transit. Adi Udupi APMC is the net-optimal destination.",
      reasoningHi: "तटीय आर्द्रता के कारण पारगमन में 2.5%/घंटा नुकसान। अभी बेचना सबसे लाभदायक है।",
      reasoningMr: "किनारपट्टीच्या आर्द्रतेमुळे वाहतुकीत 2.5%/तास नुकसान. आताच विक्री फायदेशीर.",
      optimalWindowDays: 1,
    },
  },
  {
    id: "mattu_gulla",
    name: "Mattu Gulla (GI Brinjal)",
    category: "Vegetables",
    variety: "GI-Tagged Mattu Gulla",
    grade: "Super",
    unit: "₹/Quintal",
    msp: 0,
    modalPrice: 4800,
    minPrice: 4300,
    maxPrice: 5800,
    dailyChange: 1.8,
    dailyChangeAmount: 85,
    trend: "up",
    arrivalVolume: 85,
    historical7Days: [
      { date: "Day -6", price: 4500, arrivals: 78 },
      { date: "Day -5", price: 4580, arrivals: 80 },
      { date: "Day -4", price: 4630, arrivals: 82 },
      { date: "Day -3", price: 4680, arrivals: 83 },
      { date: "Day -2", price: 4720, arrivals: 84 },
      { date: "Yesterday", price: 4770, arrivals: 85 },
      { date: "Today", price: 4800, arrivals: 85 },
    ],
    forecast14Days: [
      { day: "+1d", predictedPrice: 4870, lowerBound: 4750, upperBound: 4990 },
      { day: "+3d", predictedPrice: 4980, lowerBound: 4830, upperBound: 5130 },
      { day: "+5d", predictedPrice: 5100, lowerBound: 4940, upperBound: 5260 },
      { day: "+7d", predictedPrice: 5250, lowerBound: 5070, upperBound: 5430 },
      { day: "+10d", predictedPrice: 5420, lowerBound: 5210, upperBound: 5630 },
      { day: "+14d", predictedPrice: 5600, lowerBound: 5370, upperBound: 5830 },
    ],
    demandIndex: "High",
    supplyStatus: "Deficit",
    recommendation: {
      action: "HOLD",
      confidence: 88,
      reasoningEn: "GI-tagged product commands premium. Mangaluru buyers actively seeking. 1.8%/hr perishability manageable for short haul.",
      reasoningHi: "GI टैग वाला उत्पाद प्रीमियम मूल्य पर बिकता है। मंगलुरु खरीदार सक्रिय हैं।",
      reasoningMr: "GI टॅग असलेला माल प्रीमियमला विकतो. मंगळुरू खरेदीदार सक्रिय आहेत.",
      optimalWindowDays: 3,
    },
  },
  {
    id: "jasmine",
    name: "Shankarapura Jasmine",
    category: "Cash Crops",
    variety: "Shankarapura GI Jasmine",
    grade: "Super",
    unit: "₹/Quintal",
    msp: 0,
    modalPrice: 85000,
    minPrice: 75000,
    maxPrice: 95000,
    dailyChange: 3.2,
    dailyChangeAmount: 2600,
    trend: "up",
    arrivalVolume: 12,
    historical7Days: [
      { date: "Day -6", price: 79000, arrivals: 10 },
      { date: "Day -5", price: 80500, arrivals: 11 },
      { date: "Day -4", price: 81500, arrivals: 11 },
      { date: "Day -3", price: 82500, arrivals: 12 },
      { date: "Day -2", price: 83500, arrivals: 12 },
      { date: "Yesterday", price: 84200, arrivals: 12 },
      { date: "Today", price: 85000, arrivals: 12 },
    ],
    forecast14Days: [
      { day: "+1d", predictedPrice: 86500, lowerBound: 83000, upperBound: 90000 },
      { day: "+3d", predictedPrice: 88000, lowerBound: 84000, upperBound: 92000 },
      { day: "+5d", predictedPrice: 90000, lowerBound: 85500, upperBound: 94500 },
      { day: "+7d", predictedPrice: 92000, lowerBound: 87000, upperBound: 97000 },
      { day: "+10d", predictedPrice: 94000, lowerBound: 88500, upperBound: 99500 },
      { day: "+14d", predictedPrice: 96500, lowerBound: 90000, upperBound: 103000 },
    ],
    demandIndex: "High",
    supplyStatus: "Deficit",
    recommendation: {
      action: "SELL NOW",
      confidence: 95,
      reasoningEn: "CRITICAL: 5%/hr perishability. Jasmine must reach mandi within 4 hours of harvest. Adi Udupi APMC is the only viable option.",
      reasoningHi: "महत्वपूर्ण: 5%/घंटा नाशवान। तुड़ाई के 4 घंटे के भीतर मंडी पहुंचना अनिवार्य।",
      reasoningMr: "महत्त्वाचे: 5%/तास नाशवंत. कापणीच्या 4 तासात मंडीत पोहोचणे अनिवार्य.",
      optimalWindowDays: 0,
    },
  },
  {
    id: "arecanut",
    name: "Arecanut (Chali Supari)",
    category: "Cash Crops",
    variety: "Chali / Rashi (Processed)",
    grade: "Grade A",
    unit: "₹/Quintal",
    msp: 0,
    modalPrice: 46500,
    minPrice: 44000,
    maxPrice: 48500,
    dailyChange: 0.5,
    dailyChangeAmount: 230,
    trend: "stable",
    arrivalVolume: 210,
    historical7Days: [
      { date: "Day -6", price: 46000, arrivals: 200 },
      { date: "Day -5", price: 46100, arrivals: 202 },
      { date: "Day -4", price: 46200, arrivals: 205 },
      { date: "Day -3", price: 46300, arrivals: 207 },
      { date: "Day -2", price: 46350, arrivals: 208 },
      { date: "Yesterday", price: 46400, arrivals: 210 },
      { date: "Today", price: 46500, arrivals: 210 },
    ],
    forecast14Days: [
      { day: "+1d", predictedPrice: 46700, lowerBound: 45900, upperBound: 47500 },
      { day: "+3d", predictedPrice: 47000, lowerBound: 46100, upperBound: 47900 },
      { day: "+5d", predictedPrice: 47200, lowerBound: 46300, upperBound: 48100 },
      { day: "+7d", predictedPrice: 47500, lowerBound: 46500, upperBound: 48500 },
      { day: "+10d", predictedPrice: 47800, lowerBound: 46800, upperBound: 48800 },
      { day: "+14d", predictedPrice: 48200, lowerBound: 47100, upperBound: 49300 },
    ],
    demandIndex: "Moderate",
    supplyStatus: "Balanced",
    recommendation: {
      action: "HOLD",
      confidence: 79,
      reasoningEn: "Non-perishable. Zero spoilage risk. Mangaluru Bunder offers ₹2000/Qtl premium over Adi Udupi. Hold for pooling window.",
      reasoningHi: "गैर-नाशवान। शून्य खराबी जोखिम। मंगलुरू बंदर ₹2000/क्विंटल अधिक देता है। पूलिंग का इंतजार करें।",
      reasoningMr: "नाशवंत नाही. खराबीचा धोका नाही. मंगळुरू बंदर ₹2000/क्विंटल जास्त देतो. पूलिंगची वाट पाहा.",
      optimalWindowDays: 7,
    },
  },
];

// ============================================================
// VajraYield: Udupi-Belt Regional Mandis (4 Markets)
// All distances measured from Bantakal (SMVITM Hub) origin
// ============================================================
export const MASTER_MANDIS: MandiInfo[] = [
  {
    id: "mandi_adi_udupi",
    name: "Adi Udupi APMC",
    district: "Udupi",
    state: "Karnataka",
    distanceKm: 14.5,
    travelTimeHours: 0.42,
    apmcCessPercent: 1.0,
    hamaliPerQtl: 12,
    weighbridgeCharge: 30,
    dailyArrivalsTotalTonnes: 480,
    congestionStatus: "Smooth",
    phone: "+91 820 2520456",
    timing: "07:00 AM - 05:00 PM",
    commodities: {
      tomato:     { modalPrice: 2200, minPrice: 1900, maxPrice: 2600, arrivalsTonnes: 120 },
      mattu_gulla:{ modalPrice: 4800, minPrice: 4300, maxPrice: 5400, arrivalsTonnes: 40 },
      jasmine:    { modalPrice: 85000, minPrice: 78000, maxPrice: 92000, arrivalsTonnes: 4 },
      arecanut:   { modalPrice: 46500, minPrice: 44500, maxPrice: 48000, arrivalsTonnes: 200 },
    },
    decayRates: { tomato: 0.025, mattu_gulla: 0.018, jasmine: 0.05, arecanut: 0.0 },
    baseTransitHire: 600,
    tolls: 0,
  },
  {
    id: "mandi_mangaluru",
    name: "Mangaluru Central Bunder Wholesale",
    district: "Dakshina Kannada",
    state: "Karnataka",
    distanceKm: 54.0,
    travelTimeHours: 1.42,
    apmcCessPercent: 1.0,
    hamaliPerQtl: 12,
    weighbridgeCharge: 30,
    dailyArrivalsTotalTonnes: 1800,
    congestionStatus: "Moderate",
    phone: "+91 824 2440922",
    timing: "05:00 AM - 03:00 PM",
    commodities: {
      tomato:     { modalPrice: 2700, minPrice: 2300, maxPrice: 3100, arrivalsTonnes: 380 },
      mattu_gulla:{ modalPrice: 5800, minPrice: 5200, maxPrice: 6400, arrivalsTonnes: 90 },
      jasmine:    { modalPrice: 95000, minPrice: 87000, maxPrice: 103000, arrivalsTonnes: 8 },
      arecanut:   { modalPrice: 48500, minPrice: 46500, maxPrice: 50000, arrivalsTonnes: 520 },
    },
    decayRates: { tomato: 0.025, mattu_gulla: 0.018, jasmine: 0.05, arecanut: 0.0 },
    baseTransitHire: 2200,
    tolls: 120,
  },
  {
    id: "mandi_kundapura",
    name: "Kundapura APMC Market",
    district: "Udupi",
    state: "Karnataka",
    distanceKm: 48.0,
    travelTimeHours: 1.17,
    apmcCessPercent: 1.0,
    hamaliPerQtl: 12,
    weighbridgeCharge: 30,
    dailyArrivalsTotalTonnes: 620,
    congestionStatus: "Smooth",
    phone: "+91 820 2522710",
    timing: "07:30 AM - 05:30 PM",
    commodities: {
      tomato:     { modalPrice: 2400, minPrice: 2100, maxPrice: 2800, arrivalsTonnes: 160 },
      mattu_gulla:{ modalPrice: 4500, minPrice: 4100, maxPrice: 5100, arrivalsTonnes: 55 },
      jasmine:    { modalPrice: 86000, minPrice: 79000, maxPrice: 93000, arrivalsTonnes: 3 },
      arecanut:   { modalPrice: 47000, minPrice: 45000, maxPrice: 48800, arrivalsTonnes: 260 },
    },
    decayRates: { tomato: 0.025, mattu_gulla: 0.018, jasmine: 0.05, arecanut: 0.0 },
    baseTransitHire: 1800,
    tolls: 60,
  },
  {
    id: "mandi_karkala",
    name: "Karkala Santhe Market",
    district: "Udupi",
    state: "Karnataka",
    distanceKm: 21.0,
    travelTimeHours: 0.58,
    apmcCessPercent: 1.0,
    hamaliPerQtl: 12,
    weighbridgeCharge: 30,
    dailyArrivalsTotalTonnes: 290,
    congestionStatus: "Smooth",
    phone: "+91 820 2242080",
    timing: "07:00 AM - 04:00 PM",
    commodities: {
      tomato:     { modalPrice: 2100, minPrice: 1850, maxPrice: 2450, arrivalsTonnes: 80 },
      mattu_gulla:{ modalPrice: 5000, minPrice: 4500, maxPrice: 5500, arrivalsTonnes: 35 },
      jasmine:    { modalPrice: 84000, minPrice: 77000, maxPrice: 91000, arrivalsTonnes: 2 },
      arecanut:   { modalPrice: 46500, minPrice: 44500, maxPrice: 48000, arrivalsTonnes: 140 },
    },
    decayRates: { tomato: 0.025, mattu_gulla: 0.018, jasmine: 0.05, arecanut: 0.0 },
    baseTransitHire: 850,
    tolls: 0,
  },
];

// Transport Vehicles for Logistics Optimization
export const TRANSPORT_VEHICLES: TransportVehicle[] = [
  {
    id: "tata_ace",
    name: "Tata Ace / Chhota Hathi (1 Tonne)",
    capacityTonnes: 1.0,
    capacityQuintals: 10,
    baseFare: 450,
    ratePerKm: 16,
    perTonneKmRate: 16,
    recommendedFor: "Small harvest (up to 10 Quintals), Vegetables & Local Mandis (<40 km)",
    icon: "Truck",
  },
  {
    id: "bolero_pickup",
    name: "Bolero Maxi Truck / Pickup (1.7 Tonne)",
    capacityTonnes: 1.7,
    capacityQuintals: 17,
    baseFare: 650,
    ratePerKm: 22,
    perTonneKmRate: 12.9,
    recommendedFor: "Medium lots (10 - 17 Quintals), Fast transit for Tomato/Jasmine",
    icon: "Truck",
  },
  {
    id: "tractor_trolley",
    name: "Tractor Trolley (4 Tonne)",
    capacityTonnes: 4.0,
    capacityQuintals: 40,
    baseFare: 800,
    ratePerKm: 28,
    perTonneKmRate: 7.0,
    recommendedFor: "Heavy bulk Arecanut transport within 30-50 km radius",
    icon: "Tractor",
  },
  {
    id: "eicher_14ft",
    name: "Eicher 14ft Light Truck (6 Tonne)",
    capacityTonnes: 6.0,
    capacityQuintals: 60,
    baseFare: 1400,
    ratePerKm: 38,
    perTonneKmRate: 6.3,
    recommendedFor: "Commercial lots (30 - 60 Qtl) to Mangaluru / Kundapura APMC",
    icon: "Truck",
  },
  {
    id: "truck_10t",
    name: "10-Tonner 6-Wheeler Heavy Truck (10 Tonne)",
    capacityTonnes: 10.0,
    capacityQuintals: 100,
    baseFare: 2200,
    ratePerKm: 52,
    perTonneKmRate: 5.2,
    recommendedFor: "Large FPO pooled shipments (80-100 Qtl) for maximum per-quintal freight savings",
    icon: "Truck",
  },
];

// Verified Cold Storages & Warehousing Infrastructure (Coastal Karnataka)
export const WAREHOUSE_FACILITIES: WarehouseFacility[] = [
  {
    id: "wh_udupi_apmc_cold",
    name: "Udupi APMC Cold Storage Complex",
    type: "Cold Storage",
    location: "Near Adi Udupi APMC, Udupi",
    district: "Udupi",
    state: "Karnataka",
    distanceKm: 15,
    capacityTonnes: 4200,
    availableCapacityTonnes: 1800,
    monthlyRentPerQtl: 38,
    tempRange: "2°C to 8°C / 85% RH (Jasmine/Vegetable Suitable)",
    wdraAccredited: true,
    eNwrLoanEligible: true,
    contactNumber: "+91 820 2520456",
    rating: 4.5,
  },
  {
    id: "wh_mangaluru_bunder",
    name: "Mangaluru Port Trust Agri Cold Hub",
    type: "Cold Storage",
    location: "Bunder, Mangaluru",
    district: "Dakshina Kannada",
    state: "Karnataka",
    distanceKm: 54,
    capacityTonnes: 18000,
    availableCapacityTonnes: 6200,
    monthlyRentPerQtl: 62,
    tempRange: "-2°C to 10°C (Multi-chamber, Export Grade)",
    wdraAccredited: true,
    eNwrLoanEligible: true,
    contactNumber: "+91 824 2440922",
    rating: 4.8,
  },
  {
    id: "wh_kundapura_dry",
    name: "Kundapura Arecanut Dry Warehouse (CWC)",
    type: "Dry Warehouse",
    location: "APMC Yard, Kundapura",
    district: "Udupi",
    state: "Karnataka",
    distanceKm: 48,
    capacityTonnes: 8500,
    availableCapacityTonnes: 3400,
    monthlyRentPerQtl: 15,
    tempRange: "Ambient (Ventilated, Arecanut-grade)",
    wdraAccredited: true,
    eNwrLoanEligible: true,
    contactNumber: "+91 820 2522710",
    rating: 4.4,
  },
  {
    id: "wh_karkala_silo",
    name: "Karkala Agricultural Silo & Storage",
    type: "Silo",
    location: "Near Karkala Santhe, Udupi Dist.",
    district: "Udupi",
    state: "Karnataka",
    distanceKm: 21,
    capacityTonnes: 3000,
    availableCapacityTonnes: 1100,
    monthlyRentPerQtl: 12,
    tempRange: "Ambient (Aerated Silo)",
    wdraAccredited: false,
    eNwrLoanEligible: false,
    contactNumber: "+91 820 2242080",
    rating: 4.1,
  },
];

// Verified Buyer Requisitions (Direct Procurement — Coastal Karnataka)
export const BUYER_REQUISITIONS: BuyerRequisition[] = [
  {
    id: "req_udupi_tomato_fpo",
    buyerName: "Udupi District FPO Collective",
    buyerType: "FPO",
    commodity: "Tomato (Hybrid Local)",
    requiredQuintals: 200,
    offeredPricePerQtl: 2350,
    deliveryMandi: "Adi Udupi APMC / Farm Gate",
    paymentTerms: "Instant Bank Transfer",
    qualitySpec: "Size 45mm+, No cracks, Moisture <90%",
    expiryDate: "Valid for 2 days",
    verified: true,
  },
  {
    id: "req_mangaluru_arecanut",
    buyerName: "Mangaluru Spice & Arecanut Exporters Guild",
    buyerType: "Exporter",
    commodity: "Arecanut (Chali Supari)",
    requiredQuintals: 500,
    offeredPricePerQtl: 48000,
    deliveryMandi: "Mangaluru Bunder Wholesale",
    paymentTerms: "24 Hours T+1",
    qualitySpec: "Chali grade, Moisture <12%, No black spots",
    expiryDate: "Valid for 7 days",
    verified: true,
  },
  {
    id: "req_bangalore_mattu_gulla",
    buyerName: "Namma Bengaluru Premium Vegetables",
    buyerType: "Corporate Buyer",
    commodity: "Mattu Gulla (GI Brinjal)",
    requiredQuintals: 80,
    offeredPricePerQtl: 5600,
    deliveryMandi: "Direct Farm / Adi Udupi APMC",
    paymentTerms: "Instant Bank Transfer",
    qualitySpec: "GI-certified origin, Size 8-12cm, No pest marks",
    expiryDate: "Valid for 3 days",
    verified: true,
  },
  {
    id: "req_jasmine_perfume",
    buyerName: "Kama Ayurveda & Karnataka Floriculture Board",
    buyerType: "Food Processor",
    commodity: "Shankarapura Jasmine",
    requiredQuintals: 15,
    offeredPricePerQtl: 92000,
    deliveryMandi: "Adi Udupi APMC (Same-day harvest only)",
    paymentTerms: "Instant Bank Transfer",
    qualitySpec: "Harvested before 6 AM, No wilting, GI origin certified",
    expiryDate: "Valid today only",
    verified: true,
  },
];
