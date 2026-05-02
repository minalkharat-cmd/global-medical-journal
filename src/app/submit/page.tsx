'use client';
import { useState } from 'react';

const SPECIALTIES = ['Cardiology','Oncology','Neurology','Pediatrics','Surgery','Internal Medicine','Psychiatry','Radiology','Emergency Medicine','Other'];
const MANUSCRIPT_TYPES = ['Original Research','Review Article','Case Report','Meta-Analysis','Letter to Editor','Editorial','Clinical Trial','Systematic Review'];

interface FormData {
  title: string;
  authors: string;
  author_email: string;
  abstract: string;
  specialty: string;
  manuscript_type: string;
  keywords: string;
  cover_letter: string;
  declaration: boolean;
}

const EMPTY: FormData = { title:'', authors:'', author_email:'', abstract:'', specialty:'', manuscript_type:'', keywords:'', cover_letter:'', declaration: false };

export default function SubmitPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [step, setStep] = useState<'form'|'review'|'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [serverError, setServerError] = useState('');
  const [charCount, setCharCount] = useState(0);

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim() || form.title.length < 10) e.title = 'Title must be at least 10 characters';
    if (!form.authors.trim()) e.authors = 'Author name(s) required';
    if (!form.author_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.author_email)) e.author_email = 'Valid email required';
    if (!form.abstract.trim() || form.abstract.length < 50) e.abstract = 'Abstract must be at least 50 characters';
    if (form.abstract.length > 3000) e.abstract = 'Abstract must be under 3000 characters';
    if (!form.specialty) e.specialty = 'Please select a specialty';
    if (!form.manuscript_type) e.manuscript_type = 'Please select a manuscript type';
    if (!form.declaration) e.declaration = 'You must agree to the declaration';
    setErrors(e as Partial<FormData>);
    return Object.keys(e).length === 0;
  }

  function handleChange(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (field === 'abstract') setCharCount((value as string).length);
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setStep('review');
  }

  async function handleSubmit() {
    setSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          authors: form.authors,
          author_email: form.author_email,
          abstract: form.abstract,
          specialty: form.specialty,
          manuscript_type: form.manuscript_type,
          keywords: form.keywords,
          cover_letter: form.cover_letter,
        })
      });
      const data = await res.json();
      if (res.ok && data.submission_id) {
        setSubmissionId(data.submission_id);
        setStep('success');
      } else {
        setServerError(data.error || 'Submission failed. Please try again.');
        setStep('form');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setStep('form');
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h1>
          <p className="text-gray-500 mb-6">Your manuscript has been submitted successfully to Medical Vanguard Journal.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-600 font-medium mb-1">Your Submission ID</p>
            <p className="text-2xl font-mono font-bold text-blue-800">{submissionId}</p>
            <p className="text-xs text-blue-500 mt-1">Save this ID to track your submission status</p>
          </div>
          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-sm font-medium text-gray-700">What happens next?</p>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-500 font-bold shrink-0">1.</span>
              <span>Our editorial team will screen your submission within 3-5 business days</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-500 font-bold shrink-0">2.</span>
              <span>If it passes screening, it will be sent for peer review</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-500 font-bold shrink-0">3.</span>
              <span>You&apos;ll receive updates at {form.author_email}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setForm(EMPTY); setStep('form'); setCharCount(0); }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
              Submit Another
            </button>
            <a href="/articles" className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors">
              Browse Articles
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setStep('form')} className="text-sm text-blue-600 hover:text-blue-800">← Edit</button>
              <span className="text-gray-300">/</span>
              <h2 className="text-lg font-bold text-gray-900">Review Your Submission</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Title', value: form.title },
                { label: 'Authors', value: form.authors },
                { label: 'Contact Email', value: form.author_email },
                { label: 'Specialty', value: form.specialty },
                { label: 'Manuscript Type', value: form.manuscript_type },
                { label: 'Keywords', value: form.keywords || '(none)' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-sm font-medium text-gray-500 w-36 shrink-0">{label}:</span>
                  <span className="text-sm text-gray-900">{value}</span>
                </div>
              ))}
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">Abstract:</span>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 leading-relaxed">{form.abstract}</p>
              </div>
              {form.cover_letter && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Cover Letter:</span>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 leading-relaxed">{form.cover_letter}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('form')} className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
              ← Go Back & Edit
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Confirm & Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Manuscript</h1>
          <p className="text-gray-500">Medical Vanguard Journal — Open Access Medical Research</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleReview} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div className="border-b border-gray-100 pb-4 mb-2">
            <h2 className="font-semibold text-gray-900">Manuscript Information</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="Full title of your manuscript" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author(s) <span className="text-red-500">*</span></label>
            <input type="text" value={form.authors} onChange={e => handleChange('authors', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.authors ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="e.g. John Smith, Jane Doe, Robert Johnson" />
            {errors.authors && <p className="text-red-500 text-xs mt-1">{errors.authors}</p>}
            <p className="text-xs text-gray-400 mt-1">Separate multiple authors with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Corresponding Author Email <span className="text-red-500">*</span></label>
            <input type="email" value={form.author_email} onChange={e => handleChange('author_email', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.author_email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="your@institution.edu" />
            {errors.author_email && <p className="text-red-500 text-xs mt-1">{errors.author_email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty <span className="text-red-500">*</span></label>
              <select value={form.specialty} onChange={e => handleChange('specialty', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.specialty ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                <option value="">Select specialty...</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manuscript Type <span className="text-red-500">*</span></label>
              <select value={form.manuscript_type} onChange={e => handleChange('manuscript_type', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.manuscript_type ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                <option value="">Select type...</option>
                {MANUSCRIPT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.manuscript_type && <p className="text-red-500 text-xs mt-1">{errors.manuscript_type}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Abstract <span className="text-red-500">*</span></label>
              <span className={`text-xs ${charCount > 3000 ? 'text-red-500' : charCount > 2500 ? 'text-yellow-600' : 'text-gray-400'}`}>{charCount}/3000</span>
            </div>
            <textarea value={form.abstract} onChange={e => handleChange('abstract', e.target.value)} rows={6}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.abstract ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="Background, Methods, Results, and Conclusion (50-3000 characters)" />
            {errors.abstract && <p className="text-red-500 text-xs mt-1">{errors.abstract}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <input type="text" value={form.keywords} onChange={e => handleChange('keywords', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. cardiology, hypertension, clinical trial" />
            <p className="text-xs text-gray-400 mt-1">Comma-separated keywords to help readers find your article</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
            <textarea value={form.cover_letter} onChange={e => handleChange('cover_letter', e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Optional: Brief message to the editor explaining the significance of your work" />
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.declaration} onChange={e => handleChange('declaration', e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">
                I declare that this manuscript is original, has not been published elsewhere, and is not under consideration by another journal. All authors have approved the submission. I confirm there are no conflicts of interest. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.declaration && <p className="text-red-500 text-xs mt-2">{errors.declaration}</p>}
          </div>

          <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
            Review Submission →
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          By submitting, you agree to our submission guidelines and publication ethics policy.
        </p>
      </div>
    </div>
  );
}
