"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, FileText, Package, Shield, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { formatDate, getWarrantyLabel } from "@/lib/utils";
import { Product } from "@/types";

const MOCK: Product = {
  _id: "1",
  userId: "1",
  name: 'Samsung 65" QLED TV',
  brand: "Samsung",
  category: "Television",
  purchaseDate: "2024-12-01",
  price: 85000,
  warrantyDuration: 24,
  warrantyExpiry: "2026-12-01",
  warrantyStatus: "active",
  createdAt: "2024-12-01",
};

const repairs = [
  { date: "2025-02-14", issue: "Panel calibration", status: "Completed", cost: "Rs. 0" },
  { date: "2025-11-20", issue: "Remote replacement", status: "Open", cost: "Pending" },
];

function statusClass(status: string) {
  if (status === "active") return "badge-active";
  if (status === "expiring_soon") return "badge-expiring";
  return "badge-expired";
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product>(MOCK);

  useEffect(() => {
    api
      .get(`/api/products/${id}`)
      .then((res) => {
        if (res.data?.data) setProduct(res.data.data);
      })
      .catch(() => {});
  }, [id]);

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div className="flex items-start gap-3">
          <Link href="/products" className="btn-secondary h-10 w-10 px-0" aria-label="Back to products">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1>{product.name}</h1>
              <span className={`status-badge ${statusClass(product.warrantyStatus)}`}>{getWarrantyLabel(product.warrantyStatus)}</span>
            </div>
            <p className="page-kicker">{product.brand} - {product.category}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/repairs" className="btn-secondary"><Wrench size={16} /> Log Repair</Link>
          <Link href="/upload-invoice" className="btn-primary"><FileText size={16} /> Add Document</Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="card metric-card">
          <span className="icon-box"><Package size={18} /></span>
          <div>
            <p className="text-sm font-semibold">{product.category}</p>
            <p className="text-xs text-[#6B7280]">Category</p>
          </div>
        </div>
        <div className="card metric-card">
          <span className="icon-box"><Calendar size={18} /></span>
          <div>
            <p className="text-sm font-semibold">{formatDate(product.purchaseDate)}</p>
            <p className="text-xs text-[#6B7280]">Purchase Date</p>
          </div>
        </div>
        <div className="card metric-card">
          <span className="icon-box"><Shield size={18} /></span>
          <div>
            <p className="text-sm font-semibold">{formatDate(product.warrantyExpiry)}</p>
            <p className="text-xs text-[#6B7280]">Warranty Expiry</p>
          </div>
        </div>
        <div className="card metric-card">
          <span className="icon-box"><FileText size={18} /></span>
          <div>
            <p className="text-sm font-semibold">Rs. {product.price?.toLocaleString("en-IN")}</p>
            <p className="text-xs text-[#6B7280]">Purchase Price</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="card">
            <h4 className="mb-4">Product Metadata</h4>
            <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
              {[
                ["Product Name", product.name],
                ["Brand", product.brand],
                ["Category", product.category],
                ["Purchase Date", formatDate(product.purchaseDate)],
                ["Purchase Price", `Rs. ${product.price?.toLocaleString("en-IN")}`],
                ["Warranty Duration", `${product.warrantyDuration} months`],
                ["Warranty Expiry", formatDate(product.warrantyExpiry)],
                ["Warranty Status", getWarrantyLabel(product.warrantyStatus)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-[#6B7280]">{label}</p>
                  <p className="mt-1 font-semibold">{value || "Not recorded"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-0">
            <div className="section-title"><h4>Repair History</h4></div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th>Issue</th><th>Status</th><th>Cost</th></tr>
                </thead>
                <tbody>
                  {repairs.map((repair) => (
                    <tr key={`${repair.date}-${repair.issue}`}>
                      <td>{formatDate(repair.date)}</td>
                      <td>{repair.issue}</td>
                      <td><span className="status-badge badge-neutral">{repair.status}</span></td>
                      <td>{repair.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h4 className="mb-3">Uploaded Invoice</h4>
            <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileText size={17} className="text-[#6B7280]" />
                <p className="font-semibold">Invoice document</p>
              </div>
              <p className="text-sm text-[#6B7280]">No verified invoice is attached to this record.</p>
            </div>
          </div>
          <div className="card">
            <h4 className="mb-3">Service Actions</h4>
            <div className="space-y-2">
              <Link href="/repairs" className="btn-secondary w-full justify-start">Open repair request</Link>
              <Link href="/warranties" className="btn-secondary w-full justify-start">Review warranty terms</Link>
              <Link href="/upload-invoice" className="btn-primary w-full justify-start">Upload invoice</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
