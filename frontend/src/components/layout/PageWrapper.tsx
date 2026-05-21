import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />
      <Sidebar />
      <main className="pt-16 md:pl-56">
        <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-5 lg:px-6">{children}</div>
      </main>
    </div>
  );
}
