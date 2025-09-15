export default function Home() {
  async function handleBuy(kind) {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: kind })
    });
    const data = await res.json();
    if (data?.url) window.location = data.url;
  }

  return (
    <div>
      <nav className="nav">
        <strong>PyroGuide</strong>
        <div>
          <a href="#results">Results</a>
          <a href="#shop">Shop</a>
          <a href="/studio">Template Studio</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <video autoPlay loop muted playsInline poster="/images/kit-hero.jpg">
          <source src="/video/hero-burn.mp4" type="video/mp4" />
        </video>
        <div className="shade" />
        <div className="copy">
          <div className="copy-inner">
            <h1 className="h1">Wood burning made easy</h1>
            <p className="p" style={{color:'#f0e4d6'}}>Starter kits, stick-on templates, and wedding-grade blanks for crisp results.</p>
            <div className="cta">
              <button className="btn" onClick={() => handleBuy('starter')}>Buy Starter Kit — $69</button>
              <a className="btn outline" href="#results">See Results</a>
            </div>
          </div>
        </div>
      </section>

      <main className="container">
        {/* Results + Downloads */}
        <section id="results" className="section">
          <div className="panel">
            <h2 className="h2">Templates, actually burned into wood</h2>
            <p className="p">Use our free SVGs or your own design. Stick, burn, peel — clean lines every time.</p>
            <div className="grid auto tiles" style={{marginTop:16}}>
              <article className="card">
                <img className="thumb" src="/images/before-after.jpg" alt="Before and after burn" />
                <div className="tile-text">
                  <div className="tile-title">Before → After</div>
                  <p className="p">Peel to reveal sharp burned outlines.</p>
                  <a href="/templates/wreath.svg" download>Download Wreath SVG</a>
                </div>
              </article>
              <article className="card">
                <img className="thumb" src="/images/wedding-sign.jpg" alt="Wedding sign" />
                <div className="tile-text">
                  <div className="tile-title">Wedding Welcome Sign</div>
                  <p className="p">Perfect for ceremonies & receptions.</p>
                  <a href="/templates/mrandmrs_script.svg" download>Mr &amp; Mrs Script SVG</a>
                </div>
              </article>
              <article className="card">
                <img className="thumb" src="/images/coaster-set.jpg" alt="Monogram coasters" />
                <div className="tile-text">
                  <div className="tile-title">Monogram Coasters</div>
                  <p className="p">Personalized gifts in minutes.</p>
                  <a href="/templates/monogram_ring.svg" download>Monogram Ring SVG</a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Shop */}
        <section id="shop" className="section">
          <h2 className="h2">Shop Kits & Blanks</h2>
          <div className="grid auto" style={{marginTop:16}}>
            <article className="card">
              <img className="thumb" src="/images/kit-hero.jpg" alt="Starter kit" />
              <div className="card-body">
                <h3>Starter Kit</h3>
                <p className="p">Pen + 10 templates + 3 blanks</p>
                <div className="price">$69</div>
                <button className="btn" onClick={() => handleBuy('starter')}>Buy Starter Kit</button>
              </div>
            </article>
            <article className="card">
              <img className="thumb" src="/images/burn-closeup.jpg" alt="Pro bundle" />
              <div className="card-body">
                <h3>Pro Bundle</h3>
                <p className="p">Extra tips + 30 templates + 10 blanks</p>
                <div className="price">$129</div>
                <button className="btn" onClick={() => handleBuy('pro')}>Buy Pro Bundle</button>
              </div>
            </article>
            <article className="card">
              <img className="thumb" src="/images/wedding-sign.jpg" alt="Welcome sign blank" />
              <div className="card-body">
                <h3>Wedding Welcome Sign</h3>
                <p className="p">18×24 maple/oak blank</p>
                <div className="price">$120</div>
                <button className="btn" onClick={() => handleBuy('welcome')}>Order Sign</button>
              </div>
            </article>
          </div>
        </section>

        {/* Gallery */}
        <section className="section">
          <h2 className="h2">Gallery</h2>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',marginTop:12}}>
            <img src="/images/kit-hero.jpg" alt="Kit contents" className="gallery" />
            <img src="/images/burn-closeup.jpg" alt="Burn closeup" className="gallery" />
            <img src="/images/mountains.jpg" alt="Mountains burn" className="gallery" />
            <img src="/images/pine-forest.jpg" alt="Pine forest burn" className="gallery" />
          </div>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} PyroGuide • <a href="/studio" style={{color:'#fff'}}>Template Studio</a>
      </footer>
    </div>
  );
}
