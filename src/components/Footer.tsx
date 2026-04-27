import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Medical Vanguard</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              An open-access, peer-reviewed journal dedicated to advancing medical science and improving global health outcomes.
            </p>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>ISSN (Print): <span className="text-yellow-400">Applied for</span></p>
              <p>ISSN (Online): <span className="text-yellow-400">Applied for</span></p>
              <p className="mt-2">Published continuously since 2025</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Journal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About the Journal</Link></li>
              <li><Link href="/editorial-board" className="hover:text-white transition-colors">Editorial Board</Link></li>
              <li><Link href="/issues" className="hover:text-white transition-colors">All Issues</Link></li>
              <li><Link href="/articles" className="hover:text-white transition-colors">Articles</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Authors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit Manuscript</Link></li>
              <li><Link href="/guidelines" className="hover:text-white transition-colors">Author Guidelines</Link></li>
              <li><Link href="/ethics" className="hover:text-white transition-colors">Publication Ethics</Link></li>
              <li><Link href="/corrections" className="hover:text-white transition-colors">Corrections & Retractions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:editor@globalmedicaljounal.org" className="hover:text-white transition-colors">editor@globalmedicaljounal.org</a></li>
              <li><a href="mailto:submissions@globalmedicaljounal.org" className="hover:text-white transition-colors">submissions@globalmedicaljounal.org</a></li>
              <li className="pt-2"><Link href="/contact" className="hover:text-white transition-colors">Contact Form</Link></li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-500">Member of</p>
              <a href="https://publicationethics.org" target="_blank" className="text-xs text-blue-400 hover:text-blue-300">
                Committee on Publication Ethics (COPE)
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Medical Vanguard. All rights reserved.</p>
          <p>Open Access | CC BY 4.0 International License</p>
          <div className="flex gap-4">
            <Link href="/ethics" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/corrections" className="hover:text-gray-300">Corrections</Link>
            <Link href="/guidelines" className="hover:text-gray-300">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
