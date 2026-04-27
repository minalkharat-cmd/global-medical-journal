export default function EditorialBoard() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='bg-blue-900 text-white py-12 px-6'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-2'>Editorial Board</h1>
          <p className='text-blue-200'>Meet the team behind Medical Vanguard</p>
        </div>
      </div>
      <div className='max-w-4xl mx-auto px-6 py-12 space-y-12'>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-700 pl-4'>Editor-in-Chief</h2>
          <div className='bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 border border-blue-100'>
            <div className='flex items-start gap-4'>
              <div className='w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0'>MK</div>
              <div>
                <h3 className='text-xl font-bold text-gray-800'>Minal Kharat</h3>
                <p className='text-blue-700 font-medium'>Editor-in-Chief, Medical Vanguard</p>
                <p className='text-gray-500 text-sm mt-1'>Mahasamund, Chhattisgarh, India</p>
                <p className='text-gray-600 text-sm mt-3'>Founder and Editor-in-Chief of Medical Vanguard, committed to advancing open-access medical publishing and making quality research accessible to healthcare professionals globally.</p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Editorial Board Members</h2>
          <div className='bg-amber-50 border border-amber-200 rounded-xl p-6'>
            <h3 className='text-lg font-semibold text-amber-800 mb-2'>We Are Recruiting Editorial Board Members</h3>
            <p className='text-gray-700 mb-4'>Medical Vanguard is actively building its editorial board. We invite experienced researchers, clinicians, and academics across all medical disciplines to join our team.</p>
            <p className='text-gray-700 mb-3'><strong>As an editorial board member, you will:</strong></p>
            <ul className='text-gray-600 space-y-1 text-sm mb-6'>
              <li>Handle peer review assignments in your area of expertise</li>
              <li>Contribute to editorial decisions on submitted manuscripts</li>
              <li>Help shape the scientific direction of the journal</li>
              <li>Be listed as a board member on our website and publications</li>
            </ul>
            <a href='mailto:medicalvanguard@zohomail.in?subject=Editorial Board Application - Medical Vanguard' className='bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-amber-700 transition inline-block'>Apply to Join the Board</a>
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-700 pl-4'>Join as a Peer Reviewer</h2>
          <div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
            <p className='text-gray-600 mb-4'>We maintain a pool of expert reviewers across all medical specialties. If you are an active researcher or clinician and would like to contribute to the peer review process, we welcome your application.</p>
            <p className='text-gray-600 text-sm mb-4'><strong>Minimum requirements:</strong> PhD, MD, or equivalent doctoral qualification; active research output in the relevant field; no significant conflicts of interest.</p>
            <a href='/reviewers' className='text-blue-700 font-semibold hover:underline'>Apply to become a reviewer</a>
          </div>
        </section>
      </div>
    </div>
  );
}