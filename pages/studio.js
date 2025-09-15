import { useRef, useState, useEffect } from 'react';

export default function Studio() {
  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [threshold, setThreshold] = useState(128);
  const [strength, setStrength] = useState(1.0);
  const [loaded, setLoaded] = useState(false);

  // Simple grayscale + Sobel edge + threshold (client-only)
  const process = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !loaded) return;
    const w = Math.min(900, img.naturalWidth);
    const scale = w / img.naturalWidth;
    const h = Math.round(img.naturalHeight * scale);
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);

    const src = ctx.getImageData(0, 0, w, h);
    const data = src.data;
    // grayscale
    const gray = new Uint8ClampedArray(w * h);
    for (let i = 0; i < data.length; i += 4) {
      gray[i/4] = (data[i]*0.2126 + data[i+1]*0.7152 + data[i+2]*0.0722) | 0;
    }
    // Sobel
    const out = new Uint8ClampedArray(w * h);
    const gxk = [-1,0,1,-2,0,2,-1,0,1];
    const gyk = [-1,-2,-1,0,0,0,1,2,1];
    for (let y=1; y<h-1; y++){
      for (let x=1; x<w-1; x++){
        let gx=0, gy=0, idx=0;
        for (let j=-1;j<=1;j++){
          for (let i=-1;i<=1;i++){
            const v = gray[(y+j)*w + (x+i)];
            gx += v * gxk[idx]; gy += v * gyk[idx]; idx++;
          }
        }
        const mag = Math.min(255, Math.hypot(gx, gy) * strength);
        out[y*w + x] = mag;
      }
    }
    // threshold to black/white edges
    for (let i=0;i<out.length;i++){
      const v = out[i] >= threshold ? 0 : 255; // black edge on white
      data[i*4] = v; data[i*4+1] = v; data[i*4+2] = v; data[i*4+3] = 255;
    }
    ctx.putImageData(src, 0, 0);
  };

  useEffect(process, [threshold, strength, loaded]);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    imgRef.current.src = url;
    imgRef.current.onload = () => { setLoaded(true); process(); };
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'pyroguide-template.png';
    a.click();
  };

  return (
    <div className="container">
      <h1 className="h2">Template Studio — make your image burn-ready</h1>
      <p className="p">Upload a photo/logo. Adjust edge strength & threshold. Download the black-line template (print on adhesive sheets) or use as overlay.</p>

      <div className="panel" style={{marginTop:16}}>
        <input type="file" accept="image/*" ref={fileRef} onChange={onFile} />
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:16,marginTop:16}}>
          <label>Edge strength: {strength.toFixed(2)}
            <input type="range" min="0.4" max="2.0" step="0.05" value={strength} onChange={e=>setStrength(parseFloat(e.target.value))} />
          </label>
          <label>Threshold: {threshold}
            <input type="range" min="0" max="255" step="1" value={threshold} onChange={e=>setThreshold(parseInt(e.target.value))} />
          </label>
        </div>

        {/* preview: wood background + overlay */}
        <div style={{display:'grid',gap:16,gridTemplateColumns:'1fr',marginTop:16}}>
          <div style={{border:'1px solid var(--line)',borderRadius:12,overflow:'hidden',background:`url(/images/wood.jpg) center/cover`}}>
            <canvas ref={canvasRef} style={{width:'100%',display:'block',mixBlendMode:'multiply'}} />
          </div>
          <button className="btn" onClick={download}>Download template PNG</button>
        </div>

        {/* hidden img holder */}
        <img ref={imgRef} alt="" style={{display:'none'}} />
      </div>

      <p className="p" style={{marginTop:16}}>Tip: For logos or high-contrast images, try lower edge strength and a higher threshold. For photos, increase strength and lower the threshold.</p>
    </div>
  );
}
