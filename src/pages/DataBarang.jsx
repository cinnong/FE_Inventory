import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllBarang, deleteBarang, getAllKategori } from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import AdminOnly from "../components/AdminOnly";
import { isAdmin } from "../utils/auth";

export default function DataBarang() {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [kategori, setKategori] = useState([]);
  const isUserAdmin = isAdmin();

  const getKategoriNama = (id) => {
    const found = kategori.find((k) => k.id === id);
    return found ? found.nama : "Tidak diketahui";
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin hapus barang ini?",
      text: "Aksi ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBarang(id);
          setAlert({
            type: "success",
            message: "Barang berhasil dihapus",
          });
          // Refresh data setelah hapus
          const data = await getAllBarang();
          setBarang(data);
          Swal.fire("Terhapus!", "Barang berhasil dihapus.", "success");
        } catch {
          setAlert({
            type: "error",
            message: "Gagal menghapus barang",
          });
          Swal.fire("Gagal!", "Barang gagal dihapus.", "error");
        }
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/barang/edit/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barangData, kategoriData] = await Promise.all([
          getAllBarang(),
          getAllKategori(),
        ]);
        setBarang(barangData);
        setKategori(kategoriData);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Daftar Barang
      </Typography>

      {alert && (
        <Alert
          color={alert.type === "success" ? "green" : "red"}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography variant="h5" color="blue-gray">
            Total Barang: {barang.length}
          </Typography>
        </div>
        <AdminOnly>
          <Link to="/barang/tambah">
            <Button variant="gradient" color="black">
              <span className="mr-2">+</span>
              Tambah Barang
            </Button>
          </Link>
        </AdminOnly>
      </div>

      <Card>
        <CardBody>
          <div className="overflow-x-auto overflow-y-auto h-lvh">
            <table className="table-auto w-full border text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Kategori</th>
                  <th className="px-4 py-2">Stok</th>
                  {/* Hanya tampilkan kolom Aksi untuk admin */}
                  {isUserAdmin && <th className="px-4 py-2">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {barang.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.nama}</td>
                    <td className="px-4 py-2">
                      {getKategoriNama(item.kategori_id)}
                    </td>
                    <td className="px-4 py-2">{item.stok}</td>
                    {/* Hanya tampilkan kolom aksi untuk admin */}
                    {isUserAdmin && (
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {/* View button - hanya untuk admin */}
                          <Link to={`/barang/${item.id}`}>
                            <Button variant="text" color="green" size="sm">
                              <EyeIcon className="h-5 w-5" />
                            </Button>
                          </Link>

                          {/* Edit & Delete buttons - hanya untuk admin */}
                          <Button
                            size="sm"
                            onClick={() => handleEdit(item.id)}
                            variant="text"
                            color="blue"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="text"
                            color="red"
                            onClick={() => handleDelete(item.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </td>
                    )}
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
