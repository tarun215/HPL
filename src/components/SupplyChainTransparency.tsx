import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Warehouse, 
  Truck, 
  Landmark, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  DollarSign,
  HelpCircle,
  Building,
  ArrowRight
} from "lucide-react";
import { 
  WAREHOUSE_FACILITIES, 
  TRANSPORT_VEHICLES, 
  WarehouseFacility, 
  TransportVehicle 
} from "@/data/ruralMarketData";
import { Language } from "@/utils/translations";
import { getMarketTranslation } from "@/utils/marketTranslations";
import { toast } from "sonner";

interface SupplyChainTransparencyProps {
  language: Language;
}

export const SupplyChainTransparency = ({ language = "en" }: SupplyChainTransparencyProps) => {
  // e-NWR Loan Calculator State
  const [pledgeQuantityQtl, setPledgeQuantityQtl] = useState<number>(100);
  const [commodityMarketRate, setCommodityMarketRate] = useState<number>(2850); // ₹/Qtl for Onion/Wheat
  const [storageMonths, setStorageMonths] = useState<number>(3);

  // e-NWR calculations: 70% Loan-to-Value (LTV) at 7% p.a. agri loan interest
  const totalStockValue = pledgeQuantityQtl * commodityMarketRate;
  const eligibleLoanAmount = Math.round(totalStockValue * 0.70);
  const estimatedStorageRent = pledgeQuantityQtl * 16 * storageMonths;
  const monthlyInterest = Math.round((eligibleLoanAmount * 0.07) / 12);

  const handleBookWarehouse = (wh: WarehouseFacility) => {
    toast.success(`Space inquiry submitted to ${wh.name}! Manager contact: ${wh.contactNumber}`);
  };

  const handleBookTransport = (vehicle: TransportVehicle) => {
    toast.success(`Transporter dispatch request initiated for ${vehicle.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-50/40 via-background to-teal-50/30 dark:from-emerald-950/20 dark:to-background">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-600 text-white text-xs">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Supply Chain Transparency
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  WDRA Accredited & Zero Commission Enforced
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                🚚 {getMarketTranslation("tabSupplyChain", language)}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Statutory APMC fee audits, verified cold chain infrastructure, and instant credit pledge loans against warehouse receipts.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* APMC Statutory Fee Audit Card (Prevents Middleman Exploitation) */}
      <Card className="border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm">
        <CardHeader className="pb-3 border-b border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              {getMarketTranslation("feeAuditTitle", language)}
            </CardTitle>
            <Badge className="bg-emerald-700 text-white text-xs font-semibold">
              Statutory Gazette Standard
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {getMarketTranslation("feeAuditDesc", language)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fee 1: Mandi Cess */}
            <div className="p-3 bg-card border rounded-lg space-y-1">
              <span className="text-xs font-semibold text-muted-foreground block">
                1. APMC Mandi Cess
              </span>
              <div className="text-lg font-bold text-foreground">1.0% to 1.5%</div>
              <p className="text-[11px] text-muted-foreground">
                Statutory state cess applied to gross transaction value.
              </p>
            </div>

            {/* Fee 2: Hamali & Labour */}
            <div className="p-3 bg-card border rounded-lg space-y-1">
              <span className="text-xs font-semibold text-muted-foreground block">
                2. Standard Hamali / Labour
              </span>
              <div className="text-lg font-bold text-foreground">₹12 - ₹16 / Qtl</div>
              <p className="text-[11px] text-muted-foreground">
                Unloading, cleaning, and bag stitching charges.
              </p>
            </div>

            {/* Fee 3: Middleman Commission (Zero for Farmers) */}
            <div className="p-3 bg-emerald-100/60 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> 3. Farmer Commission
              </span>
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                0% (STRICTLY PROHIBITED)
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                {getMarketTranslation("zeroCommissionRule", language)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Columns: e-NWR Warehouse Loan Estimator & WDRA Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: e-NWR Pledge Loan Calculator (5 Cols) */}
        <Card className="lg:col-span-5 border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              e-NWR Warehouse Receipt Loan Estimator
            </CardTitle>
            <CardDescription className="text-xs">
              Avoid distress sale at harvest. Store produce in WDRA warehouse & borrow up to 70% value.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Stock Quantity to Store (Quintals)
              </Label>
              <Input
                type="number"
                value={pledgeQuantityQtl}
                onChange={(e) => setPledgeQuantityQtl(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Current Mandi Rate (₹/Qtl)
              </Label>
              <Input
                type="number"
                value={commodityMarketRate}
                onChange={(e) => setCommodityMarketRate(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Planned Holding Period (Months)
              </Label>
              <Select value={String(storageMonths)} onValueChange={(val) => setStorageMonths(Number(val))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="2">2 Months</SelectItem>
                  <SelectItem value="3">3 Months (Recommended)</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Box */}
            <div className="bg-muted/60 dark:bg-muted/30 rounded-lg p-3 space-y-2 border text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Stock Value:</span>
                <span className="font-semibold text-foreground">₹{totalStockValue.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  Eligible Bank Loan (70% LTV):
                </span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                  ₹{eligibleLoanAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>Est. Storage Fee ({storageMonths} mo):</span>
                <span>₹{estimatedStorageRent.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>Est. Monthly Interest (@7% p.a.):</span>
                <span>₹{monthlyInterest}/month</span>
              </div>
            </div>

            <Button
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
              onClick={() => toast.success("Bank e-NWR loan facilitation desk connected!")}
            >
              Apply for e-NWR Loan Facilitation
            </Button>
          </CardContent>
        </Card>

        {/* Right: Verified Warehouses & Cold Storages Directory (7 Cols) */}
        <Card className="lg:col-span-7 border shadow-sm">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-emerald-600" />
                {getMarketTranslation("warehouseFinder", language)}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                WDRA Registered
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {WAREHOUSE_FACILITIES.map((wh) => (
              <div key={wh.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">{wh.name}</h4>
                    <Badge variant="secondary" className="text-[10px]">
                      {wh.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {wh.location}, {wh.district} • {wh.distanceKm} km away
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                    <span>Temp: <strong>{wh.tempRange}</strong></span>
                    <span>•</span>
                    <span>Rate: <strong className="text-foreground">₹{wh.monthlyRentPerQtl}/Qtl/mo</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">⭐ {wh.rating} / 5.0</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                    {wh.availableCapacityTonnes} Tonnes Free
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBookWarehouse(wh)}
                    className="h-7 text-xs border-emerald-300 hover:bg-emerald-50 text-emerald-800"
                  >
                    {getMarketTranslation("bookSpace", language)}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Transporter Fleet & Direct Booking Directory */}
      <Card className="border">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                Rural Transporter Fleet & Direct Freight Estimator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Standardized per-km freight rates with verified local agri-logistics drivers.
              </CardDescription>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs">
              Live Fleet Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRANSPORT_VEHICLES.slice(0, 3).map((v) => (
            <div key={v.id} className="p-3 bg-muted/40 rounded-lg border space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{v.name}</h4>
                  <Badge variant="outline" className="text-[10px]">
                    {v.capacityQuintals} Qtl
                  </Badge>
                </div>
                <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                  ₹{v.ratePerKm}/km
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    (Base: ₹{v.baseFare})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {v.recommendedFor}
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => handleBookTransport(v)}
                className="w-full h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white mt-2"
              >
                Request Transporter Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
