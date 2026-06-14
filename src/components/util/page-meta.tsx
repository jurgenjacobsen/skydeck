import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
    /**
     * The title rendered in the browser tab and search results.
     */
    title?: string;
    /**
     * The meta description describing the page content.
     */
    description?: string;
    /**
     * The type of OpenGraph object (e.g. 'website', 'article'). Defaults to 'website'.
     */
    ogType?: 'website' | 'article' | 'profile';
    /**
     * The URL of the image that should appear in social preview cards.
     */
    ogImage?: string;
    /**
     * The canonical URL of this page. Defaults to the current window location.
     */
    ogUrl?: string;
    /**
     * Twitter Card layout type. Defaults to 'summary_large_image'.
     */
    twitterCard?: 'summary' | 'summary_large_image';
}

export default function PageMeta({
    title,
    description = 'Skydeck - Flight preparation, interactive checklists, and briefings.',
    ogType = 'website',
    ogImage = 'https://skydeck.jurgen.fyi/default-og.png', // Replace with your deployment's actual default asset url
    ogUrl,
    twitterCard = 'summary_large_image',
}: PageMetaProps) {
    const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Helmet>
            {/* Primary HTML Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* OpenGraph Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {currentUrl && <meta property="og:url" content={currentUrl} />}
            <meta property="og:site_name" content="Skydeck" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
        </Helmet>
    );
}
