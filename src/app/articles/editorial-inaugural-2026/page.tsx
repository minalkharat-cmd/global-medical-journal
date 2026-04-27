import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Open Access in the 21st Century: A New Journal for Global Medicine | Medical Vanguard",
  description: "Inaugural editorial by Editor-in-Chief Minal Kharat on the founding of Medical Vanguard and the importance of open-access medical publishing for global health equity.",
};

export default function InauguralEditorialPage() {
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

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <Link href="/articles" className="hover:text-blue-700">Articles</Link>
          <span>/</span>
          <span className="text-gray-700">Inaugural Editorial</span>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">EDITORIAL</span>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">OPEN ACCESS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            Open Access in the 21st Century: A New Journal for Global Medicine
          </h1>
          <p className="text-gray-500 text-sm mb-6">Published: 27 April 2026 &nbsp;|&nbsp; Volume 1, Issue 1 &nbsp;|&nbsp; Medical Vanguard</p>

          {/* Author */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">MK</div>
            <div>
              <p className="font-bold text-gray-900">Minal Kharat</p>
              <p className="text-sm text-gray-600">Editor-in-Chief, Medical Vanguard</p>
              <p className="text-sm text-gray-500">Mahasamund, Chhattisgarh, India</p>
              <p className="text-xs text-blue-700 mt-1">Correspondence: medicalvanguard@zohomail.in</p>
            </div>
          </div>

          {/* Citation */}
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
            <strong>Cite this article:</strong> Kharat M. Open Access in the 21st Century: A New Journal for Global Medicine. <em>Medical Vanguard.</em> 2026;1(1):1–3.
          </div>
        </div>

        {/* Abstract */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Abstract</h2>
          <p className="text-gray-700 leading-relaxed">
            The launch of Medical Vanguard marks a commitment to democratising access to high-quality biomedical research for clinicians, scientists, and health policymakers worldwide. This inaugural editorial articulates the journal&apos;s mission, scope, and founding principles — including our dedication to rigorous double-blind peer review, COPE-aligned editorial practices, zero article processing charges for authors, and full open-access publishing under the Creative Commons Attribution 4.0 International (CC BY 4.0) licence. We invite the global research community to contribute their finest work and join us in advancing the frontiers of medical science.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500"><strong>Keywords:</strong> open access, medical publishing, peer review, editorial, research integrity, biomedical sciences</p>
          </div>
        </div>

        {/* Full Text */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8 mb-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The dissemination of medical knowledge has undergone a profound transformation over the past two decades. The advent of the internet, the global open-access movement, and the increasing interconnectedness of the international research community have together created conditions that were once unimaginable: the possibility that a clinician in a rural district hospital, a researcher in a low-income country, or a medical student in a remote town could access the very same cutting-edge literature as their counterparts in elite academic institutions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Yet, for all this progress, significant barriers persist. Subscription paywalls, prohibitive article processing charges, and geographic inequity in publishing infrastructure continue to exclude large portions of the global medical community from both accessing and contributing to the scientific record. It is in response to these enduring inequities that Medical Vanguard was founded.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Mission and Scope</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Medical Vanguard is a peer-reviewed, open-access journal dedicated to the publication of high-quality research across all disciplines of clinical medicine and biomedical sciences. Our scope encompasses original research articles, systematic reviews, meta-analyses, case reports, short communications, and letters to the editor spanning cardiology, oncology, neurology, endocrinology, infectious diseases, public health, and all allied specialties.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are committed to serving a global audience. We particularly welcome contributions from researchers in low- and middle-income countries, and we have structured our editorial processes to ensure that geographical origin, institutional affiliation, or financial capacity do not influence editorial decisions. Manuscripts are evaluated solely on the basis of scientific merit, methodological rigour, and ethical integrity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Editorial Standards and Peer Review</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Medical Vanguard employs a rigorous double-blind peer review process in which neither reviewers nor authors are aware of each other&apos;s identities. Each manuscript is evaluated by a minimum of two independent experts in the relevant field. We are committed to delivering initial editorial decisions within two weeks and completed peer review within four to six weeks of submission.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our editorial practices are aligned with the guidelines of the Committee on Publication Ethics (COPE), the International Committee of Medical Journal Editors (ICMJE), and the World Association of Medical Editors (WAME). All submitted manuscripts are screened for plagiarism prior to peer review. Human subjects research must be conducted in accordance with the Declaration of Helsinki, and all clinical trials must be registered in an ICMJE-approved registry.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Open Access and No Publication Fees</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Medical Vanguard is committed to full and immediate open access. All published articles are freely available to read, download, share, and adapt under the Creative Commons Attribution 4.0 International (CC BY 4.0) licence. Authors retain copyright of their work.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Crucially, we charge <strong>no article processing charges (APCs)</strong>. We believe that the ability to publish should not be contingent on financial resources. This commitment to fee-free publishing is central to our mission of equity in global medical science.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. An Invitation to the Global Research Community</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We launch Medical Vanguard with humility and ambition in equal measure. We recognise that trust in a new journal is earned, not assumed — earned through the quality of the science we publish, the transparency of our processes, the rigour of our peer review, and the integrity of our editorial decisions. We are committed to earning that trust.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We invite researchers, clinicians, and scientists from every corner of the globe to submit their work, to volunteer as peer reviewers, to join our editorial board, and to become part of this growing community. Together, we can build a platform worthy of the science it carries and the patients whose lives that science ultimately touches.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Declarations</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Conflict of Interest:</strong> None declared.</p>
              <p><strong>Funding:</strong> None.</p>
              <p><strong>Ethics Approval:</strong> Not applicable (editorial).</p>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/submit" className="bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">Submit a Manuscript</Link>
          <Link href="/reviewers" className="bg-white text-blue-900 border border-blue-900 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">Become a Reviewer</Link>
          <Link href="/articles" className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">Browse Articles</Link>
        </div>
      </div>

      <footer className="bg-blue-900 text-white py-8 text-center text-sm text-blue-300">
        <p>© 2026 Medical Vanguard. All rights reserved. Open Access under CC BY 4.0 License.</p>
      </footer>
    </div>
  );
}
