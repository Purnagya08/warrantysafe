"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownUp, Eye, MessageSquare, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

type TicketStatus = "Raised" | "Acknowledged" | "Under Review" | "Awaiting User Input" | "Resolution Offered" | "Closed";
type Ticket = {
  _id: string;
  product: string;
  issue: string;
  priority: "Low" | "Medium" | "High";
  status: TicketStatus;
  lastUpdated: string;
};
type SortKey = keyof Pick<Ticket, "product" | "issue" | "priority" | "status" | "lastUpdated">;

const TICKETS: Ticket[] = [
  { _id: "TCK-1042", product: "iPhone 15 Pro", issue: "Warranty claim documentation needed", priority: "High", status: "Awaiting User Input", lastUpdated: "2026-05-20" },
  { _id: "TCK-1039", product: "Samsung QLED TV", issue: "Panel replacement approval", priority: "Medium", status: "Under Review", lastUpdated: "2026-05-18" },
  { _id: "TCK-1028", product: "Whirlpool Refrigerator", issue: "Compressor warranty clarification", priority: "Low", status: "Resolution Offered", lastUpdated: "2026-05-14" },
  { _id: "TCK-1015", product: "Dell XPS 15", issue: "Extended warranty activation", priority: "Medium", status: "Closed", lastUpdated: "2026-05-08" },
];

function statusClass(status: TicketStatus) {
  if (status === "Closed" || status === "Resolution Offered") return "badge-active";
  if (status === "Awaiting User Input" || status === "Under Review") return "badge-expiring";
  return "badge-neutral";
}

function sortValue(ticket: Ticket, key: SortKey) {
  if (key === "lastUpdated") return new Date(ticket.lastUpdated).getTime();
  return String(ticket[key]).toLowerCase();
}

export default function TicketsPage() {
  const queryClient = useQueryClient();
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "lastUpdated", direction: "desc" });

  const ticketsQuery = useQuery({
    queryKey: ["mock-tickets"],
    queryFn: async () => TICKETS,
    initialData: TICKETS,
    retry: 1,
  });

  const createTicket = useMutation({
    mutationFn: async (ticket: Ticket) => ticket,
    onMutate: async (ticket) => {
      await queryClient.cancelQueries({ queryKey: ["mock-tickets"] });
      const previous = queryClient.getQueryData<Ticket[]>(["mock-tickets"]);
      queryClient.setQueryData<Ticket[]>(["mock-tickets"], (current = []) => [ticket, ...current]);
      return { previous };
    },
    onError: (_error, _ticket, context) => {
      queryClient.setQueryData(["mock-tickets"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mock-tickets"] });
    },
  });

  const tickets = ticketsQuery.data;
  const sortedTickets = useMemo(
    () =>
      [...tickets].sort((a, b) => {
        const aValue = sortValue(a, sort.key);
        const bValue = sortValue(b, sort.key);
        const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return sort.direction === "asc" ? result : -result;
      }),
    [sort, tickets],
  );

  const updateSort = (key: SortKey) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));
  };

  const sortLabel = (key: SortKey) => (sort.key === key ? (sort.direction === "asc" ? " asc" : " desc") : "");

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p className="page-kicker">Support ticket queue across products and warranty issues {ticketsQuery.isFetching ? "- syncing" : ""}</p>
        </div>
        <button
          className="btn-primary"
          disabled={createTicket.isPending}
          onClick={() =>
            createTicket.mutate({
              _id: `TCK-${Date.now().toString().slice(-4)}`,
              product: "New Product",
              issue: "New support request",
              priority: "Medium",
              status: "Raised",
              lastUpdated: new Date().toISOString().slice(0, 10),
            })
          }
          type="button"
        >
          <Plus size={16} />
          {createTicket.isPending ? "Raising..." : "Raise Ticket"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Raised", "Under Review", "Closed"].map((label) => (
          <div className="card metric-card" key={label}>
            <span className="icon-box"><MessageSquare size={18} /></span>
            <div>
              <p className="text-2xl font-bold">{tickets.filter((ticket) => ticket.status === label).length}</p>
              <p className="text-xs font-semibold text-[#6B7280]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-0">
        <div className="section-title">
          <h4>Support Tickets</h4>
          {ticketsQuery.isError && (
            <button className="btn-secondary h-8 px-2 text-xs" onClick={() => ticketsQuery.refetch()} type="button">
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
                  ["Product", "product"],
                  ["Issue", "issue"],
                  ["Priority", "priority"],
                  ["Status", "status"],
                  ["Last Updated", "lastUpdated"],
                ].map(([label, key]) => (
                  <th className="sortable-th" key={key}>
                    <button onClick={() => updateSort(key as SortKey)} type="button">
                      {label}{sortLabel(key as SortKey)} <ArrowDownUp size={12} />
                    </button>
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ticketsQuery.isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}><td data-label="Loading" colSpan={6}><div className="skeleton h-5 rounded" /></td></tr>
                  ))
                : sortedTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td data-label="Product" className="font-semibold">{ticket.product}</td>
                      <td data-label="Issue">{ticket.issue}</td>
                      <td data-label="Priority">{ticket.priority}</td>
                      <td data-label="Status"><span className={`status-badge ${statusClass(ticket.status)}`}>{ticket.status}</span></td>
                      <td data-label="Last Updated">{formatDate(ticket.lastUpdated)}</td>
                      <td data-label="Actions">
                        <Link className="btn-secondary h-8 px-2" href={`/tickets?id=${ticket._id}`} aria-label={`View ${ticket._id}`}>
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
