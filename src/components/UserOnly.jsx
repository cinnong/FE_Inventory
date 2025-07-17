// components/UserOnly.jsx
import { isUser } from "../utils/auth";

/**
 * Component wrapper untuk fitur yang hanya bisa diakses user biasa
 * @param {React.ReactNode} children - Component yang akan di-wrap
 * @param {React.ReactNode} fallback - Component yang ditampilkan jika bukan user (optional)
 */
const UserOnly = ({ children, fallback = null }) => {
  if (!isUser()) {
    return fallback;
  }

  return children;
};

export default UserOnly;
