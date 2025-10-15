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
      <Card className="overflow-hidden border border-emerald-100 shadow-lg py-0 gap-0">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-6">
          <CardTitle className="text-2xl font-semibold text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-emerald-50/90">
            Tarif terbaru Reborn Lombok Trans dengan layanan profesional dan
            armada prima.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table className="min-w-[600px] text-sm">
            <TableHeader className="bg-emerald-50 text-emerald-900">
              <TableRow className="border-b border-emerald-100">
                <TableHead className="px-6 py-4">Jenis Layanan</TableHead>
                <TableHead className="px-6 py-4">Jenis Paket</TableHead>
                <TableHead className="px-6 py-4">Jenis Armada</TableHead>
                <TableHead className="px-6 py-4 text-right">Harga</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b border-emerald-50 bg-white transition-colors hover:bg-emerald-50/60"
                >
                  <TableCell className="px-6 py-5 text-gray-700">
                    <span className="block text-base font-semibold text-emerald-800">
                      {item.layanan}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-gray-700">
                    {item.paket || "-"}
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {item.armada}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right text-lg font-bold text-emerald-700">
                    {item.harga}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceTable;
