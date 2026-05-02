

interface Article {
  id: number;
  title: string;
  authors: string;
  specialty: string;
  type: string;
  doi: string | null;
  publishedAt: string;
  volume: number | null;
  issue: number | null;
  pages: string | null;
  abstract: string;
}

interface IssueGroup {
  volume: number;
  issue: number;
  year: number;
  articles: Article[];
}

async function getArticles(): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medical-vanguard.vercel.app";
    const res = await fetch(`${baseUrl}/api/articles`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || [];
  } catch {
    return [];
  }
}

export default async function IssuesPage() {
  const articles = await getArticles();

  // Group articles by volume and issue
  const issueMap = new Map<string, IssueGroup>();

  for (const article of articles) {
    const vol = article.volume ?? 1;
    const iss = article.issue ?? 1;
    const key = `${vol}-${iss}`;
    if (!issueMap.has(key)) {
      const pubYear = article.publishedAt
        ? new Date(article.publishedAt).getFullYear()
        : new Date().getFullYear();
      issueMap.set(key, { volume: vol, issue: iss, year: pubYear, articles: [] });
    }
    issueMap.get(key)!.articles.push(article);
  }

  // Sort issues: latest volume/issue first
  const issues = Array.from(issueMap.values()).sort((a, b) => {
    if (b.volume !== a.volume) return b.volume - a.volume;
    return b.issue - a.issue;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Journal Issues</h1>
          <p className="text-xl text-blue-200">All volumes and issues of the Medical Vanguard</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {issues.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Issues Published Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              The first issue will be published once enough peer-reviewed manuscripts have been accepted.
              Check back soon or{" "}
              <a href="/submit" className="text-blue-600 hover:underline">
                submit your manuscript
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {issues.map((issueGroup) => (
              <div
                key={`${issueGroup.volume}-${issueGroup.issue}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Issue Header */}
                <div className="bg-blue-900 text-white px-6 py-4">
                  <h2 className="text-xl font-bold">
                    Volume {issueGroup.volume}, Issue {issueGroup.issue} &mdash; {issueGroup.year}
                  </h2>
                  <p className="text-blue-200 text-sm mt-1">
                    {issueGroup.articles.length} article{issueGroup.articles.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Articles List */}
                <div className="divide-y divide-gray-100">
                  {issueGroup.articles.map((article) => (
                    <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Article Type Badge */}
                          {article.type && (
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded mb-2 uppercase tracking-wide">
                              {article.type.replace(/_/g, " ")}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {article.title}
                          </h3>

                          {/* Authors */}
                          <p className="text-sm text-gray-600 mb-2">{article.authors}</p>

                          {/* Metadata row */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {article.specialty && (
                              <span className="bg-gray-100 px-2 py-0.5 rounded">{article.specialty}</span>
                            )}
                            {article.pages && <span>pp. {article.pages}</span>}
                            {article.doi && (
                              <a
                                href={`https://doi.org/${article.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                DOI: {article.doi}
                              </a>
                            )}
                            {article.publishedAt && (
                              <span>
                                Published{" "}
                                {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
