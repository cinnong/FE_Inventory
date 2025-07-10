import Sidebar from "../components/organisms/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full p-6">{children}</main>
    </div>
  );
}
