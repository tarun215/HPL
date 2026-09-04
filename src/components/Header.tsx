import { useState } from "react";
import { Search, Menu, Bell, X, CloudSun, Sprout, Tractor, HelpCircle, ArrowUpRight, TrendingUp, CheckCircle2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Language, getTranslation } from "@/utils/translations";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: Language;
}

export const Header = ({ searchQuery, setSearchQuery, language }: HeaderProps) => {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const activeAlerts = [
    {
      id: "alert-1",
      title: "Lasalgaon Mandi Onion Arbitrage Spurt",
      description: "Modal rate jumped +4.6% today (₹2,850/Qtl). Demand is high from southern buyers.",
      time: "15 mins ago",
      type: "bullish",
      crop: "Onion"
    },
    {
      id: "alert-2",
      title: "Pimpalgaon Tomato Heavy Arrivals",
      description: "Peak morning arrivals (1,450 tonnes). Gate congestion moderate (~1.2h queue).",
      time: "1 hour ago",
      type: "warning",
      crop: "Tomato"
    }
  ];

  return (
    <>
      <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo & Title */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl" role="img" aria-label="Wheat harvest icon">🌾</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-foreground tracking-tight group-hover:text-emerald-700 transition-colors">
                    Krishi Rates
                  </span>
                  <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 font-semibold">
                    PS 02
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Rural Market Intelligence Platform
                </p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-2 sm:mx-6 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={getTranslation('searchPlaceholder', language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 h-9 bg-muted/60 focus:bg-background border-muted-foreground/20 rounded-lg text-xs"
                  aria-label="Search agricultural market data"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              <Link to="/">
                <Button 
                  variant={location.pathname === "/" ? "secondary" : "ghost"} 
                  size="sm" 
                  className={`text-xs font-semibold ${location.pathname === "/" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : ""}`}
                >
                  Mandi Intelligence
                </Button>
              </Link>
              <Link to="/weather">
                <Button 
                  variant={location.pathname === "/weather" ? "secondary" : "ghost"} 
                  size="sm" 
                  className="text-xs font-medium flex items-center gap-1"
                >
                  <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                  {getTranslation('weather', language)}
                </Button>
              </Link>
              <Link to="/crop-care">
                <Button 
                  variant={location.pathname === "/crop-care" ? "secondary" : "ghost"} 
                  size="sm" 
                  className="text-xs font-medium flex items-center gap-1"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  {getTranslation('CropCare', language)}
                </Button>
              </Link>
              <Link to="/equipment">
                <Button 
                  variant={location.pathname === "/equipment" ? "secondary" : "ghost"} 
                  size="sm" 
                  className="text-xs font-medium flex items-center gap-1"
                >
                  <Tractor className="w-3.5 h-3.5 text-blue-600" />
                  Machinery
                </Button>
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAlertsOpen(true)}
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
                aria-label="View active mandi price alerts"
                title="Price alerts"
              >
                <Bell className="w-4 h-4" />
                <Badge className="absolute top-1 right-1 w-4 h-4 p-0 text-[10px] flex items-center justify-center bg-amber-500 text-white font-bold">
                  2
                </Badge>
              </Button>

              <Link to="/profile">
                <Button
                  variant={location.pathname === "/profile" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  aria-label="Farmer profile and watchlist settings"
                  title="Farmer profile"
                >
                  <User className="w-4 h-4" />
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-9 w-9 text-muted-foreground"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-3 border-t space-y-2">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={getTranslation('searchPlaceholder', language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-muted/60 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs font-medium">
                    🌾 Mandi Intelligence
                  </Button>
                </Link>
                <Link to="/weather" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs font-medium">
                    ☀️ {getTranslation('weather', language)}
                  </Button>
                </Link>
                <Link to="/crop-care" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs font-medium">
                    🌱 {getTranslation('CropCare', language)}
                  </Button>
                </Link>
                <Link to="/equipment" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs font-medium">
                    🚜 Machinery
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Price Alerts Modal Dialog */}
      <Dialog open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Bell className="w-5 h-5 text-amber-500" />
              Live Mandi Price & Arrival Alerts
            </DialogTitle>
            <DialogDescription className="text-xs">
              Automated triggers based on AGMARKNET arrivals, APMC price surges, and buyer requisitions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {activeAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="p-3 bg-muted/50 rounded-lg border border-border space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    {alert.title}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {alert.time}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {alert.description}
                </p>
              </div>
            ))}
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAlertsOpen(false);
                toast.success("Price alert preferences saved to SMS/WhatsApp!");
              }}
              className="text-xs"
            >
              Configure SMS Alerts
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAlertsOpen(false)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
            >
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};