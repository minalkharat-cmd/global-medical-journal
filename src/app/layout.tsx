import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Medical Vanguard | Advancing Medical Science",
    template: "%s | Medical Vanguard",
  },
  description: "Medical Vanguard is a peer-reviewed, open-access medical journal publishing high-quality research across clinical medicine, biomedical sciences, and public health.",
  keywords: ["medical journal", "open access", "peer reviewed", "clinical research", "biomedical science", "public health", "Medical Vanguard"],
  authors: [{ name: "Medical Vanguard Editorial Office" }],
  creator: "Medical Vanguard",
  publisher: "Medical Vanguard",
  metadataBase: new URL("https://medical-vanguard.vercel.app"),
  openGraph: {
    title: "Medical Vanguard | Advancing Medical Science",
    description: "Peer-reviewed open-access medical journal",
    url: "https://medical-vanguard.vercel.app",
    siteName: "Medical Vanguard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical Vanguard | Advancing Medical Science",
    description: "Peer-reviewed open-access medical journal",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Scholar / Highwire Press metadata */}
        <meta name="citation_journal_title" content="Medical Vanguard" />
        <meta name="citation_publisher" content="Medical Vanguard" />
        <meta name="citation_language" content="en" />
        <meta name="DC.publisher" content="Medical Vanguard" />
        <meta name="DC.language" content="en" />
        <meta name="DC.rights" content="Open Access" />
        <meta name="prism.publicationName" content="Medical Vanguard" />
        <meta name="prism.issn" content="pending" />
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <nav style={{ background: "#1a365d", padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <a href="/" style={{ color: "white", textDecoration: "none", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.5px" }}>
              Medical <span style={{ color: "#63b3ed" }}>Vanguard</span>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
              {[["About", "/about"], ["Articles", "/articles"], ["Guidelines", "/guidelines"], ["Editorial Board", "/editorial-board"], ["Contact", "/contact"]].map(([label, href]) => (
                <a key={label} href={href} style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", padding: "8px 14px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 500, transition: "all 0.2s" }}>
                  {label}
                </a>
              ))}
              <a href="/guidelines" style={{ background: "#3182ce", color: "white", textDecoration: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 700, marginLeft: "8px" }}>
                Submit
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer style={{ background: "#0f2744", color: "rgba(255,255,255,0.8)", padding: "48px 20px 24px", marginTop: "auto" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "32px", marginBottom: "40px" }}>
              <div>
                <h3 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", marginBottom: "12px" }}>Medical <span style={{ color: "#63b3ed" }}>Vanguard</span></h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,255,255,0.65)" }}>A peer-reviewed, open-access medical journal committed to advancing biomedical research globally.</p>
              </div>
              <div>
                <h4 style={{ color: "white", fontWeight: 600, marginBottom: "12px" }}>Quick Links</h4>
                {[["Home", "/"], ["About", "/about"], ["Author Guidelines", "/guidelines"], ["Editorial Board", "/editorial-board"], ["Contact", "/contact"]].map(([label, href]) => (
                  <div key={label} style={{ marginBottom: "6px" }}><a href={href} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.9rem" }}>{label}</a></div>
                ))}
              </div>
              <div>
                <h4 style={{ color: "white", fontWeight: 600, marginBottom: "12px" }}>Journal Info</h4>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 2 }}>
                  <div>ISSN: Pending</div>
                  <div>DOI: CrossRef Member</div>
                  <div>Access: Open Access</div>
                  <div>Language: English</div>
                </div>
              </div>
              <div>
                <h4 style={{ color: "white", fontWeight: 600, marginBottom: "12px" }}>Contact</h4>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 2 }}>
                  <div>medicalvanguard@zohomail.in</div>
                  <div>+91 8103713606</div>
                  <div>566 College Road</div>
                  <div>Mahasamund, CG 493445</div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", textAlign: "center", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
              © {new Date().getFullYear()} Medical Vanguard. All rights reserved. Open Access under CC BY 4.0 License.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
