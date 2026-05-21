"use client";

import {
  Bell,
  BarChart3,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Shield,
  Upload,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Ownership Vault", href: "/products", icon: Package },
  { label: "Warranties", href: "/warranties", icon: Shield },
  { label: "Repairs", href: "/repairs", icon: Wrench },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Imports", href: "/upload-invoice", icon: Upload },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-56 overflow-y-auto bg-[#232F3E] md:block">
      <div className="py-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              className={`flex h-11 items-center gap-3 border-l-4 px-4 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-[#FF9900] bg-[#131921] text-[#FF9900]"
                  : "border-transparent text-gray-100 hover:bg-[#1B2531] hover:text-white"
              }`}
              href={item.href}
              key={item.href}
              style={{
                color: isActive ? "#FF9900" : "#F9FAFB",
              }}
            >
              <Icon size={16} color={isActive ? "#FF9900" : "#F9FAFB"} />
              <span style={{ color: isActive ? "#FF9900" : "#F9FAFB" }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
