export default function Guidelines() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='bg-blue-900 text-white py-12 px-6'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-2'>Author Guidelines</h1>
          <p className='text-blue-200'>Everything you need to know before submitting your manuscript</p>
        </div>
      </div>
      <div className='max-w-4xl mx-auto px-6 py-12 space-y-10'>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Before You Submit</h2>
          <ul className='space-y-2 text-gray-600'>
            <li className='flex gap-2'><span className='text-blue-600'>checkmark</span> Your manuscript has not been published elsewhere and is not under consideration by another journal.</li>
            <li className='flex gap-2'><span className='text-blue-600'>checkmark</span> All authors have approved the submitted version and consent to publication.</li>
            <li className='flex gap-2'><span className='text-blue-600'>checkmark</span> Appropriate ethical approvals have been obtained for studies involving human participants or animals.</li>
            <li className='flex gap-2'><span className='text-blue-600'>checkmark</span> Conflicts of interest (if any) have been declared.</li>
            <li className='flex gap-2'><span className='text-blue-600'>checkmark</span> The manuscript is written in clear, grammatically correct English.</li>
          </ul>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Manuscript Formatting</h2>
          <div className='bg-gray-50 rounded-lg p-5'>
            <ul className='text-sm text-gray-600 space-y-1'>
              <li>File format: Microsoft Word (.doc or .docx)</li>
              <li>Font: Times New Roman or Arial, 12pt</li>
              <li>Line spacing: Double-spaced throughout</li>
              <li>Margins: 2.5 cm (1 inch) on all sides</li>
              <li>Pages: Numbered consecutively</li>
              <li>Line numbers: Continuous throughout the manuscript</li>
            </ul>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Word Limits by Article Type</h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-gray-600 border border-gray-200 rounded-lg'>
              <thead className='bg-blue-50'><tr className='text-left'><th className='p-3 font-semibold text-gray-800'>Article Type</th><th className='p-3 font-semibold text-gray-800'>Word Limit</th><th className='p-3 font-semibold text-gray-800'>Max References</th><th className='p-3 font-semibold text-gray-800'>Max Figures/Tables</th></tr></thead>
              <tbody className='divide-y divide-gray-100'>
                <tr><td className='p-3'>Original Research</td><td className='p-3'>4,000 to 6,000</td><td className='p-3'>60</td><td className='p-3'>8</td></tr>
                <tr className='bg-gray-50'><td className='p-3'>Systematic Review</td><td className='p-3'>5,000 to 8,000</td><td className='p-3'>100</td><td className='p-3'>10</td></tr>
                <tr><td className='p-3'>Review Article</td><td className='p-3'>4,000 to 6,000</td><td className='p-3'>80</td><td className='p-3'>8</td></tr>
                <tr className='bg-gray-50'><td className='p-3'>Case Report</td><td className='p-3'>1,500 to 2,500</td><td className='p-3'>30</td><td className='p-3'>5</td></tr>
                <tr><td className='p-3'>Short Communication</td><td className='p-3'>1,000 to 2,000</td><td className='p-3'>20</td><td className='p-3'>3</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Manuscript Structure</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='border border-gray-200 rounded-lg p-4'><h3 className='font-semibold text-gray-800 mb-1'>Title Page</h3><p className='text-gray-600 text-sm'>Full title, all author names with affiliations, corresponding author contact details, word count, and conflict of interest statement.</p></div>
            <div className='border border-gray-200 rounded-lg p-4'><h3 className='font-semibold text-gray-800 mb-1'>Abstract</h3><p className='text-gray-600 text-sm'>Structured abstract of 250 to 300 words with sections: Background, Methods, Results, and Conclusions. Include 5 to 8 keywords.</p></div>
            <div className='border border-gray-200 rounded-lg p-4'><h3 className='font-semibold text-gray-800 mb-1'>Introduction</h3><p className='text-gray-600 text-sm'>Background context, rationale for the study, and clear statement of the research objective or hypothesis.</p></div>
            <div className='border border-gray-200 rounded-lg p-4'><h3 className='font-semibold text-gray-800 mb-1'>Methods</h3><p className='text-gray-600 text-sm'>Detailed description of study design, participants, interventions, measurements, and statistical analysis.</p></div>
            <div className='border border-gray-200 rounded-lg p-4'><h3 className='font-semibold text-gray-800 mb-1'>Results</h3><p className='text-gray-600 text-sm'>Clear presentation of findings with appropriate tables and figures.</p></div>
            <div className='border border-gray-200 rounded-lg p-4'><h3 className='font-semibold text-gray-800 mb-1'>Discussion</h3><p className='text-gray-600 text-sm'>Interpretation of findings in context of existing literature, study limitations, and clinical implications.</p></div>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Ethics Requirements</h2>
          <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-6'>
            <p className='text-gray-700 mb-3'>All research involving human participants must comply with the Declaration of Helsinki. Authors must:</p>
            <ul className='space-y-1 text-gray-600 text-sm'>
              <li>State that written informed consent was obtained from all participants</li>
              <li>Provide the name of the ethics committee and approval reference number</li>
              <li>For animal studies, state compliance with institutional and national guidelines</li>
              <li>Ensure patient anonymity throughout the manuscript</li>
            </ul>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>References</h2>
          <p className='text-gray-600 mb-3'>Medical Vanguard uses Vancouver citation style. References must be numbered consecutively in the order they appear in the text.</p>
          <div className='bg-gray-50 rounded-lg p-5 text-sm text-gray-700'>
            <p className='font-semibold text-gray-800 mb-2'>Example: Journal Article</p>
            <p className='text-gray-600'>Smith J, Jones A. Title of article. J Med Res. 2024;15(3):120-128. doi:10.1000/xyz123</p>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Article Processing Charge (APC)</h2>
          <div className='bg-green-50 border border-green-200 rounded-xl p-6'>
            <p className='text-gray-700'><strong>Medical Vanguard currently charges no Article Processing Charges (APC).</strong> Submission, peer review, and publication are entirely free for authors.</p>
          </div>
        </section>
        <section className='bg-blue-900 text-white rounded-2xl p-8 text-center'>
          <h2 className='text-2xl font-bold mb-2'>Ready to Submit?</h2>
          <p className='text-blue-200 mb-6'>For queries, contact our editorial office before submitting.</p>
          <a href='/submit' className='bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition inline-block'>Submit Your Manuscript</a>
        </section>
      </div>
    </div>
  );
}