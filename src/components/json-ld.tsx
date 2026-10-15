import { certifications, education } from "@/lib/cv-data";
import { siteConfig } from "@/lib/site-config";

/**
 * schema.org Person markup. Lets search engines and LLM crawlers read the
 * structured facts rather than inferring them from prose. Rendered from the
 * same data as the page, so it cannot drift.
 */
export function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location,
    },
    sameAs: [siteConfig.github, siteConfig.linkedin],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.institution,
    },
    hasCredential: certifications.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "EducationalOccupationalCredential",
        name: item.name,
        credentialCategory: "certificate",
        recognizedBy: { "@type": "Organization", name: group.issuer },
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      // Serialised once from trusted local data; `<` is escaped so the JSON
      // can never close the surrounding script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(person).replace(/</g, "\u003c"),
      }}
    />
  );
}
