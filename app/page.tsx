import FriendlyHome from "./components/friendly/FriendlyHome";
import { pageMetadata, siteName, siteOrigin } from "./site-metadata";

export const metadata = pageMetadata("/");

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  alternateName: ["智遊工作室", "Playwise"],
  url: siteOrigin,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }}
      />
      <FriendlyHome />
    </>
  );
}
