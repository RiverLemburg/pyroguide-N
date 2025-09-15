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
      {/* Top nav */}
      <nav className="nav">
        <strong>PyroGuide</strong>
        <div>
          <a href="#gallery">Gallery</a>
          <a href="#templates">Templates</a>
          <a href="/studio">Template Studio</a>
          <a href="#shop">Shop</a>
        </div>
      </nav>

      {/* HERO — big, warm image with headline + CTAs */}
      <section className="hero" style={{borderBottom:'none'}}>
        <img
          src="/images/hero-wedding-sign.jpg"
          alt="Burned wedding welcome sign"
          style={{ width:'100%', display:'block', objectFit:'cover', maxHeight:560, filter:'contrast(1.03) saturate(1.04)' }}
        />
        <div className="shade" />
        <div className="copy">
          <div className="copy-inner">
            <h1 className="h1">Craft keepsakes they’ll keep forever</h1>
            <p className="p" style={{color:'#f0e4d6'}}>
              Real examples. Real results. Templates that peel clean and burn crisp.
            </p>
            <div className="cta">
              <button className="btn" onClick={() => handleBuy('starter')}>Buy Starter Kit — $69</button>
              <a className="btn outline" href="#gallery">See finished pieces</a>
            </div>
          </div>
        </div>
      </section>

      <main className="container">

        {/* Before/After slider */}
        <section className="section">
          <div className="panel">
            <h2 className="h2">Before → After</h2>
            <p className="p">Peel the template to reveal clean, sharp lines on real wood.</p>
            <BeforeAfter />
          </div>
        </section>

        {/* Gallery — real work on wood */}
        <section id="gallery" className="section">
          <h2 className="h2">Gallery</h2>
          <p className="p">A few examples made with PyroGuide templates & blanks.</p>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16, marginTop:12}}>
            <GalleryCard src="/images/coasters-monogram.jpg" title="Monogram coasters" />
            <GalleryCard src="/images/wedding-sign-detail.jpg" title="Welcome sign detail" />
            <GalleryCard src="/images/table-numbers.jpg" title="Table numbers set" />
            <GalleryCard src="/images/burn-closeup.jpg" title="Burning close-up" />
            <GalleryCard src="/images/pine-forest.jpg" title="Pine forest plaque" />
            <GalleryCard src="/images/mountains.jpg" title="Mountain landscape" />
          </div>
        </section>

        {/* Featured templates (thumbnails link to your SVGs) */}
        <section id="templates" className="section">
          <div className="panel">
            <h2 className="h2">Featured templates (free)</h2>
            <div className="grid auto" style={{marginTop:12}}>
              <TemplateThumb href="/templates/wreath_detailed_01.svg" label="Laurel Wreath" preview="/images/tpl-wreath.png" />
              <TemplateThumb href="/templates/mrandmrs_elegant_01.svg" label="Mr & Mrs Script" preview="/images/tpl-mrandmrs.png" />
              <TemplateThumb href="/templates/monogram_crest_01.svg" label="Monogram Crest" preview="/images/tpl-crest.png" />
              <TemplateThumb href="/templates/artdeco_border_01.svg" label="Art-Deco Border" preview="/images/tpl-artdeco.png" />
              <TemplateThumb href="/templates/mountain_pines_poster_01.svg" label="Mountains + Pines" preview="/images/tpl-mountain.png" />
              <TemplateThumb href="/templates/table_number_ring_01.svg" label="Table Number" preview="/images/tpl-number.png" />
            </div>
            <p className="p" style={{marginTop:8}}>
              Want more? Browse <strong>100+ templates</strong> in <code>public/templates/</code> or add your own in the <a href="/studio">Template Studio</a>.
            </p>
          </div>
        </section>

        {/* Shop */}
        <section id="shop" className="section">
          <h2 className="h2">Shop Kits & Blanks</h2>
          <div className="grid auto" style={{marginTop:12}}>
            <ProductCard
              src="/images/kit-hero.jpg"
              title="Starter Kit"
              text="Pen + 10 templates + 3 blanks"
              price="$69"
              onClick={() => handleBuy('starter')}
            />
            <ProductCard
              src="/images/kit-pro.jpg"
              title="Pro Bundle"
              text="Extra tips + 30 templates + 10 blanks"
              price="$129"
              onClick={() => handleBuy('pro')}
            />
            <ProductCard
              src="/images/welcome-blank.jpg"
              title="Wedding Welcome Sign"
              text="18×24 maple/oak blank"
              price="$120"
              onClick={() => handleBuy('welcome')}
            />
          </div>
        </section>

      </main>

      <footer className="footer">
        © {new Date().getFullYear()} PyroGuide • <a href="/studio" style={{color:'#fff'}}>Template Studio</a>
      </footer>
    </div>
  );
}

/* --- little UI helpers (inline for simplicity) --- */
function GalleryCard({ src, title }) {
  return (
    <figure className="card" style={{overflow:'hidden', background:'#fff9f2'}}>
      <img src={src} alt={title} className="thumb" />
      <figcaption className="card-body" style={{padding:'10px 12px'}}>
        <strong>{title}</strong>
      </figcaption>
    </figure>
  );
}

function ProductCard({ src, title, text, price, onClick }) {
  return (
    <article className="card">
      <img className="thumb" src={src} alt={title} />
      <div className="card-body">
        <h3>{title}</h3>
        <p className="p">{text}</p>
        <div className="price">{price}</div>
        <button className="btn" onClick={onClick} style={{marginTop:8}}>Buy Now</button>
      </div>
    </article>
  );
}

function TemplateThumb({ href, label, preview }) {
  return (
    <a className="card" href={href} download style={{textDecoration:'none'}}>
      <img className="thumb" src={preview} alt={label} />
      <div className="card-body" style={{padding:'10px 12px'}}>
        <strong>{label}</strong>
        <div className="p" style={{marginTop:4}}>Download SVG</div>
      </div>
    </a>
  );
}

function BeforeAfter() {
  // CSS-only slider feel using a range input masking the top image
  return (
    <div style={{position:'relative', border:'1px solid var(--line)', borderRadius:12, overflow:'hidden'}}>
      <img src="/images/before.jpg" alt="Before" style={{display:'block', width:'100%'}} />
      <div id="afterClip" style={{position:'absolute', inset:0, clipPath:'inset(0 50% 0 0)'}}>
        <img src="/images/after.jpg" alt="After" style={{display:'block', width:'100%'}} />
      </div>
      <input
        type="range"
        min="0" max="100" defaultValue="50"
        onInput={(e)=>{ const v=100-Number(e.currentTarget.value); document.getElementById('afterClip').style.clipPath=`inset(0 ${v}% 0 0)`; }}
        style={{position:'absolute', left:12, right:12, bottom:12, appearance:'none', height:6, borderRadius:6, background:'#e8dccf'}}
      />
    </div>
  );
}
