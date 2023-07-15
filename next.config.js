/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"storage.googleapis.com",
			"i.postimg.cc",
			"dxxffxihbcbwpntjdzlk.supabase.co",
			"via.placeholder.com",
			"th.bing.com",
			"www.investopedia.com",
		],
	},
	env: {
		supabase_public_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
		supabase_public_key: process.env.NEXT_PUBLIC_SUPABASE_KEY,
		stripe_publishable_key: process.env.NEXT_STRIPE_PUBLISHABLE_KEY,
		stripe_secret_key: process.env.STRIPE_SECRET_KEY,
		VERCEL_URL: process.env.VERCEL_URL,
		admin_fee_id: process.env.ADMIN_FEES_PRICE_ID,
		stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
	},
};

module.exports = nextConfig;
