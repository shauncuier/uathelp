export const siteConfig = {
  name: "UAT Help",
  description:
    "AI-powered university admission companion for Bangladeshi students. Get personalized guidance, explore universities, and track your admission journey.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://uathelp.com",
  ogImage: "/og-image.png",
  creator: "3s-Soft",
  keywords: [
    "university admission",
    "bangladesh",
    "AI assistant",
    "admission help",
    "university database",
    "admission circular",
    "scholarship finder",
    "BUET",
    "Dhaka University",
    "admission test",
  ],
  links: {
    github: "https://github.com/3s-soft/uathelp",
    facebook: "https://facebook.com/uathelp",
  },
} as const;
