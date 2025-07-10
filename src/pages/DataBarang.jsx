import { useEffect, useState } from "react";
import { getAllBarang, deleteBarang, getAllKategori } from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

export default function DataBarang() {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [kategori, setKategori] = useState([]);

  const getKategoriNama = (id) => {
    const found = kategori.find((k) => k.id === id);
    return found ? found.nama : "Tidak diketahui";
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      try {
        await deleteBarang(id);
        setAlert({
          type: 'success',
          message: 'Barang berhasil dihapus'
        });
        // Refresh data setelah hapus
        const data = await getAllBarang();
        setBarang(data);
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Gagal menghapus barang'
        });
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/barang/edit/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barangData, kategoriData] = await Promise.all([
          getAllBarang(),
          getAllKategori()
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
          color={alert.type === 'success' ? 'green' : 'red'}
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
        <Link to="/barang/tambah">
          <Button variant="gradient" color="black">
            <span className="mr-2">+</span>
            Tambah Barang
          </Button>
        </Link>
      </div>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="table-auto w-full border text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barang.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.nama}</td>
                  <td className="px-4 py-2">{getKategoriNama(item.kategori_id)}</td>
                  <td className="px-4 py-2">{item.stok}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
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
                      <Link to={`/barang/${item.id}`}>
                        <Button variant="text" color="green">
                          <span className="h-5 w-5">🔍</span>
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
