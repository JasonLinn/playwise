import type { ReactNode } from "react";
import { pageMetadata } from "../../site-metadata";

export const metadata = pageMetadata("/works/bnb");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
