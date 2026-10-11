'use client';

import { useEffect, useState } from 'react';
import {
  Briefcase, Plus, Edit2, Trash2, ArrowUp, ArrowDown,
  X, Check, AlertCircle, Sparkles, Tag, CheckCircle2
} from 'lucide-react';
import { ExperienceEntry } from '@/lib/adminData';

export default function AdminExperiencePage() {
  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form state
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Internship');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/experience');
      const data = await res.json();
      if (data.success) {
        setEntries(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch experience:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setRole('');
    setCompany('');
    setPeriod('');
    setLocation('Bengaluru, India');
    setType('Internship');
    setHighlights(['']);
    setTechnologies([]);
    setTechInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ExperienceEntry) => {
    setEditingItem(item);
    setRole(item.role);
    setCompany(item.company);
    setPeriod(item.period);
    setLocation(item.location);
    setType(item.type);
    setHighlights(item.highlights && item.highlights.length > 0 ? [...item.highlights] : ['']);
    setTechnologies(item.technologies ? [...item.technologies] : []);
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleHighlightChange = (index: number, val: string) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };

  const addHighlightField = () => {
    setHighlights([...highlights, '']);
  };

  const removeHighlightField = (index: number) => {
    if (highlights.length === 1) return;
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const addTechTag = () => {
    if (!techInput.trim()) return;
    const tag = techInput.trim();
    if (!technologies.includes(tag)) {
      setTechnologies([...technologies, tag]);
    }
    setTechInput('');
  };

  const removeTechTag = (tag: string) => {
    setTechnologies(technologies.filter((t) => t !== tag));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const cleanHighlights = highlights.map((h) => h.trim()).filter(Boolean);
    if (!role || !company || cleanHighlights.length === 0) {
      alert('Please fill out role, company, and at least one highlight point.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        // Edit PUT
        await fetch('/api/admin/experience', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            updates: {
              role,
              company,
              period,
              location,
              type,
              highlights: cleanHighlights,
              technologies,
            },
          }),
        });
        showNotification('Experience updated successfully!');
      } else {
        // Add POST
        await fetch('/api/admin/experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role,
            company,
            period,
            location,
            type,
            highlights: cleanHighlights,
            technologies,
          }),
        });
        showNotification('New experience entry created!');
      }

      setIsModalOpen(false);
      fetchExperience();
    } catch (err) {
      console.error('Failed to save experience:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/admin/experience', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setDeletingId(null);
      showNotification('Experience deleted.');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === entries.length - 1)
    ) {
      return;
    }

    const newEntries = [...entries];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newEntries[index];
    newEntries[index] = newEntries[targetIndex];
    newEntries[targetIndex] = temp;

    // reassign order indices
    const updated = newEntries.map((item, idx) => ({ ...item, order: idx }));
    setEntries(updated);

    try {
      await fetch('/api/admin/experience', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: updated }),
      });
      showNotification('Timeline order updated.');
    } catch (err) {
      console.error('Failed to reorder:', err);
      fetchExperience();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#111116] border border-[#FF7A00]/40 text-white shadow-2xl flex items-center gap-2 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Experience & Timeline
            </h1>
            <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your work history, internships, and education entries displayed across the portfolio.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-[#FF5500] to-[#FF7A00] hover:from-[#ff661a] hover:to-[#ff8a1a] text-white shadow-lg shadow-[#FF7A00]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-400 bg-[#111116] rounded-2xl border border-white/[0.08]">
            Loading experience data...
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center bg-[#111116] rounded-2xl border border-white/[0.08]">
            <p className="text-sm font-semibold text-white">No experience entries found</p>
            <p className="text-xs text-neutral-400 mt-1">Click "Add Experience" to create your first entry.</p>
          </div>
        ) : (
          entries.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#111116] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-4 relative group"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-white">{item.role}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/30">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                    {item.company} &middot; <span className="text-neutral-400">{item.location}</span>
                  </p>
                  <p className="text-xs font-mono text-[#FF7A00]">{item.period}</p>
                </div>

                {/* Actions: Reorder + Edit + Delete */}
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <button
                    onClick={() => moveOrder(idx, 'up')}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 transition-all"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveOrder(idx, 'down')}
                    disabled={idx === entries.length - 1}
                    title="Move Down"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 transition-all"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-white/[0.1] mx-1" />
                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit entry"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    title="Delete entry"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 pt-1">
                <ul className="space-y-1 text-xs text-neutral-300">
                  {item.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FF7A00] mt-1 shrink-0">&bull;</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.04]">
                  {item.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.03] text-neutral-400 border border-white/[0.06]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Experience Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#111116] border border-white/[0.1] rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {editingItem ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Role / Degree Title *
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Development Engineer Intern"
                    required
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Company / Institution *
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. BrikUp or BMSIT"
                    required
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Period
                  </label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="e.g. Internship or 2023 - 2025"
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Education">Education</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Highlights / Responsibilities */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-neutral-400">
                    Key Highlights & Responsibilities *
                  </label>
                  <button
                    type="button"
                    onClick={addHighlightField}
                    className="text-xs text-[#FF7A00] hover:text-[#ff8a1a] flex items-center gap-1 font-mono"
                  >
                    + Add Bullet
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {highlights.map((point, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400 w-4">{i + 1}.</span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handleHighlightChange(i, e.target.value)}
                        placeholder="Describe key impact or feature delivered..."
                        className="flex-1 bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlightField(i)}
                        disabled={highlights.length === 1}
                        className="p-2 text-neutral-400 hover:text-red-400 disabled:opacity-20 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-neutral-400">
                  Technologies Used
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechTag();
                      }
                    }}
                    placeholder="Type technology (e.g. Next.js) and press Add..."
                    className="flex-1 bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={addTechTag}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08] transition-all"
                  >
                    Add Tag
                  </button>
                </div>

                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {technologies.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/25"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => removeTechTag(t)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5500] to-[#FF7A00] hover:from-[#ff661a] hover:to-[#ff8a1a] text-white shadow-lg shadow-[#FF7A00]/25 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Experience' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Modal */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="bg-[#111116] border border-white/[0.1] rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete experience?</h3>
            <p className="text-xs text-neutral-400">
              This experience record will be deleted from your portfolio timeline.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.08] text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
