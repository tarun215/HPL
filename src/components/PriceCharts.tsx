import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, BarChart3, Calendar, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getTranslation, Language } from "@/utils/translations";

const commodityTrendData = [
  { month: "Jan", wheat: 2350, soybean: 4900, onion: 2200, cotton: 7200, mustard: 5600 },
  { month: "Feb", wheat: 2380, soybean: 4850, onion: 2350, cotton: 7300, mustard: 5700 },
  { month: "Mar", wheat: 2420, soybean: 4800, onion: 2500, cotton: 7350, mustard: 5780 },
  { month: "Apr", wheat: 2440, soybean: 4760, onion: 2650, cotton: 7400, mustard: 5850 },
  { month: "May", wheat: 2460, soybean: 4740, onion: 2750, cotton: 7440, mustard: 5900 },
  { month: "Jun", wheat: 2480, soybean: 4720, onion: 2850, cotton: 7480, mustard: 5920 },
];

const fertilizerPriceData = [
  { month: "Jan", urea: 267, dap: 1380, npk: 1420, mop: 1680, ssp: 890 },
  { month: "Feb", urea: 267, dap: 1375, npk: 1430, mop: 1690, ssp: 885 },
  { month: "Mar", urea: 267, dap: 1360, npk: 1440, mop: 1700, ssp: 880 },
  { month: "Apr", urea: 267, dap: 1355, npk: 1450, mop: 1710, ssp: 880 },
  { month: "May", urea: 267, dap: 1350, npk: 1450, mop: 1720, ssp: 875 },
  { month: "Jun", urea: 267, dap: 1350, npk: 1450, mop: 1725, ssp: 875 },
];

const pesticidePriceData = [
  { month: "Jan", chlorpyrifos: 410, mancozeb: 680, imidacloprid: 1800, glyphosate: 550 },
  { month: "Feb", chlorpyrifos: 415, mancozeb: 680, imidacloprid: 1820, glyphosate: 545 },
  { month: "Mar", chlorpyrifos: 418, mancozeb: 680, imidacloprid: 1840, glyphosate: 540 },
  { month: "Apr", chlorpyrifos: 420, mancozeb: 680, imidacloprid: 1850, glyphosate: 538 },
  { month: "May", chlorpyrifos: 420, mancozeb: 680, imidacloprid: 1850, glyphosate: 535 },
  { month: "Jun", chlorpyrifos: 420, mancozeb: 680, imidacloprid: 1850, glyphosate: 535 },
];

interface PriceChartsProps {
  language?: Language;
}

export const PriceCharts = ({ language = 'en' }: PriceChartsProps) => {
  const [activeChart, setActiveChart] = useState<"commodities" | "fertilizer" | "pesticide">("commodities");

  interface TooltipPayloadItem {
    name?: string;
    value?: number;
    color?: string;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
          <p className="font-bold text-foreground mb-1">{label}</p>
          {payload.map((entry: TooltipPayloadItem, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: ₹{entry.value?.toLocaleString("en-IN")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Historical Price Movements (6-Month Trends)
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant={activeChart === "commodities" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("commodities")}
              className={`text-xs h-7 ${activeChart === "commodities" ? "bg-emerald-700 text-white" : ""}`}
            >
              <Wheat className="w-3.5 h-3.5 mr-1" />
              Crops (₹/Qtl)
            </Button>
            <Button
              variant={activeChart === "fertilizer" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("fertilizer")}
              className={`text-xs h-7 ${activeChart === "fertilizer" ? "bg-emerald-700 text-white" : ""}`}
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Fertilizers
            </Button>
            <Button
              variant={activeChart === "pesticide" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("pesticide")}
              className={`text-xs h-7 ${activeChart === "pesticide" ? "bg-emerald-700 text-white" : ""}`}
            >
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Pesticides
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === "commodities" ? (
              <LineChart data={commodityTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} tickFormatter={(val) => `₹${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line type="monotone" dataKey="onion" stroke="#f43f5e" strokeWidth={2.5} name="Onion" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="wheat" stroke="#059669" strokeWidth={2.5} name="Wheat" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="cotton" stroke="#8b5cf6" strokeWidth={2.5} name="Cotton" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="mustard" stroke="#eab308" strokeWidth={2.5} name="Mustard" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="soybean" stroke="#3b82f6" strokeWidth={2.5} name="Soybean" dot={{ r: 3 }} />
              </LineChart>
            ) : activeChart === "fertilizer" ? (
              <LineChart data={fertilizerPriceData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line type="monotone" dataKey="dap" stroke="#059669" strokeWidth={2} name="DAP" />
                <Line type="monotone" dataKey="npk" stroke="#eab308" strokeWidth={2} name="NPK" />
                <Line type="monotone" dataKey="mop" stroke="#3b82f6" strokeWidth={2} name="MOP" />
                <Line type="monotone" dataKey="ssp" stroke="#64748b" strokeWidth={2} name="SSP" />
                <Line type="monotone" dataKey="urea" stroke="#10b981" strokeWidth={2} name="Urea" />
              </LineChart>
            ) : (
              <BarChart data={pesticidePriceData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="imidacloprid" fill="#059669" name="Imidacloprid" radius={[2, 2, 0, 0]} />
                <Bar dataKey="mancozeb" fill="#eab308" name="Mancozeb" radius={[2, 2, 0, 0]} />
                <Bar dataKey="glyphosate" fill="#3b82f6" name="Glyphosate" radius={[2, 2, 0, 0]} />
                <Bar dataKey="chlorpyrifos" fill="#f43f5e" name="Chlorpyrifos" radius={[2, 2, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};