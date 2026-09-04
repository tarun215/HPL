import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Calculator, 
  Trophy, 
  Truck, 
  TrendingUp, 
  Download, 
  Share2, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Coins
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { 
  RURAL_COMMODITIES, 
  MASTER_MANDIS, 
  TRANSPORT_VEHICLES, 
  CommodityRecord, 
  MandiInfo, 
  TransportVehicle 
} from "@/data/ruralMarketData";
import { Language, translateItemName } from "@/utils/translations";
import { getMarketTranslation } from "@/utils/marketTranslations";
import { toast } from "sonner";

interface NetRevenueCalculatorProps {
  language: Language;
  initialCropId?: string;
  initialMandiId?: string;
}

export const NetRevenueCalculator = ({
  language = "en",
  initialCropId = "onion",
  initialMandiId,
}: NetRevenueCalculatorProps) => {
  const [cropId, setCropId] = useState<string>(initialCropId);
  const [quantityQtl, setQuantityQtl] = useState<number>(60);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("eicher_14ft");
  const [customFreightRate, setCustomFreightRate] = useState<number | "">("");
  const [includeShrinkage, setIncludeShrinkage] = useState<boolean>(true);

  const selectedCrop = useMemo(() => {
    return RURAL_COMMODITIES.find((c) => c.id === cropId) || RURAL_COMMODITIES[0];
  }, [cropId]);

  const selectedVehicle = useMemo(() => {
    return TRANSPORT_VEHICLES.find((v) => v.id === selectedVehicleId) || TRANSPORT_VEHICLES[3];
  }, [selectedVehicleId]);

  // Perishability factor: vegetables lose 0.6% per 50km, grains lose 0.1% per 50km
  const perishabilityPer50km = useMemo(() => {
    if (selectedCrop.category === "Vegetables") return 0.008; // 0.8% per 50km
    if (selectedCrop.category === "Spices") return 0.002;
    return 0.001; // 0.1% for grains/oilseeds
  }, [selectedCrop.category]);

  // Compute Net Economics across all mandis
  const mandiEconomics = useMemo(() => {
    const activeFreightPerKm = typeof customFreightRate === "number" && customFreightRate > 0
      ? customFreightRate
      : selectedVehicle.ratePerKm;

    return MASTER_MANDIS.map((mandi) => {
      const commodityData = mandi.commodities[cropId];
      const modalPrice = commodityData ? commodityData.modalPrice : selectedCrop.modalPrice;
      const minPrice = commodityData ? commodityData.minPrice : selectedCrop.minPrice;
      const maxPrice = commodityData ? commodityData.maxPrice : selectedCrop.maxPrice;

      // 1. Gross Revenue
      const grossRevenue = quantityQtl * modalPrice;

      // 2. Transport Freight (Round trip considered or commercial one-way loaded + deadhead factor)
      const freightCost = Math.round(selectedVehicle.baseFare + (mandi.distanceKm * activeFreightPerKm));

      // 3. APMC Cess (1.0% - 1.5%)
      const apmcCess = Math.round(grossRevenue * (mandi.apmcCessPercent / 100));

      // 4. Hamali (Labour Handling per quintal)
      const hamaliCost = quantityQtl * mandi.hamaliPerQtl;

      // 5. Weighbridge fee
      const weighbridgeCost = mandi.weighbridgeCharge;

      // 6. Transit Shrinkage / Spoilage loss
      const transitDistanceBlocks = mandi.distanceKm / 50;
      const shrinkageLossPercent = includeShrinkage ? transitDistanceBlocks * perishabilityPer50km : 0;
      const shrinkageCost = Math.round(grossRevenue * shrinkageLossPercent);

      // Total Deductions
      const totalDeductions = freightCost + apmcCess + hamaliCost + weighbridgeCost + shrinkageCost;

      // True Net In-Hand Revenue
      const netRevenue = grossRevenue - totalDeductions;
      const netPerQtl = Math.round(netRevenue / quantityQtl);
      const grossPerQtl = modalPrice;

      return {
        mandiId: mandi.id,
        mandiName: mandi.name,
        district: mandi.district,
        state: mandi.state,
        distanceKm: mandi.distanceKm,
        travelTimeHours: mandi.travelTimeHours,
        modalPrice,
        minPrice,
        maxPrice,
        grossRevenue,
        freightCost,
        apmcCess,
        hamaliCost,
        weighbridgeCost,
        shrinkageCost,
        totalDeductions,
        netRevenue,
        netPerQtl,
        grossPerQtl,
        shrinkageLossPercent: (shrinkageLossPercent * 100).toFixed(1),
      };
    }).sort((a, b) => b.netRevenue - a.netRevenue);
  }, [cropId, quantityQtl, selectedVehicle, customFreightRate, includeShrinkage, perishabilityPer50km, selectedCrop]);

  const optimalMandi = mandiEconomics[0];
  const nearestMandi = [...mandiEconomics].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  const extraGainVsNearest = optimalMandi ? optimalMandi.netRevenue - nearestMandi.netRevenue : 0;

  // Chart Data preparation
  const chartData = mandiEconomics.slice(0, 5).map((m) => ({
    name: m.mandiName.split(" ")[0],
    "Gross Revenue": m.grossRevenue,
    "Transport & Fees": m.totalDeductions,
    "Net Cash In-Hand": m.netRevenue,
  }));

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Mandi Name",
      "District",
      "Distance (km)",
      "Modal Rate (₹/Qtl)",
      "Gross Revenue (₹)",
      "Transport Freight (₹)",
      "APMC Cess (₹)",
      "Hamali (₹)",
      "Weighbridge (₹)",
      "Shrinkage Loss (₹)",
      "Total Deductions (₹)",
      "True Net Revenue (₹)",
      "Net Rate (₹/Qtl)"
    ];

    const rows = mandiEconomics.map((m) => [
      `"${m.mandiName}"`,
      `"${m.district}"`,
      m.distanceKm,
      m.modalPrice,
      m.grossRevenue,
      m.freightCost,
      m.apmcCess,
      m.hamaliCost,
      m.weighbridgeCost,
      m.shrinkageCost,
      m.totalDeductions,
      m.netRevenue,
      m.netPerQtl
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KrishiRate_Profit_Analysis_${selectedCrop.name}_${quantityQtl}Qtl.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Mandi Net Revenue Report downloaded as CSV!");
  };

  // WhatsApp Share Text
  const handleShareWhatsApp = () => {
    const cropName = translateItemName(selectedCrop.name, language, "commodity");
    const text = `🌾 *Krishi Rate - Net Mandi Revenue Analysis*\n` +
      `📦 *Crop:* ${cropName} | *Quantity:* ${quantityQtl} Quintals\n` +
      `🏆 *Best Mandi:* ${optimalMandi.mandiName}\n` +
      `💰 *True In-Hand Net Cash:* ₹${optimalMandi.netRevenue.toLocaleString('en-IN')} (₹${optimalMandi.netPerQtl}/Qtl)\n` +
      `🚚 *Transport & Fees:* -₹${optimalMandi.totalDeductions.toLocaleString('en-IN')}\n` +
      (extraGainVsNearest > 0 ? `✨ *Extra Profit vs Nearest Mandi:* +₹${extraGainVsNearest.toLocaleString('en-IN')}\n` : '') +
      `Generated on Krishi Rates Rural Market Intelligence Platform.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(getMarketTranslation("whatsappSharedMsg", language));
    }

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-background to-amber-500/10 dark:from-emerald-950/30">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-600 text-white text-xs">
                  <Calculator className="w-3 h-3 mr-1" /> PS 02 Net Revenue Engine
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  Transparent In-Hand Cash Audit
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                💰 {getMarketTranslation("calcTitle", language)}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {getMarketTranslation("calcSubtitle", language)}
              </CardDescription>
            </div>

            {/* Quick Export CTAs */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs border-emerald-300 hover:bg-emerald-50 text-emerald-800 dark:hover:bg-emerald-950"
              >
                <Download className="w-3.5 h-3.5" />
                {getMarketTranslation("exportPdf", language)}
              </Button>
              <Button
                size="sm"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                {getMarketTranslation("shareWhatsapp", language)}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Input Configuration & Winner Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Panel (5 Cols) */}
        <Card className="lg:col-span-5 border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              Harvest & Transport Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* 1. Crop Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                {getMarketTranslation("selectCrop", language)}
              </Label>
              <Select value={cropId} onValueChange={setCropId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose commodity" />
                </SelectTrigger>
                <SelectContent>
                  {RURAL_COMMODITIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {translateItemName(c.name, language, "commodity")} (Base: ₹{c.modalPrice}/Qtl)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Harvest Quantity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {getMarketTranslation("harvestQuantity", language)}
                </Label>
                <span className="text-xs text-muted-foreground font-medium">
                  {quantityQtl} Quintals ({(quantityQtl / 10).toFixed(1)} Tonnes)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={quantityQtl}
                  onChange={(e) => setQuantityQtl(Math.max(1, Number(e.target.value) || 1))}
                  className="w-28 font-bold text-center"
                />
                <div className="flex items-center gap-1.5 flex-1">
                  {[20, 50, 100, 200].map((quickVal) => (
                    <Button
                      key={quickVal}
                      type="button"
                      variant={quantityQtl === quickVal ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuantityQtl(quickVal)}
                      className={`h-8 text-xs flex-1 px-1 ${
                        quantityQtl === quickVal ? "bg-emerald-700 text-white" : ""
                      }`}
                    >
                      {quickVal} Q
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Transport Vehicle Selection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {getMarketTranslation("selectVehicle", language)}
                </Label>
                <Badge variant="outline" className="text-[10px]">
                  Cap: {selectedVehicle.capacityQuintals} Qtl
                </Badge>
              </div>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSPORT_VEHICLES.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} (₹{v.ratePerKm}/km)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                💡 {selectedVehicle.recommendedFor}
              </p>
            </div>

            {/* 4. Custom Freight Rate Override */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                {getMarketTranslation("customFreightRate", language)} (Optional Override)
              </Label>
              <Input
                type="number"
                placeholder={`Standard: ₹${selectedVehicle.ratePerKm}/km`}
                value={customFreightRate}
                onChange={(e) => setCustomFreightRate(e.target.value ? Number(e.target.value) : "")}
              />
            </div>

            {/* 5. Transit Shrinkage Toggle */}
            <div className="pt-2 border-t flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <Label className="text-xs font-medium text-foreground cursor-pointer">
                  {getMarketTranslation("shrinkageRisk", language)}
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  {getMarketTranslation("shrinkageRiskDesc", language)}
                </p>
              </div>
              <Switch checked={includeShrinkage} onCheckedChange={setIncludeShrinkage} />
            </div>
          </CardContent>
        </Card>

        {/* Right: Optimal Mandi Crown & Profit Spotlight (7 Cols) */}
        {optimalMandi && (
          <Card className="lg:col-span-7 border-emerald-500 shadow-md bg-gradient-to-br from-emerald-500/10 via-background to-emerald-50/50 dark:from-emerald-950/40">
            <CardHeader className="pb-3 border-b bg-emerald-600/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    🏆
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                      {getMarketTranslation("optimalMandiBadge", language)}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Yields the highest net cash in hand for your {quantityQtl} Quintals
                    </p>
                  </div>
                </div>

                {extraGainVsNearest > 0 && (
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1">
                    +₹{extraGainVsNearest.toLocaleString("en-IN")} Extra Cash
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Winner Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-foreground">
                    {optimalMandi.mandiName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {optimalMandi.district}, {optimalMandi.state} • {optimalMandi.distanceKm} km away (~{optimalMandi.travelTimeHours} hrs transit)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-muted-foreground">Gross Modal Rate</div>
                  <div className="text-lg font-bold text-foreground">₹{optimalMandi.modalPrice}/Qtl</div>
                </div>
              </div>

              {/* Big Net Cash Box */}
              <div className="bg-emerald-600 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-emerald-100">
                    {getMarketTranslation("netCashInHand", language)}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">
                    ₹{optimalMandi.netRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-emerald-100 mt-1">
                    Net Realization: <strong>₹{optimalMandi.netPerQtl}/Qtl</strong> (after all costs)
                  </div>
                </div>

                <div className="bg-emerald-700/60 rounded-lg p-3 text-xs space-y-1 sm:text-right border border-emerald-500/40">
                  <div className="text-emerald-100 font-medium">Breakdown Summary</div>
                  <div>Gross Value: ₹{optimalMandi.grossRevenue.toLocaleString("en-IN")}</div>
                  <div className="text-amber-200">
                    Total Deductions: -₹{optimalMandi.totalDeductions.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Transparent Cost Deductions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded bg-muted/50 border">
                  <span className="text-muted-foreground block text-[11px]">
                    {getMarketTranslation("freightCost", language)}
                  </span>
                  <span className="font-bold text-foreground">
                    -₹{optimalMandi.freightCost.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    ({optimalMandi.distanceKm} km transit)
                  </span>
                </div>

                <div className="p-2.5 rounded bg-muted/50 border">
                  <span className="text-muted-foreground block text-[11px]">
                    {getMarketTranslation("apmcCess", language)}
                  </span>
                  <span className="font-bold text-foreground">
                    -₹{optimalMandi.apmcCess.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    (Statutory Cess)
                  </span>
                </div>

                <div className="p-2.5 rounded bg-muted/50 border">
                  <span className="text-muted-foreground block text-[11px]">
                    {getMarketTranslation("handlingHamali", language)}
                  </span>
                  <span className="font-bold text-foreground">
                    -₹{optimalMandi.hamaliCost.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    (Loading & Weighing)
                  </span>
                </div>

                <div className="p-2.5 rounded bg-muted/50 border">
                  <span className="text-muted-foreground block text-[11px]">
                    {getMarketTranslation("shrinkageLoss", language)}
                  </span>
                  <span className="font-bold text-foreground">
                    -₹{optimalMandi.shrinkageCost.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    ({optimalMandi.shrinkageLossPercent}% transit risk)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comparison Table Across All Mandis */}
      <Card className="border">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <span>Detailed Mandi Net Profit Ranking Matrix</span>
            <Badge variant="outline" className="text-xs font-normal">
              Sorted by Highest In-Hand Cash
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted text-muted-foreground font-semibold border-b">
              <tr>
                <th className="p-3">Rank & Mandi</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Gross Rate</th>
                <th className="p-3">Gross Value</th>
                <th className="p-3">Transport Freight</th>
                <th className="p-3">Mandi Cess + Hamali</th>
                <th className="p-3">Shrinkage Loss</th>
                <th className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-bold">
                  True Net In-Hand (₹)
                </th>
                <th className="p-3 text-right">Net ₹/Qtl</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mandiEconomics.map((m, rank) => {
                const isWinner = rank === 0;
                return (
                  <tr
                    key={m.mandiId}
                    className={`hover:bg-muted/50 transition-colors ${
                      isWinner ? "bg-emerald-50/30 dark:bg-emerald-950/20 font-medium" : ""
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isWinner
                              ? "bg-emerald-600 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {rank + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-foreground">{m.mandiName}</span>
                          <span className="text-[10px] text-muted-foreground block">{m.district}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {m.distanceKm} km ({m.travelTimeHours}h)
                    </td>
                    <td className="p-3 font-semibold text-foreground">₹{m.modalPrice}</td>
                    <td className="p-3">₹{m.grossRevenue.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-rose-600 font-medium">-₹{m.freightCost.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-muted-foreground">-₹{(m.apmcCess + m.hamaliCost + m.weighbridgeCost).toLocaleString("en-IN")}</td>
                    <td className="p-3 text-muted-foreground">-₹{m.shrinkageCost.toLocaleString("en-IN")}</td>
                    <td className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                      ₹{m.netRevenue.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-right font-bold text-foreground">
                      ₹{m.netPerQtl}/Qtl
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recharts Bar Chart: Gross vs Net vs Fees */}
      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            📊 Visual Comparison: Gross Revenue vs In-Hand Net Cash
          </CardTitle>
          <CardDescription className="text-xs">
            Notice how higher freight for distant mandis can still yield significantly higher net cash due to favorable wholesale price spreads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, ""]}
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="Gross Revenue" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Transport & Fees" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Net Cash In-Hand" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
