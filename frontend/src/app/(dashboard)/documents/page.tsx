"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownUp, Download, Eye, FileText, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

type DocumentRow = {
  _id: string;
  document: string;
  type: "Invoice PDF" | "Warranty Certificate" | "Manual";
  linkedProduct: string;
  uploadDate: string;
};
type SortKey = keyof Pick<DocumentRow, "document" | "type" | "linkedProduct" | "uploadDate">;

const DOCUMENTS: DocumentRow[] = [
  { _id: "DOC-201", document: "amazon-samsung-tv-invoice.pdf", type: "Invoice PDF", linkedProduct: 'Samsung 65" QLED TV', uploadDate: "2026-05-19" },
  { _id: "DOC-187", document: "iphone-applecare-certificate.pdf", type: "Warranty Certificate", linkedProduct: "iPhone 15 Pro", uploadDate: "2026-05-12" },
  { _id: "DOC-166", document: "dell-xps-service-manual.pdf", type: "Manual", linkedProduct: "Dell XPS 15", uploadDate: "2026-04-30" },
  { _id: "DOC-142", document: "whirlpool-refrigerator-invoice.pdf", type: "Invoice PDF", linkedProduct: "Whirlpool Refrigerator", uploadDate: "2026-04-08" },
];

function sortValue(document: DocumentRow, key: SortKey) {
  if (key === "uploadDate") return new Date(document.uploadDate).getTime();
  return String(document[key]).toLowerCase();
}

export default function DocumentsPage() {
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "uploadDate", direction: "desc" });

  const documentsQuery = useQuery({
    queryKey: ["mock-documents"],
    queryFn: async () => DOCUMENTS,
    initialData: DOCUMENTS,
    retry: 1,
  });

  const documents = documentsQuery.data;
  const sortedDocuments = useMemo(
    () =>
      [...documents].sort((a, b) => {
        const aValue = sortValue(a, sort.key);
        const bValue = sortValue(b, sort.key);
        const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return sort.direction === "asc" ? result : -result;
      }),
    [documents, sort],
  );

  const updateSort = (key: SortKey) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));
  };

  const sortLabel = (key: SortKey) => (sort.key === key ? (sort.direction === "asc" ? " asc" : " desc") : "");

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p className="page-kicker">Uploaded invoices, warranty certificates, and manuals {documentsQuery.isFetching ? "- syncing" : ""}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Invoice PDF", "Warranty Certificate", "Manual"].map((label) => (
          <div className="card metric-card" key={label}>
            <span className="icon-box"><FileText size={18} /></span>
            <div>
              <p className="text-2xl font-bold">{documents.filter((document) => document.type === label).length}</p>
              <p className="text-xs font-semibold text-[#6B7280]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-0">
        <div className="section-title">
          <h4>Uploaded Documents</h4>
          {documentsQuery.isError && (
            <button className="btn-secondary h-8 px-2 text-xs" onClick={() => documentsQuery.refetch()} type="button">
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
                  ["Document", "document"],
                  ["Type", "type"],
                  ["Linked Product", "linkedProduct"],
                  ["Upload Date", "uploadDate"],
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
              {documentsQuery.isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}><td data-label="Loading" colSpan={5}><div className="skeleton h-5 rounded" /></td></tr>
                  ))
                : sortedDocuments.map((document) => (
                    <tr key={document._id}>
                      <td data-label="Document" className="font-semibold">{document.document}</td>
                      <td data-label="Type"><span className="status-badge badge-neutral">{document.type}</span></td>
                      <td data-label="Linked Product">{document.linkedProduct}</td>
                      <td data-label="Upload Date">{formatDate(document.uploadDate)}</td>
                      <td data-label="Actions">
                        <div className="flex justify-end gap-2 md:justify-start">
                          <button className="btn-secondary h-8 px-2" aria-label={`View ${document.document}`} type="button"><Eye size={14} /></button>
                          <button className="btn-secondary h-8 px-2" aria-label={`Download ${document.document}`} type="button"><Download size={14} /></button>
                        </div>
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
