export default function Home() {
  async function buy(product) {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ product })
    });
    const data = await res.json();
    if (data?.url) window.location = data.url;
  }

  return (
    <div>
      {/* NAV */}
      <nav className="nav">
        <strong>PyroGuide</strong>
        <div>
          <a href="/templates">Templates</a>
          <a href="/ai-templates">AI Templates</a>
          <a href="#shop">Shop</a>
        </div>
      </nav>

      {/* HERO — warm brown, welcoming, no external images */}
      <section className="hero" style={{borderBottom:'none', position:'relative', maxHeight:560}}>
        <div style={bgWood('cherry')}/>
        <div className="copy">
          <div className="copy-inner">
            <h1 className="h1">Craft keepsakes they’ll keep forever</h1>
            <p className="p" style={{color:'#f0e4d6'}}>
              Stick-on templates + curated wood blanks = beautiful, crisp burns even for beginners.
            </p>
            <div className="cta">
              <button className="btn" onClick={()=>buy('starter')}>Buy Starter Kit — $69</button>
              <a className="btn outline" href="/templates">Browse Templates</a>
            </div>
          </div>
        </div>
        {/* subtle inline “photo” made of SVG so nothing can be missing */}
        <div style={{position:'absolute', right:16, bottom:16, width:280, background:'rgba(255,255,255,.9)', borderRadius:12, padding:12}}>
          <MiniBurnPreview />
        </div>
      </section>

      <main className="container">
        {/* WHY SECTION */}
        <section className="section">
          <div className="grid auto">
            <InfoCard title="Peel & Burn">
              Stick the template, trace with heat, peel — sharp lines every time.
            </InfoCard>
            <InfoCard title="Wedding-ready">
              Elegant scripts, wreaths, crests, table numbers — perfect for signage.
            </InfoCard>
            <InfoCard title="Custom on the fly">
              Use <a href="/ai-templates">AI Templates</a> to generate exactly what you imagine.
            </InfoCard>
          </div>
        </section>

        {/* BEFORE / AFTER (SVG, no assets) */}
        <section className="section">
          <div className="panel">
            <h2 className="h2">Before → After</h2>
            <p className="p">See how a simple template becomes a clean burn on wood.</p>
            <BeforeAfterNoImages />
          </div>
        </section>

        {/* FEATURED TEMPLATES — inline SVG on wood backgrounds */}
        <section id="templates" className="section">
          <h2 className="h2">Featured templates</h2>
          <p className="p">Previewed as if burned into wood. Download or buy individually.</p>
          <div className="grid auto" style={{marginTop:12}}>
            <TplCard label="Laurel Wreath" id="wreath_detailed_01" />
            <TplCard label="Mr & Mrs Script" id="mrandmrs_elegant_01" />
            <TplCard label="Monogram Crest" id="monogram_crest_01" />
            <TplCard label="Art-Deco Border" id="artdeco_border_01" />
            <TplCard label="Mountains + Pines" id="mountain_pines_poster_01" />
            <TplCard label="Table Number" id="table_number_ring_01" />
          </div>
          <div style={{marginTop:12}}>
            <a className="btn outline" href="/templates">View full library</a>
          </div>
        </section>

        {/* SHOP */}
        <section id="shop" className="section">
          <h2 className="h2">Shop Kits & Blanks</h2>
          <div className="grid auto" style={{marginTop:12}}>
            <ShopCard title="Starter Kit" desc="Pen + 10 templates + 3 blanks" price="$69" onClick={()=>buy('starter')}>
              <KitSVG />
            </ShopCard>
            <ShopCard title="Pro Bundle" desc="Extra tips + 30 templates + 10 blanks" price="$129" onClick={()=>buy('pro')}>
              <KitProSVG />
            </ShopCard>
            <ShopCard title="Wedding Welcome Sign" desc="18×24 maple/oak blank" price="$120" onClick={()=>buy('welcome')}>
              <BoardSVG />
            </ShopCard>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="panel" style={{display:'grid', gap:8, textAlign:'center'}}>
            <h2 className="h2">Want something specific?</h2>
            <p className="p">Describe it and we’ll generate a burn-preview instantly.</p>
            <a className="btn" href="/ai-templates">Open AI Templates</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} PyroGuide • <a href="/templates" style={{color:'#fff'}}>Templates</a> • <a href="/ai-templates" style={{color:'#fff'}}>AI Templates</a>
      </footer>
    </div>
  );
}

/* ========= inline components (no external images) ========= */

function InfoCard({ title, children }) {
  return (
    <article className="card">
      <div className="card-body">
        <h3 style={{margin:0}}>{title}</h3>
        <p className="p" style={{marginTop:6}}>{children}</p>
      </div>
    </article>
  );
}

function ShopCard({ title, desc, price, onClick, children }) {
  return (
    <article className="card">
      <div style={{padding:16, borderBottom:'1px solid var(--line)'}}>
        {children}
      </div>
      <div className="card-body">
        <h3 style={{margin:0}}>{title}</h3>
        <p className="p" style={{marginTop:6}}>{desc}</p>
        <div className="price">{price}</div>
        <button className="btn" onClick={onClick} style={{marginTop:8}}>Buy Now</button>
      </div>
    </article>
  );
}

function BeforeAfterNoImages(){
  return (
    <div style={{position:'relative', border:'1px solid var(--line)', borderRadius:12, overflow:'hidden'}}>
      <div style={{...bgWoodObj('maple'), height:240}}/>
      <div id="overlay" style={{position:'absolute', inset:0, clipPath:'inset(0 50% 0 0)'}}>
        <div style={{...bgWoodObj('maple'), height:'100%'}}/>
        <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', mixBlendMode:'multiply', filter:'brightness(0) contrast(1.25)'}}>
          <WreathSVG width={220}/>
        </div>
      </div>
      <input
        type="range" min="0" max="100" defaultValue="50"
        onInput={(e)=>{ const v=100-Number(e.currentTarget.value); document.getElementById('overlay').style.clipPath=`inset(0 ${v}% 0 0)`; }}
        style={{position:'absolute', left:12, right:12, bottom:12, appearance:'none', height:6, borderRadius:6, background:'#e8dccf'}}
      />
    </div>
  );
}

function TplCard({ id, label }) {
  return (
    <a className="card" href={`/templates/${id}.svg`} download style={{textDecoration:'none', overflow:'hidden'}}>
      <div style={{position:'relative', aspectRatio:'4/3', ...bgWoodObj('maple')}}>
        <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', mixBlendMode:'multiply', filter:'brightness(0) contrast(1.25)'}}>
          {/* simple inline icon per label */}
          {label.includes('Wreath') && <WreathSVG width={200}/>}
          {label.includes('Mr & Mrs') && <MrMrsSVG width={260}/>}
          {label.includes('Crest') && <CrestSVG width={220}/>}
          {label.includes('Art-Deco') && <BorderSVG width={260}/>}
          {label.includes('Mountains') && <MountainsSVG width={260}/>}
          {label.includes('Table') && <TableRingSVG width={220} text="12"/>}
        </div>
      </div>
      <div className="card-body">
        <strong>{label}</strong>
        <div className="p" style={{marginTop:4}}>Download SVG</div>
      </div>
    </a>
  );
}

/* ---- inline SVG “art” (all self-contained) ---- */
function WreathSVG({ width=180 }) {
  return (
    <svg viewBox="0 0 300 300" width={width} height={width} fill="none" stroke="#000" strokeWidth="3">
      <circle cx="150" cy="150" r="100"/>
      <path d="M70 140c20-30 40-30 60 0M230 160c-20 30-40 30-60 0" />
    </svg>
  );
}
function MrMrsSVG({ width=280 }) {
  return (
    <svg viewBox="0 0 680 220" width={width} height={(width*220)/680} fill="none" stroke="#000" strokeWidth="2">
      <path d="M60,170 C120,60 200,60 270,170 C340,60 410,60 480,170" />
      <text x="340" y="125" textAnchor="middle" fontFamily="serif" fontSize="56">Mr &amp; Mrs</text>
    </svg>
  );
}
function CrestSVG({ width=220 }) {
  return (
    <svg viewBox="0 0 520 520" width={width} height={width} fill="none" stroke="#000" strokeWidth="3">
      <circle cx="260" cy="260" r="180"/>
      <text x="260" y="280" textAnchor="middle" fontFamily="serif" fontSize="64">A&B</text>
    </svg>
  );
}
function BorderSVG({ width=280 }) {
  return (
    <svg viewBox="0 0 600 300" width={width} height={(width*300)/600} fill="none" stroke="#000" strokeWidth="3">
      <rect x="30" y="30" width="540" height="240" rx="18"/>
      <path d="M80 80h440M80 220h440" />
    </svg>
  );
}
function MountainsSVG({ width=280 }) {
  return (
    <svg viewBox="0 0 600 300" width={width} height={(width*300)/600} fill="none" stroke="#000" strokeWidth="3">
      <path d="M40 240 L140 120 L220 240 Z M180 240 L300 100 L420 240 Z M360 240 L470 150 L560 240 Z" />
      <path d="M180 200 h50 M300 180 h60 M420 210 h40" />
    </svg>
  );
}
function TableRingSVG({ width=200, text='1' }) {
  return (
    <svg viewBox="0 0 420 420" width={width} height={width} fill="none" stroke="#000" strokeWidth="4">
      <circle cx="210" cy="210" r="150"/>
      <text x="210" y="245" textAnchor="middle" fontFamily="serif" fontSize="140">{text}</text>
    </svg>
  );
}
function KitSVG(){ return <BoardSVG /> }
function KitProSVG(){ return <BoardSVG detail /> }
function BoardSVG({ detail=false }) {
  return (
    <svg viewBox="0 0 600 360" width="100%" height="160" fill="none" stroke="#000" strokeWidth="2">
      <rect x="20" y="40" width="560" height="280" rx="18"/>
      {detail && <path d="M60 100 h480 M60 140 h480" />}
    </svg>
  );
}
function MiniBurnPreview(){
  return (
    <div style={{position:'relative', aspectRatio:'4/3', ...bgWoodObj('maple')}}>
      <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', mixBlendMode:'multiply', filter:'brightness(0) contrast(1.25)'}}>
        <CrestSVG width={160}/>
      </div>
    </div>
  );
}

/* ---- procedural wood backgrounds (no files) ---- */
function bgWood(tone='maple'){
  return {
    position:'absolute', inset:0,
    ...bgWoodObj(tone)
  };
}
function bgWoodObj(tone='maple'){
  const tones = {
    maple:  { c1:"#f8eedf", c2:"#efe2cd", c3:"#e4d2b6" },
    cherry: { c1:"#e9d6c2", c2:"#dcc1a3", c3:"#c79a72" },
    walnut: { c1:"#cbb49a", c2:"#a9886a", c3:"#8b6a4d" }
  }[tone] || { c1:"#f8eedf", c2:"#efe2cd", c3:"#e4d2b6" };
  return {
    backgroundImage: `
      linear-gradient(0deg, ${tones.c1}, ${tones.c2}),
      repeating-linear-gradient(14deg, ${tones.c2} 0px, ${tones.c2} 6px, ${tones.c1} 9px, ${tones.c1} 18px),
      repeating-linear-gradient(-10deg, ${tones.c3} 0px, ${tones.c3} 3px, transparent 6px, transparent 16px)
    `,
    backgroundBlendMode: "multiply, normal, overlay"
  };
}
