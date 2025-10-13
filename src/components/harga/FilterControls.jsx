import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterControls = ({ filters, onFilterChange, options }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-emerald-50 rounded-lg shadow-md">
      {/* Filter Jenis Kendaraan */}
      <div className="md:flex flex-col items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          Jenis Kendaraan
        </label>
        <Select
          value={filters.armada}
          onValueChange={(value) =>
            onFilterChange("armada", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
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
      <div className="md:flex flex-col items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Jenis Paket</label>
        <Select
          value={filters.paket}
          onValueChange={(value) =>
            onFilterChange("paket", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
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

      {/* Filter Range Harga (Contoh Sederhana) */}
      <div className="md:flex flex-col items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Range Harga</label>
        <Select
          value={filters.harga}
          onValueChange={(value) =>
            onFilterChange("harga", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Harga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Harga</SelectItem>
            <SelectItem value="<500k">Di bawah Rp.500.000</SelectItem>
            <SelectItem value="500k-1m">Rp.500.000 - Rp.1.000.000</SelectItem>
            <SelectItem value=">1m">Di atas Rp.1.000.000</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterControls;
