export default function IssuesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Journal Issues</h1>
          <p className="text-xl text-blue-200">All volumes and issues of the Medical Vanguard</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-24 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Issues Published Yet</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            The first issue will be published once enough peer-reviewed manuscripts have been accepted.
            Check back soon or <a href="/submit" className="text-blue-600 hover:underline">submit your manuscript</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
