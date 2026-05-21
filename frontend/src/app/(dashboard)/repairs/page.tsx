"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownUp, Plus, RefreshCw, Wrench } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Repair = {
  _id: string;
  productName: string;
  issue: string;
  status: "open" | "in_progress" | "completed";
  cost: number;
  date: string;
  technician: string;
  priority: string;
};

const REPAIRS: Repair[] = [
  { _id: "1", productName: "LG 1.5 Ton AC", issue: "Not cooling properly", status: "completed", cost: 2500, date: "2026-02-15", technician: "Rajesh Kumar", priority: "Normal" },
  { _id: "2", productName: "iPhone 15 Pro", issue: "Screen cracked", status: "in_progress", cost: 8000, date: "2026-04-10", technician: "Apple Service", priority: "High" },
  { _id: "3", productName: "Samsung TV", issue: "Remote not working", status: "open", cost: 0, date: "2026-05-01", technician: "Unassigned", priority: "Normal" },
];

const STATUS_LABELS: Record<Repair["status"], string> = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
};

type SortKey = keyof Pick<Repair, "productName" | "issue" | "date" | "technician" | "priority" | "cost" | "status">;

function statusClass(status: string) {
  if (status === "completed") return "badge-active";
  if (status === "in_progress") return "badge-expiring";
  return "badge-neutral";
}

function sortValue(repair: Repair, key: SortKey) {
  if (key === "date") return new Date(repair.date).getTime();
  if (key === "cost") return repair.cost;
  return String(repair[key]).toLowerCase();
}

export default function RepairsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productName: "", issue: "", date: "" });
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "date", direction: "desc" });

  const repairsQuery = useQuery({
    queryKey: ["mock-repairs"],
    queryFn: async () => REPAIRS,
    initialData: REPAIRS,
    retry: 1,
  });

  const createRepair = useMutation({
    mutationFn: async (repair: Repair) => repair,
    onMutate: async (repair) => {
      await queryClient.cancelQueries({ queryKey: ["mock-repairs"] });
      const previous = queryClient.getQueryData<Repair[]>(["mock-repairs"]);
      queryClient.setQueryData<Repair[]>(["mock-repairs"], (current = []) => [repair, ...current]);
      return { previous };
    },
    onError: (_error, _repair, context) => {
      queryClient.setQueryData(["mock-repairs"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mock-repairs"] });
    },
  });

  const repairs = repairsQuery.data;
  const sortedRepairs = useMemo(
    () =>
      [...repairs].sort((a, b) => {
        const aValue = sortValue(a, sort.key);
        const bValue = sortValue(b, sort.key);
        const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return sort.direction === "asc" ? result : -result;
      }),
    [repairs, sort],
  );

  const updateSort = (key: SortKey) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));
  };

  const sortLabel = (key: SortKey) => (sort.key === key ? (sort.direction === "asc" ? " asc" : " desc") : "");

  const submitRepair = () => {
    createRepair.mutate({
      _id: String(Date.now()),
      productName: form.productName || "Unassigned Product",
      issue: form.issue || "New repair request",
      status: "open",
      cost: 0,
      date: form.date || new Date().toISOString().slice(0, 10),
      technician: "Unassigned",
      priority: "Normal",
    });
    setForm({ productName: "", issue: "", date: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Repairs</h1>
          <p className="page-kicker">Operational tracking for service requests, technicians, and costs {repairsQuery.isFetching ? "- syncing" : ""}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((value) => !value)} type="button">
          <Plus size={16} />
          Log Repair
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h4 className="mb-4">New Repair Request</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="input-label">Product Name</label>
              <input className="input-field" onChange={(event) => setForm({ ...form, productName: event.target.value })} placeholder="Samsung TV" value={form.productName} />
            </div>
            <div>
              <label className="input-label">Issue</label>
              <input className="input-field" onChange={(event) => setForm({ ...form, issue: event.target.value })} placeholder="Describe issue" value={form.issue} />
            </div>
            <div>
              <label className="input-label">Date</label>
              <input className="input-field" onChange={(event) => setForm({ ...form, date: event.target.value })} type="date" value={form.date} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary" disabled={createRepair.isPending} onClick={submitRepair} type="button">{createRepair.isPending ? "Submitting..." : "Submit"}</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)} type="button">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {["Open", "In Progress", "Completed"].map((label) => (
          <div className="card metric-card" key={label}>
            <span className="icon-box"><Wrench size={18} /></span>
            <div>
              <p className="text-2xl font-bold">{repairs.filter((repair) => STATUS_LABELS[repair.status] === label).length}</p>
              <p className="text-xs font-semibold text-[#6B7280]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-0">
        <div className="section-title">
          <h4>Repair Queue</h4>
          {repairsQuery.isError && (
            <button className="btn-secondary h-8 px-2 text-xs" onClick={() => repairsQuery.refetch()} type="button">
              <RefreshCw size={13} />
              Retry
            </button>
          )}
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {[
                  ["Product", "productName"],
                  ["Issue", "issue"],
                  ["Date", "date"],
                  ["Technician", "technician"],
                  ["Priority", "priority"],
                  ["Cost", "cost"],
                  ["Status", "status"],
                ].map(([label, key]) => (
                  <th className={`sortable-th ${key === "cost" ? "text-right" : ""}`} key={key}>
                    <button onClick={() => updateSort(key as SortKey)} type="button">
                      {label}{sortLabel(key as SortKey)} <ArrowDownUp size={12} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {repairsQuery.isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <tr key={index}><td data-label="Loading" colSpan={7}><div className="skeleton h-5 rounded" /></td></tr>
                  ))
                : sortedRepairs.map((repair) => (
                    <tr key={repair._id}>
                      <td data-label="Product" className="font-semibold">{repair.productName}</td>
                      <td data-label="Issue">{repair.issue}</td>
                      <td data-label="Date">{formatDate(repair.date)}</td>
                      <td data-label="Technician">{repair.technician}</td>
                      <td data-label="Priority">{repair.priority}</td>
                      <td data-label="Cost" className="text-right">{repair.cost > 0 ? `Rs. ${repair.cost.toLocaleString("en-IN")}` : "Pending"}</td>
                      <td data-label="Status"><span className={`status-badge ${statusClass(repair.status)}`}>{STATUS_LABELS[repair.status]}</span></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
