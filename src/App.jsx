import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataBarang from "./pages/DataBarang";
import DetailBarang from "./pages/DetailBarang";
import KategoriList from "./pages/KategoriList";
import MainLayout from "./layouts/MainLayout";
import PeminjamanList from "./pages/PeminjamanList";
import LaporanPeminjaman from "./pages/LaporanPeminjaman";
import FormTambahBarang from "./pages/FormTambahBarang";
import FormTambahKategori from "./pages/FormTambahKategori";
import FormTambahPeminjaman from "./pages/FormTambahPeminjaman";
import FormEditBarang from "./pages/FormEditBarang";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/barang"
          element={
            <MainLayout>
              <DataBarang />
            </MainLayout>
          }
        />
        <Route
          path="/barang/:id"
          element={
            <MainLayout>
              <DetailBarang />
            </MainLayout>
          }
        />
        <Route
          path="/barang/edit/:id"
          element={
            <MainLayout>
              <FormEditBarang />
            </MainLayout>
          }
        />
        <Route
          path="/kategori"
          element={
            <MainLayout>
              <KategoriList />
            </MainLayout>
          }
        />
        <Route
          path="/peminjaman"
          element={
            <MainLayout>
              <PeminjamanList />
            </MainLayout>
          }
        />
        <Route
          path="/laporan"
          element={
            <MainLayout>
              <LaporanPeminjaman />
            </MainLayout>
          }
        />

        <Route
          path="/barang/tambah"
          element={
            <MainLayout>
              <FormTambahBarang />
            </MainLayout>
          }
        />

        <Route
          path="/kategori/tambah"
          element={
            <MainLayout>
              <FormTambahKategori />
            </MainLayout>
          }
        />

        <Route
          path="/peminjaman/tambah"
          element={
            <MainLayout>
              <FormTambahPeminjaman />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
