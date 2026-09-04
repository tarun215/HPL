import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  TrendingUp, 
  Phone, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap
} from "lucide-react";
import { MASTER_MANDIS, RURAL_COMMODITIES, MandiInfo } from "@/data/ruralMarketData";
import { Language, translateItemName } from "@/utils/translations";
import { getMarketTranslation } from "@/utils/marketTranslations";

interface MandiComparisonProps {
  language: Language;
  onNavigateToCalculator?: (cropId: string, mandiId: string) => void;
}

export const MandiComparison = ({ language = "en", onNavigateToCalculator }: MandiComparisonProps) => {
  const [selectedCropId, setSelectedCropId] = useState<string>("onion");
  const [baseMandiId, setBaseMandiId] = useState<string>("mandi_nashik_central");
  const [radiusKm, setRadiusKm] = useState<number>(100);

  const selectedCrop = useMemo(() => {
    return RURAL_COMMODITIES.find((c) => c.id === selectedCropId) || RURAL_COMMODITIES[0];
  }, [selectedCropId]);

  const baseMandi = useMemo(() => {
    return MASTER_MANDIS.find((m) => m.id === baseMandiId) || MASTER_MANDIS[0];
  }, [baseMandiId]);

  const basePrice = baseMandi.commodities[selectedCropId]?.modalPrice || selectedCrop.modalPrice;

  // Filter mandis by radius and calculate spatial spread
  const comparedMandis = useMemo(() => {
    return MASTER_MANDIS.filter((mandi) => {
      // Include all mandis within selected radius or the base mandi itself
      return mandi.distanceKm <= radiusKm || mandi.id === baseMandiId;
    }).map((mandi) => {
      const commodityInfo = mandi.commodities[selectedCropId];
      const modalPrice = commodityInfo ? commodityInfo.modalPrice : basePrice;
      const minPrice = commodityInfo ? commodityInfo.minPrice : selectedCrop.minPrice;
      const maxPrice = commodityInfo ? commodityInfo.maxPrice : selectedCrop.maxPrice;
      const arrivals = commodityInfo ? commodityInfo.arrivalsTonnes : 0;
      const spreadVsBase = modalPrice - basePrice;
      const isBase = mandi.id === baseMandiId;

      return {
        ...mandi,
        modalPrice,
        minPrice,
        maxPrice,
        arrivals,
        spreadVsBase,
        isBase,
      };
    }).sort((a, b) => b.modalPrice - a.modalPrice);
  }, [baseMandiId, radiusKm, selectedCropId, basePrice, selectedCrop]);

  const bestMandi = comparedMandis[0];
  const maxSpread = bestMandi ? bestMandi.spreadVsBase : 0;

  return (
    <div className="space-y-6">
      {/* Control Header Card */}
      <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-50/40 via-background to-teal-50/30 dark:from-emerald-950/20 dark:to-background">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-600 text-white text-xs">
                  <Zap className="w-3 h-3 mr-1" /> Spatial Arbitrage Engine
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300 dark:text-emerald-400">
                  Real-time APMC Spread
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                📍 {getMarketTranslation("compareMandis", language)}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Compare real-time crop rates, gate queues, transit travel times, and price spreads across nearby mandis.
              </CardDescription>
            </div>

            {/* Quick Arbitrage Callout if spread > 0 */}
            {maxSpread > 0 && bestMandi && !bestMandi.isBase && (
              <div className="bg-emerald-600 text-white p-3 rounded-lg shadow-sm flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-300 animate-bounce" />
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-emerald-100">
                    Highest Price Arbitrage
                  </div>
                  <div className="text-sm font-bold">
                    +₹{maxSpread}/Qtl at {bestMandi.name.split("(")[0]}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filters Grid */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Commodity Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {getMarketTranslation("selectCrop", language)}
              </label>
              <Select value={selectedCropId} onValueChange={setSelectedCropId}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select commodity" />
                </SelectTrigger>
                <SelectContent>
                  {RURAL_COMMODITIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {translateItemName(c.name, language, "commodity")} (₹{c.modalPrice}/Qtl)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Base Mandi Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {getMarketTranslation("selectBaseMandi", language)}
              </label>
              <Select value={baseMandiId} onValueChange={setBaseMandiId}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your nearest mandi" />
                </SelectTrigger>
                <SelectContent>
                  {MASTER_MANDIS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name.split("(")[0]} ({m.district}, {m.distanceKm} km)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Radius Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {getMarketTranslation("selectDistanceRadius", language)}
              </label>
              <Select value={String(radiusKm)} onValueChange={(val) => setRadiusKm(Number(val))}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Distance radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">{getMarketTranslation("radius25", language)}</SelectItem>
                  <SelectItem value="50">{getMarketTranslation("radius50", language)}</SelectItem>
                  <SelectItem value="100">{getMarketTranslation("radius100", language)}</SelectItem>
                  <SelectItem value="350">{getMarketTranslation("radius300", language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {comparedMandis.map((mandi) => {
          const isHighest = mandi.id === bestMandi?.id && mandi.spreadVsBase > 0;
          const isBase = mandi.isBase;

          return (
            <Card
              key={mandi.id}
              className={`relative overflow-hidden transition-all duration-200 border ${
                isHighest
                  ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/20"
                  : isBase
                  ? "border-amber-400/80 bg-amber-50/10 dark:bg-amber-950/10"
                  : "hover:border-emerald-200"
              }`}
            >
              {/* Top Banner for Best / Base */}
              {isHighest && (
                <div className="bg-emerald-600 text-white text-[11px] font-bold py-1 px-3 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {getMarketTranslation("optimalRouteBadge", language)}
                  </span>
                  <span>+₹{mandi.spreadVsBase}/Qtl higher than base market</span>
                </div>
              )}
              {isBase && !isHighest && (
                <div className="bg-amber-500 text-white text-[11px] font-bold py-1 px-3 flex items-center justify-between">
                  <span>📍 Your Selected Base Mandi (Benchmark)</span>
                  <span>₹{mandi.modalPrice}/Qtl</span>
                </div>
              )}

              <CardContent className="p-4 space-y-4">
                {/* Mandi Name and Distance */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {mandi.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {mandi.district}, {mandi.state}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5" />
                        {mandi.distanceKm} km away
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        ~{mandi.travelTimeHours} hrs transit
                      </span>
                    </div>
                  </div>

                  {/* Congestion Status Badge */}
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 py-0.5 whitespace-nowrap ${
                      mandi.congestionStatus === "Smooth"
                        ? "border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                        : mandi.congestionStatus === "Moderate"
                        ? "border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950/40"
                        : "border-rose-500 text-rose-700 bg-rose-50 dark:bg-rose-950/40"
                    }`}
                  >
                    {mandi.congestionStatus === "Smooth"
                      ? getMarketTranslation("smooth", language)
                      : mandi.congestionStatus === "Moderate"
                      ? getMarketTranslation("moderate", language)
                      : getMarketTranslation("heavyQueue", language)}
                  </Badge>
                </div>

                {/* Price & Spread Spotlight */}
                <div className="bg-muted/40 dark:bg-muted/20 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase font-medium">
                      {translateItemName(selectedCrop.name, language, "commodity")} {getMarketTranslation("modalRate", language)}
                    </span>
                    <div className="text-xl font-black text-foreground tracking-tight mt-0.5">
                      ₹{mandi.modalPrice.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-muted-foreground ml-1">/Qtl</span>
                    </div>
                  </div>

                  {/* Spread vs Base */}
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase font-medium">
                      {getMarketTranslation("priceSpread", language)}
                    </span>
                    <div className="mt-0.5">
                      {isBase ? (
                        <span className="text-xs font-semibold text-muted-foreground">Base Reference</span>
                      ) : mandi.spreadVsBase > 0 ? (
                        <span className="text-base font-bold text-emerald-600 flex items-center gap-0.5">
                          <TrendingUp className="w-4 h-4" /> +₹{mandi.spreadVsBase}/Qtl
                        </span>
                      ) : mandi.spreadVsBase < 0 ? (
                        <span className="text-base font-bold text-rose-600">
                          -₹{Math.abs(mandi.spreadVsBase)}/Qtl
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">Equal to base</span>
                      )}
                    </div>
                  </div>

                  {/* Arrivals in this Mandi */}
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-muted-foreground uppercase font-medium">
                      {getMarketTranslation("dailyArrivals", language)}
                    </span>
                    <div className="text-sm font-semibold text-foreground mt-0.5">
                      {mandi.arrivals > 0 ? `${mandi.arrivals} Tonnes` : "Active Trading"}
                    </div>
                  </div>
                </div>

                {/* Statutory Fee Transparency Strip */}
                <div className="text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-3">
                    <span>
                      APMC Cess: <strong className="text-foreground">{mandi.apmcCessPercent}%</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Hamali: <strong className="text-foreground">₹{mandi.hamaliPerQtl}/Qtl</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Weighbridge: <strong className="text-foreground">₹{mandi.weighbridgeCharge}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>0% Farmer Commission</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 border-t flex items-center justify-between">
                  <a
                    href={`tel:${mandi.phone}`}
                    className="text-xs text-muted-foreground hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{mandi.phone}</span>
                  </a>

                  <Button
                    size="sm"
                    onClick={() => onNavigateToCalculator && onNavigateToCalculator(selectedCropId, mandi.id)}
                    className="h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-medium flex items-center gap-1"
                  >
                    Calculate Net Revenue
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
