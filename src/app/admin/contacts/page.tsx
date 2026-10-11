'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Mail, Search, Trash2, CheckCircle, Circle, Download,
  ExternalLink, Clock, RefreshCw, X, AlertTriangle
} from 'lucide-react';
import { ContactEntry } from '@/lib/adminData';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch contact logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const toggleReadStatus = async (id: string, currentRead: boolean) => {
    const updated = !currentRead;
    // Optimistic UI update
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read: updated } : c)));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, read: updated } : null));
    }

    try {
      await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: updated }),
      });
    } catch {
      // Revert if error
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read: currentRead } : c)));
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await fetch('/api/admin/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      setDeletingId(null);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase()) ||
        (c.subject && c.subject.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;
      if (filter === 'unread') return !c.read;
      if (filter === 'read') return c.read;
      return true;
    });
  }, [contacts, search, filter]);

  const unreadCount = contacts.filter((c) => !c.read).length;

  const exportCSV = () => {
    if (contacts.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Email', 'Subject', 'Read', 'Message'];
    const rows = contacts.map((c) => [
      c.id,
      new Date(c.receivedAt).toISOString(),
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${(c.subject || '').replace(/"/g, '""')}"`,
      c.read ? 'Yes' : 'No',
      `"${c.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `portfolio_contact_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Contact Submissions
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF7A00] text-black">
                {unreadCount} UNREAD
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Incoming inquiries from recruiters, collaborators, and clients sent via your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            disabled={contacts.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchContacts}
            disabled={loading}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF7A00]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or message keyword..."
            className="w-full bg-[#111116] border border-white/[0.08] focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-400 outline-none transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center p-1 rounded-xl bg-[#111116] border border-white/[0.08] text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all' ? 'bg-[#FF7A00]/20 text-[#FF7A00] font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({contacts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'unread' ? 'bg-[#FF7A00]/20 text-[#FF7A00] font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'read' ? 'bg-[#FF7A00]/20 text-[#FF7A00] font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Read ({contacts.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-[#111116] border border-white/[0.08] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-400">Loading messages...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <Mail className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-white">No messages found</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              {search || filter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'No contact submissions have been logged yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filteredContacts.map((c) => (
              <div
                key={c.id}
                className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] ${
                  !c.read ? 'bg-[#FF7A00]/[0.03]' : ''
                }`}
                onClick={() => {
                  setSelectedMessage(c);
                  if (!c.read) toggleReadStatus(c.id, false);
                }}
              >
                {/* Left: Avatar + Sender Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReadStatus(c.id, c.read);
                    }}
                    title={c.read ? 'Mark unread' : 'Mark read'}
                    className="mt-1 text-neutral-400 hover:text-[#FF7A00] transition-colors"
                  >
                    {c.read ? (
                      <CheckCircle className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <Circle className="w-4 h-4 fill-[#FF7A00] text-[#FF7A00]" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm ${c.read ? 'font-medium text-white' : 'font-bold text-white'}`}>
                        {c.name}
                      </span>
                      <span className="text-xs text-[#FF7A00] font-mono">
                        &lt;{c.email}&gt;
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-1 mt-1">
                      {c.message}
                    </p>
                  </div>
                </div>

                {/* Right: Date + Action Buttons */}
                <div className="flex items-center gap-3 sm:self-center shrink-0 pl-7 sm:pl-0">
                  <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(c.receivedAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <a
                    href={`mailto:${c.email}?subject=Re:%20Portfolio%20Inquiry`}
                    onClick={(e) => e.stopPropagation()}
                    title="Reply via Email"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-[#FF7A00] hover:bg-white/[0.05] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(c.id);
                    }}
                    title="Delete message"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-[#111116] border border-white/[0.1] rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-xs font-mono text-[#FF7A00] hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timestamp & Meta */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 bg-black/30 p-3 rounded-xl border border-white/[0.04]">
              <span>Received At:</span>
              <span>
                {new Date(selectedMessage.receivedAt).toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'full',
                  timeStyle: 'medium',
                })}
              </span>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">Message Body</label>
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.read)}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteEntry(selectedMessage.id)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re:%20Portfolio%20Inquiry`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5500] to-[#FF7A00] text-white hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-[#FF7A00]/20"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
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
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete submission?</h3>
            <p className="text-xs text-neutral-400">
              This action cannot be undone. This message will be permanently removed from logs.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.08] text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteEntry(deletingId)}
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
