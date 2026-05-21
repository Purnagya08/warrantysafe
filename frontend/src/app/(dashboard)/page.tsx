"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, FileUp, Loader2, Package, Plus, Shield, Wrench, XCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { formatDate, getWarrantyLabel } from "@/lib/utils";
import { ApiResponse, Product, Repair, Warranty } from "@/types";

type WarrantyStatus = "active" | "expiring_soon" | "expired" | "unknown";
type RepairWithProduct = Repair & {
  product?: Pick<Product, "id" | "name">;
  productName?: string;
};
type ExpiringWarranty = Warranty & {
  product?: Pick<Product, "id" | "name">;
  productName?: string;
};

const getWarrantyStatus = (endDate?: string): WarrantyStatus => {
  if (!endDate) return "unknown";
  const end = new Date(endDate);
  const now = new Date();
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 30) return "expiring_soon";
  return "active";
};

const getDaysLeft = (endDate?: string) => {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

function statusClass(status: string) {
  if (status === "active") return "badge-active";
  if (status === "expiring_soon") return "badge-expiring";
  if (status === "expired") return "badge-expired";
  return "badge-neutral";
}

function repairStatusClass(status: Repair["status"]) {
  if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-800";
  if (status === "COMPLETED") return "badge-active";
  if (status === "CANCELLED") return "badge-expired";
  return "badge-neutral";
}

function repairStatusLabel(status: Repair["status"]) {
  return status.replaceAll("_", " ");
}

function formatOptionalDate(date?: string) {
  return date ? formatDate(date) : "Not recorded";
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [expiringWarranties, setExpiringWarranties] = useState<ExpiringWarranty[]>([]);
  const [repairs, setRepairs] = useState<RepairWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const [productsRes, expiringRes, repairsRes] = await Promise.all([
          api.get<ApiResponse<Product[]>>("/products"),
          api.get<ApiResponse<ExpiringWarranty[]>>("/warranties/expiring"),
          api.get<ApiResponse<RepairWithProduct[]>>("/repairs"),
        ]);

        if (!active) return;
        setProducts(productsRes.data.data ?? []);
        setExpiringWarranties(expiringRes.data.data ?? []);
        setRepairs(repairsRes.data.data ?? []);
      } catch {
        if (!active) return;
        setError("Unable to load dashboard data. Please try again.");
        toast.error("Unable to load dashboard data");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const activeWarranties = products.filter((product) => getWarrantyStatus(product.warranty?.endDate) === "active").length;
    const expired = products.filter((product) => getWarrantyStatus(product.warranty?.endDate) === "expired").length;

    return {
      totalProducts: products.length,
      activeWarranties,
      expiringSoon: expiringWarranties.length,
      expired,
    };
  }, [expiringWarranties.length, products]);

  const recentProducts = useMemo(() => products.slice(0, 5), [products]);
  const recentRepairs = useMemo(() => repairs.slice(0, 3), [repairs]);

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "#2563EB" },
    { label: "Active Warranties", value: stats.activeWarranties, icon: Shield, color: "#067D62" },
    { label: "Expiring Soon", value: stats.expiringSoon, icon: AlertTriangle, color: "#B7791F" },
    { label: "Expired", value: stats.expired, icon: XCircle, color: "#C53030" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-[#4B5563]">
          <Loader2 size={22} className="animate-spin" />
          <span className="font-semibold">Loading ownership command center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Ownership Vault</h1>
          <p className="page-kicker">Your complete product ownership command center</p>
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

      {error && (
        <div className="card border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {products.length === 0 && !error ? (
        <div className="card flex min-h-64 flex-col items-center justify-center text-center">
          <Package size={34} className="mb-3 text-[#6B7280]" />
          <h3>No products yet. Add your first product.</h3>
          <Link href="/products/add" className="btn-primary mt-4">
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      ) : (
        <>
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
                      <th>Purchase Date</th>
                      <th>Warranty Expiry</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => {
                      const warrantyStatus = getWarrantyStatus(product.warranty?.endDate);
                      const statusLabel = warrantyStatus === "unknown" ? "No Warranty" : getWarrantyLabel(warrantyStatus);

                      return (
                        <tr key={product.id}>
                          <td data-label="Product">
                            <Link href={`/products/${product.id}`} className="font-semibold text-[#B26A00] hover:underline">
                              {product.name}
                            </Link>
                          </td>
                          <td data-label="Brand">{product.brand ?? "Unknown"}</td>
                          <td data-label="Category">{product.category ?? "Not recorded"}</td>
                          <td data-label="Purchase Date">{formatOptionalDate(product.purchaseDate)}</td>
                          <td data-label="Warranty Expiry">{formatOptionalDate(product.warranty?.endDate)}</td>
                          <td data-label="Status"><span className={`status-badge ${statusClass(warrantyStatus)}`}>{statusLabel}</span></td>
                        </tr>
                      );
                    })}
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
                  {expiringWarranties.length === 0 ? (
                    <p className="text-sm text-[#6B7280]">No warranties expiring soon.</p>
                  ) : (
                    expiringWarranties.map((warranty) => {
                      const daysLeft = getDaysLeft(warranty.endDate);
                      const timelineStatus = daysLeft !== null && daysLeft <= 30 ? "expiring_soon" : "active";

                      return (
                        <div className="border-l-2 border-[#E5E7EB] pl-3" key={warranty.id}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">{warranty.product?.name ?? warranty.productName ?? "Product"}</p>
                            <span className={`status-badge ${statusClass(timelineStatus)}`}>{timelineStatus === "expiring_soon" ? "Expiring Soon" : "Active"}</span>
                          </div>
                          <p className="text-xs text-[#6B7280]">
                            {formatOptionalDate(warranty.endDate)} - {daysLeft === null ? "Date not recorded" : `${daysLeft} days remaining`}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="card">
                <div className="mb-3 flex items-center gap-2">
                  <Wrench size={18} className="text-[#6B7280]" />
                  <h4>Repair Activity</h4>
                </div>
                <div className="space-y-2">
                  {recentRepairs.length === 0 ? (
                    <p className="text-sm text-[#6B7280]">No recent repair activity.</p>
                  ) : (
                    recentRepairs.map((repair) => (
                      <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-[#E5E7EB] py-2 last:border-0" key={repair.id}>
                        <div>
                          <p className="font-semibold">{repair.product?.name ?? repair.productName ?? "Product"}</p>
                          <p className="text-xs text-[#6B7280]">{repair.issue}</p>
                        </div>
                        <span className={`status-badge ${repairStatusClass(repair.status)}`}>{repairStatusLabel(repair.status)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
