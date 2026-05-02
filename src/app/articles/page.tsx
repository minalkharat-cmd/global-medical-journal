"use client";
import { useState, useEffect, useCallback } from "react";

interface Article {
  id: number;
  submissionId: string;
  title: string;
  authors: string;
  abstract: string;
  specialty: string;
  type: string;
  doi: string | null;
  publishedAt: string;
  volume: number | null;
  issue: number | null;
  pages: string | null;
}

interface ApiResponse {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  specialties: string[];
}

export default function ArticlesPage() {
  const [data, setData] = useState<ApiResponse>({ articles: [], total: 0, page: 1, totalPages: 0, specialties: [] });
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState("");

  const fetchArticles = useCallback(async (q: string, sp: string, pg: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: "9" });
      if (q) params.set("search", q);
      if (sp) params.set("specialty", sp);
      const res = await fetch(`/api/articles?${params}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData({ articles: [], total: 0, page: 1, totalPages: 0, specialties: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(search, specialty, page); }, [search, specialty, page, fetchArticles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputVal);
    setPage(1);
  };

  const handleSpecialty = (sp: string) => {
    setSpecialty(sp === specialty ? "" : sp);
    setPage(1);
  };

  const clearFilters = () => { setSearch(""); setInputVal(""); setSpecialty(""); setPage(1); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Published Articles</h1>
          <p className="text-blue-200 text-lg">Open-access peer-reviewed research</p>
          {data.total > 0 && (
            <p className="text-blue-300 text-sm mt-2">{data.total} article{data.total !== 1 ? "s" : ""} published</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search by title, author, or keyword..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
            Search
          </button>
          {(search || specialty) && (
            <button type="button" onClick={clearFilters} className="border border-gray-300 text-gray-600 px-4 py-3 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Clear
            </button>
          )}
        </form>

        {/* Specialty filters */}
        {data.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {data.specialties.map(sp => (
              <button
                key={sp}
                onClick={() => handleSpecialty(sp)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  specialty === sp
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        )}

        {/* Active filters banner */}
        {(search || specialty) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-6 text-sm text-blue-700 flex items-center justify-between">
            <span>
              Showing {data.total} result{data.total !== 1 ? "s" : ""}
              {search && <> for &ldquo;<strong>{search}</strong>&rdquo;</>}
              {specialty && <> in <strong>{specialty}</strong></>}
            </span>
            <button onClick={clearFilters} className="text-blue-500 hover:text-blue-700 font-medium ml-4">✕ Clear</button>
          </div>
        )}

        {/* Articles grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-3 bg-gray-200 rounded mb-4 w-1/3" />
                <div className="h-5 bg-gray-200 rounded mb-2" />
                <div className="h-5 bg-gray-200 rounded mb-4 w-3/4" />
                <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
                <div className="h-20 bg-gray-100 rounded mt-4" />
              </div>
            ))}
          </div>
        ) : data.articles.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {search || specialty ? "No articles match your search" : "No Articles Published Yet"}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {search || specialty
                ? "Try different keywords or remove the specialty filter."
                : "Articles will appear here once peer-reviewed manuscripts are accepted and published."}
            </p>
            {(search || specialty) && (
              <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline text-sm">Clear all filters</button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.articles.map(article => (
                <div key={article.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="p-6 flex-1">
                    {/* Type badge */}
                    {article.type && (
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded mb-3 uppercase tracking-wide">
                        {article.type.replace(/_/g, " ")}
                      </span>
                    )}
                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-3">
                      {article.title}
                    </h3>
                    {/* Authors */}
                    <p className="text-sm text-gray-500 mb-3 italic">{article.authors}</p>
                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-4">
                      {article.specialty && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{article.specialty}</span>
                      )}
                      {article.volume && article.issue && (
                        <span>Vol. {article.volume}, No. {article.issue}</span>
                      )}
                      {article.pages && <span>pp. {article.pages}</span>}
                      {article.publishedAt && (
                        <span>{new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      )}
                    </div>
                    {/* Abstract (expandable) */}
                    {article.abstract && (
                      <div>
                        <p className={`text-xs text-gray-600 leading-relaxed ${expanded === article.id ? "" : "line-clamp-3"}`}>
                          {article.abstract}
                        </p>
                        {article.abstract.length > 180 && (
                          <button
                            onClick={() => setExpanded(expanded === article.id ? null : article.id)}
                            className="text-xs text-blue-600 hover:underline mt-1"
                          >
                            {expanded === article.id ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Footer */}
                  {article.doi && (
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                      <a
                        href={`https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline font-mono"
                      >
                        DOI: {article.doi}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {[...Array(data.totalPages)].map((_, i) => {
                  const pg = i + 1;
                  if (pg === 1 || pg === data.totalPages || Math.abs(pg - page) <= 1) {
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          pg === page ? "bg-blue-700 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  }
                  if (Math.abs(pg - page) === 2) return <span key={pg} className="text-gray-400">…</span>;
                  return null;
                })}
                <button
                  onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
