"use client";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const FilterControls = ({ filters, onFilterChange, options }) => {
  const activeFilters = [
    filters.armada && { label: "Armada", value: filters.armada },
    filters.paket && { label: "Paket", value: filters.paket },
    filters.harga && { label: t("priceRange"), value: filters.harga },
  ].filter(Boolean);

  const handleReset = () => {
    Object.keys(filters || {}).forEach((key) => onFilterChange(key, ""));
  };
  const t = useTranslations("pricing.filterControls");
  return (
    <Card className="mb-8 border border-[#EFF7FF] shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-primary">
              <span className="rounded-full bg-[#EFF7FF] p-2 text-primary">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              {t("title")}
            </CardTitle>
            <CardDescription className="mt-2">{t("description")}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-primary hover:bg-[#EFF7FF]"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" /> {t("resetButton")}
          </Button>
        </div>

        {activeFilters.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeFilters.map(({ label, value }) => (
              <span
                key={`${label}-${value}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#EFF7FF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
              >
                <span className="text-primary">{label}:</span>
                {value}
              </span>
            ))}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
          {/* Filter Jenis Kendaraan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="rounded-md bg-white p-2 shadow-sm">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>
              {t("vehicleType")}
            </div>
            <Select
              value={filters.armada}
              onValueChange={(value) =>
                onFilterChange("armada", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full border-[#3E6598] focus:border-primary focus:ring-[#8FA6C3]">
                <SelectValue placeholder={t("allVehicles")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allVehicles")}</SelectItem>
                {options.armada.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Jenis Paket */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="rounded-md bg-white p-2 shadow-sm">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>
              {t("packageType")}
            </div>
            <Select
              value={filters.paket}
              onValueChange={(value) =>
                onFilterChange("paket", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full border-[#3E6598] focus:border-primary focus:ring-[#8FA6C3]">
                <SelectValue placeholder={t("allPackages")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allPackages")}</SelectItem>
                {options.paket.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Range Harga */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="rounded-md bg-white p-2 shadow-sm">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>
              {t("priceRange")}
            </div>
            <Select
              value={filters.harga}
              onValueChange={(value) =>
                onFilterChange("harga", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full border-[#3E6598] focus:border-primary focus:ring-[#8FA6C3]">
                <SelectValue placeholder={t("allPrices")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allPrices")}</SelectItem>
                <SelectItem value="<500k">{t("priceRanges.under500k")}</SelectItem>
                <SelectItem value="500k-1m">{t("priceRanges.500kto1m")}</SelectItem>
                <SelectItem value=">1m">{t("priceRanges.over1m")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
