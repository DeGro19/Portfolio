import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// `new Date()` during render would make the route dynamic under Cache
// Components, so the build timestamp is captured at module load.
const buildDate = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
