import { useState, useEffect } from "react";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAllKategori } from "../services/api";
import Swal from "sweetalert2";

export default function FormTambahBarang() {
  const [form, setForm] = useState({
    nama: "",
    kategori_id: "",
    stok: "",
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil data kategori saat komponen dimuat
  useEffect(() => {
    getAllKategori().then((data) => setKategoriList(data));
  }, []);

  // Validasi field
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nama":
        if (!value.trim()) {
          error = "Nama barang wajib diisi";
        } else if (value.length < 3) {
          error = "Nama barang minimal 3 karakter";
        }
        break;
      case "stok":
        if (!value) {
          error = "Stok wajib diisi";
        } else if (value < 0) {
          error = "Stok tidak boleh negatif";
        } else if (!Number.isInteger(Number(value))) {
          error = "Stok harus berupa angka bulat";
        }
        break;
      case "kategori_id":
        if (!value) {
          error = "Kategori wajib dipilih";
        }
        break;
    }
    return error;
  };

  // Update nilai form ketika input berubah dengan real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Real-time validation
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  // Submit data ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields before submit
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);

      Swal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: "Mohon perbaiki field yang bermasalah",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const payload = {
      ...form,
      stok: parseInt(form.stok), // ubah stok jadi angka
    };

    console.log("Data dikirim:", payload);

    try {
      await axios.post("http://localhost:3000/api/barang", payload);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Barang berhasil ditambahkan",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate("/barang");
      });
    } catch (err) {
      console.error("Detail error:", err.response?.data || err.message);

      Swal.fire({
        icon: "error",
        title: "Gagal Menambah Barang",
        text:
          err.response?.data?.error || "Terjadi kesalahan saat menambah barang",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">
        Tambah Barang Baru
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <FormField
            label="Nama Barang"
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />
          {errors.nama && (
            <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
          )}
        </div>

        {/* Dropdown Kategori */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            name="kategori_id"
            value={form.kategori_id}
            onChange={handleChange}
            className={`border rounded-md px-3 py-2 w-full ${
              errors.kategori_id ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Pilih Kategori</option>
            {kategoriList.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.nama}
              </option>
            ))}
          </select>
          {errors.kategori_id && (
            <p className="text-red-500 text-sm mt-1">{errors.kategori_id}</p>
          )}
        </div>

        <div>
          <FormField
            label="Stok"
            name="stok"
            type="number"
            value={form.stok}
            onChange={handleChange}
          />
          {errors.stok && (
            <p className="text-red-500 text-sm mt-1">{errors.stok}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Tambah"}
        </Button>
      </form>
    </div>
  );
}
