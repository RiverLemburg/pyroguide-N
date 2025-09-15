import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-08' });

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).end('Method Not Allowed'); }
  try {
    const { product, sku, price, meta } = req.body || {};
    const catalog = {
      starter: { name: 'PyroGuide Starter Kit', unit_amount: 6900, currency: 'usd' },
      pro:     { name: 'PyroGuide Pro Bundle',  unit_amount: 12900, currency: 'usd' },
      welcome: { name: 'Wedding Welcome Sign',  unit_amount: 12000, currency: 'usd' }
    };

    let line_item = null;
    let success_url = `${req.headers.origin}/success`;

    if (product === 'template' && sku) {
      line_item = { price_data: { currency:'usd', product_data:{ name:`Template: ${sku}` }, unit_amount: 300 }, quantity: 1 };
      success_url = `${req.headers.origin}/success?sku=${encodeURIComponent(sku)}`;
    } else if (product === 'bundle' && sku) {
      const cents = Number.isFinite(price) ? price : 1500;
      line_item = { price_data: { currency:'usd', product_data:{ name:`Bundle: ${sku}` }, unit_amount: cents }, quantity: 1 };
      success_url = `${req.headers.origin}/success?bundle=${encodeURIComponent(sku)}`;
    } else if (product === 'generated') {
      const cents = Number.isFinite(price) ? price : 400; // $4 default
      line_item = { price_data: { currency:'usd', product_data:{ name:`Custom AI Template` }, unit_amount: cents }, quantity: 1 };
      const tone = encodeURIComponent(meta?.tone || 'maple');
      const contrast = encodeURIComponent(String(meta?.contrast ?? 1.25));
      const opacity = encodeURIComponent(String(meta?.opacity ?? 1.0));
      success_url = `${req.headers.origin}/success?generated=1&tone=${tone}&contrast=${contrast}&opacity=${opacity}`;
    } else {
      const item = catalog[product] || catalog.starter;
      line_item = { price_data: { currency:item.currency, product_data:{ name:item.name }, unit_amount:item.unit_amount }, quantity: 1 };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [line_item],
      success_url,
      cancel_url: `${req.headers.origin}/`
    });
    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('Checkout error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
