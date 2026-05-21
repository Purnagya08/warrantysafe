"use client";

import { useState } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import { formatDate, getWarrantyLabel } from "@/lib/utils";

const WARRANTIES = [
  { _id: "1", productName: 'Samsung 65" QLED TV', brand: "Samsung", expiryDate: "2026-12-01", status: "active", daysLeft: 559 },
  { _id: "2", productName: "iPhone 15 Pro", brand: "Apple", expiryDate: "2026-06-15", status: "expiring_soon", daysLeft: 25 },
  { _id: "3", productName: "LG 1.5 Ton AC", brand: "LG", expiryDate: "2025-03-10", status: "expired", daysLeft: -437 },
  { _id: "4", productName: "Dell XPS 15", brand: "Dell", expiryDate: "2027-01-20", status: "active", daysLeft: 244 },
  { _id: "5", productName: "Whirlpool Refrigerator", brand: "Whirlpool", expiryDate: "2027-08-05", status: "active", daysLeft: 441 },
];

const TABS = ["All", "Active", "Expiring Soon", "Expired"];

function statusClass(status: string) {
  if (status === "active") return "badge-active";
  if (status === "expiring_soon") return "badge-expiring";
  return "badge-expired";
}

export default function WarrantiesPage() {
  const [tab, setTab] = useState("All");
  const filtered = WARRANTIES.filter((warranty) => {
    if (tab === "All") return true;
    if (tab === "Active") return warranty.status === "active";
    if (tab === "Expiring Soon") return warranty.status === "expiring_soon";
    return warranty.status === "expired";
  });

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Warranties</h1>
          <p className="page-kicker">Dense operational list of active, expiring, and expired coverage.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Active", count: WARRANTIES.filter((w) => w.status === "active").length, color: "#067D62" },
          { label: "Expiring Soon", count: WARRANTIES.filter((w) => w.status === "expiring_soon").length, color: "#B7791F" },
          { label: "Expired", count: WARRANTIES.filter((w) => w.status === "expired").length, color: "#C53030" },
        ].map((summary) => (
          <div className="card metric-card" key={summary.label}>
            <span className="icon-box"><Shield size={18} style={{ color: summary.color }} /></span>
            <div>
              <p className="text-2xl font-bold" style={{ color: summary.color }}>{summary.count}</p>
              <p className="text-xs font-semibold text-[#6B7280]">{summary.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-0">
        <div className="section-title">
          <div className="flex flex-wrap gap-1">
            {TABS.map((item) => (
              <button className={`h-9 rounded-md px-3 text-sm font-semibold ${tab === item ? "bg-[#232F3E] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"}`} key={item} onClick={() => setTab(item)} type="button">
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Product</th><th>Brand</th><th>Expiry Date</th><th>Days Left</th><th>Status</th><th>Risk</th></tr>
            </thead>
            <tbody>
              {filtered.map((warranty) => (
                <tr key={warranty._id}>
                  <td className="font-semibold">{warranty.productName}</td>
                  <td>{warranty.brand}</td>
                  <td>{formatDate(warranty.expiryDate)}</td>
                  <td>{warranty.daysLeft > 0 ? `${warranty.daysLeft} days` : "Expired"}</td>
                  <td><span className={`status-badge ${statusClass(warranty.status)}`}>{getWarrantyLabel(warranty.status)}</span></td>
                  <td>{warranty.status === "expiring_soon" ? <span className="inline-flex items-center gap-1 text-[#B7791F]"><AlertTriangle size={14} /> Action needed</span> : "Standard"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
