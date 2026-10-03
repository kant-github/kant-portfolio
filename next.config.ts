import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// The three old write-ups were replaced by one case study.
			{
				source: "/writing/:slug*",
				destination: "/case-studies/taste-is-the-new-moat",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
