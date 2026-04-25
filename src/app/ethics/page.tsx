export default function Ethics() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Ethics Policy</h1>
      <p className="text-gray-500 mb-10">Global Medical Journal adheres to COPE guidelines and the highest standards of publication ethics</p>
      <div className="space-y-6">
        {[
          { title: 'Research Ethics', content: 'All research involving human subjects must have received approval from an appropriate institutional ethics committee or review board. Authors must confirm that informed consent was obtained from all participants. Studies on animals must follow the ARRIVE guidelines and comply with institutional and national regulations.' },
          { title: 'Authorship Criteria', content: 'All listed authors must meet the ICMJE criteria: substantial contributions to conception/design or data acquisition/analysis; drafting or critically revising the work; final approval of the version to be published; and accountability for all aspects of the work.' },
          { title: 'Plagiarism & Originality', content: 'Submitted manuscripts must be original work not previously published or under consideration elsewhere. All text must be properly attributed. Plagiarism, including self-plagiarism, is strictly prohibited. All submissions are screened with plagiarism detection software.' },
          { title: 'Conflicts of Interest', content: 'Authors must disclose all financial and non-financial conflicts of interest. This includes funding sources, employment relationships, consultancies, patent applications, and personal relationships that could have influenced the work.' },
          { title: 'Data Availability', content: 'Authors are encouraged to make their research data publicly available in an appropriate repository. Data supporting the findings should be available for verification upon request by editors or reviewers.' },
          { title: 'Corrections & Retractions', content: 'Authors are obligated to notify the editorial office of any significant errors in published work. The journal follows COPE retraction guidelines and will issue corrections, expressions of concern, or retractions as appropriate.' },
        ].map(({ title, content }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h2 className="text-lg font-bold text-blue-900 mb-3">{title}</h2>
            <p className="text-gray-600 leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
