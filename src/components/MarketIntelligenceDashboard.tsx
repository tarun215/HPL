import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  MapPin,
  Calculator,
  LineChart,
  ArrowUpRight
} from "lucide-react";
import { CommodityPriceDiscovery } from "./CommodityPriceDiscovery";
import { MandiComparison } from "./MandiComparison";
import { NetRevenueCalculator } from "./NetRevenueCalculator";
import { DemandForecasting } from "./DemandForecasting";
import { Language } from "@/utils/translations";
import { getMarketTranslation } from "@/utils/marketTranslations";
import { RURAL_COMMODITIES } from "@/data/ruralMarketData";

interface MarketIntelligenceDashboardProps {
  language: Language;
  searchQuery?: string;
}

export const MarketIntelligenceDashboard = ({
  language = "en",
  searchQuery = "",
}: MarketIntelligenceDashboardProps) => {
  const [activeTab, setActiveTab] = useState<string>("discovery");
  const [calculatorCropId, setCalculatorCropId] = useState<string>("tomato");
  const [calculatorMandiId, setCalculatorMandiId] = useState<string | undefined>(undefined);

  // Listen for navigation tab events from Header
  useEffect(() => {
    const handleTabSwitch = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener("switch_dashboard_tab", handleTabSwitch);
    return () => window.removeEventListener("switch_dashboard_tab", handleTabSwitch);
  }, []);

  // Top gaining commodity
  const topGainer = [...RURAL_COMMODITIES].sort((a, b) => b.dailyChange - a.dailyChange)[0] || {
    name: "Tomato",
    dailyChange: 2.3,
    modalPrice: 2200,
  };

  const handleNavigateToCalculator = (cropId: string, mandiId: string) => {
    setCalculatorCropId(cropId);
    setCalculatorMandiId(mandiId);
    setActiveTab("calculator");
  };

  const handleSelectCommodityFromDiscovery = (cropId: string) => {
    setCalculatorCropId(cropId);
    setActiveTab("calculator");
  };

  return (
    <div id="dashboard-tabs-container" className="space-y-6 scroll-mt-20">
      {/* Top Quick KPI Metric Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* KPI 1: Top Arbitrage Spread */}
        <Card className="border border-emerald-500/30 bg-gradient-to-br from-emerald-50/60 to-background dark:from-emerald-950/30 shadow-sm">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                {getMarketTranslation("bestOpportunity", language)}
              </span>
              <div className="text-lg font-black text-foreground mt-0.5">
                Adi Udupi APMC
              </div>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +₹500/Qtl vs Karkala
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
              📍
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Top Daily Gainer */}
        <Card className="border shadow-sm">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                {getMarketTranslation("highestGainer", language)}
              </span>
              <div className="text-lg font-black text-foreground mt-0.5">
                {topGainer.name}
              </div>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +{topGainer.dailyChange}% (₹{topGainer.modalPrice})
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold">
              🔥
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Verified Corporate Bids */}
        <Card className="border shadow-sm">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                Active Buyer Bids
              </span>
              <div className="text-lg font-black text-foreground mt-0.5">
                4 FPO / Corporate
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Assured Instant Payment
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
              🤝
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Mandi Statutory Fee Standard */}
        <Card className="border shadow-sm">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                Farmer Protection
              </span>
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                0% Commission
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                WDRA e-NWR Loans Active
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
              🛡️
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Navigation (Clean 4-Tab Focused Layout) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="bg-card border rounded-xl p-1.5 shadow-sm">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto gap-1 bg-transparent p-0">
            {/* Tab 1: Discovery */}
            <TabsTrigger
              value="discovery"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white data-[state=active]:shadow font-semibold text-xs py-2.5 px-2 flex items-center gap-1.5 rounded-lg transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="truncate">{getMarketTranslation("tabPriceDiscovery", language)}</span>
            </TabsTrigger>

            {/* Tab 2: Comparison */}
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white data-[state=active]:shadow font-semibold text-xs py-2.5 px-2 flex items-center gap-1.5 rounded-lg transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span className="truncate">{getMarketTranslation("tabMandiComparison", language)}</span>
            </TabsTrigger>

            {/* Tab 3: Core Net Revenue Calculator */}
            <TabsTrigger
              value="calculator"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white data-[state=active]:shadow font-semibold text-xs py-2.5 px-2 flex items-center gap-1.5 rounded-lg transition-all relative"
            >
              <Calculator className="w-4 h-4" />
              <span className="truncate">{getMarketTranslation("tabNetRevenueCalc", language)}</span>
              <span className="hidden lg:inline-block w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />
            </TabsTrigger>

            {/* Tab 4: Forecast */}
            <TabsTrigger
              value="forecast"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white data-[state=active]:shadow font-semibold text-xs py-2.5 px-2 flex items-center gap-1.5 rounded-lg transition-all"
            >
              <LineChart className="w-4 h-4" />
              <span className="truncate">{getMarketTranslation("tabDemandForecast", language)}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Price Discovery */}
        <TabsContent value="discovery" className="m-0 focus-visible:outline-none">
          <CommodityPriceDiscovery
            language={language}
            searchQuery={searchQuery}
            onSelectCommodity={handleSelectCommodityFromDiscovery}
            selectedCommodityId={calculatorCropId}
          />
        </TabsContent>

        {/* Tab 2: Mandi Comparison */}
        <TabsContent value="comparison" className="m-0 focus-visible:outline-none">
          <MandiComparison
            language={language}
            onNavigateToCalculator={handleNavigateToCalculator}
          />
        </TabsContent>

        {/* Tab 3: Net Revenue Calculator */}
        <TabsContent value="calculator" className="m-0 focus-visible:outline-none">
          <NetRevenueCalculator
            language={language}
            initialCropId={calculatorCropId}
            initialMandiId={calculatorMandiId}
          />
        </TabsContent>

        {/* Tab 4: Demand Forecasting */}
        <TabsContent value="forecast" className="m-0 focus-visible:outline-none">
          <DemandForecasting language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
};