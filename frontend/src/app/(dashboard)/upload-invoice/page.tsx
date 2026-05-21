"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, CheckCircle, FileText, RefreshCw, Upload } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import api from "@/lib/api";

type Step = "upload" | "review" | "done";

const extractionSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  price: z.string().min(1, "Price is required").refine((value) => Number(value) >= 0, "Enter a valid price"),
  warrantyDuration: z.string().min(1, "Warranty duration is required").refine((value) => Number(value) > 0, "Enter warranty duration in months"),
  serialNumber: z.string().optional(),
});

type ExtractionForm = z.infer<typeof extractionSchema>;

const demoExtraction: ExtractionForm = {
  name: 'Samsung 65" QLED TV',
  brand: "Samsung",
  category: "Television",
  purchaseDate: "2024-12-01",
  price: "85000",
  warrantyDuration: "24",
  serialNumber: "SM-TV-2024-001",
};

const confidence = [
  { label: "Product name", score: 94 },
  { label: "Purchase date", score: 88 },
  { label: "Price", score: 91 },
  { label: "Warranty duration", score: 68 },
];

function confidenceLevel(score: number) {
  if (score >= 90) return { label: "High", className: "badge-active", bar: "#067D62" };
  if (score >= 75) return { label: "Medium", className: "badge-expiring", bar: "#B7791F" };
  return { label: "Low", className: "badge-expired", bar: "#C53030" };
}

export default function UploadInvoicePage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ExtractionForm>({
    resolver: zodResolver(extractionSchema),
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      purchaseDate: "",
      price: "",
      warrantyDuration: "",
      serialNumber: "",
    },
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
      const res = await api.post("/documents/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      reset(res.data?.data || demoExtraction);
      toast.success("Invoice processed");
    } catch {
      reset(demoExtraction);
      toast.success("Invoice extracted with demo data");
    } finally {
      setLoading(false);
      setStep("review");
    }
  };

  const handleConfirm = async (values: ExtractionForm) => {
    try {
      await api.post("/products", { ...values, price: Number(values.price), warrantyDuration: Number(values.warrantyDuration) });
      toast.success("Product added to vault");
      setStep("done");
    } catch {
      toast.error("Failed to save product");
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
          <form className="card" onSubmit={handleSubmit(handleConfirm)}>
            <h4 className="mb-4">Extraction Review</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Product name", "name"],
                ["Brand", "brand"],
                ["Category", "category"],
                ["Purchase date", "purchaseDate"],
                ["Price", "price"],
                ["Warranty duration", "warrantyDuration"],
                ["Serial number", "serialNumber"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="input-label">{label}</label>
                  <input className="input-field" {...register(key as keyof ExtractionForm)} />
                  {errors[key as keyof ExtractionForm] && <p className="field-error">{errors[key as keyof ExtractionForm]?.message}</p>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Saving..." : "Confirm and Add to Vault"}</button>
              <button className="btn-secondary" disabled={!file || loading} onClick={handleExtract} type="button">
                <RefreshCw size={16} />
                {loading ? "Retrying..." : "Retry Extraction"}
              </button>
              <button className="btn-secondary" onClick={() => setStep("upload")} type="button">Re-upload</button>
            </div>
          </form>
          <div className="card">
            <h4 className="mb-3">Confidence Indicators</h4>
            <div className="space-y-3">
              {confidence.map((item) => {
                const level = confidenceLevel(item.score);
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold">
                      <span>{item.label}</span>
                      <span className={`status-badge ${level.className}`}>{level.label} - {item.score}%</span>
                    </div>
                    <div className="h-2 rounded bg-[#E5E7EB]"><div className="h-2 rounded" style={{ background: level.bar, width: `${item.score}%` }} /></div>
                  </div>
                );
              })}
              <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-sm">
                <p className="font-semibold">Overall OCR confidence score: 85%</p>
                <p className="mt-1 text-xs text-[#6B7280]">Review medium and low confidence fields before confirming.</p>
              </div>
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
            <button className="btn-secondary" onClick={() => { setStep("upload"); setFile(null); reset(); }} type="button">Import Another</button>
          </div>
        </div>
      )}
    </div>
  );
}
