import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAllPeminjaman,
  updatePeminjaman,
  deletePeminjaman,
  getAllBarang,
  updateJumlahPeminjaman,
} from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Alert,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import AdminOnly from "../components/AdminOnly";
import Swal from "sweetalert2";
import { getUserDisplayInfo, isAdmin } from "../utils/auth";

export default function PeminjamanList() {
  // Get user info - gunakan useMemo sebelum kode lain yang menggunakannya
  const userInfo = useMemo(() => getUserDisplayInfo(), []);
  const isUserAdmin = useMemo(() => isAdmin(), []);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [allData, setAllData] = useState([]); // Menyimpan semua data asli
  const [statusFilter, setStatusFilter] = useState(""); // Untuk dropdown status admin
  const [barangFilter, setBarangFilter] = useState(""); // Untuk filter barang
  const [barangMap, setBarangMap] = useState({}); // id -> barang

  // Ambil data barang sekali untuk semua role (admin & user)
  useEffect(() => {
    getAllBarang().then((barangList) => {
      const map = {};
      barangList.forEach((b) => {
        map[b.id] = b;
      });
      setBarangMap(map);
    });
  }, []);

  const [form, setForm] = useState({
    id: "",
    nama_peminjam: "",
    email_peminjam: "",
    telepon_peminjam: "",
    jumlah: "",
    status: "",
    tanggal_pinjam: "",
  });
  const [formError, setFormError] = useState({
    nama_peminjam: "",
    email_peminjam: "",
    telepon_peminjam: "",
    jumlah: "",
    status: "",
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
      // Jalankan validasi otomatis pada semua field
      setFormError({
        nama_peminjam: !peminjaman.nama_peminjam?.trim()
          ? "Nama peminjam wajib diisi"
          : "",
        email_peminjam: !peminjaman.email_peminjam?.trim()
          ? "Email wajib diisi"
          : "",
        telepon_peminjam: !peminjaman.telepon_peminjam?.trim()
          ? "Telepon wajib diisi"
          : "",
        jumlah:
          !peminjaman.jumlah || Number(peminjaman.jumlah) <= 0
            ? "Jumlah harus lebih dari 0"
            : "",
        status: !peminjaman.status?.trim() ? "Status wajib diisi" : "",
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Inline validation per field
    setFormError((prev) => {
      let errorMsg = "";
      if (name === "nama_peminjam" && !value.trim())
        errorMsg = "Nama peminjam wajib diisi";
      if (name === "email_peminjam" && !value.trim())
        errorMsg = "Email wajib diisi";
      if (name === "telepon_peminjam" && !value.trim())
        errorMsg = "Telepon wajib diisi";
      if (name === "jumlah" && (!value || Number(value) <= 0))
        errorMsg = "Jumlah harus lebih dari 0";
      if (name === "status" && !value.trim()) errorMsg = "Status wajib diisi";
      return {
        ...prev,
        [name]: errorMsg,
      };
    });
  };

  const handleSaveEdit = async () => {
    // Cek jika masih ada error di formError atau field kosong
    const hasError = Object.values(formError).some((v) => v);
    const hasEmpty = [
      form.nama_peminjam,
      form.email_peminjam,
      form.telepon_peminjam,
      form.jumlah,
      form.status,
    ].some((v) => !v || (typeof v === "string" && !v.trim()));
    if (hasError || hasEmpty) return;

    try {
      // Cari data lama
      const old = data.find((p) => p.id === form.id);
      let jumlahChanged = false;
      let statusChanged = false;
      if (old) {
        jumlahChanged = String(form.jumlah) !== String(old.jumlah);
        statusChanged = form.status !== old.status;
      }

      // Jika jumlah berubah, update jumlah via endpoint khusus
      if (jumlahChanged) {
        await updateJumlahPeminjaman(form.id, Number(form.jumlah));
      }
      // Jika status berubah, update status
      if (statusChanged) {
        await updatePeminjaman(form.id, { status: form.status });
      }
      // Jika hanya field lain yang berubah (nama, email, telepon), update via updatePeminjaman
      if (!jumlahChanged && !statusChanged) {
        await updatePeminjaman(form.id, form);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data peminjaman berhasil diperbarui",
        confirmButtonColor: "#10b981",
        timer: 1500,
        timerProgressBar: true,
      });

      // Fetch ulang data dari backend agar sinkron
      ambilDataPeminjaman(searchTerm, statusFilter, barangFilter);
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
      setFormError({
        nama_peminjam: "",
        email_peminjam: "",
        telepon_peminjam: "",
        jumlah: "",
        status: "",
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

  const ambilDataPeminjaman = useCallback(
    async (search = "", status = "", barang = "") => {
      try {
        setLoading(true);
        setNoResults(false);
        const res = await getAllPeminjaman();

        // Filter data berdasarkan role user
        let filteredByUser = res;
        if (!isUserAdmin && userInfo) {
          // User biasa hanya melihat peminjaman mereka sendiri
          filteredByUser = res.filter(
            (item) => item.email_peminjam === userInfo.email
          );
        }

        // Filter status jika admin memilih status
        let filteredByStatus = filteredByUser;
        if (isUserAdmin && status && status !== "semua") {
          filteredByStatus = filteredByUser.filter(
            (item) => (item.status || "").toLowerCase() === status
          );
        }

        // Filter barang jika admin memilih barang
        let filteredByBarang = filteredByStatus;
        if (isUserAdmin && barang && barang !== "") {
          filteredByBarang = filteredByStatus.filter(
            (item) => String(item.barang_id) === String(barang)
          );
        }

        setAllData(filteredByBarang); // Simpan data yang sudah difilter

        if (search.trim() === "") {
          setData(filteredByBarang);
        } else {
          const searchLower = search.trim().toLowerCase();
          const filteredData = filteredByBarang.filter((item) =>
            item.nama_peminjam.toLowerCase().includes(searchLower)
          );
          setData(filteredData);
          if (filteredData.length === 0) {
            setNoResults(true);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal mengambil data",
          text: "Terjadi kesalahan saat mengambil data peminjaman",
          confirmButtonColor: "#ef4444",
        });
      } finally {
        setLoading(false);
      }
    },
    [isUserAdmin, userInfo]
  );

  // Handler untuk pencarian real-time
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      setData(allData);
      setNoResults(false);
    } else {
      const searchLower = searchValue.trim().toLowerCase();
      const filteredData = allData.filter((item) =>
        item.nama_peminjam.toLowerCase().includes(searchLower)
      );
      setData(filteredData);
      setNoResults(filteredData.length === 0);
    }
  };

  // Handler untuk reset pencarian dan filter
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    setBarangFilter("");
    setData(allData);
    setNoResults(false);
  };

  useEffect(() => {
    ambilDataPeminjaman(searchTerm, statusFilter, barangFilter);
    // eslint-disable-next-line
  }, [ambilDataPeminjaman, statusFilter, barangFilter]);

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
        {isUserAdmin ? "Daftar Peminjaman" : "Peminjaman Saya"}
      </Typography>

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <Typography variant="h5" color="blue-gray">
            {isUserAdmin
              ? `Total Peminjaman: ${data.length}`
              : `Peminjaman Anda: ${data.length}`}
          </Typography>
          <Link to="/peminjaman/tambah">
            <Button variant="gradient" color="black">
              <span className="mr-2">+</span>
              Tambah Peminjaman
            </Button>
          </Link>
        </div>

        {isUserAdmin && (
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="w-72">
              <Input
                type="text"
                label="Filter Nama Peminjam"
                value={searchTerm}
                onChange={handleSearch}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                placeholder="Ketik nama untuk memfilter..."
              />
            </div>
            <div className="w-56">
              <Select
                label="Filter Status"
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
              >
                <Option value="">Semua Status</Option>
                <Option value="dipinjam">Dipinjam</Option>
                <Option value="dikembalikan">Dikembalikan</Option>
              </Select>
            </div>
            <div className="w-56">
              <Select
                label="Filter Barang"
                value={barangFilter}
                onChange={(val) => setBarangFilter(val)}
              >
                <Option value="">Semua Barang</Option>
                {Object.values(barangMap).map((barang) => (
                  <Option key={barang.id} value={barang.id}>
                    {barang.nama}
                  </Option>
                ))}
              </Select>
            </div>
            {(searchTerm || statusFilter || barangFilter) && (
              <Button
                type="button"
                color="gray"
                size="sm"
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
          </div>
        )}
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
                    {formError.nama_peminjam && (
                      <p className="text-red-500 text-xs mt-1">
                        {formError.nama_peminjam}
                      </p>
                    )}
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
                    {formError.email_peminjam && (
                      <p className="text-red-500 text-xs mt-1">
                        {formError.email_peminjam}
                      </p>
                    )}
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
                    {formError.telepon_peminjam && (
                      <p className="text-red-500 text-xs mt-1">
                        {formError.telepon_peminjam}
                      </p>
                    )}
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
                    {formError.jumlah && (
                      <p className="text-red-500 text-xs mt-1">
                        {formError.jumlah}
                      </p>
                    )}
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
                      <option value="dipinjam">Dipinjam</option>
                      <option value="dikembalikan">Dikembalikan</option>
                    </select>
                    {formError.status && (
                      <p className="text-red-500 text-xs mt-1">
                        {formError.status}
                      </p>
                    )}
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
        <CardBody>
          <div className="overflow-x-auto overflow-y-auto h-lvh">
            <table className="table-auto w-full border text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Telepon</th>
                  <th className="px-4 py-2">Barang</th>
                  <th className="px-4 py-2">Jumlah</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Tanggal</th>
                  {isUserAdmin && <th className="px-4 py-2">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {noResults ? (
                  <tr>
                    <td
                      colSpan={isUserAdmin ? 8 : 9}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Data peminjaman dengan nama "{searchTerm}" tidak ditemukan
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isUserAdmin ? 8 : 9}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {isUserAdmin
                        ? "Belum ada data peminjaman"
                        : "Anda belum memiliki peminjaman. Silakan buat peminjaman baru."}
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.nama_peminjam}</td>
                      <td className="px-4 py-2">{item.email_peminjam}</td>
                      <td className="px-4 py-2">{item.telepon_peminjam}</td>
                      <td className="px-4 py-2">
                        {barangMap[item.barang_id]?.nama || (
                          <span className="italic text-gray-400">
                            (Barang tidak ditemukan)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">{item.jumlah}</td>
                      <td className="px-4 py-2">{item.status}</td>
                      <td className="px-4 py-2">{item.tanggal_pinjam}</td>
                      {isUserAdmin && (
                        <td className="px-4 py-2">
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
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
