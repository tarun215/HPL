import { useState } from "react";
import { Search, Menu, Bell, X, TrendingUp, User, Calculator, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
      title: "Adi Udupi APMC — Tomato Arbitrage Spurt",
      description:
        "Modal rate +2.3% today (₹2,200/Qtl). Coastal buyers actively procuring from Bantakal cluster.",
      time: "15 mins ago",
      type: "bullish",
      crop: "Tomato",
    },
    {
      id: "alert-2",
      title: "Mattu Gulla — Peak Harvest Window",
      description:
        "Mangaluru Bunder buyers seeking GI-tagged Mattu Gulla. ₹5,800/Qtl. Sell before 11 AM.",
      time: "42 mins ago",
      type: "warning",
      crop: "Mattu Gulla",
    },
  ];

  const handleNavClick = (tabKey: string) => {
    // Dispatch event to switch tab inside MarketIntelligenceDashboard
    window.dispatchEvent(new CustomEvent("switch_dashboard_tab", { detail: tabKey }));

    // Smoothly scroll down to dashboard tabs
    const targetElement = document.getElementById("dashboard-tabs-container");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navLinks = [
    {
      tab: "discovery",
      label: "Arbitrage & Mandi Intelligence",
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />,
      id: "nav-mandi-intelligence",
    },
    {
      tab: "calculator",
      label: "Net Revenue Maximizer",
      icon: <Calculator className="w-3.5 h-3.5 text-amber-600" />,
      id: "nav-net-revenue",
    },
    {
      tab: "calculator", // Points to calculator where Shared Freight Pooling switch lives
      label: "Pooling Cluster Radar",
      icon: <Truck className="w-3.5 h-3.5 text-blue-600" />,
      id: "nav-pooling-radar",
    },
  ];

  return (
    <>
      <header
        className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm"
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo & Brand */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              aria-label="VajraYield Home"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-emerald-500/20 bg-white">
                <img
                  src="/vajrayield.jpeg"
                  alt="VajraYield Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-foreground tracking-tight group-hover:text-emerald-700 transition-colors">
                    VajraYield
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                  Rural Market Intelligence · Build For Udupi!
                </p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-2 sm:mx-6 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search-mandi-data"
                  placeholder={getTranslation("searchPlaceholder", language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 h-9 bg-muted/60 focus:bg-background border-muted-foreground/20 rounded-lg text-xs"
                  aria-label="Search Udupi mandi data and commodities"
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

            {/* Desktop Navigation — Safe Tab Navigation (No 404s) */}
            <nav
              className="hidden lg:flex items-center space-x-1"
              aria-label="Primary Navigation — VajraYield"
            >
              {navLinks.map((link) => (
                <Button
                  key={link.id}
                  id={link.id}
                  onClick={() => handleNavClick(link.tab)}
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold flex items-center gap-1 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
                >
                  {link.icon}
                  {link.label}
                </Button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAlertsOpen(true)}
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
                aria-label="View active Udupi mandi price alerts"
                title="Price alerts"
                id="btn-price-alerts"
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
                  id="btn-farmer-profile"
                >
                  <User className="w-4 h-4" />
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-9 w-9 text-muted-foreground"
                aria-label="Toggle mobile navigation menu"
                aria-expanded={isMobileMenuOpen}
                id="btn-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-3 border-t space-y-2" role="navigation" aria-label="Mobile Navigation">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={getTranslation("searchPlaceholder", language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-muted/60 text-xs"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs font-medium gap-2"
                    onClick={() => {
                      handleNavClick(link.tab);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Price Alerts Modal */}
      <Dialog open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Bell className="w-5 h-5 text-amber-500" />
              Live Udupi Mandi Price Alerts
            </DialogTitle>
            <DialogDescription className="text-xs">
              Automated triggers based on AGMARKNET arrivals, APMC price surges, and Bantakal cluster buyer requisitions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-muted/50 rounded-lg border border-border space-y-1"
                role="listitem"
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
                <p className="text-xs text-muted-foreground">{alert.description}</p>
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
              id="btn-configure-sms-alerts"
            >
              Configure SMS Alerts
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAlertsOpen(false)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
              id="btn-dismiss-alerts"
            >
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};