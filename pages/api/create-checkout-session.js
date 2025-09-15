import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-08' });

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).end('Method Not Allowed'); }
  try {
    const { product } = req.body || {};
    const catalog = {
      starter: { name: 'PyroGuide Starter Kit', unit_amount: 6900, currency: 'usd' },
      pro:     { name: 'PyroGuide Pro Bundle', unit_amount: 12900, currency: 'usd' },
      welcome: { name: 'Wedding Welcome Sign', unit_amount: 12000, currency: 'usd' }
    };
    const item = catalog[product] || catalog.starter;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: item.currency,
          product_data: { name: item.name },
          unit_amount: item.unit_amount
        },
        quantity: 1
      }],
      // optional shipping address capture:
      // shipping_address_collection: { allowed_countries: ['US','CA'] },
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/`
    });
    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
