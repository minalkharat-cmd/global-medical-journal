import { CheckCircle, FileText, AlertCircle } from 'lucide-react'

export default function Guidelines() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Author Guidelines</h1>
      <p className="text-gray-500 mb-10">Please read carefully before submitting your manuscript</p>
      {[
        { title: 'Manuscript Types', icon: FileText, color: 'blue', items: [
          'Original Research Articles (max 5,000 words)',
          'Systematic Reviews & Meta-Analyses (max 8,000 words)',
          'Review Articles (max 6,000 words)',
          'Case Reports (max 2,500 words)',
          'Letters to the Editor (max 800 words)',
          'Editorials (by invitation)',
        ]},
        { title: 'Formatting Requirements', icon: CheckCircle, color: 'green', items: [
          'Manuscripts must be written in English',
          'Use 12-point Times New Roman or Arial font',
          'Double-spaced text with 2.5cm margins',
          'Structured abstract: Background, Methods, Results, Conclusion',
          'Maximum 350 words for abstract',
          '4-8 MeSH keywords required',
          'References in Vancouver style (numbered)',
          'Tables and figures must be numbered and have captions',
        ]},
        { title: 'Peer Review Process', icon: AlertCircle, color: 'yellow', items: [
          'All submissions undergo double-blind peer review',
          'Minimum two independent reviewers per manuscript',
          'Initial editorial decision within 2 weeks',
          'Complete review process: 6-10 weeks',
          'Authors will be notified of decision via email',
          'Revised manuscripts must be resubmitted within 60 days',
        ]},
      ].map(section => (
        <div key={section.title} className={`bg-${section.color}-50 rounded-2xl p-8 mb-6`}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <section.icon className={`w-6 h-6 text-${section.color}-600`} />{section.title}
          </h2>
          <ul className="space-y-2">
            {section.items.map(item => (
              <li key={item} className="flex items-start gap-2 text-gray-700">
                <span className={`w-2 h-2 rounded-full bg-${section.color}-400 mt-2 flex-shrink-0`}></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
