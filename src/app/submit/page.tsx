'use client';
import { useState } from 'react';
import Link from 'next/link';

const MANUSCRIPT_TYPES = ['Original Research','Review Article','Case Report','Short Communication','Letter to Editor','Editorial','Systematic Review','Meta-Analysis'];
const SPECIALTIES = ['Cardiology','Oncology','Neurology','Infectious Disease','Endocrinology','Pulmonology','Gastroenterology','Nephrology','Rheumatology','Hematology','Psychiatry','Surgery','Pediatrics','Obstetrics & Gynecology','Emergency Medicine','Other'];

export default function SubmitPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submissionId, setSubmissionId] = useState('');

  const [form, setForm] = useState({
    authorName: '', authorEmail: '', institution: '',
    coAuthors: '', country: '', phone: '',
    title: '', abstract: '', keywords: '', manuscriptType: '',
    specialty: '', wordCount: '', references: '',
    conflictOfInterest: '', fundingSource: '', ethicsApproval: false,
    dataAvailability: '', coverLetter: '',
    agreeTerms: false, agreeOriginal: false, agreeReview: false,
  });
  const [manuscriptFile, setManuscriptFile] = useState<File|null>(null);
  const [coverFile, setCoverFile] = useState<File|null>(null);
  const [suppFiles, setSuppFiles] = useState<FileList|null>(null);

  const set = (k: string, v: string|boolean) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmissionId(data.submissionId || data.id || 'MV-'+Date.now());
        setSubmitted(true);
      } else {
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border p-10 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
        <p className="text-gray-600 mb-4">Your manuscript has been successfully submitted for peer review.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 font-medium">Submission Reference</p>
          <p className="text-xl font-bold text-blue-900 mt-1">{submissionId}</p>
        </div>
        <p className="text-sm text-gray-500 mb-6">You will receive a confirmation email at <strong>{form.authorEmail}</strong>. Our editorial team will review your manuscript and contact you within 2-4 weeks.</p>
        <Link href="/" className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-medium">
          Return to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit a Manuscript</h1>
          <p className="text-gray-600 mt-2">All submissions undergo double-blind peer review</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1,2,3].map((s,i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step >= s ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block
                ${step >= s ? 'text-blue-900' : 'text-gray-400'}`}>
                {['Author Info','Manuscript','Declaration'][i]}
              </span>
              {i < 2 && <div className={`w-12 h-0.5 mx-3 ${step > s ? 'bg-blue-900' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Corresponding Author Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input value={form.authorName} onChange={e=>set('authorName',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" value={form.authorEmail} onChange={e=>set('authorEmail',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution / Affiliation *</label>
                  <input value={form.institution} onChange={e=>set('institution',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input value={form.country} onChange={e=>set('country',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input value={form.phone} onChange={e=>set('phone',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Co-Authors (Name, Affiliation; separated by semicolons)</label>
                <textarea value={form.coAuthors} onChange={e=>set('coAuthors',e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Dr. Jane Smith, Harvard Medical School; Dr. John Doe, Johns Hopkins University" />
              </div>
              <div className="flex justify-end">
                <button onClick={()=>{if(form.authorName&&form.authorEmail&&form.institution&&form.country)setStep(2);else setError('Please fill all required fields');}}
                  className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-medium">
                  Next: Manuscript Details →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Manuscript Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manuscript Title *</label>
                <input value={form.title} onChange={e=>set('title',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manuscript Type *</label>
                  <select value={form.manuscriptType} onChange={e=>set('manuscriptType',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                    <option value="">Select type...</option>
                    {MANUSCRIPT_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Specialty *</label>
                  <select value={form.specialty} onChange={e=>set('specialty',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                    <option value="">Select specialty...</option>
                    {SPECIALTIES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Word Count *</label>
                  <input type="number" value={form.wordCount} onChange={e=>set('wordCount',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of References</label>
                  <input type="number" value={form.references} onChange={e=>set('references',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abstract (250–300 words) *</label>
                <textarea value={form.abstract} onChange={e=>set('abstract',e.target.value)} rows={6} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (5–8, separated by commas) *</label>
                <input value={form.keywords} onChange={e=>set('keywords',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="diabetes, insulin resistance, HbA1c, metabolic syndrome" required />
              </div>

              {/* File Uploads */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-medium text-gray-800">File Uploads</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manuscript File * <span className="text-gray-400 font-normal">(Word or PDF, max 20MB)</span>
                  </label>
                  <input type="file" accept=".doc,.docx,.pdf" onChange={e=>setManuscriptFile(e.target.files?.[0]||null)}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100" />
                  {manuscriptFile && <p className="text-xs text-green-600 mt-1">✓ {manuscriptFile.name} ({(manuscriptFile.size/1024/1024).toFixed(2)}MB)</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter <span className="text-gray-400 font-normal">(PDF or Word, optional)</span>
                  </label>
                  <input type="file" accept=".doc,.docx,.pdf" onChange={e=>setCoverFile(e.target.files?.[0]||null)}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
                  {coverFile && <p className="text-xs text-green-600 mt-1">✓ {coverFile.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplementary Files <span className="text-gray-400 font-normal">(optional, multiple allowed)</span>
                  </label>
                  <input type="file" multiple onChange={e=>setSuppFiles(e.target.files)}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
                  {suppFiles && suppFiles.length > 0 && <p className="text-xs text-green-600 mt-1">✓ {suppFiles.length} file(s) selected</p>}
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={()=>setStep(1)} className="text-gray-600 hover:text-gray-900 px-4 py-2 border rounded-lg">← Back</button>
                <button onClick={()=>{if(form.title&&form.manuscriptType&&form.specialty&&form.abstract)setStep(3);else setError('Please fill all required fields');}}
                  className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-medium">
                  Next: Declaration →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Author Declaration</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conflict of Interest Statement *</label>
                <textarea value={form.conflictOfInterest} onChange={e=>set('conflictOfInterest',e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="None declared. OR: Author X has received funding from..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funding Source</label>
                <input value={form.fundingSource} onChange={e=>set('fundingSource',e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="None. OR: Grant number, funding body" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Availability Statement</label>
                <textarea value={form.dataAvailability} onChange={e=>set('dataAvailability',e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Data available on reasonable request." />
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Required Declarations</h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.ethicsApproval} onChange={e=>set('ethicsApproval',e.target.checked)} className="mt-1" />
                  <span className="text-sm text-gray-700">This study was conducted in accordance with the Declaration of Helsinki and relevant institutional ethics committee approval was obtained.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreeOriginal} onChange={e=>set('agreeOriginal',e.target.checked)} className="mt-1" />
                  <span className="text-sm text-gray-700">This manuscript is original, has not been published before, and is not under consideration for publication elsewhere.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreeReview} onChange={e=>set('agreeReview',e.target.checked)} className="mt-1" />
                  <span className="text-sm text-gray-700">All authors have agreed to submission and accept the journal's peer review process.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreeTerms} onChange={e=>set('agreeTerms',e.target.checked)} className="mt-1" />
                  <span className="text-sm text-gray-700">I have read and agree to the <Link href="/guidelines" className="text-blue-700 underline">Author Guidelines</Link> and <Link href="/ethics" className="text-blue-700 underline">Publication Ethics Policy</Link>.</span>
                </label>
              </div>

              {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex justify-between">
                <button onClick={()=>setStep(2)} className="text-gray-600 hover:text-gray-900 px-4 py-2 border rounded-lg">← Back</button>
                <button
                  onClick={()=>{
                    if(!form.conflictOfInterest||!form.agreeTerms||!form.agreeOriginal||!form.agreeReview||!form.ethicsApproval){
                      setError('Please complete all required fields and declarations.');
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={loading}
                  className="bg-green-700 text-white px-8 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium">
                  {loading ? 'Submitting...' : 'Submit Manuscript'}
                </button>
              </div>
            </div>
          )}

          {error && step !== 3 && <p className="text-red-600 text-sm mt-4 bg-red-50 p-3 rounded-lg">{error}</p>}
        </div>
      </div>
    </div>
  );
}
