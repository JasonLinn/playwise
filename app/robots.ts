import type { MetadataRoute } from "next";
import { siteOrigin } from "./site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteOrigin).href,
  };
}
