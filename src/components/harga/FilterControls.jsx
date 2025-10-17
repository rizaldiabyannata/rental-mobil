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
    filters.harga && { label: "Harga", value: filters.harga },
  ].filter(Boolean);

  const handleReset = () => {
    Object.keys(filters || {}).forEach((key) => onFilterChange(key, ""));
  };

  return (
    <Card className="mb-8 border border-[#EFF7FF] shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-primary">
              <span className="rounded-full bg-[#EFF7FF] p-2 text-primary">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              Sesuaikan Harga
            </CardTitle>
            <CardDescription className="mt-2">
              Filter tarif sesuai armada, paket, dan rentang harga yang Anda
              inginkan.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-primary hover:bg-[#EFF7FF]"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" /> Reset
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
              Jenis Kendaraan
            </div>
            <Select
              value={filters.armada}
              onValueChange={(value) =>
                onFilterChange("armada", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full border-[#3E6598] focus:border-primary focus:ring-[#8FA6C3]">
                <SelectValue placeholder="Semua Kendaraan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kendaraan</SelectItem>
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
              Jenis Paket
            </div>
            <Select
              value={filters.paket}
              onValueChange={(value) =>
                onFilterChange("paket", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full border-[#3E6598] focus:border-primary focus:ring-[#8FA6C3]">
                <SelectValue placeholder="Semua Paket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Paket</SelectItem>
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
              Range Harga
            </div>
            <Select
              value={filters.harga}
              onValueChange={(value) =>
                onFilterChange("harga", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full border-[#3E6598] focus:border-primary focus:ring-[#8FA6C3]">
                <SelectValue placeholder="Semua Harga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Harga</SelectItem>
                <SelectItem value="<500k">Di bawah Rp.500.000</SelectItem>
                <SelectItem value="500k-1m">
                  Rp.500.000 - Rp.1.000.000
                </SelectItem>
                <SelectItem value=">1m">Di atas Rp.1.000.000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
