import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Medical Vanguard
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            An open-access, peer-reviewed journal dedicated to advancing medical science and improving global health outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit" className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Submit Manuscript
            </Link>
            <Link href="/articles" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              Browse Articles
            </Link>
          </div>
        </div>
      </section>

      {/* About the Journal */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Journal</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Medical Vanguard publishes high-quality, peer-reviewed research across all areas of medicine and clinical science. We are committed to open access, research integrity, and advancing evidence-based healthcare worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold mb-2">Rigorous Peer Review</h3>
              <p className="text-gray-600">All submissions undergo double-blind peer review by expert reviewers to ensure scientific quality and integrity.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Open Access</h3>
              <p className="text-gray-600">All published articles are freely available worldwide under Creative Commons licensing, maximising research impact.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Publication Ethics</h3>
              <p className="text-gray-600">We follow COPE guidelines and are committed to the highest standards of publication ethics and research integrity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Scope & Topics</h2>
            <p className="text-gray-600">We welcome submissions across a broad range of medical and clinical disciplines</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Clinical Medicine","Cardiology","Oncology","Neurology","Infectious Disease","Surgery","Public Health","Pharmacology","Paediatrics","Psychiatry","Radiology","Emergency Medicine"].map((topic) => (
              <div key={topic} className="bg-white border border-blue-100 rounded-lg p-4 text-center text-sm font-medium text-blue-800 hover:bg-blue-50 transition-colors">
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call for Papers */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Call for Papers</h2>
          <p className="text-xl text-blue-200 mb-8">
            We are currently accepting manuscript submissions. Share your research with the global medical community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit" className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Submit Your Manuscript
            </Link>
            <Link href="/guidelines" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              Author Guidelines
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/about" className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-3">ℹ️</div>
              <h3 className="font-semibold text-gray-900">About the Journal</h3>
              <p className="text-sm text-gray-500 mt-1">Mission, scope, and aims</p>
            </Link>
            <Link href="/editorial-board" className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900">Editorial Board</h3>
              <p className="text-sm text-gray-500 mt-1">Meet our editorial team</p>
            </Link>
            <Link href="/guidelines" className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold text-gray-900">Author Guidelines</h3>
              <p className="text-sm text-gray-500 mt-1">Submission requirements</p>
            </Link>
            <Link href="/ethics" className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-semibold text-gray-900">Ethics Policy</h3>
              <p className="text-sm text-gray-500 mt-1">COPE-compliant standards</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
