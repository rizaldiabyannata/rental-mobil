
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const BookingForm = () => {
  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Sewa Mobil Sekarang
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi Penjemputan</Label>
            <Input id="location" placeholder="Contoh: Bandara Lombok" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-date">Tanggal Jemput</Label>
              <Input id="pickup-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-time">Waktu Jemput</Label>
              <Input id="pickup-time" type="time" />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Cari Mobil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
