import Link from 'next/link';

export const metadata = { title: 'Corrections & Retractions | Global Medical Journal' };

export default function CorrectionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Corrections, Expressions of Concern &amp; Retractions</h1>
          <p className="text-blue-200 mt-2">Policy and procedures for post-publication changes</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-gray-800">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Commitment to the Scientific Record</h2>
          <p className="leading-relaxed">Global Medical Journal is committed to maintaining the integrity of the scientific record. We follow the Committee on Publication Ethics (COPE) guidelines for handling errors and concerns in published work.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Post-Publication Notices</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-900 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Correction (Erratum / Corrigendum)</h3>
              <p className="leading-relaxed mb-2">A correction notice is issued when a published article contains a significant error that does not invalidate the conclusions. Corrections are published as separate notices linked to the original article and are indexed separately.</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li><strong>Erratum</strong> – Error introduced by the journal during production</li>
                <li><strong>Corrigendum</strong> – Error introduced by the authors</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Expression of Concern</h3>
              <p className="leading-relaxed">An expression of concern is published when editors have inconclusive evidence of research or publication misconduct, or when an investigation is ongoing. This alerts readers to potential concerns while the matter is resolved.</p>
            </div>

            <div className="border-l-4 border-red-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Retraction</h3>
              <p className="leading-relaxed mb-2">A retraction is issued when published findings are unreliable due to major error, fabrication, falsification, or plagiarism. Retracted articles remain in the journal archive but are clearly marked, with the retraction notice linked to the original article.</p>
              <p className="text-sm font-medium text-gray-700 mb-1">Retraction notices include:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>The reason(s) for retraction</li>
                <li>Who initiated the retraction</li>
                <li>The date of retraction</li>
                <li>Whether the authors agree with the retraction</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Report Concerns</h2>
          <p className="leading-relaxed">Anyone who identifies an error or has concerns about a published article may contact our editorial office at <a href="mailto:editor@globalmedicaljounal.org" className="text-blue-700 underline">editor@globalmedicaljounal.org</a>. All concerns are treated confidentially and investigated according to COPE guidelines.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Current Corrections and Retractions</h2>
          <div className="bg-gray-50 border rounded-lg p-8 text-center text-gray-500">
            <p className="font-medium">No corrections or retractions have been issued to date.</p>
            <p className="text-sm mt-2">This page will be updated as notices are published.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">COPE Compliance</h2>
          <p className="leading-relaxed">Global Medical Journal is a member of the Committee on Publication Ethics (COPE) and follows the <a href="https://publicationethics.org" target="_blank" className="text-blue-700 underline">COPE Code of Conduct</a> for journal editors and publishers.</p>
        </section>

        <div className="flex flex-wrap gap-4 pt-4 border-t">
          <Link href="/ethics" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 font-medium text-sm">
            Publication Ethics Policy
          </Link>
          <Link href="/contact" className="border border-blue-900 text-blue-900 px-5 py-2 rounded-lg hover:bg-blue-50 font-medium text-sm">
            Contact Editorial Office
          </Link>
        </div>
      </div>
    </div>
  );
}
