import { Target, Eye, Award, BookOpen } from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Medical Vanguard</h1>
        <p className="text-xl text-gray-500">Dedicated to advancing medical knowledge worldwide</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-blue-50 rounded-2xl p-8">
          <Target className="w-10 h-10 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">To disseminate high-quality, peer-reviewed medical research that advances clinical practice and improves patient outcomes globally. We are committed to open access publishing, ensuring research is freely available to clinicians, researchers, and health professionals worldwide.</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-8">
          <Eye className="w-10 h-10 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">To be the leading international platform for medical research publication, recognized for scientific excellence, integrity, and global impact. We aim to bridge the gap between research and clinical practice across all medical disciplines.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Award className="w-7 h-7 text-yellow-500" /> Journal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['Full Title', 'Medical Vanguard'],
            ['ISSN (Online)', 'XXXX-XXXX'],
            ['Publisher', 'MV Publishing House'],
            ['Frequency', 'Quarterly (4 issues/year)'],
            ['Access Type', 'Open Access'],
            ['Review Process', 'Double-blind peer review'],
            ['Language', 'English'],
            ['Founded', '2024'],
            ['DOI Prefix', '10.XXXXX'],
            ['Indexing', 'Scopus, DOAJ (pending Embase)'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="font-semibold text-gray-700 min-w-36">{k}:</span>
              <span className="text-gray-600">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><BookOpen className="w-7 h-7 text-blue-500" /> Scope & Focus Areas</h2>
        <p className="text-gray-600 mb-4">MV publishes original research, review articles, case reports, systematic reviews, and meta-analyses across all areas of medicine including:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Clinical Medicine','Surgery & Anesthesia','Internal Medicine','Cardiology & Vascular','Oncology','Neurology & Neuroscience','Infectious Disease','Public Health & Epidemiology','Pharmacology','Pediatrics','Obstetrics & Gynecology','Psychiatry & Mental Health'].map(s => (
            <div key={s} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">{s}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
