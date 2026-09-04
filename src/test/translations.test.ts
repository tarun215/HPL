import { describe, it, expect } from "vitest";
import { getTranslation, translateItemName } from "../utils/translations";
import { getMarketTranslation } from "../utils/marketTranslations";

describe("Multilingual Localization & Accessibility", () => {
  it("should return correct English translations", () => {
    expect(getTranslation("mandiRates", "en")).toBe("Mandi Rates");
    expect(getTranslation("weather", "en")).toBe("Weather");
    expect(getTranslation("CropCare", "en")).toBe("Crop Care");
  });

  it("should return correct Hindi translations", () => {
    expect(getTranslation("mandiRates", "hi")).toBe("मंडी दरें");
    expect(getTranslation("weather", "hi")).toBe("मौसम");
  });

  it("should return correct Marathi translations", () => {
    expect(getTranslation("mandiRates", "mr")).toBe("मंडी दर");
    expect(getTranslation("weather", "mr")).toBe("हवामान");
  });

  it("should translate commodity names correctly", () => {
    expect(translateItemName("Wheat", "hi", "commodity")).toBe("गेहूं");
    expect(translateItemName("Wheat", "mr", "commodity")).toBe("गहू");
    expect(translateItemName("Cotton", "mr", "commodity")).toBe("कापूस");
    expect(translateItemName("Cotton", "hi", "commodity")).toBe("कपास");
  });

  it("should return market intelligence keys in all languages without crashing", () => {
    const enText = getMarketTranslation("ruralMarketIntelligence", "en");
    const hiText = getMarketTranslation("ruralMarketIntelligence", "hi");
    const mrText = getMarketTranslation("ruralMarketIntelligence", "mr");

    expect(enText).toContain("Rural Market Intelligence");
    expect(hiText).toContain("ग्रामीण बाजार");
    expect(mrText).toContain("ग्रामीण बाजार");
  });
});
