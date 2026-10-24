import Link from "next/link";

const features = [
  { n: "01", title: "Draft with precision", body: "Shape clear, measured floor plans in a calm, purpose-built workspace." },
  { n: "02", title: "Think in three dimensions", body: "Move from a plan to a spatial concept without losing the design thread." },
  { n: "03", title: "Keep every decision close", body: "Layers, dimensions, and project settings stay close to the canvas." }
];

export default function HomePage() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Link className="brand" href="/"><span className="brand-mark">A</span><span>ARCHNOVA <i>STUDIO</i></span></Link>
        <div className="nav-links"><a href="#features">Platform</a><a href="#workflow">Workflow</a><span className="status-dot">Early access</span></div>
        <Link className="nav-cta" href="/studio">Open workspace <span>↗</span></Link>
      </nav>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> ARCHITECTURE, IN A NEW DIMENSION</div>
          <h1>Ideas become<br /><em>architecture.</em></h1>
          <p className="hero-lede">A considered workspace for turning spatial ideas into clear plans and compelling 3D concepts.</p>
          <div className="hero-actions"><Link href="/studio" className="primary-btn">Enter the studio <span>↗</span></Link><a href="#features" className="quiet-link">Explore the workflow <span>↓</span></a></div>
          <div className="hero-meta"><span><b>02D</b> drafting</span><span className="meta-divider" /><span><b>03D</b> visualization</span><span className="meta-divider" /><span><b>01</b> connected workspace</span></div>
        </div>
        <div className="hero-art" aria-label="Architectural blueprint and house concept preview">
          <div className="art-topline"><span>PROJECT / RESIDENCE 014</span><span>CONCEPT STUDY&nbsp; — &nbsp;01</span></div>
          <div className="blueprint-card">
            <div className="plan-label">GROUND FLOOR <span>1:100</span></div>
            <svg viewBox="0 0 420 310" role="img" aria-label="Minimal floor plan drawing" className="hero-plan">
              <defs><pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="#7f9488" strokeOpacity=".13" strokeWidth=".5"/></pattern></defs>
              <rect width="420" height="310" fill="url(#grid)"/>
              <g fill="none" stroke="#c4d4c9" strokeWidth="4" strokeLinejoin="miter">
                <path d="M57 40H356V262H57Z"/><path d="M57 146H220V262"/><path d="M220 40V146H356"/><path d="M285 146V262"/>
              </g>
              <g fill="none" stroke="#90b6a1" strokeWidth="1.2">
                <path d="M70 40V18H344V40M57 274V290H356V274"/><path d="M42 54H25V248H42"/>
                <path d="M128 40V60M149 40V60M270 40V60M291 40V60M57 96H77M57 116H77M356 192H336M356 212H336"/>
                <path d="M57 174H78M57 195H78M220 76H240M220 97H240M220 206H240M220 227H240"/>
              </g>
              <g fill="#9db5a8" fontSize="9" fontFamily="monospace" letterSpacing="1"><text x="105" y="94">LIVING</text><text x="102" y="107">/ DINING</text><text x="263" y="91">KITCHEN</text><text x="89" y="205">BEDROOM 01</text><text x="234" y="205">BATH</text><text x="297" y="202">STUDY</text><text x="80" y="282">12.40 m</text><text x="15" y="155" transform="rotate(-90 15 155)">9.20 m</text></g>
              <g stroke="#75c6a0" strokeWidth="2" fill="none"><path d="M57 74H82M57 74V99M356 220H331M356 220V195"/></g>
            </svg>
            <div className="plan-foot"><span>AREA / 114.2 m²</span><span>REV 01.04</span></div>
          </div>
          <div className="model-card">
            <div className="model-badge"><span className="live-dot" /> 3D CONCEPT</div>
            <div className="house-illustration">
              <div className="house-shadow" />
              <div className="house-roof" /><div className="house-upper"><span className="window w1"/><span className="window w2"/><span className="balcony" /></div>
              <div className="house-lower"><span className="glass g1"/><span className="glass g2"/><span className="entry" /></div>
              <div className="house-side"><span className="side-window" /></div>
              <div className="house-base" />
            </div>
            <div className="model-caption"><span>COURTYARD HOUSE</span><span>AXONOMETRIC / 01</span></div>
          </div>
          <div className="art-crosshair">+</div>
          <div className="art-coordinates">X 04.820 &nbsp; Y 12.640 &nbsp; Z 03.200</div>
        </div>
        <div className="hero-bottom-rule"><span>DESIGNED FOR THE WAY YOU THINK</span><span>SCROLL TO DISCOVER &nbsp; ↓</span></div>
      </section>
      <section className="feature-section" id="features">
        <div className="section-intro"><div className="eyebrow"><span className="eyebrow-line" /> ONE WORKSPACE, MANY PERSPECTIVES</div><h2>From first line<br />to <em>full vision.</em></h2></div>
        <div className="feature-list">{features.map(f => <article className="feature-row" key={f.n}><span className="feature-num">{f.n}</span><div><h3>{f.title}</h3><p>{f.body}</p></div><span className="feature-arrow">↗</span></article>)}</div>
      </section>
      <section className="workflow-band" id="workflow"><div><span className="eyebrow">YOUR NEXT IDEA STARTS HERE</span><h2>Make room for<br /><em>better ideas.</em></h2></div><Link className="primary-btn" href="/studio">Launch workspace <span>↗</span></Link></section>
      <footer className="site-footer"><Link className="brand" href="/"><span className="brand-mark">A</span><span>ARCHNOVA <i>STUDIO</i></span></Link><span>AN EARLY CONCEPT WORKSPACE</span><span>© 2026 ARCHNOVA STUDIO</span></footer>
    </main>
  );
}
