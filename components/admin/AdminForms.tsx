"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Link as LinkIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  className,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <label className="text-white/50 text-sm block mb-2">{label}</label>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            mode === "upload"
              ? "bg-gold/20 text-gold"
              : "bg-white/5 text-white/50 hover:text-white"
          )}
        >
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            mode === "url"
              ? "bg-gold/20 text-gold"
              : "bg-white/5 text-white/50 hover:text-white"
          )}
        >
          Image URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer",
            "hover:border-gold/30 transition-colors",
            uploading && "opacity-50 pointer-events-none"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          {uploading ? (
            <Loader2 className="w-8 h-8 text-gold mx-auto animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
              <p className="text-white/50 text-sm">Click to upload image</p>
              <p className="text-white/30 text-xs mt-1">JPEG, PNG, WebP up to 5MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
          />
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      {value && (
        <div className="relative mt-3 w-32 h-32 rounded-xl overflow-hidden border border-white/10 group">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-white/50 text-sm block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors";

export const textareaClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors resize-none";

export function AdminModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-light border border-white/10 shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-navy-light">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function DeleteConfirm({
  open,
  onClose,
  onConfirm,
  itemName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}) {
  return (
    <AdminModal open={open} onClose={onClose} title="Confirm Delete">
      <p className="text-white/70 mb-6">
        Are you sure you want to delete <strong className="text-white">{itemName}</strong>?
        This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
        >
          Delete
        </button>
      </div>
    </AdminModal>
  );
}

export function SaveButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2.5 rounded-xl bg-gold text-navy font-semibold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow disabled:opacity-50"
    >
      Save Changes
    </button>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-navy font-medium text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow"
    >
      + {label}
    </button>
  );
}
