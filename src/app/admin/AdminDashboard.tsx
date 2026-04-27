'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Article {
  id: string;
  title: string;
  authors: string;
  status: string;
  submittedAt: string;
  specialty: string;
  manuscriptType: string;
}

interface Stats {
  total: number;
  pending: number;
  underReview: number;
  accepted: number;
  rejected: number;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, underReview: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, articlesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/articles'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (articlesRes.ok) setArticles(await articlesRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const statusColor: Record<string, string> = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    UNDER_REVIEW: 'bg-blue-100 text-blue-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    REVISION_REQUIRED: 'bg-purple-100 text-purple-800',
    PUBLISHED: 'bg-gray-100 text-gray-800',
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Loading dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Editorial Management System</h1>
          <p className="text-blue-200 text-sm">Medical Vanguard</p>
        </div>
        <button onClick={logout} className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium">
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Submissions', value: stats.total, color: 'bg-white' },
            { label: 'Pending Review', value: stats.pending, color: 'bg-yellow-50' },
            { label: 'Under Review', value: stats.underReview, color: 'bg-blue-50' },
            { label: 'Accepted', value: stats.accepted, color: 'bg-green-50' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} border rounded-lg p-4 text-center`}>
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {['overview', 'submissions', 'contacts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-900">All Manuscript Submissions</h2>
            </div>
            {articles.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No submissions yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left">Authors</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Submitted</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {articles.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 max-w-xs truncate font-medium">{a.title}</td>
                        <td className="px-4 py-3 text-gray-600">{a.authors}</td>
                        <td className="px-4 py-3 text-gray-600">{a.manuscriptType}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(a.submittedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[a.status] || 'bg-gray-100 text-gray-700'}`}>
                            {a.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={a.status}
                            onChange={(e) => updateStatus(a.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="SUBMITTED">Submitted</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="REVISION_REQUIRED">Revision Required</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="PUBLISHED">Published</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => setActiveTab('submissions')} className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-900">
                  Review Pending Submissions ({stats.pending})
                </button>
                <a href="/guidelines" target="_blank" className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                  View Author Guidelines
                </a>
                <a href="/ethics" target="_blank" className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                  Ethics Policy
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Submissions</h3>
              {articles.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm truncate max-w-xs text-gray-700">{a.title}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${statusColor[a.status] || 'bg-gray-100 text-gray-700'}`}>
                    {a.status.replace('_',' ')}
                  </span>
                </div>
              ))}
              {articles.length === 0 && <p className="text-sm text-gray-500">No submissions yet</p>}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <ContactMessages />
        )}
      </div>
    </div>
  );
}

function ContactMessages() {
  const [messages, setMessages] = useState<{id:string;name:string;email:string;subject:string;message:string;createdAt:string}[]>([]);

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(setMessages).catch(console.error);
  }, []);

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="font-semibold text-gray-900">Contact Messages</h2>
      </div>
      {messages.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No messages yet</div>
      ) : (
        <div className="divide-y">
          {messages.map((m) => (
            <div key={m.id} className="px-6 py-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900">{m.name}</span>
                  <span className="text-gray-500 text-sm ml-2">{m.email}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">{m.subject}</p>
              <p className="text-sm text-gray-600">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
