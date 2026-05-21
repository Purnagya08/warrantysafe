"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, IndianRupee, Package, RefreshCw, Shield, Wrench } from "lucide-react";

const ANALYTICS = {
  totalProducts: 12,
  activeWarranties: 7,
  expiringWarranties: 3,
  expiredWarranties: 2,
  repairSpend: 10500,
  categorySpend: [
    { category: "Electronics", spend: 408900 },
    { category: "Appliances", spend: 77000 },
    { category: "Computing", spend: 189000 },
  ],
  frequentRepairProducts: [
    { product: "LG 1.5 Ton AC", repairs: 3, spend: 6200 },
    { product: "iPhone 15 Pro", repairs: 2, spend: 8000 },
    { product: "Samsung QLED TV", repairs: 1, spend: 0 },
  ],
};

export default function AnalyticsPage() {
  const analyticsQuery = useQuery({
    queryKey: ["mock-analytics"],
    queryFn: async () => ANALYTICS,
    initialData: ANALYTICS,
    retry: 1,
  });

  const analytics = analyticsQuery.data;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-kicker">Warranty and ownership metrics from cached operational data {analyticsQuery.isFetching ? "- syncing" : ""}</p>
        </div>
        {analyticsQuery.isError && (
          <button className="btn-secondary" onClick={() => analyticsQuery.refetch()} type="button">
            <RefreshCw size={16} />
            Retry
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total Products", value: analytics.totalProducts, icon: Package, color: "#111827" },
          { label: "Active Warranties", value: analytics.activeWarranties, icon: Shield, color: "#067D62" },
          { label: "Expiring Warranties", value: analytics.expiringWarranties, icon: Shield, color: "#B7791F" },
          { label: "Expired Warranties", value: analytics.expiredWarranties, icon: Shield, color: "#C53030" },
          { label: "Repair Spend", value: `Rs. ${analytics.repairSpend.toLocaleString("en-IN")}`, icon: IndianRupee, color: "#111827" },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div className="card metric-card" key={metric.label}>
              <span className="icon-box"><Icon size={18} style={{ color: metric.color }} /></span>
              <div>
                <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
                <p className="text-xs font-semibold text-[#6B7280]">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} />
            <h4>Category Spend</h4>
          </div>
          <div className="space-y-3">
            {analytics.categorySpend.map((item) => {
              const max = Math.max(...analytics.categorySpend.map((category) => category.spend));
              return (
                <div key={item.category}>
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <span>{item.category}</span>
                    <span>Rs. {item.spend.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-2 rounded bg-[#E5E7EB]">
                    <div className="h-2 rounded bg-[#FF9900]" style={{ width: `${(item.spend / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-0">
          <div className="section-title">
            <div className="flex items-center gap-2">
              <Wrench size={18} />
              <h4>Frequent Repair Products</h4>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>Repairs</th><th className="text-right">Spend</th></tr>
              </thead>
              <tbody>
                {analytics.frequentRepairProducts.map((item) => (
                  <tr key={item.product}>
                    <td data-label="Product" className="font-semibold">{item.product}</td>
                    <td data-label="Repairs">{item.repairs}</td>
                    <td data-label="Spend" className="text-right">Rs. {item.spend.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
