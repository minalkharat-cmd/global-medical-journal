"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Published Articles</h1>
          <p className="text-xl text-blue-200">Browse peer-reviewed research from our journal</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="text-center py-24 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Articles Published Yet</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Articles will appear here once they have been peer-reviewed and accepted for publication.
            Authors are welcome to <a href="/submit" className="text-blue-600 hover:underline">submit their manuscripts</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
