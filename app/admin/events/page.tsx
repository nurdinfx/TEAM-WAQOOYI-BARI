"use client";

import { useState } from "react";
import type { Event } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { useContent, generateId } from "@/components/admin/ContentProvider";
import {
  AdminModal, DeleteConfirm, AddButton, FormField,
  inputClass, textareaClass, SaveButton,
} from "@/components/admin/AdminForms";
import { formatDate } from "@/lib/utils";

const emptyEvent = (): Event => ({
  id: generateId(),
  title: "",
  date: new Date().toISOString().split("T")[0],
  time: "14:00",
  location: "",
  description: "",
  isUpcoming: true,
});

export default function AdminEventsPage() {
  const { content, loading, save } = useContent();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  if (loading || !content) return <AdminLoading />;

  const sorted = [...content.events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSave = async () => {
    if (!editing || !content) return;
    const exists = content.events.find((e) => e.id === editing.id);
    const events = exists
      ? content.events.map((e) => (e.id === editing.id ? editing : e))
      : [...content.events, editing];
    await save({ ...content, events });
    setModal(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !content) return;
    await save({ ...content, events: content.events.filter((e) => e.id !== deleteTarget.id) });
    setDeleteTarget(null);
  };

  return (
    <>
      <AdminHeader title="Manage Events" />
      <div className="p-6 lg:p-8">
        <div className="flex justify-end mb-6">
          <AddButton onClick={() => { setEditing(emptyEvent()); setModal(true); }} label="Add Event" />
        </div>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-white/50 text-sm">Title</th>
                  <th className="text-left p-4 text-white/50 text-sm">Date</th>
                  <th className="text-left p-4 text-white/50 text-sm">Location</th>
                  <th className="text-left p-4 text-white/50 text-sm">Status</th>
                  <th className="text-left p-4 text-white/50 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((event) => (
                  <tr key={event.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{event.title}</td>
                    <td className="p-4 text-white/60">{formatDate(event.date)}</td>
                    <td className="p-4 text-white/60">{event.location}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${event.isUpcoming ? "bg-gold/10 text-gold border-gold/20" : "bg-white/5 text-white/40 border-white/10"}`}>
                        {event.isUpcoming ? "Soo Socda" : "La qabtay"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => { setEditing({ ...event }); setModal(true); }} className="text-gold text-sm hover:underline">Edit</button>
                      <button onClick={() => setDeleteTarget(event)} className="text-red-400 text-sm hover:underline ml-4">Delete</button>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-white/40">Munaasabad ma jirto.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing && content.events.find((e) => e.id === editing.id) ? "Edit Event" : "Add Event"}>
        {editing && (
          <div className="space-y-4">
            <FormField label="Title">
              <input className={inputClass} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </FormField>
            <FormField label="Topic (optional)">
              <input className={inputClass} value={(editing as Event & { topic?: string }).topic || ""} onChange={(e) => setEditing({ ...editing, title: editing.title })} placeholder="Discussion topic" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date">
                <input type="date" className={inputClass} value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
              </FormField>
              <FormField label="Time">
                <input type="time" className={inputClass} value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Location">
              <input className={inputClass} value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
            </FormField>
            <FormField label="Description">
              <textarea className={textareaClass} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </FormField>
            <FormField label="Status">
              <select className={inputClass} value={editing.isUpcoming ? "upcoming" : "past"} onChange={(e) => setEditing({ ...editing, isUpcoming: e.target.value === "upcoming" })}>
                <option value="upcoming">Soo Socda</option>
                <option value="past">La qabtay</option>
              </select>
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
