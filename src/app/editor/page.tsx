'use client';
import { useState, useEffect, useCallback } from 'react';

interface Submission {
  id: number;
  submission_id: string;
  title: string;
  authors: string;
  abstract: string;
  specialty: string;
  manuscript_type: string;
  status: string;
  submitted_at: string;
  assigned_reviewer?: string;
  editor_notes?: string;
  author_email?: string;
  review_count?: number;
  recommendations?: string;
}

const STATUSES = ['pending','screening','under_review','accepted','rejected','revision_requested','published'];
const STATUS_COLORS: Record<string,string> = {
  pending:'bg-yellow-100 text-yellow-800',
  screening:'bg-orange-100 text-orange-800',
  under_review:'bg-blue-100 text-blue-800',
  accepted:'bg-green-100 text-green-800',
  rejected:'bg-red-100 text-red-800',
  revision_requested:'bg-purple-100 text-purple-800',
  published:'bg-teal-100 text-teal-800',
};

export default function EditorDashboard() {
  const [adminToken, setAdminToken] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [selected, setSelected] = useState<Submission | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [assignedReviewer, setAssignedReviewer] = useState('');
  const [editorNotes, setEditorNotes] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details'|'review'>('details');

  useEffect(() => {
    const saved = localStorage.getItem('editor_token');
    if (saved) { setAdminToken(saved); setAuthed(true); }
  }, []);

  const fetchSubmissions = useCallback(async (tok: string, pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: '20' });
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      if (filterSpecialty) params.set('specialty', filterSpecialty);
      const res = await fetch(`/api/editor/submissions?${params}`, { headers: { Authorization: `Bearer ${tok}` } });
      const data = await res.json();
      if (res.ok) { setSubmissions(data.submissions); setTotal(data.total); setPages(data.pages); setPage(pg); }
      else { setLoginError('Invalid token or failed to load'); setAuthed(false); localStorage.removeItem('editor_token'); }
    } finally { setLoading(false); }
  }, [search, filterStatus, filterSpecialty]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    localStorage.setItem('editor_token', adminToken);
    setAuthed(true);
    fetchSubmissions(adminToken, 1);
  }

  useEffect(() => {
    if (authed && adminToken) fetchSubmissions(adminToken, 1);
  }, [authed, adminToken, fetchSubmissions]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setUpdating(true); setUpdateMsg('');
    try {
      const body: Record<string,string> = { submission_id: selected.submission_id, status: newStatus || selected.status };
      if (assignedReviewer) body.assigned_reviewer = assignedReviewer;
      if (editorNotes) body.editor_notes = editorNotes;
      const res = await fetch('/api/editor/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateMsg('Updated successfully!');
        setSelected(null);
        fetchSubmissions(adminToken, page);
      } else setUpdateMsg(data.error || 'Failed to update');
    } finally { setUpdating(false); }
  }

  const stats = {
    total,
    pending: submissions.filter(s => s.status === 'pending').length,
    under_review: submissions.filter(s => s.status === 'under_review').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">⚕️</div>
            <h1 className="text-2xl font-bold text-white">Editor Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Medical Vanguard Journal — Admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Admin Token</label>
              <input type="password" value={adminToken} onChange={e => setAdminToken(e.target.value)} required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin token" autoFocus />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚕️</span>
            <div>
              <h1 className="font-bold">Editor Dashboard</h1>
              <p className="text-xs text-gray-400">Medical Vanguard Journal</p>
            </div>
          </div>
          <button onClick={() => { setAuthed(false); localStorage.removeItem('editor_token'); }}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors">Sign Out</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total (page)', value: submissions.length, color: 'bg-gray-100' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-50' },
            { label: 'Under Review', value: stats.under_review, color: 'bg-blue-50' },
            { label: 'Accepted', value: stats.accepted, color: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 border border-gray-200`}>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <input type="text" placeholder="Search title, author, ID..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
            </select>
            <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Specialties</option>
              {['Cardiology','Oncology','Neurology','Pediatrics','Surgery','Internal Medicine','Psychiatry','Radiology','Emergency Medicine','Other'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => fetchSubmissions(adminToken, 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Search
            </button>
            <button onClick={() => { setSearch(''); setFilterStatus(''); setFilterSpecialty(''); setTimeout(() => fetchSubmissions(adminToken, 1), 100); }}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition-colors">
              Clear
            </button>
          </div>
        </div>

        {updateMsg && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${updateMsg.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {updateMsg}
          </div>
        )}

        {selected ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <button onClick={() => { setSelected(null); setUpdateMsg(''); }}
              className="text-sm text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1">
              ← Back to list
            </button>
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              {(['details','review'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  {tab === 'details' ? 'Manuscript Details' : 'Update & Assign'}
                </button>
              ))}
            </div>

            {activeTab === 'details' ? (
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[selected.status] || 'bg-gray-100 text-gray-700'}`}>
                    {selected.status?.replace(/_/g,' ') || 'pending'}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{selected.submission_id}</span>
                  {selected.review_count && Number(selected.review_count) > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      {selected.review_count} review(s)
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{selected.title}</h2>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div><span className="font-medium text-gray-600">Authors:</span> <span className="text-gray-800">{selected.authors}</span></div>
                  <div><span className="font-medium text-gray-600">Specialty:</span> <span className="text-gray-800">{selected.specialty}</span></div>
                  <div><span className="font-medium text-gray-600">Type:</span> <span className="text-gray-800">{selected.manuscript_type}</span></div>
                  <div><span className="font-medium text-gray-600">Submitted:</span> <span className="text-gray-800">{new Date(selected.submitted_at).toLocaleDateString()}</span></div>
                  {selected.assigned_reviewer && <div><span className="font-medium text-gray-600">Reviewer:</span> <span className="text-gray-800">{selected.assigned_reviewer}</span></div>}
                  {selected.recommendations && <div><span className="font-medium text-gray-600">Recommendations:</span> <span className="text-gray-800">{selected.recommendations}</span></div>}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Abstract</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selected.abstract}</p>
                </div>
                {selected.editor_notes && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-700 mb-1">Editor Notes</p>
                    <p className="text-sm text-blue-600">{selected.editor_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <select value={newStatus || selected.status} onChange={e => setNewStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign Reviewer (email or name)</label>
                  <input type="text" value={assignedReviewer} onChange={e => setAssignedReviewer(e.target.value)}
                    defaultValue={selected.assigned_reviewer || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="reviewer@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Editor Notes</label>
                  <textarea value={editorNotes} onChange={e => setEditorNotes(e.target.value)}
                    defaultValue={selected.editor_notes || ''} rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Internal notes about this submission..." />
                </div>
                {updateMsg && <p className={`text-sm font-medium ${updateMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{updateMsg}</p>}
                <div className="flex gap-3">
                  <button type="submit" disabled={updating}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50">
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  {(newStatus === 'accepted' || selected.status === 'accepted') && (
                    <a href="/admin/publish" className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg font-medium transition-colors text-center">
                      Go to Publish
                    </a>
                  )}
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-3">{total} total submissions — showing page {page} of {pages}</div>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-gray-200" />)}</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                <p>No submissions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map(sub => (
                  <div key={sub.submission_id} onClick={() => { setSelected(sub); setNewStatus(sub.status); setAssignedReviewer(sub.assigned_reviewer || ''); setEditorNotes(sub.editor_notes || ''); setActiveTab('details'); setUpdateMsg(''); }}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[sub.status] || 'bg-gray-100 text-gray-700'}`}>
                            {sub.status?.replace(/_/g,' ') || 'pending'}
                          </span>
                          <span className="text-xs text-gray-400">{sub.specialty}</span>
                          <span className="text-xs text-gray-400 font-mono">{sub.submission_id}</span>
                          {sub.review_count && Number(sub.review_count) > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">✓ {sub.review_count} review(s)</span>}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{sub.title}</h3>
                        <p className="text-xs text-gray-500">{sub.authors} · {new Date(sub.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-gray-400 text-sm shrink-0">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => fetchSubmissions(adminToken, page - 1)} disabled={page <= 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">← Prev</button>
                <span className="text-sm text-gray-500">Page {page} of {pages}</span>
                <button onClick={() => fetchSubmissions(adminToken, page + 1)} disabled={page >= pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">Next →</button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
