export default function Contact() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='bg-blue-900 text-white py-12 px-6'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-2'>Contact Us</h1>
          <p className='text-blue-200'>We are here to help with any queries about your submission or our journal</p>
        </div>
      </div>
      <div className='max-w-4xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>Get in Touch</h2>
              <div className='space-y-5'>
                <div className='flex gap-4'>
                  <div className='text-2xl'>Email</div>
                  <div>
                    <h3 className='font-semibold text-gray-800'>Editorial Office</h3>
                    <a href='mailto:minalkharat@gmail.com' className='text-blue-700 hover:underline'>minalkharat@gmail.com</a>
                    <p className='text-gray-500 text-sm'>For manuscript submissions, editorial queries, and peer review requests</p>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div className='text-2xl'>Addr</div>
                  <div>
                    <h3 className='font-semibold text-gray-800'>Publisher Address</h3>
                    <p className='text-gray-600'>Medical Vanguard</p>
                    <p className='text-gray-600'>566 College Road</p>
                    <p className='text-gray-600'>Mahasamund, Chhattisgarh 493445</p>
                    <p className='text-gray-600'>India</p>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div className='text-2xl'>Tel</div>
                  <div>
                    <h3 className='font-semibold text-gray-800'>Phone</h3>
                    <p className='text-gray-600'>+91 8103713606</p>
                    <p className='text-gray-500 text-sm'>Available Monday to Friday, 9:00 AM to 5:00 PM IST</p>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div className='text-2xl'>Web</div>
                  <div>
                    <h3 className='font-semibold text-gray-800'>Website</h3>
                    <a href='https://medical-vanguard.vercel.app' className='text-blue-700 hover:underline'>medical-vanguard.vercel.app</a>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-blue-50 rounded-xl p-5 border border-blue-100'>
              <h3 className='font-semibold text-gray-800 mb-2'>Response Time</h3>
              <p className='text-gray-600 text-sm'>We aim to respond to all queries within <strong>2 business days</strong>. For urgent matters, please indicate URGENT in your email subject line.</p>
            </div>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Frequently Asked Questions</h2>
            <div className='space-y-5'>
              <div className='border-b border-gray-100 pb-4'>
                <h3 className='font-semibold text-gray-800 mb-1'>How do I submit a manuscript?</h3>
                <p className='text-gray-600 text-sm'>Visit our Submit page and send your manuscript as a Word file attachment to our editorial email. Include a cover letter explaining the significance of your work.</p>
              </div>
              <div className='border-b border-gray-100 pb-4'>
                <h3 className='font-semibold text-gray-800 mb-1'>Is there an Article Processing Charge (APC)?</h3>
                <p className='text-gray-600 text-sm'>No. Medical Vanguard is currently free to submit and publish. We do not charge authors any fees.</p>
              </div>
              <div className='border-b border-gray-100 pb-4'>
                <h3 className='font-semibold text-gray-800 mb-1'>How long does peer review take?</h3>
                <p className='text-gray-600 text-sm'>We aim to complete initial review within 1 to 3 days and full peer review within 2 to 4 weeks.</p>
              </div>
              <div className='border-b border-gray-100 pb-4'>
                <h3 className='font-semibold text-gray-800 mb-1'>Can I submit a preprint paper?</h3>
                <p className='text-gray-600 text-sm'>Yes. We accept manuscripts previously posted on recognised preprint servers such as medRxiv or bioRxiv. Please disclose this in your cover letter.</p>
              </div>
              <div className='border-b border-gray-100 pb-4'>
                <h3 className='font-semibold text-gray-800 mb-1'>Under what licence are articles published?</h3>
                <p className='text-gray-600 text-sm'>All articles are published under the Creative Commons Attribution 4.0 International (CC BY 4.0) licence. Authors retain full copyright.</p>
              </div>
              <div className='border-b border-gray-100 pb-4'>
                <h3 className='font-semibold text-gray-800 mb-1'>How do I join the editorial board?</h3>
                <p className='text-gray-600 text-sm'>Please send your CV and a brief statement of interest to our editorial email. We welcome applications from experienced researchers and clinicians.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}