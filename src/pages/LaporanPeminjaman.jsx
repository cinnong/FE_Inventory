import { useEffect, useState } from "react";
import { getLaporanPeminjaman } from "../services/api";
import { Card, CardBody, Typography, Spinner, Button } from "@material-tailwind/react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import AdminOnly from "../components/AdminOnly";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  // Fungsi untuk export ke Excel
  const handleExportExcel = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    
    const ws = XLSX.utils.json_to_sheet(laporan.map((item, index) => ({
      No: index + 1,
      "Nama Peminjam": item.nama_peminjam,
      "Barang": item.barang_info?.nama,
      "Kategori": item.kategori_info?.nama,
      "Jumlah": item.jumlah,
      "Status": item.status,
      "Tanggal": item.tanggal_pinjam
    })));

    const wb = { Sheets: { 'Laporan Peminjaman': ws }, SheetNames: ['Laporan Peminjaman'] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    
    saveAs(data, "Laporan_Peminjaman" + fileExtension);
  };

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
        <AdminOnly>
          <Button
            size="sm"
            className="flex items-center gap-2"
            color="green"
            onClick={handleExportExcel}
          >
            <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" />
            Export Excel
          </Button>
        </AdminOnly>
      </div>
      <Card>
        <CardBody>
          <div className="overflow-x-auto overflow-y-auto h-lvh">
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
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
