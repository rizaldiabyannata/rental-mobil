import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Calendar,
  DollarSign
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function CarTariffsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState(null);

  // Mock data - nanti bisa diambil dari API berdasarkan car ID
  const car = {
    id: "1",
    name: "Toyota Avanza",
  };

  const [tariffs, setTariffs] = useState([
    {
      id: "1",
      durationType: "Harian",
      durationValue: 1,
      price: 350000,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      durationType: "Mingguan", 
      durationValue: 7,
      price: 2100000,
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      durationType: "Bulanan",
      durationValue: 30,
      price: 8500000,
      createdAt: "2024-01-15",
    },
    {
      id: "4",
      durationType: "Custom",
      durationValue: 3,
      price: 950000,
      createdAt: "2024-01-20",
    },
  ]);

  const [newTariff, setNewTariff] = useState({
    durationType: "",
    durationValue: "",
    price: ""
  });

  const handleAddTariff = () => {
    const tariff = {
      id: Date.now().toString(),
      ...newTariff,
      durationValue: parseInt(newTariff.durationValue),
      price: parseInt(newTariff.price),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTariffs([...tariffs, tariff]);
    setNewTariff({ durationType: "", durationValue: "", price: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditTariff = (tariff) => {
    setEditingTariff(tariff);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTariff = () => {
    setTariffs(tariffs.map(t => 
      t.id === editingTariff.id 
        ? { 
            ...editingTariff, 
            durationValue: parseInt(editingTariff.durationValue),
            price: parseInt(editingTariff.price)
          }
        : t
    ));
    setEditingTariff(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTariff = (id) => {
    setTariffs(tariffs.filter(t => t.id !== id));
  };

  const getDurationLabel = (type, value) => {
    switch(type) {
      case "Harian": return `${value} Hari`;
      case "Mingguan": return `${value} Hari (${Math.round(value/7)} Minggu)`;
      case "Bulanan": return `${value} Hari (${Math.round(value/30)} Bulan)`;
      default: return `${value} Hari`;
    }
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">
                    Admin Panel
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/cars">
                    Manajemen Armada
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/admin/cars/${car.id}`}>
                    {car.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tarif Sewa</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <CreditCard className="h-8 w-8 text-emerald-600" />
                Tarif Sewa - {car.name}
              </h1>
              <p className="text-muted-foreground">
                Kelola harga sewa berdasarkan durasi rental
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Tarif
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Tarif Baru</DialogTitle>
                    <DialogDescription>
                      Buat tarif sewa baru untuk kendaraan ini
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="durationType">Jenis Durasi</Label>
                      <Select 
                        value={newTariff.durationType} 
                        onValueChange={(value) => setNewTariff({...newTariff, durationType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis durasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Harian">Harian</SelectItem>
                          <SelectItem value="Mingguan">Mingguan</SelectItem>
                          <SelectItem value="Bulanan">Bulanan</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="durationValue">Jumlah Hari</Label>
                      <Input 
                        type="number"
                        value={newTariff.durationValue}
                        onChange={(e) => setNewTariff({...newTariff, durationValue: e.target.value})}
                        placeholder="Contoh: 7"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Harga Total</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          Rp
                        </span>
                        <Input 
                          type="number"
                          value={newTariff.price}
                          onChange={(e) => setNewTariff({...newTariff, price: e.target.value})}
                          placeholder="350000"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button 
                      onClick={handleAddTariff}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={!newTariff.durationType || !newTariff.durationValue || !newTariff.price}
                    >
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tarif</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tariffs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Paket harga tersedia
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Harga Terendah</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  Rp {Math.min(...tariffs.map(t => Math.round(t.price / t.durationValue))).toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per hari
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Harga Tertinggi</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  Rp {Math.max(...tariffs.map(t => Math.round(t.price / t.durationValue))).toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per hari
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  Rp {Math.round(tariffs.reduce((sum, t) => sum + (t.price / t.durationValue), 0) / tariffs.length).toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per hari
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tariffs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Tarif</CardTitle>
              <CardDescription>
                Kelola semua paket harga sewa untuk kendaraan ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Durasi</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Harga Total</TableHead>
                    <TableHead>Harga per Hari</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tariffs.map((tariff) => (
                    <TableRow key={tariff.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {tariff.durationType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getDurationLabel(tariff.durationType, tariff.durationValue)}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          Rp {tariff.price.toLocaleString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          Rp {Math.round(tariff.price / tariff.durationValue).toLocaleString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(tariff.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditTariff(tariff)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTariff(tariff.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Tarif</DialogTitle>
                <DialogDescription>
                  Ubah informasi tarif sewa
                </DialogDescription>
              </DialogHeader>
              {editingTariff && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editDurationType">Jenis Durasi</Label>
                    <Select 
                      value={editingTariff.durationType} 
                      onValueChange={(value) => setEditingTariff({...editingTariff, durationType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Harian">Harian</SelectItem>
                        <SelectItem value="Mingguan">Mingguan</SelectItem>
                        <SelectItem value="Bulanan">Bulanan</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDurationValue">Jumlah Hari</Label>
                    <Input 
                      type="number"
                      value={editingTariff.durationValue}
                      onChange={(e) => setEditingTariff({...editingTariff, durationValue: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPrice">Harga Total</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        Rp
                      </span>
                      <Input 
                        type="number"
                        value={editingTariff.price}
                        onChange={(e) => setEditingTariff({...editingTariff, price: e.target.value})}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button 
                  onClick={handleUpdateTariff}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}