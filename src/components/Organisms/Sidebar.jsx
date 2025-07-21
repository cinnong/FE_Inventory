import {
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import { Link, useLocation } from "react-router-dom";
import { logout } from "../../services/api";
import { getUserDisplayInfo } from "../../utils/auth";
import { useState, useEffect } from "react";
import { useSidebar } from "../../context/SidebarContext";

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
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Get user info menggunakan utility function
  const userInfo = getUserDisplayInfo();
  const currentUserRole = userInfo?.role || "user";

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSidebarOpen]);

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
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors duration-200"
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r shadow-md z-40
          w-[280px] md:w-64
          transition-all duration-300 ease-in-out transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-indigo-700">
              Inventaris
            </h1>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-1.5 rounded-lg hover:bg-indigo-50 text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-2">
            <ul className="space-y-1">
              {filteredMenu.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      text-sm transition-colors duration-200
                      ${location.pathname === item.path
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info and logout section */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="mb-3">
              <p className="font-medium text-gray-900 text-sm">
                {userInfo?.username || "User"}
              </p>
              <span
                className={`
                  inline-block px-2 py-0.5 rounded-full text-xs mt-1
                  ${userInfo?.isAdmin
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                  }
                `}
              >
                {userInfo?.role || "user"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-center gap-2 
                px-3 py-2 rounded-lg text-sm
                text-red-600 hover:bg-red-50 hover:text-red-700 
                transition-colors duration-200
              "
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );

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
    
}
