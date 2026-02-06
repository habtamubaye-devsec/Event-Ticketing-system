import { Helmet } from "react-helmet-async";
import { seoConfig, generatePageTitle, generateCanonicalUrl } from "../utils/seo-config";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: "website" | "article" | "profile";
    canonicalPath?: string;
    structuredData?: object;
}

export default function SEO({
    title,
    description = seoConfig.defaultDescription,
    keywords = seoConfig.defaultKeywords,
    ogImage = seoConfig.defaultImage,
    ogType = "website",
    canonicalPath = "/",
    structuredData,
}: SEOProps) {
    const pageTitle = generatePageTitle(title);
    const canonicalUrl = generateCanonicalUrl(canonicalPath);

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{pageTitle}</title>
            <meta name="title" content={pageTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={seoConfig.author} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={seoConfig.siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:creator" content={seoConfig.twitterHandle} />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
}
