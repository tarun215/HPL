import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, MapPin, Bell, ShieldCheck, Save, CheckCircle2, Sprout, Tractor, Phone } from "lucide-react";
import { Language, getTranslation } from "@/utils/translations";
import { MASTER_MANDIS, RURAL_COMMODITIES } from "@/data/ruralMarketData";
import { toast } from "sonner";

const Profile = () => {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("app_language") as Language) || "en");
  const [farmerName, setFarmerName] = useState(() => localStorage.getItem("farmer_name") || "Ramesh Patil");
  const [phone, setPhone] = useState(() => localStorage.getItem("farmer_phone") || "+91 98220 12345");
  const [landAcres, setLandAcres] = useState(() => localStorage.getItem("farmer_land_acres") || "12");
  const [defaultMandi, setDefaultMandi] = useState(() => localStorage.getItem("farmer_default_mandi") || "mandi_lasalgaon");
  const [primaryCrop, setPrimaryCrop] = useState(() => localStorage.getItem("farmer_primary_crop") || "onion");
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSaveProfile = () => {
    localStorage.setItem("farmer_name", farmerName);
    localStorage.setItem("farmer_phone", phone);
    localStorage.setItem("farmer_land_acres", landAcres);
    localStorage.setItem("farmer_default_mandi", defaultMandi);
    localStorage.setItem("farmer_primary_crop", primaryCrop);
    toast.success("Farmer Profile & Mandi Preferences updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} language={language} />

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Profile Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black border border-white/30">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{farmerName}</h1>
                <Badge className="bg-emerald-500 text-white text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Farmer
                </Badge>
              </div>
              <p className="text-xs text-emerald-100 mt-1">
                Kisan ID: KISAN-MH-NSK-4491 • Bantakal Agri Cluster
              </p>
            </div>
          </div>

          <Button
            onClick={handleSaveProfile}
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold text-xs h-9 flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </div>

        {/* Profile Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Farmer & Farm Info */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Farmer Details & Landholding
              </CardTitle>
              <CardDescription className="text-xs">
                Your personal farm details used for personalized mandi intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Farmer Full Name</Label>
                <Input
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Enter full name"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mobile Number (For Price Alerts)</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 Phone number"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Total Cultivable Land (Acres)</Label>
                <Input
                  type="number"
                  value={landAcres}
                  onChange={(e) => setLandAcres(e.target.value)}
                  placeholder="Acres"
                  className="h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Market & Crop Watchlist */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Mandi & Crop Watchlist Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Your primary APMC benchmark and staple crops for net profit calculations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Benchmark Mandi</Label>
                <Select value={defaultMandi} onValueChange={setDefaultMandi}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select primary mandi" />
                  </SelectTrigger>
                  <SelectContent>
                    {MASTER_MANDIS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name.split("(")[0]} ({m.district})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Cash Crop</Label>
                <Select value={primaryCrop} onValueChange={setPrimaryCrop}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select primary crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {RURAL_COMMODITIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} (Modal: ₹{c.modalPrice}/Qtl)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notification Toggles */}
              <div className="pt-2 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold block">WhatsApp Price Surge Alerts</Label>
                    <span className="text-[11px] text-muted-foreground">Receive instant notifications when rates jump &gt;4%</span>
                  </div>
                  <Switch checked={whatsappAlerts} onCheckedChange={setWhatsappAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold block">SMS Mandi Summary</Label>
                    <span className="text-[11px] text-muted-foreground">Daily 6:00 PM APMC arrival bulletin</span>
                  </div>
                  <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
