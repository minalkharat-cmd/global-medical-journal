export default function About() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='bg-blue-900 text-white py-12 px-6'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-2'>About Medical Vanguard</h1>
          <p className='text-blue-200'>Our mission, scope, and commitment to ethical publishing</p>
        </div>
      </div>
      <div className='max-w-4xl mx-auto px-6 py-12 space-y-12'>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Our Mission</h2>
          <p className='text-gray-600 leading-relaxed'>Medical Vanguard is a peer-reviewed, open-access medical journal dedicated to the dissemination of high-quality research across all disciplines of clinical medicine and biomedical sciences. We are committed to advancing global health knowledge by providing a platform for researchers, clinicians, and scientists to share their findings freely and without barriers.</p>
          <p className='text-gray-600 leading-relaxed mt-4'>Founded with the vision of democratising access to medical knowledge, Medical Vanguard upholds the highest standards of scientific integrity, transparency, and ethical publishing. We believe that research which can change lives should be accessible to everyone.</p>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Aims and Scope</h2>
          <p className='text-gray-600 mb-6'>Medical Vanguard welcomes original contributions across a broad spectrum of medical and biomedical topics:</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'><h3 className='font-semibold text-gray-800 mb-1'>Clinical Medicine</h3><p className='text-gray-600 text-sm'>Cardiology, neurology, oncology, gastroenterology, pulmonology, endocrinology, nephrology, and all other clinical specialties.</p></div>
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'><h3 className='font-semibold text-gray-800 mb-1'>Surgery and Allied Sciences</h3><p className='text-gray-600 text-sm'>General surgery, orthopaedics, plastic surgery, anaesthesiology, and perioperative medicine.</p></div>
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'><h3 className='font-semibold text-gray-800 mb-1'>Public Health and Epidemiology</h3><p className='text-gray-600 text-sm'>Disease surveillance, health policy, community medicine, social determinants of health, and global health.</p></div>
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'><h3 className='font-semibold text-gray-800 mb-1'>Pharmacology and Therapeutics</h3><p className='text-gray-600 text-sm'>Drug discovery, clinical pharmacology, pharmacovigilance, and evidence-based therapeutics.</p></div>
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'><h3 className='font-semibold text-gray-800 mb-1'>Biomedical Sciences</h3><p className='text-gray-600 text-sm'>Microbiology, immunology, genetics, pathology, biochemistry, and molecular medicine.</p></div>
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'><h3 className='font-semibold text-gray-800 mb-1'>Medical Education and Ethics</h3><p className='text-gray-600 text-sm'>Innovations in medical education, bioethics, research ethics, and healthcare professionalism.</p></div>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Open Access Policy</h2>
          <div className='bg-blue-50 rounded-xl p-6 border border-blue-100'>
            <p className='text-gray-700 leading-relaxed'>Medical Vanguard is a fully open-access journal. All articles are published under the Creative Commons Attribution 4.0 International (CC BY 4.0) licence, which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited. There are no subscription fees or paywalls. Authors retain copyright of their work.</p>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Peer Review Process</h2>
          <p className='text-gray-600 mb-4'>Medical Vanguard employs a rigorous double-blind peer review process. Both the authors and reviewers remain anonymous throughout the review process to ensure impartiality.</p>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-center'>
            <div className='bg-gray-50 rounded-lg p-4'><div className='text-2xl font-bold text-blue-700 mb-1'>1</div><div className='font-semibold text-gray-800 text-sm mb-1'>Submission</div><div className='text-gray-500 text-xs'>Author submits manuscript</div></div>
            <div className='bg-gray-50 rounded-lg p-4'><div className='text-2xl font-bold text-blue-700 mb-1'>2</div><div className='font-semibold text-gray-800 text-sm mb-1'>Editorial Check</div><div className='text-gray-500 text-xs'>Scope and format review (1-3 days)</div></div>
            <div className='bg-gray-50 rounded-lg p-4'><div className='text-2xl font-bold text-blue-700 mb-1'>3</div><div className='font-semibold text-gray-800 text-sm mb-1'>Peer Review</div><div className='text-gray-500 text-xs'>Expert review (2-4 weeks)</div></div>
            <div className='bg-gray-50 rounded-lg p-4'><div className='text-2xl font-bold text-blue-700 mb-1'>4</div><div className='font-semibold text-gray-800 text-sm mb-1'>Decision</div><div className='text-gray-500 text-xs'>Accept / Revise / Reject</div></div>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Publisher Information</h2>
          <div className='bg-gray-50 rounded-xl p-6'>
            <dl className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div><dt className='text-gray-500 mb-1'>Publisher</dt><dd className='font-semibold text-gray-800'>Medical Vanguard</dd></div>
              <div><dt className='text-gray-500 mb-1'>Editor-in-Chief</dt><dd className='font-semibold text-gray-800'>Minal Kharat</dd></div>
              <div><dt className='text-gray-500 mb-1'>Country of Publication</dt><dd className='font-semibold text-gray-800'>India</dd></div>
              <div><dt className='text-gray-500 mb-1'>Language</dt><dd className='font-semibold text-gray-800'>English</dd></div>
              <div><dt className='text-gray-500 mb-1'>Access Type</dt><dd className='font-semibold text-gray-800'>Open Access (CC BY 4.0)</dd></div>
              <div><dt className='text-gray-500 mb-1'>Review Type</dt><dd className='font-semibold text-gray-800'>Double-Blind Peer Review</dd></div>
              <div><dt className='text-gray-500 mb-1'>ISSN (Online)</dt><dd className='font-semibold text-gray-800'>Pending Assignment</dd></div>
              <div><dt className='text-gray-500 mb-1'>Website</dt><dd className='font-semibold text-gray-800'>medical-vanguard.vercel.app</dd></div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}