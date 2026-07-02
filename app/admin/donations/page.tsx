"use client";

import { useState } from "react";
import type { Donation, Sponsor, PaymentChannel } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { useContent, generateId } from "@/components/admin/ContentProvider";
import {
  AdminModal, DeleteConfirm, AddButton, FormField,
  inputClass, SaveButton,
} from "@/components/admin/AdminForms";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Heart, TrendingUp, Star, DollarSign } from "lucide-react";

const emptyDonation = (): Donation => ({
  id: generateId(),
  donorName: "",
  amount: 0,
  channel: "evc",
  date: new Date().toISOString().split("T")[0],
  note: "",
});

const emptySponsor = (): Sponsor => ({
  id: generateId(),
  name: "",
  logo: "",
});

const emptyChannel = (): PaymentChannel => ({
  id: generateId(),
  name: "",
  code: "",
});

export default function AdminDonationsPage() {
  const { content, loading, save } = useContent();
  const [donationModal, setDonationModal] = useState(false);
  const [sponsorModal, setSponsorModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  if (loading || !content) return <AdminLoading />;

  const total = content.donations.reduce((sum, d) => sum + d.amount, 0);
  const { fundraisingGoal, fundraisingProgress } = content.settings;

  const saveDonation = async () => {
    if (!editingDonation || !content) return;
    const exists = content.donations.find((d) => d.id === editingDonation.id);
    const donations = exists
      ? content.donations.map((d) => (d.id === editingDonation.id ? editingDonation : d))
      : [...content.donations, editingDonation];
    await save({ ...content, donations });
    setDonationModal(false);
  };

  const saveSponsor = async () => {
    if (!editingSponsor || !content) return;
    const exists = content.sponsors.find((s) => s.id === editingSponsor.id);
    const sponsors = exists
      ? content.sponsors.map((s) => (s.id === editingSponsor.id ? editingSponsor : s))
      : [...content.sponsors, editingSponsor];
    await save({ ...content, sponsors });
    setSponsorModal(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !content) return;
    if (deleteTarget.type === "donation") {
      await save({ ...content, donations: content.donations.filter((d) => d.id !== deleteTarget.id) });
    } else if (deleteTarget.type === "sponsor") {
      await save({ ...content, sponsors: content.sponsors.filter((s) => s.id !== deleteTarget.id) });
    }
    setDeleteTarget(null);
  };

  const updateFundraising = async (goal: number, progress: number) => {
    await save({ ...content, settings: { ...content.settings, fundraisingGoal: goal, fundraisingProgress: progress } });
  };

  return (
    <>
      <AdminHeader title="Support & Donations" />
      <div className="p-6 lg:p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Wadarta", value: formatCurrency(total), icon: DollarSign },
            { label: "Taageero", value: content.donations.length, icon: Heart },
            { label: "Hadaf", value: formatCurrency(fundraisingGoal), icon: TrendingUp },
            { label: "Doneeyayaasha", value: content.sponsors.length, icon: Star },
          ].map((stat, i) => (
            <GlassCard key={i} className="p-5">
              <div className="flex items-center gap-3 mb-1">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/50 text-sm mt-0.5">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Fundraising Settings */}
        <GlassCard className="p-6">
          <h3 className="text-white font-bold mb-4">Qorshaha Maalgelinta</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Hadafka ($)">
              <input
                type="number"
                className={inputClass}
                defaultValue={fundraisingGoal}
                onBlur={(e) => updateFundraising(Number(e.target.value), fundraisingProgress)}
              />
            </FormField>
            <FormField label="Wadarta La Uruuriyey ($)">
              <input
                type="number"
                className={inputClass}
                defaultValue={fundraisingProgress}
                onBlur={(e) => updateFundraising(fundraisingGoal, Number(e.target.value))}
              />
            </FormField>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all"
                style={{ width: `${Math.min(100, (fundraisingProgress / fundraisingGoal) * 100)}%` }}
              />
            </div>
            <p className="text-white/40 text-xs mt-1">
              {Math.round((fundraisingProgress / fundraisingGoal) * 100)}% — {formatCurrency(fundraisingProgress)} / {formatCurrency(fundraisingGoal)}
            </p>
          </div>
        </GlassCard>

        {/* Donations Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">Doneeyayaasha</h3>
            <AddButton onClick={() => { setEditingDonation(emptyDonation()); setDonationModal(true); }} label="Add Donation" />
          </div>
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-white/50 text-sm">Name</th>
                    <th className="text-left p-4 text-white/50 text-sm">Amount</th>
                    <th className="text-left p-4 text-white/50 text-sm">Channel</th>
                    <th className="text-left p-4 text-white/50 text-sm">Date</th>
                    <th className="text-left p-4 text-white/50 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.donations.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-white">{d.donorName || "Anonymous"}</td>
                      <td className="p-4 text-gold font-medium">{formatCurrency(d.amount)}</td>
                      <td className="p-4 text-white/60 uppercase text-xs">{d.channel}</td>
                      <td className="p-4 text-white/40 text-sm">{formatDate(d.date)}</td>
                      <td className="p-4">
                        <button onClick={() => setDeleteTarget({ type: "donation", id: d.id, name: d.donorName || "donation" })} className="text-red-400 text-sm hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {content.donations.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-white/40">Doneeyaye ma jirto.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Sponsors */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">Taageerayaasha</h3>
            <AddButton onClick={() => { setEditingSponsor(emptySponsor()); setSponsorModal(true); }} label="Add Sponsor" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.sponsors.map((sp) => (
              <GlassCard key={sp.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                  {sp.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{sp.name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingSponsor({ ...sp }); setSponsorModal(true); }} className="text-gold text-xs hover:underline">Edit</button>
                  <button onClick={() => setDeleteTarget({ type: "sponsor", id: sp.id, name: sp.name })} className="text-red-400 text-xs hover:underline">Del</button>
                </div>
              </GlassCard>
            ))}
            {content.sponsors.length === 0 && (
              <p className="text-white/40 text-sm col-span-full">Taageeraye ma jirto.</p>
            )}
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <AdminModal open={donationModal} onClose={() => setDonationModal(false)} title="Add Donation">
        {editingDonation && (
          <div className="space-y-4">
            <FormField label="Donor Name">
              <input className={inputClass} placeholder="Anonymous" value={editingDonation.donorName} onChange={(e) => setEditingDonation({ ...editingDonation, donorName: e.target.value })} />
            </FormField>
            <FormField label="Amount ($)">
              <input type="number" className={inputClass} value={editingDonation.amount} onChange={(e) => setEditingDonation({ ...editingDonation, amount: Number(e.target.value) })} />
            </FormField>
            <FormField label="Channel">
              <select className={inputClass} value={editingDonation.channel} onChange={(e) => setEditingDonation({ ...editingDonation, channel: e.target.value })}>
                <option value="evc">EVC Plus</option>
                <option value="zaad">ZAAD</option>
                <option value="sahal">Sahal</option>
                <option value="premier">Premier Bank</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField label="Date">
              <input type="date" className={inputClass} value={editingDonation.date} onChange={(e) => setEditingDonation({ ...editingDonation, date: e.target.value })} />
            </FormField>
            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveDonation} />
            </div>
          </div>
        )}
      </AdminModal>

      {/* Sponsor Modal */}
      <AdminModal open={sponsorModal} onClose={() => setSponsorModal(false)} title={editingSponsor && content.sponsors.find((s) => s.id === editingSponsor.id) ? "Edit Sponsor" : "Add Sponsor"}>
        {editingSponsor && (
          <div className="space-y-4">
            <FormField label="Sponsor Name">
              <input className={inputClass} value={editingSponsor.name} onChange={(e) => setEditingSponsor({ ...editingSponsor, name: e.target.value })} />
            </FormField>
            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveSponsor} />
            </div>
          </div>
        )}
      </AdminModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.name || ""} />
    </>
  );
}
