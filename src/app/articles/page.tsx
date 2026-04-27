import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Articles | Medical Vanguard",
  description: "Browse published articles in Medical Vanguard — peer-reviewed, open-access medical research.",
};

const articles = [
  {
    id: "editorial-inaugural-2026",
    type: "EDITORIAL",
    typeColor: "bg-blue-100 text-blue-800",
    title: "Open Access in the 21st Century: A New Journal for Global Medicine",
    authors: "Minal Kharat",
    date: "27 April 2026",
    volume: "Vol. 1, No. 1 (2026)",
    abstract: "The launch of Medical Vanguard marks a commitment to democratising access to high-quality biomedical research for clinicians, scientists, and health policymakers worldwide. This inaugural editorial articulates the journal\'s mission, scope, and founding principles.",
    keywords: ["open access", "medical publishing", "peer review", "editorial"],
    specialty: "General",
  }
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-bold text-xl">Medical</span>
          <span className="text-blue-300 font-bold text-xl ml-1">Vanguard</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          {["About","Articles","Guidelines","Editorial Board","Contact"].map(l => (
            <Link key={l} href={`/${l.toLowerCase().replace(/ /g,"-")}`} className="hover:text-blue-200">{l}</Link>
          ))}
        </div>
        <Link href="/submit" className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-semibold">Submit</Link>
      </nav>

      <div className="bg-blue-900 text-white py-14 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-700 text-blue-100 text-xs font-semibold px-4 py-1 rounded-full mb-4 tracking-widest uppercase">Open Access</div>
          <h1 className="text-4xl font-bold mb-4">Published Articles</h1>
          <p className="text-blue-200 text-lg">Peer-reviewed research freely available to the global medical community.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 text-sm">{articles.length} article{articles.length !== 1 ? "s" : ""} published</p>
          <div className="flex gap-2">
            <Link href="/submit" className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">Submit Manuscript</Link>
          </div>
        </div>

        <div className="space-y-6">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-2 mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${article.typeColor}`}>{article.type}</span>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">OPEN ACCESS</span>
              </div>
              <Link href={`/articles/${article.id}`}>
                <h2 className="text-xl font-bold text-gray-900 hover:text-blue-700 transition-colors mb-2 cursor-pointer">{article.title}</h2>
              </Link>
              <p className="text-blue-700 text-sm font-medium mb-1">{article.authors}</p>
              <p className="text-gray-500 text-xs mb-3">{article.volume} &nbsp;|&nbsp; Published {article.date} &nbsp;|&nbsp; {article.specialty}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{article.abstract}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {article.keywords.map(kw => (
                  <span key={kw} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">{kw}</span>
                ))}
              </div>
              <Link href={`/articles/${article.id}`} className="text-blue-700 font-semibold text-sm hover:underline">Read Full Article →</Link>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Submit Your Research</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">Medical Vanguard is actively accepting submissions across all medical specialties. No publication fees. Double-blind peer review. Fast turnaround.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/submit" className="bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">Submit a Manuscript</Link>
            <Link href="/guidelines" className="border border-blue-900 text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">Author Guidelines</Link>
          </div>
        </div>
      </div>

      <footer className="bg-blue-900 text-white py-8 text-center text-sm text-blue-300">
        <p>© 2026 Medical Vanguard. All rights reserved. Open Access under CC BY 4.0 License.</p>
      </footer>
    </div>
  );
}
