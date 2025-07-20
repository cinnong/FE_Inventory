import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Setup axios interceptor untuk otomatis include JWT token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Setup response interceptor untuk handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, redirect ke login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ===== AUTHENTICATION APIs =====
export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error login:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error register:", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`);
    return response.data;
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// ===== EXISTING APIs =====

export const updateBarang = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/barang/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error mengupdate barang:", error);
    throw error;
  }
};

export const deleteBarang = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/barang/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error menghapus barang:", error);
    throw error;
  }
};

export const getAllBarang = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/barang`);
    return response.data;
  } catch (error) {
    console.error("Error mengambil data barang:", error);
    throw error;
  }
};

export const getBarangById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/barang/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error mengambil detail barang:", error);
    throw error;
  }
};

export const getAllKategori = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/kategori`);
    return response.data;
  } catch (error) {
    console.error("Gagal ambil kategori:", error);
    throw error;
  }
};

export const updateKategori = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/kategori/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error mengupdate kategori:", error);
    throw error;
  }
};

export const deleteKategori = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/kategori/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error menghapus kategori:", error);
    throw error;
  }
};

export const getAllPeminjaman = async (search = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/peminjaman`, {
      params: { search }
    });
    return response.data;
  } catch (error) {
    console.error("Error mengambil data peminjaman:", error);
    throw error;
  }
};

export const createPeminjaman = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/peminjaman`, data);
    return response.data;
  } catch (error) {
    console.error("Error menambah peminjaman:", error);
    throw error;
  }
};

export const updatePeminjaman = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/peminjaman/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error mengupdate peminjaman:", error);
    throw error;
  }
};

export const deletePeminjaman = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/peminjaman/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error menghapus peminjaman:", error);
    throw error;
  }
};

export const getLaporanPeminjaman = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/laporan/peminjaman`);
    return response.data;
  } catch (error) {
    console.error("Gagal ambil data laporan:", error);
    throw error;
  }
};
