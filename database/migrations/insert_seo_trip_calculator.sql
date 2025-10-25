-- Insert SEO data for Trip Calculator page
INSERT INTO seo_metadata (
    page_type,
    page_id,
    title,
    description,
    keywords,
    robots,
    canonical_url,
    og_title,
    og_description,
    og_image,
    twitter_title,
    twitter_description,
    twitter_image,
    structured_data,
    created_at,
    updated_at
) VALUES (
    'trip-calculator',
    NULL,
    'Trip Calculator - Hitung Biaya Pendakian Gunung | PERGIMMIKAN',
    'Rencanakan pendakian gunung Anda dengan mudah! Hitung estimasi biaya transportasi, peralatan, dan jalur pendakian. Dapatkan rekomendasi gunung terdekat dari lokasi Anda dengan Trip Calculator PERGIMMIKAN.',
    'kalkulator pendakian, biaya pendakian gunung, peralatan hiking, transportasi gunung, jalur pendakian, estimasi biaya trip, rental alat gunung, gunung terdekat, trip planner indonesia, kalkulator biaya mendaki, perencanaan pendakian, estimasi biaya hiking, sewa peralatan gunung, transportasi ke gunung, jalur hiking indonesia, gunung di indonesia, pendakian gunung jawa, biaya mendaki gunung, tips pendakian, persiapan mendaki gunung',
    'index, follow',
    'https://pergimmikan.site/next',
    'Trip Calculator - Rencanakan Pendakian Gunung Anda | PERGIMMIKAN',
    'Hitung estimasi biaya lengkap untuk pendakian gunung: transportasi, peralatan, dan jalur. Temukan gunung terdekat dari lokasi Anda! Gratis dan mudah digunakan.',
    'https://pergimmikan.site/images/og-trip-calculator.jpg',
    'Trip Calculator - Hitung Biaya Pendakian',
    'Rencanakan pendakian dengan mudah! Estimasi biaya transportasi, peralatan, dan jalur pendakian. Temukan gunung terdekat dari lokasimu.',
    'https://pergimmikan.site/images/twitter-trip-calculator.jpg',
    '{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Trip Calculator PERGIMMIKAN",
        "applicationCategory": "TravelApplication",
        "description": "Kalkulator biaya pendakian gunung yang membantu merencanakan trip dengan estimasi biaya transportasi, peralatan, dan jalur pendakian",
        "url": "https://pergimmikan.site/next",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "IDR"
        },
        "featureList": [
            "Estimasi biaya transportasi ke gunung",
            "Perhitungan biaya rental peralatan",
            "Rekomendasi jalur pendakian",
            "Pencarian gunung terdekat",
            "Estimasi total biaya trip"
        ],
        "author": {
            "@type": "Organization",
            "name": "PERGIMMIKAN",
            "url": "https://pergimmikan.site"
        }
    }',
    NOW(),
    NOW()
);

-- Verify insertion
SELECT * FROM seo_metadata WHERE page_type = 'trip-calculator';
