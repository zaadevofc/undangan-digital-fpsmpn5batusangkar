import { Metadata } from "next";

export const SEO = {
  SITE_URL: "https://fpsmpn5batusangkar.vercel.app/",
  SITE_TITLE: "Undangan Perpisahan | Farewell Party - SMPN 5 Batusangkar",
  SITE_DESCRIPTION:
    "Kamu di Undang untuk menghadiri acara Perpisahan SMPN 5 Batusangkar!",
  SITE_AUTHORS: [
    { name: "zaadevofc", url: "https://zaadevofc.tech" },
    { name: "zaadevofc", url: "https://instagram.com/zaadevofc" },
  ],
  SITE_CREATOR: "zaadevofc",
  SITE_CREATOR_EMAIL: "zaadevofc@gmail.com",
  SITE_CATEGORY: "invitation",
  SITE_KEYWORDS: [
    "undangan",
    "digital",
    "perpisahan",
    "smpn",
    "5",
    "batusangkar",
  ],
};

export const METADATA: Metadata = {
  title: SEO.SITE_TITLE,
  description: SEO.SITE_TITLE,
  authors: SEO.SITE_AUTHORS,
  creator: SEO.SITE_CREATOR,
  category: SEO.SITE_CATEGORY,
  keywords: SEO.SITE_KEYWORDS,
  appLinks: { web: { url: SEO.SITE_URL } },
  alternates: { canonical: SEO.SITE_URL },
  applicationName: SEO.SITE_TITLE,
  bookmarks: SEO.SITE_URL,
  openGraph: {
    url: SEO.SITE_URL,
    siteName: SEO.SITE_TITLE,
    ttl: 60,
    type: "website",
    countryName: "Indonesia",
    description: SEO.SITE_DESCRIPTION,
    title: SEO.SITE_TITLE,
    emails: SEO.SITE_CREATOR_EMAIL,
    images: SEO.SITE_URL + "banner/id-bg-2.jpeg",
  },
  twitter: {
    site: SEO.SITE_TITLE,
    siteId: SEO.SITE_TITLE,
    title: SEO.SITE_TITLE,
    description: SEO.SITE_DESCRIPTION,
    creator: SEO.SITE_CREATOR,
    images: SEO.SITE_URL + "banner/id-bg-2.jpeg",
    creatorId: SEO.SITE_CREATOR,
    card: "summary_large_image",
  },
};

export const fetchJson = async (uri: any, method?: any) => await fetch(uri).then((x) => x.json())
export const postJson = async (uri: any, data: any) => await fetch(uri, { body: JSON.stringify(data), method: 'POST' }).then((x) => x.json())