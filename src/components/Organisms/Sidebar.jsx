import {
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from "@heroicons/react/20/solid";


import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: ChartBarIcon, path: "/" },
  { label: "Barang", icon: CubeIcon, path: "/barang" },
  { label: "Kategori", icon: TagIcon, path: "/kategori" },
  { label: "Peminjaman", icon: ClipboardDocumentListIcon, path: "/peminjaman" },
  { label: "Laporan", icon: ChartBarIcon, path: "/laporan" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-md p-4 fixed">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Inventaris</h1>
      <ul className="space-y-2">
        {menu.map((item) => (
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
    </aside>
  );
}
