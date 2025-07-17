// components/AdminOnly.jsx
import { isAdmin } from "../utils/auth";

/**
 * Component wrapper untuk fitur yang hanya bisa diakses admin
 * @param {React.ReactNode} children - Component yang akan di-wrap
 * @param {React.ReactNode} fallback - Component yang ditampilkan jika bukan admin (optional)
 */
const AdminOnly = ({ children, fallback = null }) => {
  if (!isAdmin()) {
    return fallback;
  }

  return children;
};

export default AdminOnly;
