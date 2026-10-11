'use client';

import { useEffect, useState } from 'react';
import {
  FolderOpen, Plus, Edit2, Trash2, ArrowUp, ArrowDown,
  X, Check, AlertCircle, ExternalLink, Github, Star,
  CheckCircle2, Sparkles
} from 'lucide-react';
import { ProjectEntry } from '@/lib/adminData';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [badge, setBadge] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Full Stack');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [featured, setFeatured] = useState(true);
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([
    { label: '', value: '' },
  ]);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setBadge('');
    setTagline('');
    setDescription('');
    setCategory('Full Stack');
    setTechnologies([]);
    setTechInput('');
    setFeatured(true);
    setMetrics([{ label: '', value: '' }]);
    setGithubUrl('https://github.com/ajay9889-ai');
    setLiveUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ProjectEntry) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setBadge(item.badge || '');
    setTagline(item.tagline);
    setDescription(item.description);
    setCategory(item.category);
    setTechnologies(item.technologies ? [...item.technologies] : []);
    setTechInput('');
    setFeatured(item.featured);
    setMetrics(
      item.metrics && item.metrics.length > 0
        ? [...item.metrics]
        : [{ label: '', value: '' }]
    );
    setGithubUrl(item.githubUrl || '');
    setLiveUrl(item.liveUrl || '');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingItem) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
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

  const handleMetricChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...metrics];
    updated[index][field] = val;
    setMetrics(updated);
  };

  const addMetricRow = () => {
    setMetrics([...metrics, { label: '', value: '' }]);
  };

  const removeMetricRow = (index: number) => {
    if (metrics.length === 1) return;
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const toggleFeatured = async (project: ProjectEntry) => {
    const updatedFeatured = !project.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: updatedFeatured } : p))
    );

    try {
      await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          updates: { featured: updatedFeatured },
        }),
      });
      showNotification(`Project ${updatedFeatured ? 'featured' : 'unfeatured'}.`);
    } catch {
      fetchProjects();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!title || !description) {
      alert('Please fill out title and description.');
      return;
    }

    const cleanMetrics = metrics.filter((m) => m.label.trim() && m.value.trim());

    setSubmitting(true);
    try {
      if (editingItem) {
        // Edit PUT
        await fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            updates: {
              title,
              slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
              badge,
              tagline,
              description,
              category,
              technologies,
              featured,
              metrics: cleanMetrics,
              githubUrl,
              liveUrl,
            },
          }),
        });
        showNotification('Project updated successfully!');
      } else {
        // Add POST
        await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
            badge,
            tagline,
            description,
            category,
            technologies,
            featured,
            metrics: cleanMetrics,
            githubUrl,
            liveUrl,
          }),
        });
        showNotification('New project added to portfolio!');
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/admin/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
      showNotification('Project deleted.');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === projects.length - 1)
    ) {
      return;
    }

    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    const updated = newProjects.map((p, idx) => ({ ...p, order: idx }));
    setProjects(updated);

    try {
      await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: updated }),
      });
      showNotification('Project display order updated.');
    } catch (err) {
      console.error('Failed to reorder:', err);
      fetchProjects();
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
              Project Showcase
            </h1>
            <span className="p-1 rounded-md bg-purple-500/20 text-purple-400">
              <FolderOpen className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Showcase your hackathon wins, live web products, and software systems.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-[#FF5500] to-[#FF7A00] hover:from-[#ff661a] hover:to-[#ff8a1a] text-white shadow-lg shadow-[#FF7A00]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-neutral-400 bg-[#111116] rounded-2xl border border-white/[0.08]">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-[#111116] rounded-2xl border border-white/[0.08]">
            <p className="text-sm font-semibold text-white">No projects found</p>
            <p className="text-xs text-neutral-400 mt-1">Click "Add Project" to showcase your work.</p>
          </div>
        ) : (
          projects.map((p, idx) => (
            <div
              key={p.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#111116] border border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col justify-between space-y-4 group relative"
            >
              {/* Top row */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/[0.04] text-[#FF7A00] border border-[#FF7A00]/25">
                      {p.category}
                    </span>
                    <h2 className="text-lg font-bold text-white group-hover:text-[#FF7A00] transition-colors">
                      {p.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => toggleFeatured(p)}
                    title={p.featured ? 'Featured on home' : 'Click to feature'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      p.featured
                        ? 'text-yellow-400 bg-yellow-400/10'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${p.featured ? 'fill-yellow-400' : ''}`} />
                  </button>
                </div>

                {p.badge && (
                  <div className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/30">
                    {p.badge}
                  </div>
                )}

                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {p.tagline || p.description}
                </p>

                {/* Metrics */}
                {p.metrics && p.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {p.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-black/30 border border-white/[0.04] text-center"
                      >
                        <p className="text-[10px] text-neutral-400 uppercase font-mono">{m.label}</p>
                        <p className="text-xs font-bold text-white mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {p.technologies?.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-neutral-400 border border-white/[0.05]"
                    >
                      {t}
                    </span>
                  ))}
                  {p.technologies?.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-400">
                      +{p.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom footer: links & controls */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-neutral-400 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-neutral-400 hover:text-[#FF7A00] transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveOrder(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 transition-opacity"
                    title="Move Left/Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveOrder(idx, 'down')}
                    disabled={idx === projects.length - 1}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 transition-opacity"
                    title="Move Right/Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1 text-neutral-400 hover:text-[#FF7A00] transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(p.id)}
                    className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Project Modal */}
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
                {editingItem ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. ElderNest"
                    required
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. eldernest"
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Systems & IoT">Systems & IoT</option>
                    <option value="Game Dev">Game Dev</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Award Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. HackVerse 2025 Winner"
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Tagline (One-sentence summary)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Empathetic WCAG-compliant assistive web platform for senior citizens."
                  className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Full Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail the architecture, features, and technical achievements..."
                  required
                  className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all"
                />
              </div>

              {/* Technologies Tag Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-neutral-400">
                  Technologies
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
                    placeholder="Type tech name (e.g. React.js) and press Add..."
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
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/25"
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

              {/* Metrics Pair Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-neutral-400">
                    Key Performance Metrics (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addMetricRow}
                    className="text-xs text-[#FF7A00] hover:text-[#ff8a1a] font-mono"
                  >
                    + Add Metric
                  </button>
                </div>

                <div className="space-y-2">
                  {metrics.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                        placeholder="Label (e.g. Latency)"
                        className="flex-1 bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. <400ms)"
                        className="flex-1 bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetricRow(idx)}
                        disabled={metrics.length === 1}
                        className="p-2 text-neutral-400 hover:text-red-400 disabled:opacity-20 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* URLs & Featured Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredProject"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-white/[0.2] text-[#FF7A00] focus:ring-[#FF7A00] bg-black/40"
                />
                <label htmlFor="featuredProject" className="text-xs text-neutral-300 cursor-pointer">
                  Feature prominently on portfolio homepage
                </label>
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
                  {submitting ? 'Saving...' : editingItem ? 'Update Project' : 'Create Project'}
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
            <h3 className="text-base font-bold text-white">Delete project?</h3>
            <p className="text-xs text-neutral-400">
              This project will be removed from your portfolio projects directory.
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
