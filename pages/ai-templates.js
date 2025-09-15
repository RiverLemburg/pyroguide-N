import React from 'react';

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
    backgroundBlendMode: 'multiply, normal, overlay'
  };
}

export default function AITemplates(){
  const [prompt, setPrompt] = React.useState('floral wreath with initials A & B in the center, elegant');
  const [tone, setTone] = React.useState('maple');
  const [contrast, setContrast] = React.useState(1.25);
  const [opacity, setOpacity] = React.useState(1);
  const [img, setImg] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  async function generate(){
    setBusy(true); setError('');
    try{
      const ctrl = new AbortController();
      const t = setTimeout(()=>ctrl.abort(), 30000);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ prompt, size:'1024x1024' }),
        signal: ctrl.signal
      });
      clearTimeout(t);
      if (!res.ok) throw new Error((await res.json().catch(()=>({})))?.error || 'Generation failed');
      const data = await res.json();
      setImg(data.image);
    }catch(e){
      setError(e.message.includes('abort') ? 'Request timed out. Try a simpler prompt.' : e.message);
    }finally{ setBusy(false); }
  }

  function savePreview(){
    if (!img) return;
    const canvas = document.createElement('canvas');
    const w = 1200, h = 900; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0,0,0,h);
    if (tone==='maple'){ grad.addColorStop(0,'#f8eedf'); grad.addColorStop(1,'#e4d2b6'); }
    else if (tone==='cherry'){ grad.addColorStop(0,'#e9d6c2'); grad.addColorStop(1,'#c79a72'); }
    else { grad.addColorStop(0,'#cbb49a'); grad.addColorStop(1,'#8b6a4d'); }
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
    const image = new Image(); image.crossOrigin = 'anonymous';
    image.onload = () => {
      ctx.globalCompositeOperation='multiply';
      ctx.globalAlpha = opacity;
      ctx.filter = `brightness(0) contrast(${contrast})`;
      const scale = Math.min(w/image.width, h/image.height);
      const dw = image.width*scale, dh = image.height*scale;
      const dx = (w-dw)/2, dy=(h-dh)/2;
      ctx.drawImage(image, dx, dy, dw, dh);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png'); a.download = 'pyroguide_preview.png'; a.click();
    };
    image.src = img;
  }

  async function buyGenerated(){
    try{
      localStorage.setItem('pg_last_prompt', prompt);
      localStorage.setItem('pg_last_tone', tone);
      localStorage.setItem('pg_last_contrast', String(contrast));
      localStorage.setItem('pg_last_opacity', String(opacity));
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ product:'generated', price:400, meta:{ tone, contrast, opacity } })
      });
      const data = await res.json();
      if (data?.url) window.location = data.url; else alert(data?.error || 'Checkout failed');
    } catch {
      alert('Could not start checkout. Please try again.');
    }
  }

  return (
    <div className="container">
      <h1 className="h2">AI Template Generator</h1>
      <p className="p">Describe a design, then preview it as if it’s burned into wood. Switch wood tone and intensity.</p>

      <div className="panel" style={{display:'grid', gap:12}}>
        <input value={prompt} onChange={e=>setPrompt(e.target.value)}
               placeholder="e.g., mountain landscape with pines, elegant Mr & Mrs, vintage crest A&B"
               style={{padding:'10px 12px', borderRadius:10, border:'1px solid var(--line)'}} />
        <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
          <strong>Wood tone:</strong>
          <button className={`btn ${tone==='maple'?'':'outline'}`} onClick={()=>setTone('maple')}>Maple</button>
          <button className={`btn ${tone==='cherry'?'':'outline'}`} onClick={()=>setTone('cherry')}>Cherry</button>
          <button className={`btn ${tone==='walnut'?'':'outline'}`} onClick={()=>setTone('walnut')}>Walnut</button>
          <span style={{marginLeft:12}} />
          <label>Burn contrast <input type="range" min="0.8" max="1.6" step="0.05" value={contrast} onChange={e=>setContrast(parseFloat(e.target.value))}/></label>
          <label>Opacity <input type="range" min="0.6" max="1.0" step="0.02" value={opacity} onChange={e=>setOpacity(parseFloat(e.target.value))}/></label>
        </div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <button className="btn" onClick={generate} disabled={busy}>{busy?'Generating…':'Generate'}</button>
          {img && <button className="btn outline" onClick={savePreview}>Save Burned Preview PNG</button>}
          <button className="btn" onClick={buyGenerated}>Buy This Generated Template — $4</button>
        </div>
        {error && <div className="p" style={{color:'#b23'}}>{error}</div>}
      </div>

      <div className="section">
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{position:'relative', aspectRatio:'4/3', ...cssWood(tone)}}>
            {img ? (
              <img src={img} alt="generated"
                   style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'contain',
                           mixBlendMode:'multiply', filter:`brightness(0) contrast(${contrast})`, opacity}}/>
            ) : (
              <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', color:'#6b5b45'}}>
                Describe a design and click Generate
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
