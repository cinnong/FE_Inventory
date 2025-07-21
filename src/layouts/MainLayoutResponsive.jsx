import Sidebar from "../components/Organisms/Sidebar";
import { useSidebar } from "../context/SidebarContext";

export default function MainLayoutResponsive({ children }) {
  const { isSidebarOpen } = useSidebar();

  // Sidebar width: 0 if closed on mobile, 16rem (64) if open or always on desktop
  return (
    <div className="flex">
      <Sidebar />
      <main
        className={`transition-all duration-300 w-full p-4 sm:p-6 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        {children}
      </main>
    </div>
  );
}
