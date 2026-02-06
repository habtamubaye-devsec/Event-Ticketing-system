// SEO Configuration for Qetero Events
export const seoConfig = {
    siteName: "Qetero Events",
    siteUrl: "https://qetero-events.vercel.app",
    defaultTitle: "Qetero Events - Discover & Book Amazing Events",
    defaultDescription:
        "Discover and book tickets for the best upcoming events. From concerts to conferences, find your next experience on Qetero Events.",
    defaultKeywords:
        "events, tickets, book tickets, event booking, concerts, conferences, workshops, entertainment, upcoming events, event management",
    defaultImage: "https://qetero-events.vercel.app/Qetero%20EVENTS.png",
    twitterHandle: "@QeteroEvents",
    author: "Qetero Events Team",
    themeColor: "#1890ff",
};

export const generatePageTitle = (pageTitle?: string) => {
    if (!pageTitle) return seoConfig.defaultTitle;
    return `${pageTitle} | ${seoConfig.siteName}`;
};

export const generateCanonicalUrl = (path: string) => {
    return `${seoConfig.siteUrl}${path}`;
};
