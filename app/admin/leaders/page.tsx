"use client";

import { useState } from "react";
import Image from "next/image";
import type { Leader } from "@/lib/types";
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

const emptyLeader = (): Leader => ({
  id: generateId(),
  name: "",
  position: "",
  bio: "",
  image: "",
  social: { facebook: "", twitter: "", linkedin: "" },
});

export default function AdminLeadersPage() {
  const { content, loading, save } = useContent();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Leader | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Leader | null>(null);

  if (loading || !content) return <AdminLoading />;

  const openCreate = () => {
    setEditing(emptyLeader());
    setModal(true);
  };

  const openEdit = (leader: Leader) => {
    setEditing({ ...leader, social: { ...leader.social } });
    setModal(true);
  };

  const handleSave = async () => {
    if (!editing || !content) return;
    const exists = content.leaders.find((l) => l.id === editing.id);
    const leaders = exists
      ? content.leaders.map((l) => (l.id === editing.id ? editing : l))
      : [...content.leaders, editing];
    await save({ ...content, leaders });
    setModal(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !content) return;
    await save({
      ...content,
      leaders: content.leaders.filter((l) => l.id !== deleteTarget.id),
    });
    setDeleteTarget(null);
  };

  return (
    <>
      <AdminHeader title="Manage Leaders" />
      <div className="p-6 lg:p-8">
        <div className="flex justify-end mb-6">
          <AddButton onClick={openCreate} label="Add Leader" />
        </div>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-white/50 text-sm">Photo</th>
                  <th className="text-left p-4 text-white/50 text-sm">Name</th>
                  <th className="text-left p-4 text-white/50 text-sm">Position</th>
                  <th className="text-left p-4 text-white/50 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.leaders.map((leader) => (
                  <tr key={leader.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      {leader.image ? (
                        <Image
                          src={leader.image}
                          alt={leader.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10" />
                      )}
                    </td>
                    <td className="p-4 text-white">{leader.name}</td>
                    <td className="p-4 text-white/60">{leader.position}</td>
                    <td className="p-4">
                      <button
                        onClick={() => openEdit(leader)}
                        className="text-gold text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(leader)}
                        className="text-red-400 text-sm hover:underline ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <AdminModal
        open={modal}
        onClose={() => setModal(false)}
        title={content.leaders.find((l) => l.id === editing?.id) ? "Edit Leader" : "Add Leader"}
      >
        {editing && (
          <div className="space-y-4">
            <ImageUploadField
              label="Photo"
              value={editing.image}
              onChange={(url) => setEditing({ ...editing, image: url })}
            />
            <FormField label="Name">
              <input
                className={inputClass}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </FormField>
            <FormField label="Position">
              <input
                className={inputClass}
                value={editing.position}
                onChange={(e) => setEditing({ ...editing, position: e.target.value })}
              />
            </FormField>
            <FormField label="Bio">
              <textarea
                className={textareaClass}
                rows={3}
                value={editing.bio}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
              />
            </FormField>
            <FormField label="Facebook URL">
              <input
                className={inputClass}
                value={editing.social?.facebook || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    social: { ...editing.social, facebook: e.target.value },
                  })
                }
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
        itemName={deleteTarget?.name || ""}
      />
    </>
  );
}
