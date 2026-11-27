import FriendlyHome from "./components/friendly/FriendlyHome";
import { pageMetadata } from "./site-metadata";

export const metadata = pageMetadata("/");

export default function Home() {
  return <FriendlyHome />;
}
