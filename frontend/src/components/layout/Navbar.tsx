"use client";

import { Bell, ChevronDown, FileUp, LogOut, Search, Shield, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center gap-4 bg-[#131921] px-4">
      <Link href="/" className="flex h-10 shrink-0 items-center gap-2 pr-2 text-white">
        <Shield size={24} className="text-[#FF9900]" />
        <span className="text-base font-bold">WarrantySafe</span>
      </Link>

      <div className="relative hidden max-w-2xl flex-1 md:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          aria-label="Global search"
          className="h-10 w-full rounded-md border border-[#3B4856] bg-[#232F3E] pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-300 focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/30"
          placeholder="Search products, invoices, warranties, repairs"
          type="search"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/upload-invoice" className="btn-primary hidden sm:inline-flex">
          <FileUp size={16} />
          Import Invoice
        </Link>

        <Link
          aria-label="Notifications"
          href="/notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF9900]" />
        </Link>

        <div className="hidden h-10 items-center gap-2 rounded-md px-2 text-white hover:bg-white/10 sm:flex">
          <User size={16} />
          <span className="max-w-32 truncate text-sm font-semibold">{user?.name || "Account"}</span>
          <ChevronDown size={14} className="text-gray-300" />
        </div>

        <button
          aria-label="Sign out"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-200 hover:bg-white/10"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={17} />
        </button>
      </div>
    </nav>
  );
}
