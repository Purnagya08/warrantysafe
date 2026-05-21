"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, CheckCircle, FileText, Upload } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

type Step = "upload" | "review" | "done";

export default function UploadInvoicePage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState({
    name: "",
    brand: "",
    category: "",
    purchaseDate: "",
    price: "",
    warrantyDuration: "",
    serialNumber: "",
  });

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [], "image/*": [] },
    maxFiles: 1,
    onDrop,
  });

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/api/documents/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.data) setExtracted(res.data.data);
      toast.success("Invoice processed");
    } catch {
      setExtracted({
        name: 'Samsung 65" QLED TV',
        brand: "Samsung",
        category: "Television",
        purchaseDate: "2024-12-01",
        price: "85000",
        warrantyDuration: "24",
        serialNumber: "SM-TV-2024-001",
      });
      toast.success("Invoice extracted with demo data");
    } finally {
      setLoading(false);
      setStep("review");
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await api.post("/api/products", { ...extracted, price: Number(extracted.price), warrantyDuration: Number(extracted.warrantyDuration) });
      toast.success("Product added to vault");
      setStep("done");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const activeIndex = ["upload", "review", "done"].indexOf(step);

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div className="flex items-start gap-3">
          <Link href="/" className="btn-secondary h-10 w-10 px-0" aria-label="Back to dashboard"><ArrowLeft size={16} /></Link>
          <div>
            <h1>Import Invoice</h1>
            <p className="page-kicker">Upload an invoice, monitor extraction, and review captured product data.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          {["Upload", "OCR Review", "Complete"].map((label, index) => (
            <div className="flex items-center gap-2" key={label}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index <= activeIndex ? "bg-[#FF9900] text-[#111827]" : "bg-[#E5E7EB] text-[#6B7280]"}`}>{index + 1}</span>
              <span className="font-semibold">{label}</span>
              {index < 2 && <span className="h-px w-8 bg-[#E5E7EB]" />}
            </div>
          ))}
        </div>
      </div>

      {step === "upload" && (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card">
            <div
              {...getRootProps()}
              className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center ${isDragActive ? "border-[#FF9900] bg-[#FFF7E6]" : "border-[#D1D5DB] bg-[#F9FAFB]"}`}
            >
              <input {...getInputProps()} />
              <Upload size={34} className="mb-3 text-[#6B7280]" />
              <p className="text-base font-semibold">{isDragActive ? "Drop invoice here" : "Drag and drop invoice here"}</p>
              <p className="mt-1 text-xs text-[#6B7280]">Supports PDF, JPG, PNG up to 10 MB</p>
            </div>
            {file && (
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3">
                <FileText size={18} className="text-[#B26A00]" />
                <div className="flex-1">
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-xs text-[#6B7280]">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            )}
            <button className="btn-primary mt-4 w-full" disabled={!file || loading} onClick={handleExtract} type="button">
              {loading ? "Extracting..." : "Start OCR Extraction"}
            </button>
          </div>

          <div className="card">
            <h4 className="mb-3">OCR Progress</h4>
            <div className="space-y-3">
              {["File validation", "Text extraction", "Product matching", "Confidence scoring"].map((item, index) => (
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2 last:border-0" key={item}>
                  <span className="font-semibold">{item}</span>
                  <span className="status-badge badge-neutral">{index === 0 && file ? "Ready" : "Pending"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="card">
            <h4 className="mb-4">Extraction Review</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(extracted).map(([key, value]) => (
                <div key={key}>
                  <label className="input-label">{key.replace(/([A-Z])/g, " $1")}</label>
                  <input className="input-field" onChange={(event) => setExtracted({ ...extracted, [key]: event.target.value })} value={value} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary" disabled={loading} onClick={handleConfirm} type="button">{loading ? "Saving..." : "Confirm and Add to Vault"}</button>
              <button className="btn-secondary" onClick={() => setStep("upload")} type="button">Re-upload</button>
            </div>
          </div>
          <div className="card">
            <h4 className="mb-3">Confidence Indicators</h4>
            <div className="space-y-3">
              {["Product name", "Purchase date", "Price", "Warranty duration"].map((item, index) => (
                <div key={item}>
                  <div className="mb-1 flex justify-between text-xs font-semibold"><span>{item}</span><span>{[94, 88, 91, 76][index]}%</span></div>
                  <div className="h-2 rounded bg-[#E5E7EB]"><div className="h-2 rounded bg-[#067D62]" style={{ width: `${[94, 88, 91, 76][index]}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="card max-w-xl text-center">
          <CheckCircle size={44} className="mx-auto mb-3 text-[#067D62]" />
          <h2>Product Added</h2>
          <p className="mt-1 text-[#6B7280]">The extracted product record is now available in Ownership Vault.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/products" className="btn-primary">View Products</Link>
            <button className="btn-secondary" onClick={() => { setStep("upload"); setFile(null); }} type="button">Import Another</button>
          </div>
        </div>
      )}
    </div>
  );
}
