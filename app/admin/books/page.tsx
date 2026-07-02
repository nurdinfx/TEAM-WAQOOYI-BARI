"use client";

import { useState } from "react";
import Image from "next/image";
import type { Book } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { useContent, generateId } from "@/components/admin/ContentProvider";
import {
  AdminModal,
  DeleteConfirm,
  AddButton,
  FormField,
  ImageUploadField,
  inputClass,
  textareaClass,
  SaveButton,
} from "@/components/admin/AdminForms";

const emptyBook = (): Book => ({
  id: generateId(),
  title: "",
  author: "",
  cover: "",
  dateRead: new Date().toISOString().split("T")[0],
  rating: 5,
  summary: "",
  category: "Fiction",
});

export default function AdminBooksPage() {
  const { content, loading, save } = useContent();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);

  if (loading || !content) return <AdminLoading />;

  const handleSave = async () => {
    if (!editing || !content) return;
    const exists = content.books.find((b) => b.id === editing.id);
    const books = exists
      ? content.books.map((b) => (b.id === editing.id ? editing : b))
      : [...content.books, editing];
    await save({ ...content, books });
    setModal(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !content) return;
    await save({
      ...content,
      books: content.books.filter((b) => b.id !== deleteTarget.id),
    });
    setDeleteTarget(null);
  };

  return (
    <>
      <AdminHeader title="Manage Books" />
      <div className="p-6 lg:p-8">
        <div className="flex justify-end mb-6">
          <AddButton
            onClick={() => {
              setEditing(emptyBook());
              setModal(true);
            }}
            label="Add Book"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.books.map((book) => (
            <GlassCard key={book.id} className="overflow-hidden">
              <div className="relative h-40">
                {book.cover ? (
                  <Image src={book.cover} alt={book.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
              </div>
              <div className="p-4">
                <p className="text-white font-medium">{book.title}</p>
                <p className="text-white/50 text-sm">{book.author}</p>
                <p className="text-gold text-xs mt-1">{"⭐".repeat(book.rating)}</p>
                <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => {
                      setEditing({ ...book });
                      setModal(true);
                    }}
                    className="text-gold text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(book)}
                    className="text-red-400 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <AdminModal
        open={modal}
        onClose={() => setModal(false)}
        title={editing && content.books.find((b) => b.id === editing.id) ? "Edit Book" : "Add Book"}
      >
        {editing && (
          <div className="space-y-4">
            <ImageUploadField
              label="Cover Image"
              value={editing.cover}
              onChange={(url) => setEditing({ ...editing, cover: url })}
            />
            <FormField label="Title">
              <input
                className={inputClass}
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </FormField>
            <FormField label="Author">
              <input
                className={inputClass}
                value={editing.author}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date Read">
                <input
                  type="date"
                  className={inputClass}
                  value={editing.dateRead}
                  onChange={(e) => setEditing({ ...editing, dateRead: e.target.value })}
                />
              </FormField>
              <FormField label="Rating (1-5)">
                <input
                  type="number"
                  min={1}
                  max={5}
                  className={inputClass}
                  value={editing.rating}
                  onChange={(e) =>
                    setEditing({ ...editing, rating: Number(e.target.value) })
                  }
                />
              </FormField>
            </div>
            <FormField label="Category">
              <select
                className={inputClass}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {content.bookCategories
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField label="Summary">
              <textarea
                className={textareaClass}
                rows={3}
                value={editing.summary}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
              />
            </FormField>
            <div className="flex justify-end pt-2">
              <SaveButton onClick={handleSave} />
            </div>
          </div>
        )}
      </AdminModal>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title || ""}
      />
    </>
  );
}
