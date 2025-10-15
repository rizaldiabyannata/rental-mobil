const PriceTable = ({ title, data }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="border border-gray-300 p-3">Jenis Layanan</th>
              <th className="border border-gray-300 p-3">Jenis Paket</th>
              <th className="border border-gray-300 p-3">Jenis Armada</th>
              <th className="border border-gray-300 p-3">Harga</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="border border-gray-300 p-3">{item.layanan}</td>
                <td className="border border-gray-300 p-3">{item.paket}</td>
                <td className="border border-gray-300 p-3">{item.armada}</td>
                <td className="border border-gray-300 p-3">{item.harga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceTable;
