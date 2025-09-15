import React from "react";

/* Pick a good subset to start; add more ids any time */
const TEMPLATES = [
  // Wreaths
  "wreath_detailed_01","wreath_detailed_02","wreath_detailed_03","wreath_detailed_04","wreath_detailed_05","wreath_detailed_06",
  // Mr & Mrs
  "mrandmrs_elegant_01","mrandmrs_elegant_02","mrandmrs_elegant_03",
  // Monograms
  "monogram_crest_01","monogram_crest_02","monogram_crest_03","monogram_crest_04",
  // Art Deco
  "artdeco_border_01","artdeco_border_02","artdeco_border_03",
  // Mandalas
  "mandala_geometric_01","mandala_geometric_02","mandala_geometric_03",
  // Celtic
  "celtic_knot_square_01","celtic_knot_square_02",
  // Mountains & Pines
  "mountain_pines_poster_01","mountain_pines_poster_02","mountain_pines_poster_03",
  // Florals
  "floral_spray_corner_01","floral_spray_corner_02",
  // Table Numbers
  "table_number_ring_01","table_number_ring_02","table_number_ring_03"
];

/* Procedural wood styles — no images required */
const woodStyle = (tone) => {
  // base colors per tone
  const tones = {
    maple:  { c1: "#f8eedf", c2: "#efe2cd", c3: "#e4d2b6", knot: "#c9ac83" },
    cherry: { c1: "#e9d6c2", c2: "#dcc1a3", c3: "#c79a72", knot: "#9e6b3f"  },
    walnut: { c1: "#cbb49a", c2: "#a9886a", c3: "#8b6a4d", knot: "#5b402b"  },
  }[tone] || tones.maple;

  // layered repeating gradients to simulate grain; subtle noise-ish feel
  return {
    backgroundImage: `
      linear-gradient(0deg, ${tones[tone]?.c1 || "#f8eedf"}, ${tones[tone]?.c2 || "#efe2cd"}),
      repeating-linear-gradient(
        12deg,
        ${tones[tone]?.c2 || "#efe2cd"} 0px,
        ${tones[tone]?.c2 || "#efe2cd"} 6px,
        ${tones[tone]?.c1 || "#f8eedf"} 8px,
        ${tones[tone]?.c1 || "#f8eedf"} 16px
      ),
      repeating-linear-gradient(
        -8deg,
        ${tones[tone]?.c3 || "#e4d2b6"} 0px,
        ${tones[tone]?.c3 || "#e4d2b6"} 3px,
        transparent 5px,
        transparent 14px
      )
    `,
    backgroundBlendMode: "multiply, normal, overlay"
  };
};

function humanize(id) {
  return id
    .replace(/_/g, " ")
    .replace(/\b(\w)/g, (m) => m.toUpperCase());
}

export default function TemplatesPage() {
  const [tone, setTone] = React.useState("maple");      // maple | cherry | walnut
  const [contrast, setContrast] = React.useState(1.25); // how dark the burn looks
  const [opacity, setOpacity] = React.useState(1);      // fade the burn slightly if needed

  async function buyTemplate(sku) {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: "template", sku })
    });
    const data = await res.json();
    if (data?.url) window.location = data.url;
  }

  return (
    <div className="container">
      <h1 className="h2">Templates Library</h1>
      <p className="p">
        Preview <em>exactly</em> how each template looks burned into wood. Choose a wood tone below,
        then download the SVG or purchase a printable sheet.
      </p>

      {/* Controls */}
      <div className="panel" style={{marginTop:12, display:"grid", gap:12}}>
        <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center"}}>
          <strong>Wood tone:</strong>
          <ToneButton tone="maple" current={tone} setTone={setTone} />
          <ToneButton tone="cherry" current={tone} setTone={setTone} />
          <ToneButton tone="walnut" current={tone} setTone={setTone} />
        </div>
        <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
          <label>Burn contrast&nbsp;
            <input type="range" min="0.8" max="1.6" step="0.05" value={contrast}
                   onChange={(e)=>setContrast(parseFloat(e.target.value))} />
          </label>
          <label>Burn opacity&nbsp;
            <input type="range" min="0.6" max="1.0" step="0.02" value={opacity}
                   onChange={(e)=>setOpacity(parseFloat(e.target.value))} />
          </label>
        </div>
      </div>

      {/* Grid */}
      <div className="grid auto" style={{marginTop:16}}>
        {TEMPLATES.map((id) => (
          <TemplateCard
            key={id}
            id={id}
            label={humanize(id)}
            tone={tone}
            contrast={contrast}
            opacity={opacity}
            onBuy={() => buyTemplate(id)}
          />
        ))}
      </div>
    </div>
  );
}

function ToneButton({ tone, current, setTone }) {
  const label = tone[0].toUpperCase() + tone.slice(1);
  const active = current === tone;
  return (
    <button
      className={`btn ${active ? "" : "outline"}`}
      onClick={() => setTone(tone)}
      title={label}
    >
      {label}
    </button>
  );
}

function TemplateCard({ id, label, tone, contrast, opacity, onBuy }) {
  const boxRef = React.useRef(null);

  // Export the composite preview as PNG (client-side)
  async function savePreview() {
    const wrap = boxRef.current;
    if (!wrap) return;
    const svgURL = `/templates/${id}.svg`;
    const svgImg = await loadImage(svgURL);
    const w = 1000; // export width
    const h = Math.round((3/4) * w); // keep 4:3 aspect
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");

    // paint procedural wood: approximate using flat gradient fill per tone
    const grad = ctx.createLinearGradient(0,0,0,h);
    if (tone === "maple") { grad.addColorStop(0,"#f8eedf"); grad.addColorStop(1,"#e4d2b6"); }
    else if (tone === "cherry") { grad.addColorStop(0,"#e9d6c2"); grad.addColorStop(1,"#c79a72"); }
    else { grad.addColorStop(0,"#cbb49a"); grad.addColorStop(1,"#8b6a4d"); }
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);

    // draw SVG in multiply mode to simulate burn
    ctx.globalCompositeOperation = "multiply";
    // We want black strokes; if your svg has other colors they will multiply too
    // scale to fit
    const scale = Math.min(w / svgImg.width, h / svgImg.height);
    const dw = svgImg.width * scale, dh = svgImg.height * scale;
    const dx = (w - dw)/2, dy = (h - dh)/2;
    ctx.globalAlpha = opacity;
    ctx.filter = `contrast(${contrast})`;
    ctx.drawImage(svgImg, dx, dy, dw, dh);

    // export
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${id}_${tone}.png`;
    a.click();
  }

  return (
    <article className="card" style={{overflow:"hidden"}}>
      {/* Burned composite preview (CSS) */}
      <div
        ref={boxRef}
        style={{
          position: "relative",
          aspectRatio: "4/3",
          ...cssWood(tone)
        }}
      >
        <img
          src={`/templates/${id}.svg`}
          alt={label}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
            mixBlendMode: "multiply", filter: `brightness(0) contrast(${contrast})`, opacity
          }}
          onError={(e)=>{ e.currentTarget.style.display='none'; }}
        />
      </div>

      <div className="card-body">
        <h3 style={{margin:0}}>{label}</h3>
        <div className="p" style={{marginTop:6}}>SVG download or buy the printable sheet.</div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:8}}>
          <a className="btn outline" href={`/templates/${id}.svg`} download>Download SVG</a>
          <button className="btn" onClick={onBuy}>Buy Template — $3</button>
          <button className="btn outline" onClick={savePreview} title="Export the burned preview as PNG">
            Save Preview PNG
          </button>
        </div>
      </div>
    </article>
  );
}

/* CSS-only wood background (procedural) */
function cssWood(tone){
  const map = {
    maple:  { c1:"#f8eedf", c2:"#efe2cd", c3:"#e4d2b6" },
    cherry: { c1:"#e9d6c2", c2:"#dcc1a3", c3:"#c79a72" },
    walnut: { c1:"#cbb49a", c2:"#a9886a", c3:"#8b6a4d" }
  };
  const t = map[tone] || map.maple;
  return {
    backgroundImage: `
      linear-gradient(0deg, ${t.c1}, ${t.c2}),
      repeating-linear-gradient(14deg, ${t.c2} 0px, ${t.c2} 6px, ${t.c1} 9px, ${t.c1} 18px),
      repeating-linear-gradient(-10deg, ${t.c3} 0px, ${t.c3} 3px, transparent 6px, transparent 16px)
    `,
    backgroundBlendMode: "multiply, normal, overlay"
  };
}

/* Utility: load an image from URL and resolve when ready */
function loadImage(src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
