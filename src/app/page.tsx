import Link from 'next/link';
export default function Home() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-6'>
        <div className='max-w-5xl mx-auto text-center'>
          <h1 className='text-5xl font-bold mb-4'>Medical Vanguard</h1>
          <p className='text-xl text-blue-100 mb-2'>An Open-Access Peer-Reviewed Medical Journal</p>
          <p className='text-blue-200 mb-8'>Advancing medical science through rigorous research and ethical publishing</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/submit' className='bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition'>Submit Manuscript</Link>
            <Link href='/articles' className='border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition'>Browse Articles</Link>
          </div>
        </div>
      </section>
      <section className='py-16 px-6 bg-gray-50'>
        <div className='max-w-5xl mx-auto'>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-12'>Why Publish with Medical Vanguard?</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center'>
              <div className='text-4xl mb-4'>Open</div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>Open Access</h3>
              <p className='text-gray-600 text-sm'>All published articles are freely available to readers worldwide, maximising the reach and impact of your research.</p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center'>
              <div className='text-4xl mb-4'>Peer</div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>Rigorous Peer Review</h3>
              <p className='text-gray-600 text-sm'>Every submission undergoes double-blind peer review by qualified experts in the relevant field to ensure scientific quality.</p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center'>
              <div className='text-4xl mb-4'>Fast</div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>Fast Publication</h3>
              <p className='text-gray-600 text-sm'>We aim to complete initial review within 4 weeks and publish accepted articles within 2 weeks of final acceptance.</p>
            </div>
          </div>
        </div>
      </section>
      <section className='py-16 px-6'>
        <div className='max-w-5xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-800 mb-4'>Scope and Coverage</h2>
              <p className='text-gray-600 mb-4'>Medical Vanguard publishes original research, review articles, case reports, and editorials across all areas of clinical medicine and biomedical sciences.</p>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-center gap-2'><span className='text-blue-600 font-bold'>checkmark</span> Clinical Medicine and Surgery</li>
                <li className='flex items-center gap-2'><span className='text-blue-600 font-bold'>checkmark</span> Internal Medicine and Specialties</li>
                <li className='flex items-center gap-2'><span className='text-blue-600 font-bold'>checkmark</span> Public Health and Epidemiology</li>
                <li className='flex items-center gap-2'><span className='text-blue-600 font-bold'>checkmark</span> Pharmacology and Therapeutics</li>
                <li className='flex items-center gap-2'><span className='text-blue-600 font-bold'>checkmark</span> Medical Education and Ethics</li>
                <li className='flex items-center gap-2'><span className='text-blue-600 font-bold'>checkmark</span> Biomedical Research and Innovations</li>
              </ul>
              <Link href='/about' className='inline-block mt-6 text-blue-700 font-semibold hover:underline'>Read full aims and scope</Link>
            </div>
            <div className='bg-blue-50 rounded-2xl p-8'>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>Journal Information</h3>
              <dl className='space-y-3 text-sm'>
                <div className='flex justify-between border-b border-blue-100 pb-2'><dt className='text-gray-500 font-medium'>Publisher</dt><dd className='text-gray-800 font-semibold'>Medical Vanguard</dd></div>
                <div className='flex justify-between border-b border-blue-100 pb-2'><dt className='text-gray-500 font-medium'>Access Type</dt><dd className='text-gray-800 font-semibold'>Open Access</dd></div>
                <div className='flex justify-between border-b border-blue-100 pb-2'><dt className='text-gray-500 font-medium'>Review Type</dt><dd className='text-gray-800 font-semibold'>Double-Blind Peer Review</dd></div>
                <div className='flex justify-between border-b border-blue-100 pb-2'><dt className='text-gray-500 font-medium'>Language</dt><dd className='text-gray-800 font-semibold'>English</dd></div>
                <div className='flex justify-between border-b border-blue-100 pb-2'><dt className='text-gray-500 font-medium'>Country</dt><dd className='text-gray-800 font-semibold'>India</dd></div>
                <div className='flex justify-between'><dt className='text-gray-500 font-medium'>ISSN (Online)</dt><dd className='text-gray-800 font-semibold'>Pending</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>
      <section className='py-16 px-6 bg-blue-900 text-white text-center'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl font-bold mb-4'>Ready to Submit Your Research?</h2>
          <p className='text-blue-200 mb-8'>Join researchers worldwide in advancing medical knowledge. Submit your manuscript today and contribute to open science.</p>
          <Link href='/submit' className='bg-white text-blue-900 font-semibold px-10 py-4 rounded-lg hover:bg-blue-50 transition text-lg'>Submit a Manuscript</Link>
        </div>
      </section>
    </div>
  );
}