import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Publication Ethics & Plagiarism Policy | Medical Vanguard", description: "Medical Vanguard follows COPE guidelines and maintains the highest standards of research integrity, plagiarism detection, and ethical publishing." };

const sections = [
  { icon: "📋", color: "blue", title: "COPE Compliance", body: "Medical Vanguard follows the guidelines set forth by the Committee on Publication Ethics (COPE). All editorial decisions — including acceptance, rejection, and post-publication corrections — are made in strict accordance with COPE Core Practices. We are committed to applying for full COPE membership as the journal establishes its publication record." },
  { icon: "🔍", color: "red", title: "Plagiarism Detection", body: "All submitted manuscripts are screened for plagiarism using industry-standard similarity detection tools before peer review begins. Manuscripts with a similarity index exceeding 15% (excluding references and properly cited quotations) are returned to authors for revision. Forms of misconduct leading to immediate rejection include: verbatim copying without attribution, self-plagiarism, data fabrication, image manipulation, and duplicate submission." },
  { icon: "✍️", color: "green", title: "Authorship Criteria (ICMJE)", body: "Each author must have: (1) made substantial contributions to conception, design, data acquisition, or analysis; (2) drafted or critically revised the manuscript; (3) approved the final version; and (4) agreed to be accountable for all aspects of the work. Guest authorship and ghost authorship are both forms of misconduct and will result in rejection or retraction." },
  { icon: "⚖️", color: "yellow", title: "Conflict of Interest", body: "All authors are required to disclose any financial, personal, or professional relationships that could influence their work. This includes funding sources, employment, consultancies, stock ownership, honoraria, and patent applications. Conflict of interest statements are published alongside accepted articles. Reviewers must also declare conflicts and recuse themselves where applicable." },
  { icon: "📊", color: "purple", title: "Data Availability & Reproducibility", body: "Authors are strongly encouraged to make underlying research data publicly available in a recognised repository (e.g., Figshare, Zenodo, Dryad) and to include a Data Availability Statement. Medical Vanguard supports open science and reproducibility. Clinical trials must be registered in an ICMJE-approved registry prior to participant enrolment." },
  { icon: "🔄", color: "orange", title: "Corrections, Retractions & Expressions of Concern", body: "Erratum: publisher errors not affecting conclusions. Corrigendum: author errors not affecting conclusions. Retraction: fundamental errors, fabricated data, or undisclosed conflicts that invalidate the work. Expression of Concern: issued when an investigation is ongoing. All post-publication changes are clearly noted and timestamped in the article record." },
  { icon: "🏥", color: "teal", title: "Human & Animal Research Ethics", body: "All research involving human participants must have received IRB or Ethics Committee approval. Authors must confirm that the study was conducted in accordance with the Declaration of Helsinki. For animal research, authors must confirm compliance with institutional and national guidelines for the care and use of laboratory animals. Informed consent must be documented for all human subjects research." },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600", red: "bg-red-100 text-red-600", green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600", purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600", teal: "bg-teal-100 text-teal-600"
};

export default function EthicsPage() {
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
          <div className="inline-block bg-blue-700 text-blue-100 text-xs font-semibold px-4 py-1 rounded-full mb-4 tracking-widest uppercase">Editorial Standards</div>
          <h1 className="text-4xl font-bold mb-4">Publication Ethics & Plagiarism Policy</h1>
          <p className="text-blue-200 text-lg">Medical Vanguard is committed to the highest standards of research integrity, transparency, and ethical publishing practice in accordance with COPE guidelines.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        {sections.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${colorMap[s.color]}`}>{s.icon}</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-blue-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-3">Report Research Misconduct</h2>
          <p className="text-blue-200 mb-6">If you suspect research misconduct in any published or submitted work, please contact our editorial office confidentially. All reports are investigated in accordance with COPE guidelines.</p>
          <Link href="/contact" className="inline-block bg-white text-blue-900 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">Contact Editorial Office</Link>
        </div>
      </div>

      <footer className="bg-blue-900 text-white py-8 text-center text-sm text-blue-300">
        <p>© 2026 Medical Vanguard. All rights reserved. Open Access under CC BY 4.0 License.</p>
      </footer>
    </div>
  );
}
