import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award, Calendar, MapPin } from "lucide-react";
import { getTranslation, Language } from "@/utils/translations";
import { useEffect, useState } from "react";
import { fetchFarmingSchemes, fetchWelfareSchemes } from "@/integrations/apisetu/agricoop";

interface GovernmentSchemesProps {
  searchQuery: string;
  language?: Language;
}

// Mock data for demonstration
const schemes = [
  {
    name: "PM-KISAN",
    description: "Income support of ₹6,000 per year to farmer families",
    eligibility: "Small and marginal farmers with land holding up to 2 hectares",
    amount: "₹6,000/year",
    status: "Active",
    deadline: "Ongoing",
    type: "Financial Support",
    applyUrl: "https://pmkisan.gov.in/RegistrationForm.aspx",
    infoUrl: "https://pmkisan.gov.in/"
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support to farmers",
    eligibility: "All farmers growing crops in notified areas",
    amount: "Premium subsidy as per crop",
    status: "Active",
    deadline: "As per season",
    type: "Insurance",
    applyUrl: "https://pmfby.gov.in/farmerCorner/",
    infoUrl: "https://pmfby.gov.in/"
  },
  {
    name: "Kisan Credit Card",
    description: "Credit facility for agriculture and allied activities",
    eligibility: "All farmers including sharecroppers and tenant farmers",
    amount: "Based on crop requirement",
    status: "Active",
    deadline: "Ongoing",
    type: "Credit",
    applyUrl: "https://www.myscheme.gov.in/schemes/kcc",
    infoUrl: "https://www.myscheme.gov.in/schemes/kcc"
  },
  {
    name: "Soil Health Card",
    description: "Free soil testing and recommendations for crop productivity",
    eligibility: "All farmers",
    amount: "Free",
    status: "Active",
    deadline: "Ongoing",
    type: "Technical Support",
    applyUrl: "https://soilhealth.dac.gov.in/",
    infoUrl: "https://soilhealth.dac.gov.in/"
  },
  {
    name: "National Agriculture Market (e-NAM)",
    description: "Online trading platform for agricultural commodities",
    eligibility: "All farmers, traders, and buyers",
    amount: "Market access",
    status: "Active",
    deadline: "Ongoing",
    type: "Market Access",
    applyUrl: "https://www.enam.gov.in/web/",
    infoUrl: "https://www.enam.gov.in/web/"
  },
  {
    name: "Paramparagat Krishi Vikas Yojana",
    description: "Promotion of organic farming practices",
    eligibility: "Farmers willing to adopt organic farming in clusters",
    amount: "₹50,000/ha for 3 years",
    status: "Active",
    deadline: "Ongoing",
    type: "Financial Support",
    applyUrl: "https://pgsindia-ncof.gov.in/",
    infoUrl: "https://pgsindia-ncof.gov.in/"
  },
  {
    name: "PM Krishi Sinchayee Yojana (PMKSY)",
    description: "Expanding cultivable area under assured irrigation",
    eligibility: "Farmers and water user associations as per guidelines",
    amount: "Subsidy/assistance as per component",
    status: "Active",
    deadline: "As per component",
    type: "Irrigation",
    applyUrl: "https://pmksy.gov.in/",
    infoUrl: "https://pmksy.gov.in/"
  },
  {
    name: "NABARD – DEDS (Dairy Entrepreneurship Development Scheme)",
    description: "Support for dairy farms and allied activities",
    eligibility: "Farmers, SHGs, JLGs, NGOs, companies as per norms",
    amount: "Back-ended capital subsidy as per unit",
    status: "Active",
    deadline: "Ongoing",
    type: "Dairy",
    applyUrl: "https://www.nabard.org/",
    infoUrl: "https://www.nabard.org/"
  }
];

const schemeNameMap: Record<string, Partial<Record<Language, string>>> = {
  "PM-KISAN": { hi: "पीएम-किसान", mr: "पीएम-किसान", gu: "પીએમ-કિસાન", te: "పీఎం-కిసాన్", kn: "ಪಿಎಂ-ಕಿಸಾನ್", tulu: "ಪಿಎಂ-ಕಿಸಾನ್" },
  "Pradhan Mantri Fasal Bima Yojana": { hi: "प्रधान मंत्री फसल बीमा योजना", mr: "प्रधानमंत्री पीक विमा योजना", gu: "પ્રધાનમંત્રી પાક વીમા યોજના", te: "ప్రధాన్ మంత్రి పంట బీమా యోజన", kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ", tulu: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ" },
  "Kisan Credit Card": { hi: "किसान क्रेडिट कार्ड", mr: "किसान क्रेडिट कार्ड", gu: "કિસાન ક્રેડિટ કાર્ડ", te: "కిసాన్ క్రెడిట్ కార్డ్", kn: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್", tulu: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್" },
  "Soil Health Card": { hi: "मृदा स्वास्थ्य कार्ड", mr: "मृदा आरोग्य कार्ड", gu: "માટી આરોગ્ય કાર્ડ", te: "మట్టి ఆరోగ్య కార్డు", kn: "ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್", tulu: "ಮಣ್ಣುದ ಆರೋಗ್ಯ ಕಾರ್ಡ್" },
  "National Agriculture Market (e-NAM)": { hi: "राष्ट्रीय कृषि बाजार (e-NAM)", mr: "राष्ट्रीय कृषि बाजार (e-NAM)", gu: "રાષ્ટ્રીય કૃષિ બજાર (e-NAM)", te: "జాతీయ వ్యవసాయ మార్కెట్ (e-NAM)", kn: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ (e-NAM)", tulu: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ (e-NAM)" },
  "Paramparagat Krishi Vikas Yojana": { hi: "परम्परागत कृषि विकास योजना", mr: "परंपरागत कृषि विकास योजना", gu: "પરંપરાગત કૃષિ વિકાસ યોજના", te: "పరంపరాగత కృషి వికాస్ యోజన", kn: "ಸಾಂಪ್ರದಾಯಿಕ ಕೃಷಿ ವಿಕಾಸ ಯೋಜನೆ", tulu: "ಸಾಂಪ್ರದಾಯಿಕ ಕೃಷಿ ವಿಕಾಸ ಯೋಜನೆ" },
};

const schemeDescMap: Record<string, Partial<Record<Language, string>>> = {
  "Income support of ₹6,000 per year to farmer families": {
    hi: "किसान परिवारों को ₹6,000/वर्ष की आय सहायता",
    mr: "शेतकरी कुटुंबांना ₹6,000/वर्ष उत्पन्न सहाय्य",
    gu: "ખેડૂત પરિવારોને ₹6,000/વર્ષની આવક સહાય",
    te: "రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 ఆదాయ సహాయం",
    kn: "ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವಾರ್ಷಿಕ ₹6,000 ಆದಾಯ ನೆರವು",
    tulu: "ರೈತರೆ ಕುಟುಂಬೊಲೆಗ್ ವರ್ಷೊಗು ₹6,000 ಆದಾಯ ಸಹಾಯ"
  },
  "Crop insurance scheme providing financial support to farmers": {
    hi: "किसानों को वित्तीय सहायता प्रदान करने वाली फसल बीमा योजना",
    mr: "शेतकऱ्यांना आर्थिक मदत देणारी पीक विमा योजना",
    gu: "ખેડૂતોને આર્થિક સહાય આપતી પાક વીમા યોજના",
    te: "రైతులకు ఆర్థిక సహాయం అందించే పంట బీమా పథకం",
    kn: "ರೈತರಿಗೆ ಆರ್ಥಿಕ ನೆರವು ನೀಡುವ ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ",
    tulu: "ರೈತೆರೆಗ್ ಆರ್ಥಿಕ ಸಹಾಯ ಕೊರ್ಪುನ ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ"
  },
  "Credit facility for agriculture and allied activities": {
    hi: "कृषि और संबद्ध गतिविधियों के लिए ऋण सुविधा",
    mr: "कृषी व संलग्न उपक्रमांसाठी कर्ज सुविधा",
    gu: "કૃષિ અને સંબંધિત પ્રવૃત્તિઓ માટે લોન સુવિધા",
    te: "వ్యవసాయం మరియు అనుబంధ కార్యకలాపాలకు రుణ సౌకర్యం",
    kn: "ಕೃಷಿ ಮತ್ತು ಸಂಬಂಧಿತ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸಾಲ ಸೌಲಭ್ಯ",
    tulu: "ಕೃಷಿ ಬೊಕ್ಕ ಸಂಬಂಧ ಪಟ್ಟಿನ ಕೆಲಸೊಲೆಗ್ ಸಾಲ ಸೌಲಭ್ಯ"
  },
  "Free soil testing and recommendations for crop productivity": {
    hi: "फसल उत्पादकता के लिए मुफ्त मिट्टी परीक्षण और सिफारिशें",
    mr: "पीक उत्पादकतेसाठी विनामूल्य मृदा परीक्षण आणि शिफारसी",
    gu: "પાક ઉત્પાદકતા માટે મફત માટી પરીક્ષણ અને ભલામણો",
    te: "పంట ఉత్పాదకత కోసం ఉచిత మట్టి పరీక్షలు మరియు సిఫారసులు",
    kn: "ಬೆಳೆ ಇಳುವರಿ ಹೆಚ್ಚಿಸಲು ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಸಲಹೆಗಳು",
    tulu: "ಬೆಳೆ ಜಾಸ್ತಿ ಮಲ್ಪೆರೆ ಉಚಿತ ಮಣ್ಣುದ ಪರೀಕ್ಷೆ ಬೊಕ್ಕ ಸಲಹೆಲು"
  },
  "Online trading platform for agricultural commodities": {
    hi: "कृषि वस्तुओं के लिए ऑनलाइन ट्रेडिंग प्लेटफॉर्म",
    mr: "कृषी वस्तूंसाठी ऑनलाइन ट्रेडिंग प्लॅटफॉर्म",
    gu: "કૃષિ પદાર્થો માટે ઑનલાઇન ટ્રેડિંગ પ્લેટફોર્મ",
    te: "వ్యవసాయ సరుకుల కోసం ఆన్‌లైన్ ట్రేడింగ్ ప్లాట్‌ಫಾರమ్",
    kn: "ಕೃಷಿ ಉತ್ಪನ್ನಗಳಿಗಾಗಿ ಆನ್‌ಲೈನ್ ವ್ಯಾಪಾರ ವೇದಿಕೆ",
    tulu: "ಕೃಷಿ ವಸ್ತುಲೆಗ್ ಆನ್‌ಲೈನ್ ವ್ಯಾಪಾರ ವೇದಿಕೆ"
  },
  "Promotion of organic farming practices": {
    hi: "जैविक खेती के प्रोत्साहन",
    mr: "सेंद्रिय शेतीच्या प्रोत्साहनासाठी",
    gu: "સેંદ્રીય ખેતીને પ્રોત્સાહન",
    te: "సేంద్రీయ వ్యవసాయానికి ప్రోత్సాహం",
    kn: "ಸಾವಯವ ಕೃಷಿ ಪದ್ಧತಿಗಳಿಗೆ ಉತ್ತೇಜನ",
    tulu: "ಸಾವಯವ ಕೃಷಿ ಕ್ರಮಲೆಗ್ ಪ್ರೋತ್ಸಾಹ"
  }
};

export const GovernmentSchemes = ({ searchQuery, language = 'en' }: GovernmentSchemesProps) => {
  const [liveSchemes, setLiveSchemes] = useState<typeof schemes | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const [farming, welfare] = await Promise.all([
        fetchFarmingSchemes(),
        fetchWelfareSchemes(),
      ]);
      if (!isMounted) return;
      const apiItems = [...(farming || []), ...(welfare || [])];
      if (apiItems && apiItems.length) {
        // Map API response into UI schema as best-effort
        const mapped = apiItems.map((item) => ({
          name: item.name || "Scheme",
          description: item.description || "",
          eligibility: item.department || "",
          amount: "",
          status: "Active",
          deadline: "Ongoing",
          type: item.category || "General",
          infoUrl: item.url || undefined,
        })) as typeof schemes;
        setLiveSchemes(mapped);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const source = liveSchemes && liveSchemes.length ? liveSchemes : schemes;

  const filteredSchemes = source.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Financial Support":
        return "bg-success/10 text-success border-success";
      case "Insurance":
        return "bg-info/10 text-info border-info";
      case "Credit":
        return "bg-warning/10 text-warning border-warning";
      case "Technical Support":
        return "bg-accent/10 text-accent border-accent";
      case "Market Access":
        return "bg-primary/10 text-primary border-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          {getTranslation('governmentSchemes', language)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredSchemes.map((scheme, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{schemeNameMap[scheme.name]?.[language] || scheme.name}</h4>
                  <Badge variant="outline" className={getTypeColor(scheme.type)}>
                    {scheme.type}
                  </Badge>
                </div>
                <Badge variant={scheme.status === "Active" ? "default" : "secondary"} 
                       className={scheme.status === "Active" ? "bg-success text-success-foreground" : ""}>
                  {scheme.status}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{schemeDescMap[scheme.description]?.[language] || scheme.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{getTranslation('eligibility', language)}:</span>
                  <span className="text-foreground">{scheme.eligibility}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{getTranslation('active', language)}:</span>
                    <span className="text-foreground">{scheme.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{getTranslation('benefits', language)}:</span>
                    <span className="font-semibold text-success">{scheme.amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                {"applyUrl" in scheme ? (
                  <Button asChild size="sm" variant="default" className="flex items-center gap-1 text-xs bg-emerald-700 hover:bg-emerald-800 text-white">
                    <a href={(scheme as { applyUrl: string }).applyUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Apply Online
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled className="flex items-center gap-1 text-xs">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Apply Online
                  </Button>
                )}

                {"infoUrl" in scheme ? (
                  <Button asChild size="sm" variant="outline" className="text-xs">
                    <a href={(scheme as { infoUrl: string }).infoUrl} target="_blank" rel="noopener noreferrer">
                      Official Portal
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" disabled className="text-xs">
                    Official Portal
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};