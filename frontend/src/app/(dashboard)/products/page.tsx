"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { formatDate, getWarrantyLabel } from "@/lib/utils";
import { Product } from "@/types";

const MOCK_PRODUCTS: Product[] = [
  { _id: "1", userId: "1", name: 'Samsung 65" QLED TV', brand: "Samsung", category: "Television", purchaseDate: "2024-12-01", price: 85000, warrantyDuration: 24, warrantyExpiry: "2026-12-01", warrantyStatus: "active", createdAt: "2024-12-01" },
  { _id: "2", userId: "1", name: "iPhone 15 Pro", brand: "Apple", category: "Smartphone", purchaseDate: "2025-06-15", price: 134900, warrantyDuration: 12, warrantyExpiry: "2026-06-15", warrantyStatus: "expiring_soon", createdAt: "2025-06-15" },
  { _id: "3", userId: "1", name: "LG 1.5 Ton AC", brand: "LG", category: "Air Conditioner", purchaseDate: "2023-03-10", price: 42000, warrantyDuration: 24, warrantyExpiry: "2025-03-10", warrantyStatus: "expired", createdAt: "2023-03-10" },
  { _id: "4", userId: "1", name: "Dell XPS 15", brand: "Dell", category: "Laptop", purchaseDate: "2025-01-20", price: 189000, warrantyDuration: 24, warrantyExpiry: "2027-01-20", warrantyStatus: "active", createdAt: "2025-01-20" },
  { _id: "5", userId: "1", name: "Whirlpool 340L Refrigerator", brand: "Whirlpool", category: "Refrigerator", purchaseDate: "2024-08-05", price: 35000, warrantyDuration: 36, warrantyExpiry: "2027-08-05", warrantyStatus: "active", createdAt: "2024-08-05" },
];

const CATEGORIES = ["All", "Television", "Smartphone", "Laptop", "Air Conditioner", "Refrigerator", "Washing Machine"];
const STATUSES = ["All", "active", "expiring_soon", "expired"];

function statusClass(status: string) {
  if (status === "active") return "badge-active";
  if (status === "expiring_soon") return "badge-expiring";
  return "badge-expired";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => {
        const data = res.data?.data;
        if (data?.length > 0) setProducts(data);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query);
      const matchesCategory = category === "All" || product.category === category;
      const matchesStatus = status === "All" || product.warrantyStatus === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, products, search, status]);

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Ownership Vault</h1>
          <p className="page-kicker">{filtered.length} of {products.length} products shown</p>
        </div>
        <Link href="/products/add" className="btn-primary">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="card">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_200px_auto]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input className="input-field pl-9" onChange={(event) => setSearch(event.target.value)} placeholder="Search by product or brand" value={search} />
          </div>
          <select className="input-field" onChange={(event) => setCategory(event.target.value)} value={category}>
            {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="input-field" onChange={(event) => setStatus(event.target.value)} value={status}>
            {STATUSES.map((item) => (
              <option key={item} value={item}>{item === "All" ? "All Statuses" : getWarrantyLabel(item)}</option>
            ))}
          </select>
          <button className="btn-secondary" type="button">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="card p-0">
        <div className="section-title">
          <h4>Product Register</h4>
          <span className="text-xs font-semibold text-[#6B7280]">Sortable table structure</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Purchase Date</th>
                <th className="text-right">Price</th>
                <th>Warranty Expiry</th>
                <th>Status</th>
                <th className="w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id}>
                  <td>
                    <Link href={`/products/${product._id}`} className="font-semibold text-[#B26A00] hover:underline">{product.name}</Link>
                  </td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{formatDate(product.purchaseDate)}</td>
                  <td className="text-right">Rs. {product.price?.toLocaleString("en-IN")}</td>
                  <td>{formatDate(product.warrantyExpiry)}</td>
                  <td><span className={`status-badge ${statusClass(product.warrantyStatus)}`}>{getWarrantyLabel(product.warrantyStatus)}</span></td>
                  <td>
                    <Link aria-label={`View ${product.name}`} href={`/products/${product._id}`} className="btn-secondary h-8 px-2">
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-10 text-center text-[#6B7280]">No products match the selected filters.</div>}
      </div>
    </div>
  );
}
