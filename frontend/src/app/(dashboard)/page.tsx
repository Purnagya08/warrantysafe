"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  FileUp,
  Package,
  Plus,
  Shield,
  Wrench,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { formatDate, getWarrantyLabel } from "@/lib/utils";

const MOCK_STATS = {
  totalProducts: 12,
  activeWarranties: 7,
  expiringSoon: 3,
  expired: 2,
  recentProducts: [
    { _id: "1", name: 'Samsung 65" QLED TV', brand: "Samsung", category: "Television", warrantyStatus: "active", warrantyExpiry: "2026-12-01", purchaseDate: "2024-12-01", price: 85000 },
    { _id: "2", name: "iPhone 15 Pro", brand: "Apple", category: "Smartphone", warrantyStatus: "expiring_soon", warrantyExpiry: "2026-06-15", purchaseDate: "2025-06-15", price: 134900 },
    { _id: "3", name: "LG 1.5 Ton AC", brand: "LG", category: "Air Conditioner", warrantyStatus: "expired", warrantyExpiry: "2025-03-10", purchaseDate: "2023-03-10", price: 42000 },
    { _id: "4", name: "Dell XPS 15 Laptop", brand: "Dell", category: "Laptop", warrantyStatus: "active", warrantyExpiry: "2027-01-20", purchaseDate: "2025-01-20", price: 189000 },
    { _id: "5", name: "Whirlpool Refrigerator", brand: "Whirlpool", category: "Refrigerator", warrantyStatus: "active", warrantyExpiry: "2027-08-05", purchaseDate: "2024-08-05", price: 35000 },
  ],
};

const expiryTimeline = [
  { product: "iPhone 15 Pro", date: "2026-06-15", note: "25 days remaining", status: "expiring_soon" },
  { product: "Sony WH-1000XM5", date: "2026-07-08", note: "48 days remaining", status: "expiring_soon" },
  { product: "Dell XPS 15 Laptop", date: "2027-01-20", note: "Extended support active", status: "active" },
];

const repairActivity = [
  { product: "iPhone 15 Pro", issue: "Screen repair", owner: "Apple Service", status: "In Progress" },
  { product: "Samsung TV", issue: "Remote replacement", owner: "Vendor", status: "Open" },
  { product: "LG AC", issue: "Cooling service", owner: "Rajesh Kumar", status: "Completed" },
];

const reminders = [
  "Schedule AC filter maintenance before peak summer usage.",
  "Upload refrigerator compressor warranty document.",
  "Review marketplace service plan for laptop protection.",
];

function statusClass(status: string) {
  if (status === "active") return "badge-active";
  if (status === "expiring_soon") return "badge-expiring";
  return "badge-expired";
}

export default function DashboardPage() {
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => {
        const products = res.data?.data || [];
        if (products.length > 0) {
          setStats((prev) => ({ ...prev, totalProducts: products.length, recentProducts: products.slice(0, 5) }));
        }
      })
      .catch(() => {});
  }, []);

  const statCards = [
    { label: "Products", value: stats.totalProducts, icon: Package, color: "#111827" },
    { label: "Active Warranties", value: stats.activeWarranties, icon: Shield, color: "#067D62" },
    { label: "Expiring Soon", value: stats.expiringSoon, icon: AlertTriangle, color: "#B7791F" },
    { label: "Expired", value: stats.expired, icon: XCircle, color: "#C53030" },
  ];

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-kicker">Operational overview of ownership, warranty risk, and service actions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/upload-invoice" className="btn-secondary">
            <FileUp size={16} />
            Import Invoice
          </Link>
          <Link href="/products/add" className="btn-primary">
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div className="card metric-card" key={card.label}>
              <span className="icon-box">
                <Icon size={19} style={{ color: card.color }} />
              </span>
              <div>
                <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                <p className="text-xs font-semibold text-[#6B7280]">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-0">
          <div className="section-title">
            <h4>Recent Imports</h4>
            <Link href="/products" className="text-sm font-semibold text-[#B26A00]">View all</Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Purchase</th>
                  <th>Warranty Expiry</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <Link href={`/products/${product._id}`} className="font-semibold text-[#B26A00] hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>{formatDate(product.purchaseDate)}</td>
                    <td>{formatDate(product.warrantyExpiry)}</td>
                    <td><span className={`status-badge ${statusClass(product.warrantyStatus)}`}>{getWarrantyLabel(product.warrantyStatus)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock size={18} className="text-[#B7791F]" />
              <h4>Upcoming Expiry Timeline</h4>
            </div>
            <div className="space-y-3">
              {expiryTimeline.map((item) => (
                <div className="border-l-2 border-[#E5E7EB] pl-3" key={item.product}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.product}</p>
                    <span className={`status-badge ${statusClass(item.status)}`}>{getWarrantyLabel(item.status)}</span>
                  </div>
                  <p className="text-xs text-[#6B7280]">{formatDate(item.date)} - {item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="mb-3 flex items-center gap-2">
              <Wrench size={18} className="text-[#6B7280]" />
              <h4>Repair Activity</h4>
            </div>
            <div className="space-y-2">
              {repairActivity.map((repair) => (
                <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-[#E5E7EB] py-2 last:border-0" key={`${repair.product}-${repair.issue}`}>
                  <div>
                    <p className="font-semibold">{repair.product}</p>
                    <p className="text-xs text-[#6B7280]">{repair.issue} - {repair.owner}</p>
                  </div>
                  <span className="status-badge badge-neutral">{repair.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h4 className="mb-3">Maintenance Reminders</h4>
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div className="flex items-start gap-2 text-sm" key={reminder}>
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#B7791F]" />
                <span>{reminder}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h4 className="mb-3">Service Recommendations</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/repairs" className="btn-secondary justify-start">Review open repairs</Link>
            <Link href="/warranties" className="btn-secondary justify-start">Audit expiring warranties</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
