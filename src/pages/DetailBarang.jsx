import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBarangById } from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function DetailBarang() {
  const { id } = useParams();
  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBarangById(id)
      .then((data) => {
        setBarang(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  if (!barang) {
    return (
      <div className="p-6">
        <Typography variant="h5" color="red">
          Barang tidak ditemukan.
        </Typography>
        <Link to="/">
          <Button className="mt-4">Kembali</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Detail Barang
      </Typography>
      <Card className="max-w-xl">
        <CardBody>
          <Typography>
            <strong>Nama:</strong> {barang.nama}
          </Typography>
          <Typography>
            <strong>Stok:</strong> {barang.stok}
          </Typography>
          <Typography>
            <strong>Tanggal Buat:</strong> {barang.tanggal_buat}
          </Typography>
          <Link to="/barang">
            <Button className="mt-4" color="blue">
              Kembali
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
