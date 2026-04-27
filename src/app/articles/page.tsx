import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Medical Vanguard",
  description: "Browse published articles in Medical Vanguard — a peer-reviewed, open-access medical journal.",
};

export default function ArticlesPage() {
  return (
    <main style={{ minHeight: "80vh" }}>
      <section style={{ background: "linear-gradient(135deg,#1a365d,#2b6cb0)", color: "white", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "12px" }}>Published Articles</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: "600px", margin: "0 auto" }}>Browse all peer-reviewed articles published in Medical Vanguard. All articles are open access and freely available.</p>
      </section>
      <section style={{ padding: "60px 20px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "60px 40px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#ebf8ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3182ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a365d", marginBottom: "16px" }}>Journal Launching Soon</h2>
            <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto 24px" }}>
              Medical Vanguard is currently accepting its first round of manuscript submissions. We expect to publish our inaugural issue in 2025. Authors are encouraged to submit original research for peer review.
            </p>
            <a href="/guidelines" style={{ background: "#3182ce", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-block" }}>
              Submit Your Research
            </a>
          </div>
          <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px" }}>
            {[
              { label: "Article Types Accepted", items: ["Original Research Articles", "Systematic Reviews & Meta-Analyses", "Case Reports", "Clinical Trials", "Short Communications", "Letters to the Editor"] },
              { label: "Submission Requirements", items: ["English language manuscripts", "Structured abstract (250 words)", "Ethical approval documentation", "Author contribution statement", "Conflict of interest disclosure", "ORCID iDs encouraged"] },
            ].map((box, i) => (
              <div key={i} style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a365d", marginBottom: "14px", paddingBottom: "10px", borderBottom: "2px solid #e2e8f0" }}>{box.label}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {box.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0", color: "#374151", fontSize: "0.9rem" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3182ce", flexShrink: 0, display: "inline-block" }}></span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
