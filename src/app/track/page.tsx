"use client";
import { useState } from "react";
import Link from "next/link";

const stages = [
  { id: 1, label: "Submitted", icon: "📤", desc: "Manuscript received and assigned a reference ID." },
  { id: 2, label: "Editorial Check", icon: "📋", desc: "Editor-in-Chief checks scope, format, and ethics compliance." },
  { id: 3, label: "Under Review", icon: "🔬", desc: "Manuscript assigned to 2-3 independent peer reviewers." },
  { id: 4, label: "Decision", icon: "📩", desc: "Editorial decision communicated to corresponding author." },
  { id: 5, label: "Revision", icon: "✏️", desc: "Authors revise manuscript based on reviewer comments." },
  { id: 6, label: "Accepted", icon: "✅", desc: "Manuscript accepted for publication after final review." },
  { id: 7, label: "Published", icon: "🌐", desc: "Article published online with DOI assignment." },
];

export default function TrackPage() {
  const [refId, setRefId] = useState("");
  const [result, setResult] = useState<null | "found" | "not_found">(null);
  const [currentStage] = useState(2);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (refId.toUpperCase().startsWith("MV-")) {
      setResult("found");
    } else {
      setResult("not_found");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-bold text-xl">Medical</span>
          <span className="text-blue-300 font-bold text-xl ml-1">Vanguard</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          {["About","Articles","Guidelines","Editorial Board","Contact"].map(l => (
            <Link key={l} href={`/${l.toLowerCase().replace(/ /g,"-")}`} className="hover:text-blue-200">{l}</Link>
          ))}
        </div>
        <Link href="/submit" className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-semibold">Submit</Link>
      </nav>

      <div className="bg-blue-900 text-white py-14 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-700 text-blue-100 text-xs font-semibold px-4 py-1 rounded-full mb-4 tracking-widest uppercase">Author Portal</div>
          <h1 className="text-4xl font-bold mb-4">Track Your Manuscript</h1>
          <p className="text-blue-200 text-lg">Enter your submission reference ID to view the current status of your manuscript.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-10">
          <form onSubmit={handleTrack} className="flex gap-3">
            <input required value={refId} onChange={e => setRefId(e.target.value)}
              placeholder="Enter reference ID (e.g. MV-MOH4DE11)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors">Track</button>
          </form>
        </div>

        {result === "not_found" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-10">
            <p className="text-red-700 font-semibold">Reference ID not found.</p>
            <p className="text-red-600 text-sm mt-1">Please check your submission confirmation email and try again. Reference IDs begin with &quot;MV-&quot;.</p>
          </div>
        )}

        {result === "found" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Submission ID</p>
                <p className="text-xl font-bold text-blue-900">{refId.toUpperCase()}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full">IN PROGRESS</span>
            </div>
            <div className="space-y-4">
              {stages.map((stage) => {
                const isComplete = stage.id < currentStage;
                const isCurrent = stage.id === currentStage;
                return (
                  <div key={stage.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${isCurrent ? "border-blue-400 bg-blue-50 shadow-sm" : isComplete ? "border-green-200 bg-green-50" : "border-gray-100 bg-gray-50"}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold ${isCurrent ? "bg-blue-900 text-white" : isComplete ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                      {isComplete ? "✓" : isCurrent ? stage.id : stage.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{stage.icon}</span>
                        <span className={`font-semibold ${isCurrent ? "text-blue-900" : isComplete ? "text-green-700" : "text-gray-400"}`}>{stage.label}</span>
                        {isCurrent && <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Current</span>}
                        {isComplete && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Complete</span>}
                      </div>
                      <p className={`text-sm mt-1 ${isCurrent ? "text-blue-700" : isComplete ? "text-green-600" : "text-gray-400"}`}>{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-blue-800 border border-blue-100">
              <strong>Estimated timeline:</strong> Initial editorial decision within 2 weeks. Full peer review within 4–6 weeks. You will be notified by email at each stage.
            </div>
          </div>
        )}

        <div className="bg-gray-100 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-4">About Our Review Process</h3>
          <div className="space-y-3">
            {stages.map(s => (
              <div key={s.id} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{s.icon}</span>
                <div>
                  <span className="font-semibold text-gray-800 text-sm">{s.label}: </span>
                  <span className="text-gray-600 text-sm">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">Questions? <Link href="/contact" className="text-blue-700 font-semibold hover:underline">Contact our editorial team</Link></p>
      </div>

      <footer className="bg-blue-900 text-white py-8 text-center text-sm text-blue-300">
        <p>© 2026 Medical Vanguard. All rights reserved.</p>
      </footer>
    </div>
  );
}
