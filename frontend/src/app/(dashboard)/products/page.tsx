"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownUp, Eye, Filter, Plus, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { formatDate, getWarrantyLabel } from "@/lib/utils";
import { ApiResponse, Product } from "@/types";

const MOCK_PRODUCTS: Product[] = [
  { id: "1", userId: "1", name: 'Samsung 65" QLED TV', brand: "Samsung", category: "Television", purchaseDate: "2024-12-01", purchasePrice: 85000, createdAt: "2024-12-01", updatedAt: "2024-12-01", warranty: { id: "w1", productId: "1", startDate: "2024-12-01", endDate: "2026-12-01", warrantyType: "MANUFACTURER", reminderSent: false, createdAt: "2024-12-01", updatedAt: "2024-12-01" } },
  { id: "2", userId: "1", name: "iPhone 15 Pro", brand: "Apple", category: "Smartphone", purchaseDate: "2025-06-15", purchasePrice: 134900, createdAt: "2025-06-15", updatedAt: "2025-06-15", warranty: { id: "w2", productId: "2", startDate: "2025-06-15", endDate: "2026-06-15", warrantyType: "MANUFACTURER", reminderSent: false, createdAt: "2025-06-15", updatedAt: "2025-06-15" } },
  { id: "3", userId: "1", name: "LG 1.5 Ton AC", brand: "LG", category: "Air Conditioner", purchaseDate: "2023-03-10", purchasePrice: 42000, createdAt: "2023-03-10", updatedAt: "2023-03-10", warranty: { id: "w3", productId: "3", startDate: "2023-03-10", endDate: "2025-03-10", warrantyType: "MANUFACTURER", reminderSent: false, createdAt: "2023-03-10", updatedAt: "2023-03-10" } },
  { id: "4", userId: "1", name: "Dell XPS 15", brand: "Dell", category: "Laptop", purchaseDate: "2025-01-20", purchasePrice: 189000, createdAt: "2025-01-20", updatedAt: "2025-01-20", warranty: { id: "w4", productId: "4", startDate: "2025-01-20", endDate: "2027-01-20", warrantyType: "EXTENDED", reminderSent: false, createdAt: "2025-01-20", updatedAt: "2025-01-20" } },
  { id: "5", userId: "1", name: "Whirlpool 340L Refrigerator", brand: "Whirlpool", category: "Refrigerator", purchaseDate: "2024-08-05", purchasePrice: 35000, createdAt: "2024-08-05", updatedAt: "2024-08-05", warranty: { id: "w5", productId: "5", startDate: "2024-08-05", endDate: "2027-08-05", warrantyType: "MANUFACTURER", reminderSent: false, createdAt: "2024-08-05", updatedAt: "2024-08-05" } },
];

const CATEGORIES = ["All", "Television", "Smartphone", "Laptop", "Air Conditioner", "Refrigerator", "Washing Machine"];
const STATUSES = ["All", "active", "expiring_soon", "expired"];
type WarrantyStatus = "active" | "expiring_soon" | "expired" | "unknown";
type SortKey = "name" | "brand" | "category" | "purchaseDate" | "purchasePrice" | "warrantyEndDate" | "warrantyStatus";

const getWarrantyStatus = (endDate?: string): WarrantyStatus => {
  if (!endDate) return "unknown";
  const end = new Date(endDate);
  const now = new Date();
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 30) return "expiring_soon";
  return "active";
};

function statusClass(status: string) {
  if (status === "active") return "badge-active";
  if (status === "expiring_soon") return "badge-expiring";
  if (status === "expired") return "badge-expired";
  return "badge-neutral";
}

function sortValue(product: Product, key: SortKey) {
  if (key === "purchasePrice") return product.purchasePrice ?? 0;
  if (key === "purchaseDate") return product.purchaseDate ? new Date(product.purchaseDate).getTime() : 0;
  if (key === "warrantyEndDate") return product.warranty?.endDate ? new Date(product.warranty.endDate).getTime() : 0;
  if (key === "warrantyStatus") return getWarrantyStatus(product.warranty?.endDate);
  if (key === "brand") return (product.brand ?? "Unknown").toLowerCase();
  if (key === "category") return (product.category ?? "").toLowerCase();
  return String(product[key]).toLowerCase();
}

function formatOptionalDate(date?: string) {
  return date ? formatDate(date) : "Not recorded";
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });

  const productsQuery = useQuery<Product[]>({
    queryKey: ["mock-products"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product[]>>("/products");
      return res.data?.data ?? MOCK_PRODUCTS;
    },
    initialData: MOCK_PRODUCTS,
    retry: 1,
  });

  const products = productsQuery.data;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products
      .filter((product) => {
        const warrantyStatus = getWarrantyStatus(product.warranty?.endDate);
        const matchesSearch = !query || product.name.toLowerCase().includes(query) || (product.brand ?? "Unknown").toLowerCase().includes(query);
        const matchesCategory = category === "All" || product.category === category;
        const matchesStatus = status === "All" || warrantyStatus === status;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = sortValue(a, sort.key);
        const bValue = sortValue(b, sort.key);
        const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return sort.direction === "asc" ? result : -result;
      });
  }, [category, products, search, sort, status]);

  const updateSort = (key: SortKey) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortLabel = (key: SortKey) => (sort.key === key ? (sort.direction === "asc" ? " asc" : " desc") : "");

  return (
    <div className="space-y-5 bg-gray-50 min-h-full">
      <div className="page-header">
        <div>
          <h1>Ownership Vault</h1>
          <p className="page-kicker">{filtered.length} of {products.length} products shown {productsQuery.isFetching ? "- syncing" : ""}</p>
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

      <div className="card p-0 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="section-title">
          <h4>Product Register</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6B7280]">Sortable table</span>
            {productsQuery.isError && (
              <button className="btn-secondary h-8 px-2 text-xs" onClick={() => productsQuery.refetch()} type="button">
                <RefreshCw size={13} />
                Retry
              </button>
            )}
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {[
                  ["Product", "name"],
                  ["Brand", "brand"],
                  ["Category", "category"],
                  ["Purchase Date", "purchaseDate"],
                  ["Price", "purchasePrice"],
                  ["Warranty Expiry", "warrantyEndDate"],
                  ["Status", "warrantyStatus"],
                ].map(([label, key]) => (
                  <th className={`sortable-th ${key === "purchasePrice" ? "text-right" : ""}`} key={key}>
                    <button onClick={() => updateSort(key as SortKey)} type="button">
                      {label}{sortLabel(key as SortKey)} <ArrowDownUp size={12} />
                    </button>
                  </th>
                ))}
                <th className="w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {productsQuery.isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td data-label="Product" colSpan={8}><div className="skeleton h-5 rounded" /></td>
                    </tr>
                  ))
                : filtered.map((product) => {
                    const warrantyStatus = getWarrantyStatus(product.warranty?.endDate);
                    return (
                    <tr key={product.id}>
                      <td data-label="Product">
                        <Link href={`/products/${product.id}`} className="font-semibold text-[#B26A00] hover:underline">{product.name}</Link>
                      </td>
                      <td data-label="Brand">{product.brand ?? "Unknown"}</td>
                      <td data-label="Category">{product.category ?? "Not recorded"}</td>
                      <td data-label="Purchase Date">{formatOptionalDate(product.purchaseDate)}</td>
                      <td data-label="Price" className="text-right">Rs. {product.purchasePrice?.toLocaleString("en-IN") ?? "0"}</td>
                      <td data-label="Warranty Expiry">{formatOptionalDate(product.warranty?.endDate)}</td>
                      <td data-label="Status"><span className={`status-badge ${statusClass(warrantyStatus)}`}>{getWarrantyLabel(warrantyStatus)}</span></td>
                      <td data-label="Action">
                        <Link aria-label={`View ${product.name}`} href={`/products/${product.id}`} className="btn-secondary h-8 px-2">
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  )})}
            </tbody>
          </table>
        </div>
        {!productsQuery.isLoading && filtered.length === 0 && <div className="py-10 text-center text-[#6B7280]">No products match the selected filters.</div>}
      </div>
    </div>
  );
}
