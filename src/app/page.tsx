import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Vanguard | Advancing Medical Science",
  description: "Medical Vanguard is a peer-reviewed, open-access medical journal publishing high-quality research across clinical medicine, biomedical sciences, and public health.",
  keywords: "medical journal, open access, peer reviewed, clinical research, biomedical science",
  openGraph: {
    title: "Medical Vanguard | Advancing Medical Science",
    description: "Peer-reviewed open-access medical journal",
    url: "https://medical-vanguard.vercel.app",
    siteName: "Medical Vanguard",
    type: "website",
  },
};

export default function HomePage() {
  const features = [
    { title: "Open Access", desc: "All published articles are freely available worldwide with no paywalls, maximizing the reach and impact of your research.", color: "#3182ce", svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" },
    { title: "Rigorous Peer Review", desc: "Every submission undergoes double-blind peer review by qualified experts, ensuring scientific integrity and methodological rigor.", color: "#059669", svg: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "Fast Turnaround", desc: "We respect your time. Initial editorial decisions within 2 weeks and full review within 4-6 weeks.", color: "#d97706", svg: "M13 10V3L4 14h7v7l9-11h-7z" },
    { title: "Global Reach", desc: "Your research reaches scientists, clinicians, and policymakers worldwide through our open distribution network.", color: "#7c3aed", svg: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" },
    { title: "DOI Assignment", desc: "All accepted articles receive a unique Digital Object Identifier (DOI) via CrossRef for permanent, citable references.", color: "#dc2626", svg: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { title: "No Publication Fees", desc: "We are committed to equitable publishing. There are zero article processing charges (APCs) for all authors.", color: "#0891b2", svg: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" },
  ];
  const scope = ["Clinical Medicine & Surgery","Internal Medicine & Specialties","Public Health & Epidemiology","Biomedical & Translational Research","Pharmacology & Therapeutics","Medical Ethics & Health Policy","Global Health & Infectious Diseases","Nursing & Allied Health Sciences"];
  const info = [["Journal Title","Medical Vanguard"],["Publisher","Medical Vanguard Editorial Office"],["Publication Frequency","Continuous"],["Access Type","Open Access"],["Article Processing Charges","None (Free)"],["Peer Review","Double-blind"],["Primary Language","English"],["Website","medical-vanguard.vercel.app"]];
  return (
    <main>
      <section style={{background:"linear-gradient(135deg,#1a365d 0%,#2b6cb0 50%,#3182ce 100%)",color:"white",padding:"80px 20px",textAlign:"center"}}>
        <div style={{maxWidth:"800px",margin:"0 auto"}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.15)",borderRadius:"20px",padding:"6px 18px",marginBottom:"20px",fontSize:"14px",fontWeight:600,letterSpacing:"1px"}}>OPEN ACCESS MEDICAL JOURNAL</div>
          <h1 style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:800,margin:"0 0 20px",lineHeight:1.2}}>Advancing Medical Science,<br/>One Discovery at a Time</h1>
          <p style={{fontSize:"1.2rem",opacity:0.9,maxWidth:"600px",margin:"0 auto 36px"}}>Medical Vanguard is a peer-reviewed, open-access journal dedicated to publishing groundbreaking research in clinical medicine, biomedical sciences, and global public health.</p>
          <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/guidelines" style={{background:"white",color:"#1a365d",padding:"14px 32px",borderRadius:"8px",fontWeight:700,textDecoration:"none",fontSize:"1rem"}}>Submit Manuscript</a>
            <a href="/about" style={{background:"transparent",color:"white",padding:"14px 32px",borderRadius:"8px",fontWeight:600,textDecoration:"none",fontSize:"1rem",border:"2px solid rgba(255,255,255,0.6)"}}>Learn More</a>
          </div>
        </div>
      </section>
      <section style={{background:"#2b6cb0",padding:"24px 20px"}}>
        <div style={{maxWidth:"900px",margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:"16px",color:"white",textAlign:"center"}}>
          {[["2026","Founded"],["Free","No Article Charges"],["Open","Access Policy"],["4 Wk","Avg Review Time"]].map(([v,l],i)=>(
            <div key={i}><div style={{fontSize:"1.8rem",fontWeight:800}}>{v}</div><div style={{fontSize:"0.85rem",opacity:0.85}}>{l}</div></div>
          ))}
        </div>
      </section>
      <section style={{padding:"70px 20px",background:"#f8fafc"}}>
        <div style={{maxWidth:"1000px",margin:"0 auto"}}>
          <h2 style={{textAlign:"center",fontSize:"2rem",fontWeight:800,color:"#1a365d",marginBottom:"12px"}}>Why Publish With Us</h2>
          <p style={{textAlign:"center",color:"#64748b",maxWidth:"600px",margin:"0 auto 50px"}}>We provide a rigorous, transparent, and author-friendly publishing experience.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"28px"}}>
            {features.map((item,i)=>(
              <div key={i} style={{background:"white",borderRadius:"12px",padding:"28px",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",borderTop:`4px solid ${item.color}`}}>
                <div style={{width:"48px",height:"48px",borderRadius:"12px",background:`${item.color}22`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px"}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.svg}/></svg>
                </div>
                <h3 style={{fontSize:"1.1rem",fontWeight:700,color:"#1a365d",marginBottom:"10px"}}>{item.title}</h3>
                <p style={{color:"#64748b",fontSize:"0.95rem",lineHeight:1.6}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:"70px 20px",background:"white"}}>
        <div style={{maxWidth:"1000px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"50px",alignItems:"center"}}>
          <div>
            <h2 style={{fontSize:"2rem",fontWeight:800,color:"#1a365d",marginBottom:"16px"}}>Scope & Coverage</h2>
            <p style={{color:"#64748b",lineHeight:1.8,marginBottom:"20px"}}>Medical Vanguard welcomes submissions across all major areas of medicine and biomedical research. We are committed to broad, interdisciplinary coverage.</p>
            <ul style={{listStyle:"none",padding:0,margin:0}}>
              {scope.map((item,i)=>(
                <li key={i} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:"1px solid #f1f5f9",color:"#374151",fontSize:"0.95rem"}}>
                  <span style={{width:"8px",height:"8px",borderRadius:"50%",background:"#3182ce",flexShrink:0,display:"inline-block"}}></span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{background:"#f8fafc",borderRadius:"16px",padding:"32px"}}>
            <h3 style={{fontSize:"1.3rem",fontWeight:700,color:"#1a365d",marginBottom:"20px",paddingBottom:"12px",borderBottom:"2px solid #e2e8f0"}}>Journal Information</h3>
            {info.map(([label,value],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #e2e8f0",flexWrap:"wrap",gap:"8px"}}>
                <span style={{color:"#64748b",fontSize:"0.9rem",fontWeight:500}}>{label}</span>
                <span style={{color:"#1a365d",fontSize:"0.9rem",fontWeight:600,textAlign:"right"}}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{background:"linear-gradient(135deg,#1a365d,#2b6cb0)",color:"white",padding:"60px 20px",textAlign:"center"}}>
        <h2 style={{fontSize:"2rem",fontWeight:800,marginBottom:"16px"}}>Ready to Submit Your Research?</h2>
        <p style={{opacity:0.9,maxWidth:"500px",margin:"0 auto 32px",fontSize:"1.1rem"}}>Join a growing community of researchers advancing medical science. Submission is free and open to all.</p>
        <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/guidelines" style={{background:"white",color:"#1a365d",padding:"14px 32px",borderRadius:"8px",fontWeight:700,textDecoration:"none",fontSize:"1rem"}}>View Author Guidelines</a>
          <a href="/contact" style={{background:"transparent",color:"white",padding:"14px 32px",borderRadius:"8px",fontWeight:600,textDecoration:"none",fontSize:"1rem",border:"2px solid rgba(255,255,255,0.6)"}}>Contact Editorial Office</a>
        </div>
      </section>
    </main>
  );
}
