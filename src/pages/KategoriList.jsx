import { useEffect, useState } from "react";
import {
  getAllKategori,
  updateKategori,
  deleteKategori,
} from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AdminOnly from "../components/AdminOnly";
import Swal from "sweetalert2";
import { isAdmin } from "../utils/auth";

export default function KategoriList() {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editKategori, setEditKategori] = useState(null);
  const [editData, setEditData] = useState({
    nama: "",
    deskripsi: "",
  });
  const [editError, setEditError] = useState({
    nama: "",
    deskripsi: "",
  });

  const handleEdit = (id) => {
    const kategoriToEdit = kategori.find((k) => k.id === id);
    if (kategoriToEdit) {
      setEditKategori(id);
      setEditData({
        nama: kategoriToEdit.nama,
        deskripsi: kategoriToEdit.deskripsi,
      });
      setEditError({
        nama: !kategoriToEdit.nama?.trim() ? "Nama kategori wajib diisi" : "",
        deskripsi: !kategoriToEdit.deskripsi?.trim()
          ? "Deskripsi wajib diisi"
          : "",
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Inline validation per field
    setEditError((prev) => {
      let errorMsg = "";
      if (name === "nama" && !value.trim())
        errorMsg = "Nama kategori wajib diisi";
      if (name === "deskripsi" && !value.trim())
        errorMsg = "Deskripsi wajib diisi";
      return {
        ...prev,
        [name]: errorMsg,
      };
    });
  };

  const handleSaveEdit = async () => {
    // Cek error dan field kosong
    const errors = {
      nama: !editData.nama.trim() ? "Nama kategori wajib diisi" : "",
      deskripsi: !editData.deskripsi.trim() ? "Deskripsi wajib diisi" : "",
    };
    setEditError(errors);
    if (Object.values(errors).some((v) => v)) return;

    try {
      await updateKategori(editKategori, editData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kategori berhasil diperbarui",
        confirmButtonColor: "#10b981",
        timer: 1500,
        timerProgressBar: true,
      });

      // Refresh data
      const data = await getAllKategori();
      setKategori(data);

      // Reset form
      setEditKategori(null);
      setEditData({ nama: "", deskripsi: "" });
      setEditError({ nama: "", deskripsi: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui",
        text:
          error.response?.data?.error ||
          "Terjadi kesalahan saat memperbarui kategori",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditKategori(null);
    setEditData({ nama: "", deskripsi: "" });
  };

  const handleDelete = async (id, namaKategori) => {
    const result = await Swal.fire({
      title: "Hapus Kategori?",
      text: `Apakah Anda yakin ingin menghapus kategori "${namaKategori}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteKategori(id);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kategori berhasil dihapus",
          confirmButtonColor: "#10b981",
          timer: 1500,
          timerProgressBar: true,
        });

        // Refresh data setelah hapus
        const data = await getAllKategori();
        setKategori(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text:
            error.response?.data?.error ||
            "Kategori mungkin masih digunakan oleh barang",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  useEffect(() => {
    getAllKategori()
      .then((data) => {
        setKategori(data);
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
        Daftar Kategori
      </Typography>

      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography variant="h5" color="blue-gray">
            Total Kategori: {kategori.length}
          </Typography>
        </div>
        <AdminOnly>
          <Link to="/kategori/tambah">
            <Button variant="gradient" color="black">
              <span className="mr-2">+</span>
              Tambah Kategori
            </Button>
          </Link>
        </AdminOnly>
      </div>

      <AdminOnly>
        {editKategori && (
          <div className="mb-4">
            <Card>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={editData.nama}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {editError.nama && (
                      <p className="text-red-500 text-xs mt-1">
                        {editError.nama}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deskripsi
                    </label>
                    <textarea
                      name="deskripsi"
                      value={editData.deskripsi}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {editError.deskripsi && (
                      <p className="text-red-500 text-xs mt-1">
                        {editError.deskripsi}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="text"
                      color="red"
                      onClick={handleCancelEdit}
                    >
                      Batal
                    </Button>
                    <Button
                      variant="gradient"
                      color="blue"
                      onClick={handleSaveEdit}
                    >
                      Simpan
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </AdminOnly>

      <Card>
        <CardBody>
          <div className="overflow-x-auto overflow-y-auto h-lvh">
            <table className="table-auto w-full border text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Kategori Barang</th>
                  <th className="px-4 py-2">Deskripsi</th>
                  {isAdmin() && <th className="px-4 py-2">Tanggal Dibuat</th>}
                  {isAdmin() && <th className="px-4 py-2">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {kategori.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.nama}</td>
                    <td className="px-4 py-2">{item.deskripsi}</td>
                    {isAdmin() && (
                      <td className="px-4 py-2">{item.tanggal_buat}</td>
                    )}
                    {isAdmin() && (
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="text"
                            color="blue"
                            onClick={() => handleEdit(item.id)}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="text"
                            color="red"
                            onClick={() => handleDelete(item.id, item.nama)}
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
