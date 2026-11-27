import type { ReactNode } from "react";
import { pageMetadata } from "../../site-metadata";

export const metadata = pageMetadata("/works/washpass");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
