"use client";

import { useState } from "react";
import { ArrowLeft, FileUp, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";

const CATEGORIES = ["Television", "Smartphone", "Laptop", "Air Conditioner", "Refrigerator", "Washing Machine", "Microwave", "Furniture", "Audio", "Camera", "Vehicle", "Other"];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    purchaseDate: "",
    price: "",
    warrantyDuration: "",
    serialNumber: "",
    retailer: "",
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/products", {
        ...form,
        price: Number(form.price),
        warrantyDuration: Number(form.warrantyDuration),
      });
      toast.success("Product added");
      router.push("/products");
    } catch {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="input-label">{label}</label>
      <input className="input-field" onChange={(event) => update(key, event.target.value)} placeholder={placeholder} type={type} value={form[key]} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div className="flex items-start gap-3">
          <Link href="/products" className="btn-secondary h-10 w-10 px-0" aria-label="Back to products">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1>Add Product</h1>
            <p className="page-kicker">Create a structured ownership record with purchase and warranty data.</p>
          </div>
        </div>
      </div>

      <form className="grid gap-5 xl:grid-cols-[1fr_360px]" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="card">
            <h4 className="mb-4">Product Metadata</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {field("Product Name", "name", "text", "Samsung 65 inch QLED TV")}
              {field("Brand", "brand", "text", "Samsung")}
              <div>
                <label className="input-label">Category</label>
                <select className="input-field" onChange={(event) => update("category", event.target.value)} value={form.category}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
              {field("Serial Number", "serialNumber", "text", "Optional")}
            </div>
          </div>

          <div className="card">
            <h4 className="mb-4">Purchase Details</h4>
            <div className="grid gap-4 md:grid-cols-3">
              {field("Purchase Date", "purchaseDate", "date")}
              {field("Price (Rs.)", "price", "number", "0")}
              {field("Retailer / Store", "retailer", "text", "Amazon India")}
            </div>
          </div>

          <div className="card">
            <h4 className="mb-4">Warranty Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {field("Warranty Duration (months)", "warrantyDuration", "number", "12")}
              <div>
                <label className="input-label">Warranty Type</label>
                <select className="input-field" defaultValue="manufacturer">
                  <option value="manufacturer">Manufacturer Warranty</option>
                  <option value="extended">Extended Warranty</option>
                  <option value="seller">Seller Support</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card">
            <h4 className="mb-4">Receipt Upload</h4>
            <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-4 text-center">
              <FileUp size={24} className="mb-2 text-[#6B7280]" />
              <p className="font-semibold">Attach invoice or warranty card</p>
              <p className="mt-1 text-xs text-[#6B7280]">PDF, JPG, PNG up to 10 MB</p>
            </div>
          </div>
          <div className="card">
            <h4 className="mb-3">Actions</h4>
            <div className="space-y-2">
              <button className="btn-primary w-full" disabled={loading} type="submit">
                <Save size={16} />
                {loading ? "Saving..." : "Save Product"}
              </button>
              <Link href="/products" className="btn-secondary w-full">Cancel</Link>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
