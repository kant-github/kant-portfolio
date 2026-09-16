import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { profile } from "@/lib/data";
import { themeScript } from "@/lib/theme-script";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: profile.name,
	description: `${profile.role} based in ${profile.location}, building backend systems at scale and the product interfaces on top of them.`,
	openGraph: {
		title: profile.name,
		description: `${profile.role} based in ${profile.location}.`,
		type: "profile",
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body className="min-h-full">{children}</body>
		</html>
	);
}
