"use client";
import { useState } from "react";
import Link from "next/link";

export default function ReviewersPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", institution: "", country: "", degree: "",
    specialties: [] as string[], experience: "", orcid: "", availability: "", motivation: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const specialtyOptions = [
    "Cardiology","Oncology","Neurology","Endocrinology","Infectious Diseases",
    "Pulmonology","Gastroenterology","Nephrology","Rheumatology","Dermatology",
    "Psychiatry","Orthopedics","Ophthalmology","ENT","Pediatrics",
    "Obstetrics & Gynecology","Surgery","Emergency Medicine","Radiology","Pathology",
    "Pharmacology","Public Health","Biomedical Research","Other"
  ];

  const handleSpecialty = (s: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter((x: string) => x !== s)
        : [...prev.specialties, s]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/reviewer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    } catch {}
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Received!</h2>
          <p className="text-gray-600 mb-6">Thank you for your interest in reviewing for Medical Vanguard. Our editorial team will contact you within 5-7 business days.</p>
          <Link href="/" className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-bold text-xl">Medical</span>
          <span className="text-blue-300 font-bold text-xl ml-1">Vanguard</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          {["About","Articles","Guidelines","Editorial Board","Contact"].map(l => (
            <Link key={l} href={`/${l.toLowerCase().replace(" ","-")}`} className="hover:text-blue-200">{l}</Link>
          ))}
        </div>
        <Link href="/submit" className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-semibold">Submit</Link>
      </nav>

      <div className="bg-blue-900 text-white py-14 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-700 text-blue-100 text-xs font-semibold px-4 py-1 rounded-full mb-4 tracking-widest uppercase">Join Our Team</div>
          <h1 className="text-4xl font-bold mb-4">Become a Peer Reviewer</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Help shape the future of medical science. Join Medical Vanguard&apos;s global reviewer pool and contribute to rigorous, ethical peer review.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Review for Medical Vanguard?</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: "🏅", title: "Official Recognition", desc: "Receive a personalised Certificate of Peer Review for each manuscript reviewed, recognised by academic institutions." },
            { icon: "📊", title: "Build Your Profile", desc: "Your reviewing activity is logged and can be cited in your academic CV and funding applications." },
            { icon: "🌍", title: "Global Network", desc: "Connect with researchers across specialties worldwide through our collaborative editorial community." },
            { icon: "⚡", title: "Flexible Commitment", desc: "Review 1-2 manuscripts per quarter with a 21-day turnaround window at your convenience." },
            { icon: "📚", title: "Stay Current", desc: "Access cutting-edge research in your specialty before publication, keeping your knowledge at the frontier." },
            { icon: "✉️", title: "Direct Editorial Access", desc: "Communicate directly with the Editor-in-Chief and build lasting editorial relationships." }
          ].map((b, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-gray-600 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviewer Application Form</h2>
          <p className="text-gray-500 text-sm mb-8">Fields marked * are required. We welcome reviewers at all career stages.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: "Full Name *", field: "name", type: "text", placeholder: "Dr. Jane Smith" },
                { label: "Email Address *", field: "email", type: "email", placeholder: "jane@university.edu" },
                { label: "Institution / Affiliation *", field: "institution", type: "text", placeholder: "Harvard Medical School" },
                { label: "Country *", field: "country", type: "text", placeholder: "United States" },
                { label: "ORCID iD (optional)", field: "orcid", type: "text", placeholder: "0000-0000-0000-0000" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input required={label.includes("*")} type={type}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={(formData as Record<string, string>)[field]}
                    onChange={e => setFormData({...formData, [field]: e.target.value})}
                    placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Highest Degree *</label>
                <select required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})}>
                  <option value="">Select...</option>
                  {["MD / MBBS","PhD","MD-PhD","DM / MCh","MS / MDS","Other"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Research Experience *</label>
              <select required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}>
                <option value="">Select...</option>
                {["1-3 years","4-7 years","8-15 years","15+ years"].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Areas of Expertise * <span className="font-normal text-gray-400">(select all that apply)</span></label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specialtyOptions.map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600"
                      checked={formData.specialties.includes(s)} onChange={() => handleSpecialty(s)} />
                    <span className="text-sm text-gray-700 group-hover:text-blue-700">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Reviewing Availability *</label>
              <select required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}>
                <option value="">Select...</option>
                {["1 manuscript per quarter","2 manuscripts per quarter","3-4 manuscripts per quarter","As needed (flexible)"].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Why do you want to review for Medical Vanguard? *</label>
              <textarea required rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})}
                placeholder="Briefly describe your motivation and any prior reviewing experience..." />
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 border border-blue-100">
              <strong>Our commitment to reviewers:</strong> We guarantee a 7-day response to reviewer invitations, provide structured review templates, and issue official acknowledgement letters upon request.
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold text-base hover:bg-blue-800 transition-colors disabled:opacity-70">
              {submitting ? "Submitting..." : "Submit Reviewer Application"}
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-blue-900 text-white mt-16 py-8 text-center text-sm text-blue-300">
        <p>© 2026 Medical Vanguard. All rights reserved. Open Access under CC BY 4.0 License.</p>
      </footer>
    </div>
  );
}
