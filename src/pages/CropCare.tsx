import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CropSelector } from '@/components/CropSelector';
import { FertilizerRecommendations } from '@/components/FertilizerRecommendations';
import { PesticideRecommendations } from '@/components/PesticideRecommendations';
import { DiseasePrevention } from '@/components/DiseasePrevention';
import { MixtureRecommendations } from '@/components/MixtureRecommendations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Shield, 
  Heart, 
  Calendar,
  Sun,
  Droplets,
  Info,
  Beaker,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Language, getTranslation, translatePhrase } from '@/utils/translations';
import { CropCareInfo, cropCareData } from '@/data/cropCareData';

const CropCare = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropCareInfo | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<Language>(() => 
    (localStorage.getItem("app_language") as Language) || "en"
  );

  // Auto-select first crop on mount
  useEffect(() => {
    if (!selectedCrop && cropCareData.length > 0) {
      setSelectedCrop(cropCareData[0]);
    }
  }, [selectedCrop]);

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

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} language={language} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-10 border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Agronomic Decision Support System
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight">
              {getTranslation('cropCareTitle', language) || 'Crop Care & Protection Guide'}
            </h1>
            <p className="text-sm lg:text-base text-emerald-100 font-medium">
              {getTranslation('cropCareSubtitle', language) || 'Expert recommendations for fertilizers, pesticides, disease prevention, and spray tank mixtures.'}
            </p>
            <div className="flex justify-center pt-2">
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Crop Selection */}
        <CropSelector 
          selectedCrop={selectedCrop}
          onCropSelect={setSelectedCrop}
          language={language}
        />

        {selectedCrop && (
          <div className="space-y-6">
            {/* Tabbed Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
              <div className="bg-card border rounded-xl p-1.5 shadow-sm overflow-x-auto">
                <TabsList className="flex w-full min-w-max justify-start md:grid md:grid-cols-6 h-auto gap-1 bg-transparent p-0">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="fertilizers"
                    className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg"
                  >
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Fertilizers</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="pesticides"
                    className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Pesticides</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="diseases"
                    className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Disease Prevention</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="mixtures"
                    className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg"
                  >
                    <Beaker className="w-3.5 h-3.5" />
                    <span>Tank Mixtures</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="stages"
                    className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Growth Calendar</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab 1: Overview */}
              <TabsContent value="overview" className="m-0 space-y-6">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                      {selectedCrop.cropName} - {getTranslation('overview', language) || 'Agronomic Overview'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Ideal climate, seasonal sowing cycles, temperature, and moisture parameters.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/40 rounded-lg border">
                        <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2.5">
                          <Calendar className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <h3 className="font-bold text-sm text-foreground mb-1">{getTranslation('season', language) || 'Season'}</h3>
                        <div className="flex flex-wrap justify-center gap-1">
                          {selectedCrop.season.map((season) => (
                            <Badge key={season} variant="outline" className="text-xs">
                              {season}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-muted/40 rounded-lg border">
                        <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2.5">
                          <Sun className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                        </div>
                        <h3 className="font-bold text-sm text-foreground mb-1">{getTranslation('temperature', language) || 'Optimal Temperature'}</h3>
                        <p className="text-xs text-muted-foreground font-medium">{selectedCrop.temperature}</p>
                      </div>
                      
                      <div className="text-center p-4 bg-muted/40 rounded-lg border">
                        <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2.5">
                          <Droplets className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                        </div>
                        <h3 className="font-bold text-sm text-foreground mb-1">{getTranslation('rainfall', language) || 'Water Requirement'}</h3>
                        <p className="text-xs text-muted-foreground font-medium">{selectedCrop.rainfall}</p>
                      </div>
                    </div>

                    {/* General Agronomic Tips */}
                    <div className="mt-6 pt-6 border-t space-y-3">
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-emerald-600" />
                        Best Agricultural Practices for {selectedCrop.cropName}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {selectedCrop.generalTips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-2 p-2.5 bg-muted/30 rounded border text-xs">
                            <span className="text-emerald-600 font-bold mt-0.5">•</span>
                            <span className="text-foreground">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 2: Fertilizers */}
              <TabsContent value="fertilizers" className="m-0">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                      {getTranslation('fertilizerRecommendations', language) || 'Fertilizer Recommendations & Dosage'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Basal and split-application nutritional requirements for maximum yield.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FertilizerRecommendations crop={selectedCrop} language={language} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 3: Pesticides */}
              <TabsContent value="pesticides" className="m-0">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      {getTranslation('pesticideRecommendations', language) || 'Targeted Pesticides & Pest Management'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Registered active ingredients, dosage per acre, and withholding waiting periods.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PesticideRecommendations crop={selectedCrop} language={language} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 4: Disease Prevention */}
              <TabsContent value="diseases" className="m-0">
                <DiseasePrevention crop={selectedCrop} language={language} />
              </TabsContent>

              {/* Tab 5: Tank Mixtures */}
              <TabsContent value="mixtures" className="m-0">
                <MixtureRecommendations crop={selectedCrop} language={language} />
              </TabsContent>

              {/* Tab 6: Growth Stages */}
              <TabsContent value="stages" className="m-0">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      {getTranslation('growthStages', language) || 'Growth Stage Milestones'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Stage-by-stage agronomic actions from land preparation to harvest.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCrop.growthStages.map((stage, index) => (
                        <div key={index} className="border-l-4 border-l-emerald-600 pl-4 py-2 bg-muted/20 rounded-r-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-bold text-foreground">{stage.stage}</h3>
                            <Badge variant="outline" className="text-xs">{stage.duration}</Badge>
                          </div>
                          <ul className="text-xs space-y-1.5">
                            {stage.care.map((careItem, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span className="text-muted-foreground">{careItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* No Crop Selected State */}
        {!selectedCrop && (
          <Card className="text-center py-12">
            <CardContent>
              <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {getTranslation('selectCropToStart', language) || 'Select a crop to get started'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {getTranslation('selectCropDescription', language) || 'Choose a crop from the dropdown above to view detailed care recommendations, fertilizer suggestions, pesticide information, and disease prevention tips.'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CropCare;
