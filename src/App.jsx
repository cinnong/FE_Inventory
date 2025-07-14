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
import Login from "./pages/Login";
import Register from "./pages/Register";
import Test from "./pages/Test";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/barang"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DataBarang />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/barang/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DetailBarang />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/barang/edit/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FormEditBarang />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kategori"
          element={
            <ProtectedRoute>
              <MainLayout>
                <KategoriList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/peminjaman"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PeminjamanList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laporan"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LaporanPeminjaman />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/barang/tambah"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FormTambahBarang />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kategori/tambah"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FormTambahKategori />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/peminjaman/tambah"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FormTambahPeminjaman />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
