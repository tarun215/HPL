import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Volume2, 
  VolumeX, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Sparkles
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { RURAL_COMMODITIES, CommodityRecord } from "@/data/ruralMarketData";
import { Language, translateItemName } from "@/utils/translations";
import { getMarketTranslation } from "@/utils/marketTranslations";
import { playVernacularAudio, stopVernacularAudio } from "@/utils/audioSpeech";

const KANNADA_COMMODITY_NAMES: Record<string, string> = {
  "Tomato (Hybrid Local)": "ಟೊಮ್ಯಾಟೊ",
  "Mattu Gulla (GI Brinjal)": "ಮಟ್ಟು ಗುಳ್ಳ ಬದನೆಕಾಯಿ",
  "Shankarapura Jasmine": "ಶಂಕರಪುರ ಮಲ್ಲಿಗೆ",
  "Arecanut (Chali Supari)": "ಅಡಿಕೆ",
  "Byadagi Chilli": "ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ",
  "Coconut (Copra Grade)": "ತೆಂಗಿನಕಾಯಿ",
  "Black Pepper (Malabar)": "ಕಪ್ಪು ಮೆಣಸು",
  "Paddy (Jyothi / RNR 15048)": "ಭತ್ತ",
  "Turmeric (Salem/Erode)": "ಅರಿಶಿನ",
  "Ginger (Fresh Rhizome)": "ಶುಂಠಿ",
  "Cashew Raw Nuts": "ಗೋಡಂಬಿ",
  "Cardamom (Small Green)": "ಏಲಕ್ಕಿ",
  "Onion (Nashik Red)": "ಈರುಳ್ಳಿ",
  "Potato (Jyoti Fresh)": "ಆಲೂಗಡ್ಡೆ",
  "Maize (Hybrid Feed Grade)": "ಮೆಕ್ಕೆಜೋಳ",
  "Soybean (Yellow FAQ)": "ಸೋಯಾಬೀನ್",
  "Urad Dal (Black Matpe)": "ಉದ್ದಿನಬೇಳೆ",
  "Moong Dal (Green FAQ)": "ಹೆಸರುಬೇಳೆ",
  "Groundnut (Pods Raw)": "ಕಡಲೆಕಾಯಿ",
  "Sunflower Seeds": "ಸೂರ್ಯಕಾಂತಿ ಬೀಜ",
};

function getKannadaActionText(action: string): string {
  if (action === "SELL NOW") return "ಶಿಫಾರಸು: ತಕ್ಷಣ ಮಾರಾಟ ಮಾಡಿ";
  if (action === "HOLD") return "ಶಿಫಾರಸು: ಬೆಲೆ ಏರಿಕೆಯಾಗುವವರೆಗೆ ಸ್ಟಾಕ್ ಇಟ್ಟುಕೊಳ್ಳಿ";
  return "ಶಿಫಾರಸು: ಹೆಚ್ಚು ಲಾಭದ ಮಾರುಕಟ್ಟೆಗೆ ಸಾಗಿಸಿ";
}

interface CommodityPriceDiscoveryProps {
  language: Language;
  searchQuery?: string;
  onSelectCommodity?: (commodityId: string) => void;
  selectedCommodityId?: string;
}

export const CommodityPriceDiscovery = ({
  language = "en",
  searchQuery = "",
  onSelectCommodity,
  selectedCommodityId,
}: CommodityPriceDiscoveryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopVernacularAudio();
    };
  }, []);

  // Sync prop searchQuery
  const activeSearch = searchQuery || localSearch;

  const categories = [
    { id: "all", label: getMarketTranslation("allCategories", language) },
    { id: "Vegetables", label: getMarketTranslation("vegetables", language) },
    { id: "Cash Crops", label: getMarketTranslation("cashCrops", language) },
    { id: "Spices", label: getMarketTranslation("spices", language) },
    { id: "Cereals", label: getMarketTranslation("cereals", language) },
    { id: "Pulses", label: getMarketTranslation("pulses", language) },
    { id: "Oilseeds", label: getMarketTranslation("oilseeds", language) },
  ];

  const filteredCommodities = useMemo(() => {
    return RURAL_COMMODITIES.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        activeSearch === "" ||
        item.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        item.variety.toLowerCase().includes(activeSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(activeSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, activeSearch]);

  const handleVoiceReadout = (commodity?: CommodityRecord, index?: number) => {
    const targetIndex = index !== undefined ? index : -1;

    // If clicking the currently active button while speaking, toggle off
    if (isSpeaking && activeSpeechIndex === targetIndex) {
      stopVernacularAudio();
      setIsSpeaking(false);
      setActiveSpeechIndex(null);
      return;
    }

    // Stop any existing voice immediately to guarantee single voice assistant
    stopVernacularAudio();

    let textToSpeak = "";

    if (commodity) {
      // Individual Commodity Card Single Kannada Voice Readout
      const cropKn = KANNADA_COMMODITY_NAMES[commodity.name] || commodity.name;
      const recommendationText = getKannadaActionText(commodity.recommendation.action);
      textToSpeak = `${cropKn}. ಮಾಡೆಲ್ ದರ ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ${commodity.modalPrice.toLocaleString("en-IN")} ರೂಪಾಯಿಗಳು. ಕನಿಷ್ಠ ದರ ${commodity.minPrice.toLocaleString("en-IN")} ರೂಪಾಯಿ, ಗರಿಷ್ಠ ದರ ${commodity.maxPrice.toLocaleString("en-IN")} ರೂಪಾಯಿ. ಇಂದಿನ ಆವಕ ${commodity.arrivalVolume} ಟನ್. ${recommendationText}.`;
    } else {
      // Top Live Mandi Rates Overview
      const itemsToRead = filteredCommodities.slice(0, 4);
      if (itemsToRead.length === 0) return;

      textToSpeak =
        "ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ, ಇಂದಿನ ಲೈವ್ ಮಂಡಿ ದರಗಳ ಮುಖ್ಯಾಂಶಗಳು: " +
        itemsToRead
          .map((c) => {
            const cropKn = KANNADA_COMMODITY_NAMES[c.name] || c.name;
            return `${cropKn}, ಮಾಡೆಲ್ ದರ ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ${c.modalPrice.toLocaleString("en-IN")} ರೂಪಾಯಿಗಳು, ಆವಕ ${c.arrivalVolume} ಟನ್.`;
          })
          .join(" ") +
        " ವಜ್ರ ಯೀಲ್ಡ್ ನೇರ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ.";
    }

    playVernacularAudio({
      text: textToSpeak,
      lang: "kn", // Single, authentic native Kannada voice assistant
      rate: 0.95,
      onStart: () => {
        setIsSpeaking(true);
        setActiveSpeechIndex(targetIndex);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setActiveSpeechIndex(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setActiveSpeechIndex(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 via-background to-amber-50/30 dark:from-emerald-950/20 dark:to-background">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 text-xs">
                  <Sparkles className="w-3 h-3" /> AGMARKNET & eNAM Live Feed
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300 dark:text-emerald-400">
                  {getMarketTranslation("dailyArrivals", language)} Verified
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                🌾 {getMarketTranslation("tabPriceDiscovery", language)}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {getMarketTranslation("subTitle", language)}
              </CardDescription>
            </div>

            {/* Voice Readout CTA */}
            <div className="flex items-center gap-2">
              <Button
                variant={isSpeaking && activeSpeechIndex === -1 ? "destructive" : "default"}
                onClick={() => handleVoiceReadout()}
                className={`flex items-center gap-2 shadow-sm font-semibold transition-all ${
                  isSpeaking && activeSpeechIndex === -1
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm ring-2 ring-rose-400/50"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
                id="btn-listen-mandi-rates"
              >
                {isSpeaking && activeSpeechIndex === -1 ? (
                  <>
                    <VolumeX className="w-4 h-4 animate-pulse" />
                    Stop Audio (ನಿಲ್ಲಿಸಿ)
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    ಕನ್ನಡ ಮಂಡಿ ದರ ಆಲಿಸಿ
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Search and Category Filters */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search crop or variety..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-9 h-9 bg-background/80"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`h-8 text-xs whitespace-nowrap rounded-full transition-all ${
                    selectedCategory === cat.id
                      ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                      : "hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/50"
                  }`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Commodities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCommodities.map((crop, idx) => {
          const isSelected = selectedCommodityId === crop.id;
          const mspDiff = crop.msp > 0 ? crop.modalPrice - crop.msp : null;
          const isAboveMsp = mspDiff !== null && mspDiff >= 0;

          return (
            <Card
              key={crop.id}
              onClick={() => onSelectCommodity && onSelectCommodity(crop.id)}
              className={`relative overflow-hidden transition-all duration-200 cursor-pointer border hover:shadow-md ${
                isSelected
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20"
                  : "hover:border-emerald-300 dark:hover:border-emerald-800"
              }`}
            >
              {/* Top Card Bar with Trend Badge */}
              <div className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-foreground">
                        {translateItemName(crop.name, language, "commodity")}
                      </h3>
                      <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0 bg-muted">
                        {crop.grade}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {crop.variety} • {crop.category}
                    </p>
                  </div>

                  {/* Daily Change Badge */}
                  <div className="flex flex-col items-end">
                    <div
                      className={`flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full ${
                        crop.trend === "up"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : crop.trend === "down"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {crop.trend === "up" && <TrendingUp className="w-3 h-3" />}
                      {crop.trend === "down" && <TrendingDown className="w-3 h-3" />}
                      {crop.trend === "stable" && <Minus className="w-3 h-3" />}
                      <span>
                        {crop.dailyChange > 0 ? `+${crop.dailyChange}%` : `${crop.dailyChange}%`}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {crop.dailyChangeAmount > 0
                        ? `+₹${crop.dailyChangeAmount}/Qtl`
                        : `₹${crop.dailyChangeAmount}/Qtl`}
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-medium">
                      {getMarketTranslation("modalRate", language)}
                    </span>
                    <div className="text-2xl font-black text-foreground tracking-tight">
                      ₹{crop.modalPrice.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        / {getMarketTranslation("qtl", language)}
                      </span>
                    </div>
                  </div>

                  {/* Min / Max Range */}
                  <div className="text-right text-xs">
                    <span className="text-muted-foreground">{getMarketTranslation("minMaxRate", language)}</span>
                    <p className="font-semibold text-foreground">
                      ₹{crop.minPrice} - ₹{crop.maxPrice}
                    </p>
                  </div>
                </div>

                {/* Mini 7-Day Sparkline Chart */}
                <div className="h-12 mt-2 -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={crop.historical7Days}>
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={crop.trend === "up" ? "#059669" : crop.trend === "down" ? "#e11d48" : "#64748b"}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-popover border text-[11px] px-2 py-1 rounded shadow text-popover-foreground">
                                <span className="font-semibold">₹{payload[0].value}</span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Metrics Strip: MSP Benchmark & Daily Arrivals */}
                <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-xs">
                  {/* MSP Status */}
                  <div>
                    {crop.msp > 0 ? (
                      <div className="flex items-center gap-1">
                        {isAboveMsp ? (
                          <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-0.5 inline" />
                            +₹{mspDiff} {getMarketTranslation("aboveMsp", language)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-amber-700 dark:text-amber-400 font-medium">
                            <AlertTriangle className="w-3 h-3 mr-0.5 inline" />
                            ₹{Math.abs(mspDiff!)} {getMarketTranslation("belowMsp", language)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Free Market Pricing</span>
                    )}
                  </div>

                  {/* Arrivals Volume */}
                  <div className="text-muted-foreground flex items-center gap-1 font-medium">
                    <span>{getMarketTranslation("dailyArrivals", language)}:</span>
                    <span className="text-foreground font-semibold">
                      {crop.arrivalVolume} {getMarketTranslation("tonnes", language)}
                    </span>
                  </div>
                </div>

                {/* Recommendation Ribbon */}
                <div className="mt-2.5 bg-muted/60 dark:bg-muted/30 rounded p-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={`text-[10px] px-1.5 py-0 ${
                        crop.recommendation.action === "HOLD"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : crop.recommendation.action === "SELL NOW"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {crop.recommendation.action === "HOLD"
                        ? getMarketTranslation("holdSignal", language)
                        : getMarketTranslation("sellSignal", language)}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground truncate max-w-[140px] sm:max-w-[180px]">
                      {language === "hi"
                        ? crop.recommendation.reasoningHi
                        : language === "mr"
                        ? crop.recommendation.reasoningMr
                        : crop.recommendation.reasoningEn}
                    </span>
                  </div>

                  {/* Individual Audio Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVoiceReadout(crop, idx);
                    }}
                    className="h-6 w-6 text-muted-foreground hover:text-emerald-700"
                    title="Speak rate"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${activeSpeechIndex === idx ? "text-emerald-600 animate-pulse" : ""}`} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCommodities.length === 0 && (
        <Card className="border-dashed p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h4 className="font-semibold text-foreground">No commodities found</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search keyword or selected category filter.
          </p>
        </Card>
      )}
    </div>
  );
};
