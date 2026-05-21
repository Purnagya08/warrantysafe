"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownUp, Eye, Filter, Plus, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
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
type SortKey = "name" | "brand" | "category" | "purchaseDate" | "price" | "warrantyExpiry" | "warrantyStatus";

function statusClass(status: string) {
  if (status === "active") return "badge-active";
  if (status === "expiring_soon") return "badge-expiring";
  return "badge-expired";
}

function sortValue(product: Product, key: SortKey) {
  if (key === "price") return product.price;
  if (key === "purchaseDate" || key === "warrantyExpiry") return new Date(product[key]).getTime();
  return String(product[key]).toLowerCase();
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });

  const productsQuery = useQuery({
    queryKey: ["mock-products"],
    queryFn: async () => MOCK_PRODUCTS,
    initialData: MOCK_PRODUCTS,
    retry: 1,
  });

  const products = productsQuery.data;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products
      .filter((product) => {
        const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query);
        const matchesCategory = category === "All" || product.category === category;
        const matchesStatus = status === "All" || product.warrantyStatus === status;
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
    <div className="space-y-5">
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

      <div className="card p-0">
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
                  ["Price", "price"],
                  ["Warranty Expiry", "warrantyExpiry"],
                  ["Status", "warrantyStatus"],
                ].map(([label, key]) => (
                  <th className={`sortable-th ${key === "price" ? "text-right" : ""}`} key={key}>
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
                : filtered.map((product) => (
                    <tr key={product._id}>
                      <td data-label="Product">
                        <Link href={`/products/${product._id}`} className="font-semibold text-[#B26A00] hover:underline">{product.name}</Link>
                      </td>
                      <td data-label="Brand">{product.brand}</td>
                      <td data-label="Category">{product.category}</td>
                      <td data-label="Purchase Date">{formatDate(product.purchaseDate)}</td>
                      <td data-label="Price" className="text-right">Rs. {product.price?.toLocaleString("en-IN")}</td>
                      <td data-label="Warranty Expiry">{formatDate(product.warrantyExpiry)}</td>
                      <td data-label="Status"><span className={`status-badge ${statusClass(product.warrantyStatus)}`}>{getWarrantyLabel(product.warrantyStatus)}</span></td>
                      <td data-label="Action">
                        <Link aria-label={`View ${product.name}`} href={`/products/${product._id}`} className="btn-secondary h-8 px-2">
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!productsQuery.isLoading && filtered.length === 0 && <div className="py-10 text-center text-[#6B7280]">No products match the selected filters.</div>}
      </div>
    </div>
  );
}
