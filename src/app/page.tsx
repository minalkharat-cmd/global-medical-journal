import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Vanguard Journal | Open Access Medical Research',
  description: 'Medical Vanguard is a peer-reviewed, open access journal publishing original research, reviews, and case reports across all medical specialties.',
  keywords: 'medical journal, open access, peer review, medical research, clinical trials, cardiology, oncology, neurology',
  openGraph: {
    title: 'Medical Vanguard Journal',
    description: 'Peer-reviewed, open access medical research journal',
    type: 'website',
  },
};

const SPECIALTIES = [
  { name: 'Cardiology', icon: '❤️', desc: 'Heart & cardiovascular research' },
  { name: 'Oncology', icon: '🔬', desc: 'Cancer research & treatment' },
  { name: 'Neurology', icon: '🧠', desc: 'Brain & nervous system' },
  { name: 'Pediatrics', icon: '👶', desc: 'Child health & development' },
  { name: 'Surgery', icon: '🏥', desc: 'Surgical techniques & outcomes' },
  { name: 'Psychiatry', icon: '💭', desc: 'Mental health & behavior' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚕️</span>
            <div>
              <span className="font-bold text-gray-900 text-lg">Medical Vanguard</span>
              <span className="hidden sm:block text-xs text-gray-400 -mt-0.5">Open Access Medical Journal</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/articles" className="text-sm text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">Articles</Link>
            <Link href="/issues" className="text-sm text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">Issues</Link>
            <Link href="/submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-4 rounded-lg font-medium transition-colors">
              Submit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur rounded-full px-3 py-1 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Open Access · Peer Reviewed · Free to Read
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Advancing Medicine Through Open Research
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Medical Vanguard publishes rigorous, peer-reviewed research across all medical specialties. 
              Free to access, free to submit, committed to advancing global health.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/submit"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-colors">
                Submit Manuscript
              </Link>
              <Link href="/articles"
                className="bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur text-white font-semibold py-3 px-6 rounded-xl transition-colors border border-white/20">
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: 'Open Access', label: 'Publication Model' },
              { value: '3–5 Days', label: 'Initial Review' },
              { value: 'Double-Blind', label: 'Peer Review' },
              { value: 'Continuous', label: 'Publication' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Specialty</h2>
            <p className="text-gray-500">Research across the full spectrum of medical disciplines</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SPECIALTIES.map(s => (
              <Link key={s.name} href={`/articles?specialty=${encodeURIComponent(s.name)}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="text-2xl mb-2">{s.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{s.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/articles" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all specialties →
            </Link>
          </div>
        </div>
      </section>

      {/* Submission CTA */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Submit?</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We accept original research, review articles, case reports, meta-analyses, and more. 
                Our streamlined submission process ensures quick turnaround without compromising on quality.
              </p>
              <div className="space-y-3">
                {[
                  '✓ No submission fees',
                  '✓ Double-blind peer review',
                  '✓ DOI assigned to every article',
                  '✓ Open access — free for all readers',
                ].map(item => (
                  <p key={item} className="text-sm text-gray-700">{item}</p>
                ))}
              </div>
              <Link href="/submit" className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                Start Submission
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'Original Research', desc: 'Novel findings from clinical or basic science studies' },
                { type: 'Review Article', desc: 'Comprehensive reviews of current evidence' },
                { type: 'Case Report', desc: 'Unusual or instructive clinical cases' },
                { type: 'Meta-Analysis', desc: 'Statistical synthesis of multiple studies' },
              ].map(t => (
                <div key={t.type} className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="font-semibold text-sm text-gray-900 mb-1">{t.type}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚕️</span>
                <span className="font-bold">Medical Vanguard</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Open access peer-reviewed journal dedicated to advancing medical knowledge globally.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3 text-sm">For Authors</p>
              <div className="space-y-2">
                <Link href="/submit" className="block text-sm text-gray-400 hover:text-white transition-colors">Submit Manuscript</Link>
                <Link href="/articles" className="block text-sm text-gray-400 hover:text-white transition-colors">Browse Articles</Link>
                <Link href="/issues" className="block text-sm text-gray-400 hover:text-white transition-colors">Past Issues</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-3 text-sm">For Reviewers</p>
              <div className="space-y-2">
                <Link href="/reviewer" className="block text-sm text-gray-400 hover:text-white transition-colors">Reviewer Portal</Link>
                <Link href="/editor" className="block text-sm text-gray-400 hover:text-white transition-colors">Editor Dashboard</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Medical Vanguard Journal. All rights reserved. Open Access under CC BY 4.0.
          </div>
        </div>
      </footer>
    </div>
  );
}
