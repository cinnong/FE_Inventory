import { useState, useEffect } from "react";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllBarang, createPeminjaman } from "../services/api";

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
  const navigate = useNavigate();

  useEffect(() => {
    getAllBarang().then((data) => setBarangList(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      jumlah: parseInt(form.jumlah),
    };

    try {
      await createPeminjaman(payload);
      alert("Peminjaman berhasil ditambahkan!");
      navigate("/peminjaman");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Gagal tambah peminjaman.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Tambah Peminjaman</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <FormField
          label="Nama Peminjam"
          name="nama_peminjam"
          value={form.nama_peminjam}
          onChange={handleChange}
        />
        <FormField
          label="Email"
          name="email_peminjam"
          type="email"
          value={form.email_peminjam}
          onChange={handleChange}
        />
        <FormField
          label="Nomor Telepon"
          name="telepon_peminjam"
          type="tel"
          value={form.telepon_peminjam}
          onChange={handleChange}
        />

        {/* Dropdown Barang */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Barang</label>
          <select
            name="barang_id"
            value={form.barang_id}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
            required
          >
            <option value="">Pilih Barang</option>
            {barangList.map((barang) => (
              <option key={barang.id} value={barang.id}>
                {barang.nama}
              </option>
            ))}
          </select>
        </div>

        <FormField
          label="Jumlah"
          name="jumlah"
          type="number"
          value={form.jumlah}
          onChange={handleChange}
        />

        {/* Status */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="dipinjam">Dipinjam</option>
            <option value="dikembalikan">Dikembalikan</option>
          </select>
        </div>

        <Button type="submit">Tambah</Button>
      </form>
    </div>
  );
}
