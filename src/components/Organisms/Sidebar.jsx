import {
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/20/solid";

import { Link, useLocation } from "react-router-dom";
import { logout } from "../../services/api";
import { getUserDisplayInfo } from "../../utils/auth";

const menu = [
  {
    label: "Dashboard",
    icon: ChartBarIcon,
    path: "/",
    roles: ["admin", "user"],
  },
  {
    label: "Barang",
    icon: CubeIcon,
    path: "/barang",
    roles: ["admin", "user"],
  },
  {
    label: "Kategori",
    icon: TagIcon,
    path: "/kategori",
    roles: ["admin", "user"],
  },
  {
    label: "Peminjaman",
    icon: ClipboardDocumentListIcon,
    path: "/peminjaman",
    roles: ["admin", "user"],
  },
  { label: "Laporan", icon: ChartBarIcon, path: "/laporan", roles: ["admin"] }, // Hanya admin
];

export default function Sidebar() {
  const location = useLocation();

  // Get user info menggunakan utility function
  const userInfo = getUserDisplayInfo();
  const currentUserRole = userInfo?.role || "user";

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout();
    }
  };

  // Filter menu berdasarkan role user
  const filteredMenu = menu.filter((item) =>
    item.roles.includes(currentUserRole)
  );

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-md p-4 fixed flex flex-col">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Inventaris</h1>
        <ul className="space-y-2">
          {filteredMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-100 transition ${
                  location.pathname === item.path
                    ? "bg-indigo-100 font-medium text-indigo-700"
                    : "text-gray-700"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User info and logout section */}
      <div className="border-t pt-4 mt-4">
        <div className="mb-3 px-3">
          <p className="font-medium text-gray-900">
            {userInfo?.username || "User"}
          </p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
              userInfo?.isAdmin
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {userInfo?.role || "user"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 hover:text-red-700 transition"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
