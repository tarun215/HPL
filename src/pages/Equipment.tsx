import { Header } from "@/components/Header";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useEffect, useState } from "react";
import { Language } from "@/utils/translations";
import FarmingEquipment from "@/components/FarmingEquipment";

const EquipmentPage = () => {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("app_language") as Language) || "en");
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
      <Header searchQuery={""} setSearchQuery={() => {}} language={language} />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-end">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>
        <FarmingEquipment language={language} />
      </main>
    </div>
  );
};

export default EquipmentPage;


