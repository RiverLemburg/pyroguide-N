// Minimal OpenAI image generation -> returns data URL PNG
export const config = { api: { bodyParser: { sizeLimit: '2mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).end('Method Not Allowed'); }
  try {
    const { prompt, size = '1024x1024' } = req.body || {};
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY missing' });
    if (!prompt || prompt.length < 3) return res.status(400).json({ error: 'Prompt is required' });

    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-image-1', prompt, size, response_format: 'b64_json' })
    });
    if (!r.ok) return res.status(500).json({ error: 'Image API failed', detail: await r.text() });

    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return res.status(500).json({ error: 'No image returned' });
    return res.status(200).json({ image: `data:image/png;base64,${b64}` });
  } catch (e) {
    console.error('Generate error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
