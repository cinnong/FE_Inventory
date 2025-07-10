import { useState } from "react";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FormTambahKategori() {
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/kategori", form);
      alert("Kategori berhasil ditambahkan!");
      navigate("/kategori");
    } catch (err) {
      console.error("Detail error:", err.response?.data || err.message);
      alert("Gagal tambah kategori.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">
        Tambah Kategori Baru
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <FormField
          label="Nama Kategori"
          name="nama"
          value={form.nama}
          onChange={handleChange}
        />
        <FormField
          label="Deskripsi"
          name="deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
        />
        <Button type="submit">Tambah</Button>
      </form>
    </div>
  );
}
