import { useEffect, useState } from "react";
import {
  getAllPeminjaman,
  updatePeminjaman,
  deletePeminjaman,
} from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Alert,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AdminOnly from "../components/AdminOnly";
import Swal from "sweetalert2";

export default function PeminjamanList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({
    id: "",
    nama_peminjam: "",
    email_peminjam: "",
    telepon_peminjam: "",
    jumlah: "",
    status: "",
    tanggal_pinjam: "",
  });

  const handleEdit = (id) => {
    const peminjaman = data.find((p) => p.id === id);
    if (peminjaman) {
      setEdit(id);
      setForm({
        id: peminjaman.id,
        nama_peminjam: peminjaman.nama_peminjam,
        email_peminjam: peminjaman.email_peminjam,
        telepon_peminjam: peminjaman.telepon_peminjam,
        jumlah: peminjaman.jumlah,
        status: peminjaman.status,
        tanggal_pinjam: peminjaman.tanggal_pinjam,
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await updatePeminjaman(form.id, form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data peminjaman berhasil diperbarui",
        confirmButtonColor: "#10b981",
        timer: 1500,
        timerProgressBar: true,
      });

      setData((prev) =>
        prev.map((p) => (p.id === form.id ? { ...p, ...form } : p))
      );
      setEdit(null);
      setForm({
        id: "",
        nama_peminjam: "",
        email_peminjam: "",
        telepon_peminjam: "",
        jumlah: "",
        status: "",
        tanggal_pinjam: "",
      });
    } catch (error) {
      console.error("Error mengupdate peminjaman:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui",
        text:
          error.response?.data?.error ||
          "Terjadi kesalahan saat memperbarui data peminjaman",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleCancelEdit = () => {
    setEdit(null);
    setForm({
      id: "",
      nama_peminjam: "",
      email_peminjam: "",
      telepon_peminjam: "",
      jumlah: "",
      status: "",
      tanggal_pinjam: "",
    });
  };

  const handleDelete = async (id, namaPeminjam) => {
    const result = await Swal.fire({
      title: "Hapus Peminjaman?",
      text: `Apakah Anda yakin ingin menghapus data peminjaman "${namaPeminjam}"?`,
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
        await deletePeminjaman(id);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data peminjaman berhasil dihapus",
          confirmButtonColor: "#10b981",
          timer: 1500,
          timerProgressBar: true,
        });

        // Refresh data setelah hapus
        const res = await getAllPeminjaman();
        setData(res);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text:
            error.response?.data?.error ||
            "Terjadi kesalahan saat menghapus data",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  useEffect(() => {
    getAllPeminjaman()
      .then((res) => {
        setData(res);
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
        Daftar Peminjaman
      </Typography>

      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography variant="h5" color="blue-gray">
            Total Peminjaman: {data.length}
          </Typography>
        </div>
        <Link to="/peminjaman/tambah">
          <Button variant="gradient" color="black">
            <span className="mr-2">+</span>
            Tambah Peminjaman
          </Button>
        </Link>
      </div>

      <AdminOnly>
        {edit && (
          <div className="mb-4">
            <Card>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Peminjam
                    </label>
                    <input
                      type="text"
                      name="nama_peminjam"
                      value={form.nama_peminjam}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email_peminjam"
                      value={form.email_peminjam}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telepon
                    </label>
                    <input
                      type="text"
                      name="telepon_peminjam"
                      value={form.telepon_peminjam}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Jumlah
                    </label>
                    <input
                      type="number"
                      name="jumlah"
                      value={form.jumlah}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="dipinjam">Dipinjam</option>
                      <option value="dikembalikan">Dikembalikan</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </AdminOnly>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="table-auto w-full border text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Telepon</th>
                <th className="px-4 py-2">Jumlah</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.nama_peminjam}</td>
                  <td className="px-4 py-2">{item.email_peminjam}</td>
                  <td className="px-4 py-2">{item.telepon_peminjam}</td>
                  <td className="px-4 py-2">{item.jumlah}</td>
                  <td className="px-4 py-2">{item.status}</td>
                  <td className="px-4 py-2">{item.tanggal_pinjam}</td>
                  <td className="px-4 py-2">
                    <AdminOnly
                      fallback={<span className="text-gray-400">-</span>}
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.id, item.nama_peminjam)
                          }
                          className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </AdminOnly>
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
