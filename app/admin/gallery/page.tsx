"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { useContent, generateId } from "@/components/admin/ContentProvider";
import {
  AdminModal, DeleteConfirm, AddButton, FormField,
  ImageUploadField, inputClass, SaveButton,
} from "@/components/admin/AdminForms";
import { Image as ImageIcon, Video, X } from "lucide-react";

const emptyItem = (): GalleryItem => ({
  id: generateId(),
  type: "photo",
  src: "",
  caption: "",
  date: new Date().toISOString().split("T")[0],
});

export default function AdminGalleryPage() {
  const { content, loading, save } = useContent();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  if (loading || !content) return <AdminLoading />;

  const handleSave = async () => {
    if (!editing || !content) return;
    const exists = content.galleryItems.find((g) => g.id === editing.id);
    const galleryItems = exists
      ? content.galleryItems.map((g) => (g.id === editing.id ? editing : g))
      : [...content.galleryItems, editing];
    await save({ ...content, galleryItems });
    setModal(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !content) return;
    await save({ ...content, galleryItems: content.galleryItems.filter((g) => g.id !== deleteTarget.id) });
    setDeleteTarget(null);
  };

  return (
    <>
      <AdminHeader title="Manage Gallery" />
      <div className="p-6 lg:p-8">
        <div className="flex justify-end mb-6">
          <AddButton onClick={() => { setEditing(emptyItem()); setModal(true); }} label="Add Item" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {content.galleryItems.map((item) => (
            <GlassCard key={item.id} className="overflow-hidden group">
              <div className="relative h-28">
                {item.src ? (
                  <Image src={item.thumbnail || item.src} alt={item.caption} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    {item.type === "video" ? <Video className="w-8 h-8 text-white/20" /> : <ImageIcon className="w-8 h-8 text-white/20" />}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent" />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs bg-navy/70 text-white/60">
                  {item.type}
                </span>
              </div>
              <div className="p-3">
                <p className="text-white text-xs line-clamp-1 mb-1">{item.caption || "—"}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing({ ...item }); setModal(true); }} className="text-gold text-xs hover:underline">Edit</button>
                  <button onClick={() => setDeleteTarget(item)} className="text-red-400 text-xs hover:underline">Delete</button>
                </div>
              </div>
            </GlassCard>
          ))}
          {content.galleryItems.length === 0 && (
            <div className="col-span-full text-center py-16 text-white/40">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p>Sawirro ma jirto.</p>
            </div>
          )}
        </div>
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing && content.galleryItems.find((g) => g.id === editing?.id) ? "Edit Item" : "Add Gallery Item"}>
        {editing && (
          <div className="space-y-4">
            <FormField label="Type">
              <select className={inputClass} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as "photo" | "video" })}>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </FormField>
            <ImageUploadField label="Image / Thumbnail" value={editing.src} onChange={(url) => setEditing({ ...editing, src: url })} />
            <FormField label="Caption">
              <input className={inputClass} value={editing.caption} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} />
            </FormField>
            <FormField label="Date">
              <input type="date" className={inputClass} value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
            </FormField>
            <div className="flex justify-end pt-2">
              <SaveButton onClick={handleSave} />
            </div>
          </div>
        )}
      </AdminModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.caption || "item"} />
    </>
  );
}
