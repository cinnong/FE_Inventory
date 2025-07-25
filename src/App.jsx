import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataBarang from "./pages/DataBarang";
import DetailBarang from "./pages/DetailBarang";
import KategoriList from "./pages/KategoriList";
import MainLayoutResponsive from "./layouts/MainLayoutResponsive";
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
import { SidebarProvider } from "./context/SidebarContext";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test" element={<Test />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <Dashboard />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/barang"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <DataBarang />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/barang/:id"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <DetailBarang />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/barang/edit/:id"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <FormEditBarang />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kategori"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <KategoriList />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/peminjaman"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <PeminjamanList />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/laporan"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <LaporanPeminjaman />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/barang/tambah"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <FormTambahBarang />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kategori/tambah"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <FormTambahKategori />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
          <Route
            path="/peminjaman/tambah"
            element={
              <ProtectedRoute>
                <MainLayoutResponsive>
                  <FormTambahPeminjaman />
                </MainLayoutResponsive>
              </ProtectedRoute>
            }
          />
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
