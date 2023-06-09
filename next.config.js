/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [""],
	},
	env: {
		supabase_public_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
		supabase_public_key: process.env.NEXT_PUBLIC_SUPABASE_KEY,
	},
};

module.exports = nextConfig;
