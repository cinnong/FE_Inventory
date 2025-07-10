import axios from "axios";


const API_BASE_URL = "http://localhost:3000/api";

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



export const getAllPeminjaman = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/peminjaman`);
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

export const getLaporanPeminjaman = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/laporan/peminjaman`);
    return response.data;
  } catch (error) {
    console.error("Gagal ambil data laporan:", error);
    throw error;
  }
};
