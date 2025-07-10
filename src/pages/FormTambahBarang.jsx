import { useState, useEffect } from "react";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAllKategori } from "../services/api";

export default function FormTambahBarang() {
  const [form, setForm] = useState({
    nama: "",
    kategori_id: "",
    stok: "",
  });

  const [kategoriList, setKategoriList] = useState([]);
  const navigate = useNavigate();

  // Ambil data kategori saat komponen dimuat
  useEffect(() => {
    getAllKategori().then((data) => setKategoriList(data));
  }, []);

  // Update nilai form ketika input berubah
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit data ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      stok: parseInt(form.stok), // ubah stok jadi angka
    };

    console.log("Data dikirim:", payload);

    try {
      await axios.post("http://localhost:3000/api/barang", payload);
      alert("Barang berhasil ditambahkan!");
      navigate("/");
    } catch (err) {
      console.error("Detail error:", err.response?.data || err.message);
      alert("Gagal tambah barang.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">
        Tambah Barang Baru
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <FormField
          label="Nama Barang"
          name="nama"
          value={form.nama}
          onChange={handleChange}
        />

        {/* Dropdown Kategori */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            name="kategori_id"
            value={form.kategori_id}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
            required
          >
            <option value="">Pilih Kategori</option>
            {kategoriList.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.nama}
              </option>
            ))}
          </select>
        </div>

        <FormField
          label="Stok"
          name="stok"
          type="number"
          value={form.stok}
          onChange={handleChange}
        />

        <Button type="submit">Tambah</Button>
      </form>
    </div>
  );
}
