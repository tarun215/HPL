import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MarketIntelligenceDashboard } from "@/components/MarketIntelligenceDashboard";
import { DataNavigation } from "@/components/DataNavigation";
import { GovernmentSchemes } from "@/components/GovernmentSchemes";
import { HelpDesk } from "@/components/HelpDesk";
import { PriceCharts } from "@/components/PriceCharts";
import { LocationSelector } from "@/components/LocationSelector";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Sparkles, Sprout, CloudSun, ShieldCheck, TrendingUp } from "lucide-react";
import { Language, getTranslation } from "@/utils/translations";
import { getMarketTranslation } from "@/utils/marketTranslations";
import farmersHero from "@/assets/farmers-hero.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [selectedDistrict, setSelectedDistrict] = useState("Udupi");
  const [selectedMarket, setSelectedMarket] = useState("Bantakal");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("app_language") as Language) || "en");
  const [isSyncing, setIsSyncing] = useState(false);

  // Listen for global language change events
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail) {
        setLanguage(customEvent.detail);
      }
    };
    window.addEventListener("app_language_change", handler);
    return () => window.removeEventListener("app_language_change", handler);
  }, []);

  // Simulate data refresh
  const handleManualRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsSyncing(false);
      toast.success("Mandi rates & AGMARKNET arrivals refreshed!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500 selection:text-white">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} language={language} />

      {/* Hero Banner Section */}
      <div className="relative h-64 lg:h-72 overflow-hidden border-b">
        <img
          src={farmersHero}
          alt="Indian farmers working in agricultural fields"
          className="w-full h-full object-cover brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white space-y-3">
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight drop-shadow-sm">
                {getMarketTranslation('ruralMarketIntelligence', language)}
              </h1>
              <p className="text-sm lg:text-base text-emerald-100 font-medium drop-shadow-sm">
                {getMarketTranslation('subTitle', language)}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <LanguageSwitcher language={language} setLanguage={setLanguage} />
                <Link to="/weather">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-emerald-900 font-semibold text-xs h-8">
                    <CloudSun className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    {getTranslation('weather', language)}
                  </Button>
                </Link>
                <Link to="/crop-care">
                  <Button size="sm" variant="outline" className="bg-emerald-900/60 border-emerald-400/40 text-white hover:bg-emerald-800 text-xs h-8">
                    <Sprout className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                    {getTranslation('CropCare', language)}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Live Data Sync Status Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-card border rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  {getTranslation('liveDataStatus', language)}:
                </span>
                <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50">
                  {getTranslation('active', language)} (AGMARKNET & eNAM Synced)
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {getTranslation('lastUpdated', language)}: {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} •
                Next auto-refresh in 4 mins
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleManualRefresh}
            disabled={isSyncing}
            className="h-8 text-xs flex items-center gap-1.5 border-emerald-300 hover:bg-emerald-50 text-emerald-900 dark:text-emerald-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
            <span>Sync Live Mandi Rates</span>
          </Button>
        </div>

        {/* Location & Mandi Context Selector */}
        <LocationSelector
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedMarket={selectedMarket}
          setSelectedMarket={setSelectedMarket}
          language={language}
        />

        {/* Core PS 02 Market Intelligence Platform */}
        <section className="space-y-4">
          <MarketIntelligenceDashboard
            language={language}
            searchQuery={searchQuery}
          />
        </section>

        {/* Additional Agri Inputs & Machinery Section */}
        <section className="pt-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                🌱 Farm Inputs, Fertilizers & Machinery Rates
              </h2>
              <p className="text-xs text-muted-foreground">
                Subsidized fertilizer prices, recommended pesticides, and farm equipment rental benchmarks.
              </p>
            </div>
          </div>

          <DataNavigation
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedMarket={selectedMarket}
            searchQuery={searchQuery}
            language={language}
          />
        </section>

        {/* Additional Information Grid: Government Schemes & Helpdesk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t">
          <div className="space-y-6">
            <PriceCharts language={language} />
            <HelpDesk language={language} />
          </div>

          <div className="space-y-6">
            <GovernmentSchemes searchQuery={searchQuery} language={language} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;