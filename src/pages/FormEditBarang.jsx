import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBarangById, updateBarang, getAllKategori } from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Alert,
} from "@material-tailwind/react";
import Swal from "sweetalert2";

export default function FormEditBarang() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [barang, setBarang] = useState({
    nama: "",
    kategori_id: "",
    stok: "",
  });

  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data barang berdasarkan ID
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const data = await getBarangById(id);
        setBarang(data);
      } catch {
        setAlert({
          type: "error",
          message: "Gagal mengambil data barang",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBarang();
  }, [id]);

  // Ambil data kategori
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const data = await getAllKategori();
        setKategori(data);
      } catch {
        console.error("Error mengambil kategori");
      }
    };
    fetchKategori();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBarang((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields before submit
    const newErrors = {};
    Object.keys(barang).forEach((key) => {
      const error = validateField(key, barang[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);

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
      // Pastikan stok adalah number
      const dataToUpdate = {
        ...barang,
        stok: parseInt(barang.stok) || 0,
      };

      await updateBarang(id, dataToUpdate);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Barang berhasil diperbarui",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate("/barang");
      });
    } catch (error) {
      console.error("Error detail:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui Barang",
        text:
          error.response?.data?.error ||
          "Terjadi kesalahan saat memperbarui barang",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Edit Barang
      </Typography>

      {alert && (
        <Alert
          color={alert.type === "success" ? "green" : "red"}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                label="Nama Barang"
                name="nama"
                value={barang.nama}
                onChange={handleChange}
                error={!!errors.nama}
                required
              />
              {errors.nama && (
                <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
              )}
            </div>

            <div>
              <select
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  errors.kategori_id ? "border-red-500" : ""
                }`}
                name="kategori_id"
                value={barang.kategori_id}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Kategori</option>
                {kategori.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.nama}
                  </option>
                ))}
              </select>
              {errors.kategori_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.kategori_id}
                </p>
              )}
            </div>

            <div>
              <Input
                type="number"
                label="Stok"
                name="stok"
                value={barang.stok}
                onChange={handleChange}
                error={!!errors.stok}
                required
              />
              {errors.stok && (
                <p className="text-red-500 text-sm mt-1">{errors.stok}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outlined"
                color="gray"
                onClick={() => navigate("/barang")}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" color="blue" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
