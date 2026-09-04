import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CommodityPriceDiscovery } from "../components/CommodityPriceDiscovery";

describe("CommodityPriceDiscovery Component", () => {
  it("should render commodity price discovery header", () => {
    render(<CommodityPriceDiscovery language="en" />);
    expect(screen.getByText(/Price Discovery & Trends/i)).toBeInTheDocument();
  });

  it("should render category filter pills", () => {
    render(<CommodityPriceDiscovery language="en" />);
    expect(screen.getByText(/All Commodities/i)).toBeInTheDocument();
    expect(screen.getByText(/Cereals & Grains/i)).toBeInTheDocument();
  });

  it("should display commodity cards for Coastal Karnataka crops", () => {
    render(<CommodityPriceDiscovery language="en" />);
    expect(screen.getAllByText(/Tomato/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mattu Gulla|Jasmine|Arecanut/i).length).toBeGreaterThan(0);
  });
});
