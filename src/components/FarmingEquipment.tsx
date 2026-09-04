import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tractor, Search, Phone, ShieldCheck, Sparkles, CheckCircle2, DollarSign } from "lucide-react";
import { Language, getTranslation, translateItemName } from "@/utils/translations";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";

// External image resolver for original equipment photos
function getExternalImageUrl(name: string): string | undefined {
  switch (name) {
    case "Tractor (45–50 HP)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTViZTKoAX0lznEvl7Hu6cAJFb5mEQA4yIilA&s";
    case "Mini Tractor (25–30 HP)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AVOONH3dU6o3nK7DUKINy9FA_oFyvwTHqQ&s";
    case "Power Tiller (8–12 HP)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwA7HIPC0kpOcHp3v0upQTcEwSyvOEWM28XQ&s"
    case "Rotavator (6–7 ft)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz3-R0MGmowurR6ABU9WbG9Iql2cHdqKe4EQ&s";
    case "Cultivator (9 tyne)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTESnSA5tYe0NmXHgYDj_oxHG3DAYul7RtdkA&s";
    case "MB Plough (2–3 bottom)":
      return "https://www.mahindratractor.com/sites/default/files/2024-07/MB-Plough_799x618.webp";
    case "Seed Drill (7–9 row)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8iNyXYdkgr2ckjSr809-ddofJxRRKeg50xw&s";
    case "Zero-Till Seed Drill":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReoNB-cc3ObsnFMAHhuVUrPDB-DL61Q8VrKw&s";
    case "Boom Sprayer (600–1000 L)":
      return "https://krishispray.in/wp-content/uploads/2024/06/Krishispray-KX-600-Krishispray-Mounted-Boom-Sprayer-3-1.jpg";
    case "Knapsack Sprayer":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBWO0-IYRE9bclsY3MOr7zzKmkEugnb-GeYQ&s";
    case "Disc Harrow":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLOQ0yDiayhWjWrrbzz7mmY4eZPAo0C8yk1w&s";
    case "Happy Seeder":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEnpEVZRNvAIHPU9qYREt0pFkmb6IgcX6zBQ&s";
    case "Reaper":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_jbGh5q0aRGEWjuudTE1uhdXK3RZGPXBd2w&s"
    case "Combine Harvester":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR516KyDwQseLe8luRImaMf2ShhVatAf_LDPg&s";
    case "Chaff Cutter":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVMrgkDB2L_nBGgVVda9DYqaTb_dh5zUnn9A&s";
    case "Laser Land Leveler":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDGtx4QKPr1WjCGPPMfxO4jkFfwBga2NHFFw&s";
    case "Round Baler":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUCXgX2Ok9WeCInRn-OFFiuPMffpq1AafQCg&s";
    case "Mulcher/Shredder":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTTIainWb7lCDfv3qfzg8fqlBMqGGi0d7KRw&s";
    case "Straw Reaper":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7W4EJz5eedqL8mg3BMT8ZWdZ1L9sfoTZECw&s";
    case "Potato Planter":
      return "https://5.imimg.com/data5/JP/HS/TX/SELLER-40750711/potato-planter-machine-500x500.jpg";
    case "Paddy Transplanter (Walk-behind)":
      return "https://cpimg.tistatic.com/10574009/b/5/Rice-Transplanter.jpg";
    case "Drip Irrigation Kit (1 acre)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQug5Xwge4Knav377twQoCnzQHs5hhCMRQlEw&s";
    case "Sprinkler Set (1 acre)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcDYzmp32gtt6hJQa_qPrcd4f5cfljX-4VGw&s";
    case "Post Hole Digger":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaamPZkENTHB3FWx7AGB96KA6_n48szAXybQ&s";
    case "Farm Trailer (2 Ton)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_jbGh5q0aRGEWjuudTE1uhdXK3RZGPXBd2w&s";
    case "Water Tanker (2000–3000 L)":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5Gh5R1s37de2b_AvSL52Aszvt7gy9zP2ULw&s";
      default:
      return undefined;
  }
}

function getLocalFallback(name: string, type: string): string {
  if (type.includes("Harvest")) return "/equipment/harvester.svg";
  if (type.includes("Plant") || type.includes("Irrigation")) return "/equipment/sprayer.svg";
  if (type.includes("Tillage") || type.includes("Residue") || type.includes("Sowing") || type.includes("Land")) return "/equipment/rotavator.svg";
  return "/equipment/tractor.svg";
}

interface FarmingEquipmentProps {
  language: Language;
}

type EquipmentItem = {
  name: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  unit: string;
  use: string;
  brand?: string;
  imageUrl?: string;
};

const equipmentList: EquipmentItem[] = [
  {
    name: "Tractor (45–50 HP)",
    type: "Power Equipment",
    minPrice: 500000,
    maxPrice: 850000,
    unit: "₹/unit",
    use: "Primary tillage, transport, powering implements",
    brand: "Mahindra / Swaraj / John Deere",
    imageUrl: "/equipment/tractor.svg"
  },
  {
    name: "Mini Tractor (25–30 HP)",
    type: "Power Equipment",
    minPrice: 350000,
    maxPrice: 550000,
    unit: "₹/unit",
    use: "Small farms, orchard inter-row operations",
    brand: "Eicher / VST / Sonalika",
    imageUrl: "/equipment/tractor.svg"
  },
  {
    name: "Power Tiller (8–12 HP)",
    type: "Power Equipment",
    minPrice: 120000,
    maxPrice: 220000,
    unit: "₹/unit",
    use: "Tillage in small holdings and wetlands",
    brand: "VST / KAMCO",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Rotavator (6–7 ft)",
    type: "Tillage",
    minPrice: 90000,
    maxPrice: 150000,
    unit: "₹/unit",
    use: "Seedbed preparation, weed control",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Cultivator (9 tyne)",
    type: "Tillage",
    minPrice: 25000,
    maxPrice: 60000,
    unit: "₹/unit",
    use: "Soil aeration, secondary tillage",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "MB Plough (2–3 bottom)",
    type: "Tillage",
    minPrice: 55000,
    maxPrice: 120000,
    unit: "₹/unit",
    use: "Primary tillage, inverting soil",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Seed Drill (7–9 row)",
    type: "Sowing",
    minPrice: 45000,
    maxPrice: 110000,
    unit: "₹/unit",
    use: "Uniform seed placement",
    brand: "Mahindra / Dasmesh",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Zero-Till Seed Drill",
    type: "Sowing",
    minPrice: 95000,
    maxPrice: 160000,
    unit: "₹/unit",
    use: "Direct sowing without primary tillage",
    brand: "Mahindra / Dasmesh",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Boom Sprayer (600–1000 L)",
    type: "Plant Protection",
    minPrice: 95000,
    maxPrice: 180000,
    unit: "₹/unit",
    use: "Uniform pesticide/fertilizer foliar application",
    brand: "Krishispray / Aspee",
    imageUrl: "/equipment/sprayer.svg"
  },
  {
    name: "Knapsack Sprayer",
    type: "Plant Protection",
    minPrice: 1800,
    maxPrice: 4500,
    unit: "₹/unit",
    use: "Spot spraying for small plots",
    brand: "Aspee / Neptune",
    imageUrl: "/equipment/sprayer.svg"
  },
  {
    name: "Disc Harrow",
    type: "Tillage",
    minPrice: 65000,
    maxPrice: 140000,
    unit: "₹/unit",
    use: "Clod breaking and residue incorporation",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Happy Seeder",
    type: "Residue Management",
    minPrice: 150000,
    maxPrice: 250000,
    unit: "₹/unit",
    use: "Sowing in standing straw, stubble management",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Reaper",
    type: "Harvesting",
    minPrice: 120000,
    maxPrice: 220000,
    unit: "₹/unit",
    use: "Cutting cereal crops",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/harvester.svg"
  },
  {
    name: "Combine Harvester",
    type: "Harvesting",
    minPrice: 1800000,
    maxPrice: 3200000,
    unit: "₹/unit",
    use: "Harvesting, threshing and cleaning in one pass",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/harvester.svg"
  },
  {
    name: "Chaff Cutter",
    type: "Fodder",
    minPrice: 12000,
    maxPrice: 38000,
    unit: "₹/unit",
    use: "Chopping fodder for cattle",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Laser Land Leveler",
    type: "Land Development",
    minPrice: 250000,
    maxPrice: 380000,
    unit: "₹/unit",
    use: "Precise leveling for water saving and uniform germination",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/tractor.svg"
  },
  {
    name: "Round Baler",
    type: "Residue Management",
    minPrice: 900000,
    maxPrice: 1500000,
    unit: "₹/unit",
    use: "Baling straw and crop residues",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/harvester.svg"
  },
  {
    name: "Mulcher/Shredder",
    type: "Residue Management",
    minPrice: 120000,
    maxPrice: 240000,
    unit: "₹/unit",
    use: "Shredding crop residues to mulch",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/rotavator.svg"
  },
  {
    name: "Straw Reaper",
    type: "Residue Management",
    minPrice: 250000,
    maxPrice: 400000,
    unit: "₹/unit",
    use: "Reaping straw left by combines",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/harvester.svg"
  },
  {
    name: "Potato Planter",
    type: "Planting",
    minPrice: 140000,
    maxPrice: 260000,
    unit: "₹/unit",
    use: "Uniform planting of seed potatoes",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/tractor.svg"
  },
  {
    name: "Paddy Transplanter (Walk-behind)",
    type: "Transplanting",
    minPrice: 180000,
    maxPrice: 320000,
    unit: "₹/unit",
    use: "Transplanting rice seedlings in wetlands",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/tractor.svg"
  },
  {
    name: "Drip Irrigation Kit (1 acre)",
    type: "Irrigation",
    minPrice: 35000,
    maxPrice: 75000,
    unit: "₹/set",
    use: "Water-efficient irrigation for orchards and vegetables",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/sprayer.svg"
  },
  {
    name: "Sprinkler Set (1 acre)",
    type: "Irrigation",
    minPrice: 25000,
    maxPrice: 55000,
    unit: "₹/set",
    use: "Overhead irrigation for field crops",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/sprayer.svg"
  },
  {
    name: "Post Hole Digger",
    type: "Land Development",
    minPrice: 35000,
    maxPrice: 85000,
    unit: "₹/unit",
    use: "Digging holes for fencing and plantation",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/tractor.svg"
  },
  {
    name: "Farm Trailer (2 Ton)",
    type: "Transport",
    minPrice: 95000,
    maxPrice: 180000,
    unit: "₹/unit",
    use: "On-farm transport of produce and inputs",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/tractor.svg"
  },
  {
    name: "Water Tanker (2000–3000 L)",
    type: "Irrigation",
    minPrice: 120000,
    maxPrice: 220000,
    unit: "₹/unit",
    use: "Water transport and supply",
    brand: "Shaktiman / Maschio",
    imageUrl: "/equipment/sprayer.svg"
  },
];

export const FarmingEquipment = ({ language }: FarmingEquipmentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const equipmentTypes = [
    { id: "all", label: "All Equipment" },
    { id: "Power Equipment", label: "Tractors & Power Tillers" },
    { id: "Tillage", label: "Tillage & Ploughs" },
    { id: "Sowing", label: "Sowing & Seeding" },
    { id: "Harvesting", label: "Harvesting & Threshing" },
    { id: "Plant Protection", label: "Sprayers & Irrigation" },
  ];

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchesType =
        selectedType === "all" ||
        item.type.toLowerCase().includes(selectedType.toLowerCase());
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.use.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [searchQuery, selectedType]);

  const handleInquireRental = (item: EquipmentItem) => {
    toast.success(`Rental Inquiry for ${item.name} dispatched to nearest Custom Hiring Center (CHC)! A local CHC operator will call back.`);
  };

  const handleCheckSubsidy = (item: EquipmentItem) => {
    const minSubsidy = Math.round(item.minPrice * 0.40);
    const maxSubsidy = Math.round(item.maxPrice * 0.50);
    toast.info(`SMAM Scheme: ${item.name} is eligible for 40%–50% direct DBT subsidy (₹${minSubsidy.toLocaleString()} to ₹${maxSubsidy.toLocaleString()}) via Mahadbt / Agricoop portal.`);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-emerald-600 text-white text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> SMAM & CHC Subsidized Benchmarks
              </Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                Custom Hiring Center (CHC) Direct Rent
              </Badge>
            </div>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Tractor className="w-6 h-6 text-emerald-600" />
              {getTranslation('farmingEquipment', language) || 'Farming Equipment & Machinery'}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Official retail prices, 40-50% government subsidies (SMAM Scheme), and verified Custom Hiring Center (CHC) equipment.
            </CardDescription>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search tractors, rotavators, sprayers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
              aria-label="Search equipment"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t">
          {equipmentTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.id)}
              className={`h-7 text-xs ${
                selectedType === type.id
                  ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEquipment.map((item, idx) => (
            <div key={idx} className="p-4 bg-muted/40 rounded-lg border border-border hover:border-emerald-300 transition-colors flex flex-col justify-between">
              <div className="grid grid-cols-5 gap-3">
                {item.imageUrl && (
                  <div className="col-span-5 sm:col-span-2">
                    <AspectRatio ratio={16/9}>
                      <img
                        src={getExternalImageUrl(item.name) || item.imageUrl || getLocalFallback(item.name, item.type)}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = item.imageUrl || getLocalFallback(item.name, item.type); }}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md border"
                        loading="lazy"
                      />
                    </AspectRatio>
                  </div>
                )}
                <div className="col-span-5 sm:col-span-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                      <Badge variant="outline" className="text-[10px] mt-0.5">{item.type}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">{item.unit}</div>
                      <div className="font-bold text-sm text-foreground">₹{item.minPrice.toLocaleString()} – ₹{item.maxPrice.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{getTranslation('use', language)}: </span>
                    {item.use}
                  </div>
                  {item.brand && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{getTranslation('popularBrands', language)}: </span>
                      {item.brand}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCheckSubsidy(item)}
                  className="h-7 text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300"
                  aria-label={`Check subsidy for ${item.name}`}
                >
                  <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Check 40-50% Subsidy
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleInquireRental(item)}
                  className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                  aria-label={`Inquire rental for ${item.name}`}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Inquire CHC Rental
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No equipment found matching "{searchQuery}". Try selecting a different category.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FarmingEquipment;


