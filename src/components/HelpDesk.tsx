import { useState } from "react";
import { getTranslation, Language } from "@/utils/translations";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Send, Phone, Mail, MessageCircle, Clock } from "lucide-react";

interface HelpDeskProps {
  language: Language;
}

export const HelpDesk = ({ language }: HelpDeskProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !category || !query.trim()) {
      return;
    }
    setIsSubmitted(true);
    toast.success("Query submitted! Reference ticket generated and forwarded to local Krishi officer.");
    // Reset form after 4 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setQuery("");
      setCategory("");
      setName("");
      setEmail("");
    }, 4000);
  };

  const quickActions = [
    {
      title: "Kisan Call Center (Toll-Free)",
      description: "1800-180-1551",
      icon: <Phone className="w-5 h-5" />,
      available: "24/7 Free",
      href: "tel:18001801551"
    },
    {
      title: "Email Support Desk",
      description: "support@krishirates.gov.in",
      icon: <Mail className="w-5 h-5" />,
      available: "Business Hours",
      href: "mailto:support@krishirates.gov.in"
    },
    {
      title: "Farmer WhatsApp Assistance",
      description: "+91-98765-43210",
      icon: <MessageCircle className="w-5 h-5" />,
      available: "9 AM - 6 PM",
      href: "https://wa.me/919876543210?text=Hello%20Krishi%20Helpdesk,%20I%20need%20assistance"
    }
  ];

  const categories = [
    "Mandi Rate Inquiry",
    "Fertilizer Information",
    "Pesticide Guidance",
    "Government Schemes",
    "Technical Support",
    "Market Access",
    "Payment Issues",
    "Other"
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          {getTranslation('helpDesk', language)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Quick Contact Channels</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    target={action.href.startsWith("http") ? "_blank" : undefined}
                    rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/80 rounded-lg border border-border transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-700 dark:text-emerald-300 group-hover:scale-105 transition-transform">
                        {action.icon}
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-foreground group-hover:text-emerald-700 transition-colors">{action.title}</h5>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-emerald-400 text-emerald-700 dark:text-emerald-300">
                      <Clock className="w-3 h-3 mr-1" />
                      {action.available}
                    </Badge>
                  </a>
                ))}
              </div>
            </div>

            {/* Query Form */}
            <div>
              <h4 className="font-medium text-foreground mb-3">{getTranslation('submitQuery', language)}</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {getTranslation('name', language)} *
                  </label>
                  <Input
                    placeholder={getTranslation('enterName', language)}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {getTranslation('email', language)} *
                  </label>
                  <Input
                    type="email"
                    placeholder={getTranslation('enterEmail', language)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Category *
                  </label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select query category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {getTranslation('query', language)} *
                  </label>
                  <Textarea
                    placeholder={getTranslation('describeQuery', language)}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!name.trim() || !email.trim() || !category || !query.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {getTranslation('submit', language)}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-success" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Query Submitted Successfully!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Your query has been forwarded to the government support team. 
              You will receive a response within 24-48 hours.
            </p>
            <Badge className="bg-success text-success-foreground">
              Reference ID: KMP-{Date.now().toString().slice(-6)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};