import { useState, useEffect, useMemo } from "react";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";
import { getAllBarang, createPeminjaman } from "../services/api";
import Swal from "sweetalert2";
import { getUserDisplayInfo, isAdmin } from "../utils/auth";

export default function FormTambahPeminjaman() {
  const [form, setForm] = useState({
    nama_peminjam: "",
    email_peminjam: "",
    telepon_peminjam: "",
    barang_id: "",
    jumlah: "",
    status: "dipinjam",
  });

  const [barangList, setBarangList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get user info - menggunakan useMemo untuk mencegah re-render berulang
  const userInfo = useMemo(() => getUserDisplayInfo(), []);
  const isUserAdmin = useMemo(() => isAdmin(), []);

  useEffect(() => {
    getAllBarang().then((data) => setBarangList(data));
  }, []); // Hanya load barang sekali saat component mount

  useEffect(() => {
    // Auto-fill nama dan email untuk user biasa
    if (!isUserAdmin && userInfo) {
      setForm((prevForm) => ({
        ...prevForm,
        nama_peminjam: userInfo.username,
        email_peminjam: userInfo.email,
      }));
    }
  }, [isUserAdmin, userInfo]); // Sekarang dependencies stabil dengan useMemo

  // Validasi field
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nama_peminjam":
        if (!value.trim()) {
          error = "Nama peminjam wajib diisi";
        } else if (value.length < 3) {
          error = "Nama peminjam minimal 3 karakter";
        }
        break;
      case "email_peminjam":
        if (!value.trim()) {
          error = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Format email tidak valid";
        }
        break;
      case "telepon_peminjam":
        if (!value.trim()) {
          error = "Nomor telepon wajib diisi";
        } else if (!/^[0-9+\-\s()]+$/.test(value)) {
          error = "Format nomor telepon tidak valid";
        } else if (value.replace(/[^0-9]/g, "").length < 10) {
          error = "Nomor telepon minimal 10 digit";
        }
        break;
      case "barang_id":
        if (!value) {
          error = "Barang wajib dipilih";
        }
        break;
      case "jumlah":
        if (!value) {
          error = "Jumlah wajib diisi";
        } else if (value < 1) {
          error = "Jumlah minimal 1";
        } else if (!Number.isInteger(Number(value))) {
          error = "Jumlah harus berupa angka bulat";
        } else {
          // Validasi stok barang
          const selectedBarang = barangList.find(
            (barang) => barang.id === form.barang_id
          );
          if (selectedBarang && Number(value) > selectedBarang.stok) {
            error = `Jumlah melebihi stok yang tersedia (${selectedBarang.stok})`;
          }
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Real-time validation
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Jika user mengubah barang, validasi ulang jumlah
    if (name === "barang_id" && form.jumlah) {
      const jumlahError = validateField("jumlah", form.jumlah);
      setErrors((prev) => ({
        ...prev,
        jumlah: jumlahError,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields before submit
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (key !== "status") {
        // Status tidak perlu validasi karena sudah ada default
        const error = validateField(key, form[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Validasi khusus stok sebelum submit
    const selectedBarang = barangList.find(
      (barang) => barang.id === form.barang_id
    );
    if (selectedBarang && parseInt(form.jumlah) > selectedBarang.stok) {
      newErrors.jumlah = `Jumlah melebihi stok yang tersedia (${selectedBarang.stok})`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);

      // Pesan error spesifik untuk stok
      const stokError = newErrors.jumlah && newErrors.jumlah.includes("stok");

      Swal.fire({
        icon: "error",
        title: stokError ? "Stok Tidak Mencukupi" : "Validasi Gagal",
        text: stokError
          ? newErrors.jumlah
          : "Mohon perbaiki field yang bermasalah",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const payload = {
      ...form,
      jumlah: parseInt(form.jumlah),
    };

    console.log("Data dikirim:", payload);

    try {
      await createPeminjaman(payload);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Peminjaman berhasil ditambahkan!",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate("/peminjaman");
      });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);

      const errorMessage =
        err.response?.data?.message || "Gagal tambah peminjaman.";
      const isStockError =
        errorMessage.toLowerCase().includes("stok") ||
        errorMessage.toLowerCase().includes("stock") ||
        errorMessage.toLowerCase().includes("tersedia");

      Swal.fire({
        icon: "error",
        title: isStockError
          ? "Stok Tidak Mencukupi"
          : "Gagal Tambah Peminjaman",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        Tambah Peminjaman
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* Info untuk user biasa */}
        {!isUserAdmin && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Info:</strong> Nama dan email diisi otomatis dari profil
              Anda. 
            </p>
          </div>
        )}

        <FormField
          label="Nama Peminjam"
          name="nama_peminjam"
          value={form.nama_peminjam}
          onChange={handleChange}
          disabled={!isUserAdmin}
          placeholder={
            !isUserAdmin
              ? "Auto-filled dari profil Anda"
              : "Masukkan nama peminjam"
          }
          required
          error={errors.nama_peminjam}
        />
        <FormField
          label="Email"
          name="email_peminjam"
          type="email"
          value={form.email_peminjam}
          onChange={handleChange}
          disabled={!isUserAdmin}
          placeholder={
            !isUserAdmin
              ? "Auto-filled dari profil Anda"
              : "Masukkan email peminjam"
          }
          required
          error={errors.email_peminjam}
        />
        <FormField
          label="Nomor Telepon"
          name="telepon_peminjam"
          type="tel"
          value={form.telepon_peminjam}
          onChange={handleChange}
          required
          error={errors.telepon_peminjam}
        />

        {/* Dropdown Barang */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Barang <span className="text-red-500">*</span>
          </label>
          <select
            name="barang_id"
            value={form.barang_id}
            onChange={handleChange}
            className={`border rounded-md px-3 py-2 w-full ${
              errors.barang_id
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
            required
          >
            <option value="">Pilih Barang</option>
            {barangList.map((barang) => (
              <option key={barang.id} value={barang.id}>
                {barang.nama} (Stok: {barang.stok})
              </option>
            ))}
          </select>
          {errors.barang_id && (
            <p className="mt-1 text-sm text-red-600">{errors.barang_id}</p>
          )}
        </div>

        <FormField
          label="Jumlah"
          name="jumlah"
          type="number"
          min="1"
          value={form.jumlah}
          onChange={handleChange}
          placeholder="Masukkan jumlah yang dipinjam"
          required
          error={errors.jumlah}
        />

        {/* Status - Hanya admin yang bisa mengubah status */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Status
          </label>
          {isUserAdmin ? (
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="dipinjam">Dipinjam</option>
              <option value="dikembalikan">Dikembalikan</option>
            </select>
          ) : (
            <div className="border rounded-md px-3 py-2 w-full bg-gray-50 text-gray-700">
              Dipinjam (otomatis)
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Tambah Peminjaman"}
        </Button>
      </form>
    </div>
  );
}
