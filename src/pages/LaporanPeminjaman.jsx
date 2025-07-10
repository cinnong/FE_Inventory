import { useEffect, useState } from "react";
import { getLaporanPeminjaman } from "../services/api";
import { Card, CardBody, Typography, Spinner } from "@material-tailwind/react";

export default function LaporanPeminjaman() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLaporanPeminjaman()
      .then((data) => {
        setLaporan(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Laporan Peminjaman
      </Typography>

      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography variant="h5" color="blue-gray">
            Total Laporan: {laporan.length}
          </Typography>
        </div>
      </div>
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="table-auto w-full border text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama Peminjam</th>
                <th className="px-4 py-2">Barang</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Jumlah</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.nama_peminjam}</td>
                  <td className="px-4 py-2">{item.barang_info?.nama}</td>
                  <td className="px-4 py-2">{item.kategori_info?.nama}</td>
                  <td className="px-4 py-2">{item.jumlah}</td>
                  <td className="px-4 py-2">{item.status}</td>
                  <td className="px-4 py-2">{item.tanggal_pinjam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
