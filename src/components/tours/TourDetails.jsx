import { CheckCircle2 } from "lucide-react";

function TourInclusions({ inclusions = [] }) {
    if (!inclusions || inclusions.length === 0) return null;
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Termasuk Dalam Paket</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {inclusions.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TourPriceMatrix({ hotelTiers = [], showHotels = true }) {
    if (!hotelTiers || hotelTiers.length === 0) return null;

    const currencyFormatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Tabel Harga</h3>
            <div className="space-y-6">
                {hotelTiers.map((tier, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-4">
                            <h4 className="font-semibold text-lg">{tier.name}</h4>
                            {showHotels && tier.hotels && tier.hotels.length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">Pilihan Hotel: {tier.hotels.join(', ')}</p>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 font-medium">Jumlah Peserta</th>
                                        <th className="p-4 font-medium text-right">Harga per Orang</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tier.priceTiers.map((priceTier, pIndex) => (
                                        <tr key={pIndex} className="border-t">
                                            <td className="p-4">{priceTier.paxRange}</td>
                                            <td className="p-4 text-right font-semibold text-emerald-600">
                                                {currencyFormatter.format(priceTier.price)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { TourInclusions, TourPriceMatrix };