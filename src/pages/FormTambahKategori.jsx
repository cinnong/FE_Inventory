import { useState } from "react";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function FormTambahKategori() {
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validasi field
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nama":
        if (!value.trim()) {
          error = "Nama kategori wajib diisi";
        } else if (value.length < 1) {
          error = "Nama kategori minimal 1 karakter";
        }
        break;
      case "deskripsi":
        // Deskripsi bebas, tidak ada validasi khusus
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Real-time validation
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

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

    try {
      await axios.post("http://localhost:3000/api/kategori", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kategori berhasil ditambahkan",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate("/kategori");
      });
    } catch (err) {
      console.error("Detail error:", err.response?.data || err.message);

      Swal.fire({
        icon: "error",
        title: "Gagal Menambah Kategori",
        text:
          err.response?.data?.error ||
          "Terjadi kesalahan saat menambah kategori",
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
        Tambah Kategori Baru
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <FormField
            label="Nama Kategori"
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />
          {errors.nama && (
            <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
          )}
        </div>

        <div>
          <FormField
            label="Deskripsi"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
          />
          {errors.deskripsi && (
            <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Tambah"}
        </Button>
      </form>
    </div>
  );
}
