// utils/auth.js
/**
 * Utility functions untuk authentication dan authorization
 */

// Get current user dari localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Check apakah user sudah login
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();
  return !!(token && user);
};

// Check apakah user adalah admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

// Check apakah user adalah user biasa
export const isUser = () => {
  const user = getCurrentUser();
  return user && user.role === "user";
};

// Check apakah user memiliki permission untuk action tertentu
export const hasPermission = (action) => {
  const user = getCurrentUser();
  if (!user) return false;

  // Admin bisa semua
  if (user.role === "admin") return true;

  // Permission untuk user biasa
  const userPermissions = [
    "view_barang",
    "view_kategori",
    "view_peminjaman",
    "create_peminjaman",
  ];

  return userPermissions.includes(action);
};

// Get user display info
export const getUserDisplayInfo = () => {
  const user = getCurrentUser();
  if (!user) return null;

  return {
    username: user.username || "User",
    email: user.email || "",
    role: user.role || "user",
    isAdmin: user.role === "admin",
  };
};
