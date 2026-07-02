"use client";

import { useState } from "react";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { useContent, generateId } from "@/components/admin/ContentProvider";
import {
  AdminModal, DeleteConfirm, AddButton, FormField,
  ImageUploadField, inputClass, textareaClass, SaveButton,
} from "@/components/admin/AdminForms";
import { formatDate } from "@/lib/utils";

const emptyArticle = (): Article => ({
  id: generateId(),
  title: "",
  author: "",
  date: new Date().toISOString().split("T")[0],
  excerpt: "",
  content: "",
  cover: "",
  published: false,
});

export default function AdminArticlesPage() {
  const { content, loading, save } = useContent();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  if (loading || !content) return <AdminLoading />;

  const sorted = [...content.articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSave = async () => {
    if (!editing || !content) return;
    const exists = content.articles.find((a) => a.id === editing.id);
    const articles = exists
      ? content.articles.map((a) => (a.id === editing.id ? editing : a))
      : [...content.articles, editing];
    await save({ ...content, articles });
    setModal(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !content) return;
    await save({ ...content, articles: content.articles.filter((a) => a.id !== deleteTarget.id) });
    setDeleteTarget(null);
  };

  const togglePublish = async (article: Article) => {
    const articles = content.articles.map((a) =>
      a.id === article.id ? { ...a, published: !a.published } : a
    );
    await save({ ...content, articles });
  };

  return (
    <>
      <AdminHeader title="Manage Articles" />
      <div className="p-6 lg:p-8">
        <div className="flex justify-end mb-6">
          <AddButton onClick={() => { setEditing(emptyArticle()); setModal(true); }} label="New Article" />
        </div>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-white/50 text-sm">Cover</th>
                  <th className="text-left p-4 text-white/50 text-sm">Title</th>
                  <th className="text-left p-4 text-white/50 text-sm">Author</th>
                  <th className="text-left p-4 text-white/50 text-sm">Date</th>
                  <th className="text-left p-4 text-white/50 text-sm">Status</th>
                  <th className="text-left p-4 text-white/50 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((article) => (
                  <tr key={article.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      {article.cover ? (
                        <Image src={article.cover} alt={article.title} width={48} height={32} className="w-12 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-8 rounded bg-white/5" />
                      )}
                    </td>
                    <td className="p-4 text-white max-w-xs">
                      <p className="line-clamp-1">{article.title}</p>
                    </td>
                    <td className="p-4 text-white/60">{article.author}</td>
                    <td className="p-4 text-white/40 text-sm">{formatDate(article.date)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(article)}
                        className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${article.published ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" : "bg-white/5 text-white/40 border-white/10 hover:border-gold/20"}`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => { setEditing({ ...article }); setModal(true); }} className="text-gold text-sm hover:underline">Edit</button>
                      <button onClick={() => setDeleteTarget(article)} className="text-red-400 text-sm hover:underline ml-4">Delete</button>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-white/40">Maqaal ma jirto.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing && content.articles.find((a) => a.id === editing.id) ? "Edit Article" : "New Article"}>
        {editing && (
          <div className="space-y-4">
            <ImageUploadField label="Cover Image" value={editing.cover} onChange={(url) => setEditing({ ...editing, cover: url })} />
            <FormField label="Title">
              <input className={inputClass} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </FormField>
            <FormField label="Author">
              <input className={inputClass} value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
            </FormField>
            <FormField label="Date">
              <input type="date" className={inputClass} value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
            </FormField>
            <FormField label="Excerpt (Sharrax Gaaban)">
              <textarea className={textareaClass} rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </FormField>
            <FormField label="Content (Qoraalka Buuxa)">
              <textarea className={textareaClass} rows={8} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
            </FormField>
            <FormField label="Status">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, published: !editing.published })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${editing.published ? "bg-gold" : "bg-white/10"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${editing.published ? "translate-x-7" : "translate-x-1"}`} />
                </button>
                <span className="text-white/60 text-sm">{editing.published ? "Published" : "Draft"}</span>
              </div>
            </FormField>
            <div className="flex justify-end pt-2">
              <SaveButton onClick={handleSave} />
            </div>
          </div>
        )}
      </AdminModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.title || ""} />
    </>
  );
}
