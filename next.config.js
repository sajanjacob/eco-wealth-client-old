/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"storage.googleapis.com",
			"i.postimg.cc",
			"dxxffxihbcbwpntjdzlk.supabase.co",
			"via.placeholder.com",
		],
	},
	env: {
		supabase_public_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
		supabase_public_key: process.env.NEXT_PUBLIC_SUPABASE_KEY,
		stripe_publishable_key: process.env.NEXT_STRIPE_PUBLISHABLE_KEY,
		stripe_secret_key: process.env.STRIPE_SECRET_KEY,
	},
};

module.exports = nextConfig;
