export default function EditorialBoardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Editorial Board</h1>
          <p className="text-xl text-blue-200">Our editorial team is currently being assembled</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Editor-in-Chief</h2>
          <p className="text-gray-500 italic">Position to be announced. We are actively recruiting an Editor-in-Chief with expertise in clinical medicine and research methodology.</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Associate Editors</h2>
          <p className="text-gray-500 italic">We are recruiting Associate Editors across multiple medical specialties. If you are interested in joining our editorial board, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Advisory Board</h2>
          <p className="text-gray-500 italic">International advisors will be listed here once confirmed. We welcome researchers from all countries and institutions.</p>
        </div>
      </div>
    </div>
  );
}
