import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const PriceTable = ({ title, data }) => {
  return (
    <div className="mb-12">
      <Card className="overflow-hidden border border-[#EFF7FF] shadow-lg py-0 gap-0">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/50 py-6">
          <CardTitle className="text-2xl font-semibold text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-emerald-50/90">
            Tarif terbaru Reborn Lombok Trans dengan layanan profesional dan
            armada prima.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[480px] text-xs sm:text-sm">
              <TableHeader className="bg-[#EFF7FF] text-[#051C35] sticky top-0 z-10">
                <TableRow className="border-b border-emerald-100">
                  <TableHead className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    Jenis Layanan
                  </TableHead>
                  <TableHead className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    Jenis Paket
                  </TableHead>
                  <TableHead className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    Jenis Armada
                  </TableHead>
                  <TableHead className="px-3 py-2 sm:px-6 sm:py-4 text-right whitespace-nowrap">
                    Harga
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-[#8FA6C3]/30 bg-white transition-colors hover:bg-[#8FA6C3]/10"
                  >
                    <TableCell className="px-3 py-3 sm:px-6 sm:py-5 text-gray-700">
                      <span className="block text-sm sm:text-base font-semibold text-primary">
                        {item.layanan}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-3 sm:px-6 sm:py-5 text-gray-700">
                      {item.paket || "-"}
                    </TableCell>
                    <TableCell className="px-3 py-3 sm:px-6 sm:py-5">
                      <span className="inline-flex items-center rounded-full bg-[#8FA6C3] px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        {item.armada}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-3 sm:px-6 sm:py-5 text-right text-base sm:text-lg font-bold text-[#051C35]">
                      {item.harga}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceTable;
