import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Calculator,
  Trophy,
  Truck,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  CheckCircle,
  Users,
  MapPin,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  Radio,
  Leaf,
  Download,
  Share2,
  ArrowUpRight,
  Coins,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RURAL_COMMODITIES, MASTER_MANDIS, ORIGIN_CLUSTERS } from "@/data/ruralMarketData";
import { calculateNetReturns, MandiCalculation } from "@/lib/calculator";
import { Language } from "@/utils/translations";
import { getMarketTranslation } from "@/utils/marketTranslations";
import { toast } from "sonner";

import { playVernacularAudio, stopVernacularAudio } from "@/utils/audioSpeech";

interface NetRevenueCalculatorProps {
  language: Language;
  initialCropId?: string;
  initialMandiId?: string;
}

const KANNADA_CROP_NAMES: Record<string, string> = {
  tomato: "ಟೊಮ್ಯಾಟೊ",
  mattu_gulla: "ಮಟ್ಟು ಗುಳ್ಳ ಬದನೆಕಾಯಿ",
  jasmine: "ಶಂಕರಪುರ ಮಲ್ಲಿಗೆ",
  arecanut: "ಅಡಿಕೆ",
  coconut: "ತೆಂಗಿನಕಾಯಿ",
  black_pepper: "ಕಪ್ಪು ಮೆಣಸು",
  paddy: "ಭತ್ತ",
};

const KANNADA_MANDI_NAMES: Record<string, string> = {
  mandi_adi_udupi: "ಆದಿ ಉಡುಪಿ ಎಪಿಎಂಸಿ",
  mandi_mangaluru: "ಮಂಗಳೂರು ಬಂದರ್",
  mandi_santhekatte: "ಸಂತೆಕಟ್ಟೆ ಮಾರುಕಟ್ಟೆ",
  mandi_karkala: "ಕಾರ್ಕಳ ಎಪಿಎಂಸಿ",
  mandi_kundapura: "ಕುಂದಾಪುರ ಎಪಿಎಂಸಿ",
};

export const NetRevenueCalculator = ({
  language = "en",
  initialCropId = "tomato",
  initialMandiId,
}: NetRevenueCalculatorProps) => {
  const [cropId, setCropId] = useState<string>(initialCropId);
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [origin, setOrigin] = useState<string>("Bantakal (SMVITM Hub)");
  const [isPooled, setIsPooled] = useState<boolean>(false);
  const [applyPerishability, setApplyPerishability] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  // Update crop when prop changes
  useEffect(() => {
    if (initialCropId) setCropId(initialCropId);
  }, [initialCropId]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopVernacularAudio();
    };
  }, []);

  const selectedCrop = useMemo(
    () => RURAL_COMMODITIES.find((c) => c.id === cropId) || RURAL_COMMODITIES[0],
    [cropId]
  );

  // Run the deterministic math engine
  const calculations: MandiCalculation[] = useMemo(() => {
    try {
      return calculateNetReturns(
        cropId,
        quantityKg,
        origin,
        MASTER_MANDIS,
        isPooled,
        applyPerishability
      );
    } catch {
      return [];
    }
  }, [cropId, quantityKg, origin, isPooled, applyPerishability]);

  const winner = calculations[0];
  const adiUdupi = calculations.find((c) => c.id === "mandi_adi_udupi");
  const mangaluru = calculations.find((c) => c.id === "mandi_mangaluru");

  // Reference scenario flags (500 kg Tomato default)
  const isReferenceScenario = cropId === "tomato" && quantityKg === 500;
  const showMangaluruWarning =
    isReferenceScenario && !isPooled && adiUdupi && mangaluru &&
    adiUdupi.netCashSolo > mangaluru.netCashSolo;
  const showPoolingCelebration =
    isReferenceScenario && isPooled && mangaluru && adiUdupi &&
    mangaluru.netCashPooled > adiUdupi.netCashPooled;

  // Generate dynamic Kannada voice briefing text
  const kannadaBriefingText = useMemo(() => {
    if (!winner) return "ವಜ್ರ ಯೀಲ್ಡ್ ನಿವ್ವಳ ಆದಾಯ ಲೆಕ್ಕಾಚಾರ.";
    const cropKn = KANNADA_CROP_NAMES[cropId] || selectedCrop.name;
    const originKn = origin.split(" ")[0];
    const winnerMandiKn = KANNADA_MANDI_NAMES[winner.id] || winner.name;
    const netCash = isPooled ? winner.netCashPooled : winner.netCashSolo;

    let text = `ನಮಸ್ಕಾರ. ${originKn} ಭಾಗದ ರೈತರಿಗೆ ${quantityKg} ಕೆಜಿ ${cropKn} ಮಾರಾಟ ಮಾಡಲು ${winnerMandiKn} ಮಾರುಕಟ್ಟೆ ಅತ್ಯಂತ ಲಾಭದಾಯಕವಾಗಿದೆ. `;
    text += `ಎಲ್ಲಾ ಸಾಗಾಣಿಕೆ ಮತ್ತು ಶುಲ್ಕ ಕಳೆದು ನಿಮ್ಮ ಕೈಗೆ ಸಿಗುವ ಒಟ್ಟು ನಿವ್ವಳ ಆದಾಯ ${netCash.toLocaleString("en-IN")} ರೂಪಾಯಿಗಳು. `;

    if (showMangaluruWarning && adiUdupi && mangaluru) {
      const gap = adiUdupi.netCashSolo - mangaluru.netCashSolo;
      text += `ಎಚ್ಚರಿಕೆ! ಮಂಗಳೂರು ಬಂದರ್‌ನಲ್ಲಿ ಬೆಲೆ ಹೆಚ್ಚಾಗಿ ಕಂಡರೂ, ಸಾಗಾಣಿಕೆ ವೆಚ್ಚ ಮತ್ತು ಹೆಜಮಾಡಿ ಟೋಲ್ ಕಾರಣದಿಂದ ಆದಿ ಉಡುಪಿ ಮಾರುಕಟ್ಟೆಯು ${gap.toLocaleString("en-IN")} ರೂಪಾಯಿ ಹೆಚ್ಚು ನಿವ್ವಳ ಲಾಭ ನೀಡುತ್ತದೆ. `;
    } else if (showPoolingCelebration && mangaluru && adiUdupi) {
      const extra = mangaluru.netCashPooled - adiUdupi.netCashPooled;
      text += `ಶಿರ್ವ ರೈತರೊಂದಿಗೆ ವಾಹನ ಹಂಚಿಕೆ ಪೂಲಿಂಗ್ ಮಾಡುವುದರಿಂದ ಮಂಗಳೂರು ಬಂದರ್‌ನಲ್ಲಿ ${extra.toLocaleString("en-IN")} ರೂಪಾಯಿ ಅಧಿಕ ಲಾಭ ಸಿಗುತ್ತದೆ. `;
    } else if (isPooled) {
      text += `ಕ್ಲಸ್ಟರ್ ಪೂಲಿಂಗ್‌ನಿಂದ ಸಾಗಾಣಿಕೆ ವೆಚ್ಚ ಉಳಿತಾಯವಾಗಿದೆ. `;
    }

    return text;
  }, [winner, cropId, selectedCrop, origin, quantityKg, isPooled, showMangaluruWarning, showPoolingCelebration, adiUdupi, mangaluru]);

  // English summary of briefing
  const englishBriefingSummary = useMemo(() => {
    if (!winner) return "";
    const netCash = isPooled ? winner.netCashPooled : winner.netCashSolo;
    return `For ${quantityKg}kg ${selectedCrop.name} from ${origin.split(" ")[0]}, ${winner.name} delivers highest in-hand cash of ₹${netCash.toLocaleString("en-IN")} (${isPooled ? "Cluster Pooled" : "Solo"} mode).`;
  }, [winner, quantityKg, selectedCrop, origin, isPooled]);

  // Chart data
  const chartData = calculations.map((c) => ({
    name: c.name.split(" ")[0],
    "Gross Revenue": c.grossRevenue,
    "Transit & Fees": (isPooled ? c.pooledTransitCost : c.soloTransitCost) + c.statutoryFees + c.spoilageLoss,
    "Net Cash": isPooled ? c.netCashPooled : c.netCashSolo,
  }));

  // High quality vernacular audio speech handler
  const handleSpeak = () => {
    if (isSpeaking) {
      stopVernacularAudio();
      setIsSpeaking(false);
      return;
    }

    setShowTranscript(true);
    toast.success("▶ ಕನ್ನಡ ಧ್ವನಿ ಬ್ರೀಫಿಂಗ್ ಪ್ರಾರಂಭವಾಗಿದೆ (Playing Kannada Briefing)…");

    playVernacularAudio({
      text: kannadaBriefingText,
      lang: "kn",
      rate: 0.95,
      onStart: () => {
        setIsSpeaking(true);
      },
      onEnd: () => {
        setIsSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
        toast.error("ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ದೋಷ ಕಂಡುಬಂದಿದೆ.");
      },
    });
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Mandi Name", "Distance (km)", "Market Rate (₹/Qtl)", "Gross Revenue (₹)",
      "Solo Transit (₹)", "Pooled Transit (₹)", "Spoilage Loss (₹)",
      "Statutory Fees (₹)", "Net Cash Solo (₹)", "Net Cash Pooled (₹)"
    ];
    const rows = calculations.map((c) => [
      `"${c.name}"`, c.distanceKm, c.marketRatePerQtl, c.grossRevenue,
      c.soloTransitCost, c.pooledTransitCost, c.spoilageLoss,
      c.statutoryFees, c.netCashSolo, c.netCashPooled
    ]);
    const csv = "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = `VajraYield_${selectedCrop.name}_${quantityKg}kg.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("VajraYield Net Revenue Report downloaded!");
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    if (!winner) return;
    const net = isPooled ? winner.netCashPooled : winner.netCashSolo;
    const text =
      `🌾 *VajraYield – HPL 2026 Net Mandi Revenue*\n` +
      `📍 Origin: ${origin}\n` +
      `🌱 Crop: ${selectedCrop.name} | Qty: ${quantityKg} kg\n` +
      `🏆 Best Mandi: ${winner.name}\n` +
      `💰 Net In-Hand: ₹${net.toLocaleString("en-IN")}\n` +
      `🚚 ${isPooled ? "Pooled" : "Solo"} Transit: ₹${(isPooled ? winner.pooledTransitCost : winner.soloTransitCost).toLocaleString("en-IN")}\n` +
      `Build For Udupi! | SMVITM Bantakal | PS 02`;
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Shared on WhatsApp!");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-background to-amber-500/10 dark:from-emerald-950/30">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge className="bg-emerald-600 text-white text-xs">
                  <Calculator className="w-3 h-3 mr-1" /> VajraYield Net Revenue Engine
                </Badge>
                <Badge variant="outline" className="text-amber-700 border-amber-300 text-xs">
                  Bantakal–Udupi Belt
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                💰 {getMarketTranslation("calcTitle", language)}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {getMarketTranslation("calcSubtitle", language)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={isSpeaking ? "destructive" : "outline"}
                size="sm"
                onClick={handleSpeak}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
                  isSpeaking
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm ring-2 ring-rose-400/50"
                    : "border-emerald-400/80 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700"
                }`}
                aria-label="Listen to live mandi rates in Kannada"
                id="btn-listen-mandi-rates"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 animate-pulse text-white" />
                    Stop Audio (ನಿಲ್ಲಿಸಿ)
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    ಕನ್ನಡ ಆಡಿಯೊ ಬ್ರೀಫಿಂಗ್
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs border-emerald-300 hover:bg-emerald-50 text-emerald-800 dark:hover:bg-emerald-950"
                id="btn-export-csv"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </Button>
              <Button
                size="sm"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                id="btn-share-whatsapp"
              >
                <Share2 className="w-3.5 h-3.5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Audio Briefing Transcript & Player Card */}
      {showTranscript && (
        <div className="relative p-4 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-amber-500/10 dark:from-emerald-950/40 dark:to-background shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                {isSpeaking ? (
                  <Radio className="w-5 h-5 animate-pulse text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-emerald-700 text-white text-[10px] font-medium px-2 py-0.5">
                    {isSpeaking ? "▶ ಧ್ವನಿ ಪ್ರಸಾರವಾಗುತ್ತಿದೆ (Playing Voice Briefing)" : "✓ ಕನ್ನಡ ಧ್ವನಿ ಬ್ರೀಫಿಂಗ್ (Kannada Audio Briefing)"}
                  </Badge>
                  <Badge variant="outline" className="border-emerald-400 text-emerald-800 dark:text-emerald-300 text-[10px]">
                    Google HD TTS
                  </Badge>
                </div>

                {/* Kannada Spoken Transcript */}
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  "{kannadaBriefingText}"
                </p>

                {/* English Translation */}
                <p className="text-xs text-muted-foreground italic">
                  EN: {englishBriefingSummary}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                size="sm"
                variant={isSpeaking ? "destructive" : "default"}
                onClick={handleSpeak}
                className={`h-7 px-2.5 text-xs font-semibold ${!isSpeaking ? "bg-emerald-700 hover:bg-emerald-800 text-white" : ""}`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3 h-3 mr-1" /> ನಿಲ್ಲಿಸಿ
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3 h-3 mr-1" /> ಮತ್ತೆ ಆಲಿಸಿ
                  </>
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  stopVernacularAudio();
                  setIsSpeaking(false);
                  setShowTranscript(false);
                }}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Dismiss audio card"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reference Scenario Insight Panel */}
      {isReferenceScenario && (
        <div className="space-y-3">
          {showMangaluruWarning && adiUdupi && mangaluru && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl border border-amber-400/50 bg-amber-50/80 dark:bg-amber-950/30"
              role="alert"
              aria-live="polite"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  ⚠️ DECEPTIVE SPREAD ALERT — Mangaluru Bunder
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Mangaluru's gross rate of <strong>₹{mangaluru.marketRatePerQtl}/Qtl</strong> appears
                  ₹{mangaluru.marketRatePerQtl - adiUdupi.marketRatePerQtl}/Qtl higher — but{" "}
                  <strong>coastal spoilage + Hejamadi toll + ₹{mangaluru.soloTransitCost.toLocaleString("en-IN")} transit</strong> erodes
                  it to a net of only <strong>₹{mangaluru.netCashSolo.toLocaleString("en-IN")}</strong>.{" "}
                  Adi Udupi APMC yields <strong className="text-emerald-700">₹{(adiUdupi.netCashSolo - mangaluru.netCashSolo).toLocaleString("en-IN")} MORE</strong> in hand.
                </p>
              </div>
              <Badge className="bg-amber-500 text-white text-[10px] whitespace-nowrap">
                Net Gap: ₹{(adiUdupi.netCashSolo - mangaluru.netCashSolo).toLocaleString("en-IN")}
              </Badge>
            </div>
          )}
          {showPoolingCelebration && mangaluru && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl border border-emerald-400/50 bg-emerald-50/80 dark:bg-emerald-950/30"
              role="status"
              aria-live="polite"
            >
              <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  🎉 CLUSTER POOLING UNLOCKED — Shirva–Bantakal Network
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Freight split with <strong>2 Shirva smallholders</strong>! Mangaluru Bunder net
                  jumps to <strong>₹{mangaluru.netCashPooled.toLocaleString("en-IN")}</strong>
                  {" "}(saving ₹{(mangaluru.soloTransitCost - mangaluru.pooledTransitCost).toLocaleString("en-IN")} on freight alone).
                  This now <strong>beats Adi Udupi</strong> by ₹{(mangaluru.netCashPooled - (calculations.find(c => c.id === "mandi_adi_udupi")?.netCashPooled ?? 0)).toLocaleString("en-IN")}!
                </p>
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px] whitespace-nowrap">
                +₹{(mangaluru.netCashPooled - (calculations.find(c => c.id === "mandi_adi_udupi")?.netCashPooled ?? 0)).toLocaleString("en-IN")} Extra
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Inputs + Winner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Interactive Input Panel */}
        <Card className="lg:col-span-5 border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              Harvest & Route Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-5">
            {/* 1. Origin Village */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Origin Village / Cluster
              </Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger id="select-origin-cluster">
                  <SelectValue placeholder="Choose origin cluster" />
                </SelectTrigger>
                <SelectContent>
                  {ORIGIN_CLUSTERS.map((o) => (
                    <SelectItem key={o.id} value={o.name}>
                      {o.name} {o.distanceFromHubKm > 0 ? `(${o.distanceFromHubKm} km from Hub)` : "(Default Hub)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Crop Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Leaf className="w-3 h-3" /> {getMarketTranslation("selectCrop", language)}
              </Label>
              <Select value={cropId} onValueChange={setCropId}>
                <SelectTrigger id="select-crop">
                  <SelectValue placeholder="Choose crop" />
                </SelectTrigger>
                <SelectContent>
                  {RURAL_COMMODITIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — ₹{c.modalPrice.toLocaleString("en-IN")}/Qtl
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCrop && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">
                    {selectedCrop.category}
                  </Badge>
                  {selectedCrop.id !== "arecanut" && (
                    <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-700">
                      ⚠ Perishable
                    </Badge>
                  )}
                  {selectedCrop.id === "arecanut" && (
                    <Badge variant="outline" className="text-[10px] border-emerald-400 text-emerald-700">
                      ✓ Non-perishable
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* 3. Quantity Slider + Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Quantity (kg)
                </Label>
                <span className="text-xs font-bold text-emerald-700">
                  {quantityKg.toLocaleString("en-IN")} kg = {(quantityKg / 100).toFixed(1)} Qtl
                </span>
              </div>
              <Slider
                id="slider-quantity-kg"
                min={50}
                max={2000}
                step={50}
                value={[quantityKg]}
                onValueChange={([v]) => setQuantityKg(v)}
                className="w-full"
                aria-label="Harvest quantity in kilograms"
              />
              <div className="flex items-center gap-2">
                <Input
                  id="input-quantity-kg"
                  type="number"
                  min={50}
                  max={2000}
                  step={50}
                  value={quantityKg}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v >= 50 && v <= 2000) setQuantityKg(v);
                  }}
                  className="w-28 font-bold text-center"
                  aria-label="Enter quantity in kilograms"
                />
                <div className="flex gap-1 flex-wrap">
                  {[100, 250, 500, 1000].map((v) => (
                    <Button
                      key={v}
                      type="button"
                      variant={quantityKg === v ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuantityKg(v)}
                      className={`h-7 text-xs px-2 ${quantityKg === v ? "bg-emerald-700 text-white" : ""}`}
                      id={`btn-qty-${v}`}
                    >
                      {v}kg
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Innovation Switches */}
            <div className="pt-2 border-t space-y-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Innovation Toggles
              </p>

              {/* Pooling Toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 pr-2">
                  <Label className="text-xs font-medium text-foreground flex items-center gap-1 cursor-pointer" htmlFor="switch-pooling">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    Shared Freight / Cluster Pooling
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Bantakal–Shirva Network: Split cost with 2 smallholders (~2.8× freight reduction)
                  </p>
                </div>
                <Switch
                  id="switch-pooling"
                  checked={isPooled}
                  onCheckedChange={setIsPooled}
                  aria-label="Enable cluster freight pooling with Shirva smallholders"
                />
              </div>

              {/* Perishability Toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 pr-2">
                  <Label className="text-xs font-medium text-foreground flex items-center gap-1 cursor-pointer" htmlFor="switch-perishability">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Coastal Humidity & Midday Spoilage Factor
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Tomato: 2.5%/hr · Mattu Gulla: 1.8%/hr · Jasmine: 5.0%/hr · Arecanut: 0%
                  </p>
                </div>
                <Switch
                  id="switch-perishability"
                  checked={applyPerishability}
                  onCheckedChange={setApplyPerishability}
                  aria-label="Apply coastal humidity perishability factor"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Winner Spotlight */}
        {winner && (
          <Card className="lg:col-span-7 border-emerald-500 shadow-md bg-gradient-to-br from-emerald-500/10 via-background to-emerald-50/50 dark:from-emerald-950/40">
            <CardHeader className="pb-3 border-b bg-emerald-600/10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    🏆
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                      {getMarketTranslation("optimalMandiBadge", language)}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Highest net cash for {quantityKg.toLocaleString("en-IN")} kg from {origin}
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white text-xs px-2.5 py-1">
                  {isPooled ? "Pooled Mode" : "Solo Mode"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Winner Info */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-foreground">{winner.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {winner.distanceKm} km · Market Rate: ₹{winner.marketRatePerQtl.toLocaleString("en-IN")}/Qtl
                  </p>
                </div>
                <Badge variant="outline" className="text-emerald-700 border-emerald-400">
                  {winner.distanceKm} km from {origin.split(" ")[0]}
                </Badge>
              </div>

              {/* Big Net Cash Box */}
              <div className="bg-emerald-600 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-emerald-100">
                    {getMarketTranslation("netCashInHand", language)}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">
                    ₹{(isPooled ? winner.netCashPooled : winner.netCashSolo).toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-emerald-100 mt-1">
                    ₹{Math.round((isPooled ? winner.netCashPooled : winner.netCashSolo) / (quantityKg / 100)).toLocaleString("en-IN")}/Qtl net after all costs
                  </div>
                </div>
                <div className="bg-emerald-700/60 rounded-lg p-3 text-xs space-y-1 sm:text-right border border-emerald-500/40">
                  <div className="text-emerald-100 font-medium">Transparent Breakdown</div>
                  <div>Gross Value: ₹{winner.grossRevenue.toLocaleString("en-IN")}</div>
                  <div>Freight & Fuel: −₹{(isPooled ? winner.pooledTransitCost : winner.soloTransitCost).toLocaleString("en-IN")}</div>
                  <div>APMC Cess + Hamali: −₹{winner.statutoryFees.toLocaleString("en-IN")}</div>
                  {winner.spoilageLoss > 0 && (
                    <div>Coastal Spoilage: −₹{winner.spoilageLoss.toLocaleString("en-IN")}</div>
                  )}
                </div>
              </div>

              {/* Mandi Comparison Cards */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  All 4 Udupi-Belt Mandis Ranked
                </p>
                {calculations.map((c, i) => {
                  const net = isPooled ? c.netCashPooled : c.netCashSolo;
                  const isTop = i === 0;
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${isTop
                          ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30"
                          : "border-border bg-muted/30"
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${isTop ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                          }`}>
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs truncate">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {c.distanceKm} km · ₹{c.marketRatePerQtl.toLocaleString("en-IN")}/Qtl gross
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`font-black text-sm ${isTop ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}>
                          ₹{net.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Net In-Hand</div>
                        {/* Line item detail */}
                        <div className="text-[9px] text-muted-foreground/70 mt-0.5">
                          Transit: ₹{(isPooled ? c.pooledTransitCost : c.soloTransitCost).toLocaleString("en-IN")} · Fees: ₹{c.statutoryFees} · Spoilage: ₹{c.spoilageLoss}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <Card className="border shadow-sm">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Revenue vs. Cost Waterfall — {selectedCrop.name} · {quantityKg.toLocaleString("en-IN")} kg
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Gross Revenue" fill="hsl(142 76% 36%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Transit & Fees" fill="hsl(38 92% 50%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Net Cash" fill="hsl(158 64% 52%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
