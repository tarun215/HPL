import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  PhoneCall,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { RURAL_COMMODITIES, BUYER_REQUISITIONS, CommodityRecord, BuyerRequisition } from "@/data/ruralMarketData";
import { Language, translateItemName } from "@/utils/translations";
import { getMarketTranslation } from "@/utils/marketTranslations";
import { toast } from "sonner";

interface DemandForecastingProps {
  language: Language;
}

export const DemandForecasting = ({ language = "en" }: DemandForecastingProps) => {
  const [selectedCropId, setSelectedCropId] = useState<string>("onion");
  const [selectedRequisition, setSelectedRequisition] = useState<BuyerRequisition | null>(null);

  const selectedCrop = useMemo(() => {
    return RURAL_COMMODITIES.find((c) => c.id === selectedCropId) || RURAL_COMMODITIES[0];
  }, [selectedCropId]);

  const handleInquireContract = (req: BuyerRequisition) => {
    toast.success(`Direct contract inquiry initiated with ${req.buyerName}! Procurement officer notified.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-50/40 via-background to-teal-50/30 dark:from-emerald-950/20 dark:to-background">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-600 text-white text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> Heuristic AI Market Intelligence
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  {getMarketTranslation("forecastConfidence", language)}: {selectedCrop.recommendation.confidence}%
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                🔮 {getMarketTranslation("forecastTitle", language)}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Predictive arrivals modeling, seasonal restocking cycles, and verified direct corporate buyer bids.
              </CardDescription>
            </div>

            {/* Crop Selector */}
            <div className="w-full md:w-64">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
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
          </div>
        </CardHeader>
      </Card>

      {/* Advisory & Balance Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Advisory Action Card */}
        <Card className={`border shadow-sm ${
          selectedCrop.recommendation.action === "HOLD"
            ? "border-amber-400 bg-amber-50/20 dark:bg-amber-950/20"
            : selectedCrop.recommendation.action === "SELL NOW"
            ? "border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20"
            : "border-blue-400 bg-blue-50/20"
        }`}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
              selectedCrop.recommendation.action === "HOLD"
                ? "bg-amber-500 text-white"
                : "bg-emerald-600 text-white"
            }`}>
              {selectedCrop.recommendation.action === "HOLD" ? "⏳" : "⚡"}
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                {getMarketTranslation("actionAdvisory", language)}
              </span>
              <h4 className="font-bold text-base text-foreground">
                {selectedCrop.recommendation.action === "HOLD"
                  ? getMarketTranslation("holdSignal", language)
                  : getMarketTranslation("sellSignal", language)}
              </h4>
              <p className="text-xs text-muted-foreground">
                Optimal Window: <strong>{selectedCrop.recommendation.optimalWindowDays} {getMarketTranslation("days", language)}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demand-Supply Balance Card */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
              ⚖️
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                {getMarketTranslation("supplyStatus", language)}
              </span>
              <h4 className="font-bold text-base text-foreground">
                {selectedCrop.supplyStatus === "Deficit"
                  ? getMarketTranslation("deficit", language)
                  : selectedCrop.supplyStatus === "Surplus"
                  ? getMarketTranslation("surplus", language)
                  : getMarketTranslation("balanced", language)}
              </h4>
              <p className="text-xs text-muted-foreground">
                Buyer Demand: <strong className="text-emerald-600">{selectedCrop.demandIndex}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Heuristic Rationale */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Key Market Drivers
            </span>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {language === "hi"
                ? selectedCrop.recommendation.reasoningHi
                : language === "mr"
                ? selectedCrop.recommendation.reasoningMr
                : selectedCrop.recommendation.reasoningEn}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 14-Day Price Projection Chart */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                14-Day Price Forecast with Upper & Lower Confidence Bounds (₹/Qtl)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Current Modal Rate: <strong>₹{selectedCrop.modalPrice}</strong> | Forecasted Peak: <strong>₹{selectedCrop.forecast14Days[selectedCrop.forecast14Days.length - 1]?.predictedPrice}</strong>
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Based on historical arrival patterns & festive seasonality
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedCrop.forecast14Days} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${value}`, ""]}
                  contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="#34d399"
                  fill="transparent"
                  strokeDasharray="4 4"
                  name="Upper Price Band"
                />
                <Area
                  type="monotone"
                  dataKey="predictedPrice"
                  stroke="#059669"
                  strokeWidth={3}
                  fill="url(#forecastArea)"
                  name="Projected Price"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="#f43f5e"
                  fill="transparent"
                  strokeDasharray="4 4"
                  name="Lower Support Floor"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Direct Buyer Requisitions & Corporate Purchase Bids */}
      <Card className="border">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                {getMarketTranslation("buyerInquiries", language)}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Direct procurement orders from verified FPOs, millers, and corporate agri-businesses with assured payments.
              </CardDescription>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs">
              4 Active Procurement Bids
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {BUYER_REQUISITIONS.map((req) => (
            <div key={req.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-foreground">{req.buyerName}</h4>
                  <Badge variant="outline" className="text-[10px] bg-muted">
                    {req.buyerType}
                  </Badge>
                  {req.verified && (
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Verified Buyer
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Commodity: <strong className="text-foreground">{req.commodity}</strong> • Spec: {req.qualitySpec}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span>Delivery: <strong>{req.deliveryMandi}</strong></span>
                  <span>•</span>
                  <span>Payment: <strong className="text-emerald-700">{req.paymentTerms}</strong></span>
                  <span>•</span>
                  <span className="text-amber-700 font-medium">{req.expiryDate}</span>
                </div>
              </div>

              {/* Price Offer & Action */}
              <div className="flex items-center gap-4 justify-between md:justify-end">
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground uppercase font-medium">
                    {getMarketTranslation("offeredPrice", language)}
                  </span>
                  <div className="text-xl font-black text-foreground">
                    ₹{req.offeredPricePerQtl.toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/Qtl</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Target: {req.requiredQuintals} Qtl
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleInquireContract(req)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium"
                >
                  {getMarketTranslation("acceptContract", language)}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
