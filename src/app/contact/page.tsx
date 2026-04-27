'use client'
import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const handleChange = (e:any) => setForm({...form, [e.target.name]: e.target.value})
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    setSent(true)
  }
  if(sent) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h2>
      <p className="text-gray-500">We will respond within 2 business days.</p>
    </div>
  )
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-10">Get in touch with the editorial team</p>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-6">
          {[{icon:Mail,title:'Email',lines:['editor@globalmedjournal.org','submissions@globalmedjournal.org']},{icon:Phone,title:'Phone',lines:['+1 (617) 555-0123','Mon-Fri, 9AM-5PM EST']},{icon:MapPin,title:'Address',lines:['Medical Vanguard','123 Medical Avenue','Boston, MA 02115, USA']},{icon:Clock,title:'Office Hours',lines:['Monday-Friday: 9AM-5PM EST','Response time: 2 business days']}].map(({icon:Icon,title,lines}) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{title}</h3>
                {lines.map((l,i) => <p key={i} className="text-sm text-gray-500">{l}</p>)}
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
              <select name="subject" value={form.subject} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500">
                <option value="">Select a subject...</option>
                {['Submission Inquiry','Peer Review','Editorial Query','Indexing & Metrics','Technical Issue','Other'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={6} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 w-full">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}
