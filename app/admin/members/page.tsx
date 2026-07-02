"use client";

import { useState } from "react";
import Image from "next/image";
import type { Member } from "@/lib/types";
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
  SaveButton,
} from "@/components/admin/AdminForms";

const emptyMember = (): Member => ({
  id: generateId(),
  name: "",
  role: "",
  level: "Xubin Firfircoon",
  image: "",
});

const LEVELS = ["Xubin Sare", "Xubin Firfircoon", "Xubin"];

export default function AdminMembersPage() {
  const { content, loading, save } = useContent();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [search, setSearch] = useState("");

  if (loading || !content) return <AdminLoading />;

  const filtered = content.members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!editing || !content) return;
    const exists = content.members.find((m) => m.id === editing.id);
    const members = exists
      ? content.members.map((m) => (m.id === editing.id ? editing : m))
      : [...content.members, editing];
    await save({ ...content, members });
    setModal(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !content) return;
    await save({ ...content, members: content.members.filter((m) => m.id !== deleteTarget.id) });
    setDeleteTarget(null);
  };

  return (
    <>
      <AdminHeader title="Manage Members" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <input
            type="text"
            placeholder="Raadi xubnaha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
          />
          <AddButton onClick={() => { setEditing(emptyMember()); setModal(true); }} label="Add Member" />
        </div>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-white/50 text-sm">Photo</th>
                  <th className="text-left p-4 text-white/50 text-sm">Name</th>
                  <th className="text-left p-4 text-white/50 text-sm">Role</th>
                  <th className="text-left p-4 text-white/50 text-sm">Level</th>
                  <th className="text-left p-4 text-white/50 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      {member.image ? (
                        <Image src={member.image} alt={member.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10" />
                      )}
                    </td>
                    <td className="p-4 text-white">{member.name}</td>
                    <td className="p-4 text-white/60">{member.role}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs border border-gold/20">
                        {member.level}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => { setEditing({ ...member }); setModal(true); }} className="text-gold text-sm hover:underline">Edit</button>
                      <button onClick={() => setDeleteTarget(member)} className="text-red-400 text-sm hover:underline ml-4">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-white/40">Xubno la helin.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
        <p className="text-white/30 text-xs mt-3">{content.members.length} xubnood oo wadajir ah</p>
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing && content.members.find((m) => m.id === editing.id) ? "Edit Member" : "Add Member"}>
        {editing && (
          <div className="space-y-4">
            <ImageUploadField label="Photo" value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} />
            <FormField label="Full Name">
              <input className={inputClass} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </FormField>
            <FormField label="Role / Shaqo">
              <input className={inputClass} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
            </FormField>
            <FormField label="Membership Level">
              <select className={inputClass} value={editing.level} onChange={(e) => setEditing({ ...editing, level: e.target.value })}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </FormField>
            <div className="flex justify-end pt-2">
              <SaveButton onClick={handleSave} />
            </div>
          </div>
        )}
      </AdminModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.name || ""} />
    </>
  );
}
