import type { MetadataRoute } from 'next'

// Generated from the page files that ACTUALLY EXIST in this app directory.
// Dynamic [slug] routes are deliberately EXCLUDED: emitting a literal '[slug]' is the same
// class of defect as greasemonkeyinsurance.com serving https://[DOMAIN NAME]/ and
// engraverinsurance.com serving /blog/${p.slug} -- both are valid-looking URLs that 404.
// An incomplete but correct sitemap beats a complete but wrong one.
// Dynamic routes still needing per-repo data resolution: /channel/[slug], /company/[slug]
const BASE = 'https://sprayfoamtv.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/ai-video`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/channels`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contractors`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/events`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/live`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/netlify-forms`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/schedule`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/shows`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/sponsor`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
