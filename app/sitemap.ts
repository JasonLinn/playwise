import type { MetadataRoute } from "next";
import { publicPages, siteOrigin } from "./site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(publicPages).map((path) => ({
    url: new URL(path, siteOrigin).href,
  }));
}
