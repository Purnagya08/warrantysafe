"use client";

import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { formatDate } from "@/lib/utils";

const REPAIRS = [
  { _id: "1", productName: "LG 1.5 Ton AC", issue: "Not cooling properly", status: "completed", cost: 2500, date: "2026-02-15", technician: "Rajesh Kumar", priority: "Normal" },
  { _id: "2", productName: "iPhone 15 Pro", issue: "Screen cracked", status: "in_progress", cost: 8000, date: "2026-04-10", technician: "Apple Service", priority: "High" },
  { _id: "3", productName: "Samsung TV", issue: "Remote not working", status: "open", cost: 0, date: "2026-05-01", technician: "Unassigned", priority: "Normal" },
];

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
};

function statusClass(status: string) {
  if (status === "completed") return "badge-active";
  if (status === "in_progress") return "badge-expiring";
  return "badge-neutral";
}

export default function RepairsPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productName: "", issue: "", date: "" });

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Repairs</h1>
          <p className="page-kicker">Operational tracking for service requests, technicians, and costs.</p>
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
            <button className="btn-primary" type="button">Submit</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)} type="button">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {["Open", "In Progress", "Completed"].map((label) => (
          <div className="card metric-card" key={label}>
            <span className="icon-box"><Wrench size={18} /></span>
            <div>
              <p className="text-2xl font-bold">{REPAIRS.filter((repair) => STATUS_LABELS[repair.status] === label).length}</p>
              <p className="text-xs font-semibold text-[#6B7280]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-0">
        <div className="section-title"><h4>Repair Queue</h4></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Product</th><th>Issue</th><th>Date</th><th>Technician</th><th>Priority</th><th className="text-right">Cost</th><th>Status</th></tr>
            </thead>
            <tbody>
              {REPAIRS.map((repair) => (
                <tr key={repair._id}>
                  <td className="font-semibold">{repair.productName}</td>
                  <td>{repair.issue}</td>
                  <td>{formatDate(repair.date)}</td>
                  <td>{repair.technician}</td>
                  <td>{repair.priority}</td>
                  <td className="text-right">{repair.cost > 0 ? `Rs. ${repair.cost.toLocaleString("en-IN")}` : "Pending"}</td>
                  <td><span className={`status-badge ${statusClass(repair.status)}`}>{STATUS_LABELS[repair.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
