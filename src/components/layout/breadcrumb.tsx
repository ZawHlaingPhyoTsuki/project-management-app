"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Split path into ["dashboard", "workspaces", "id", "boards"]
  const segments = pathname.split("/").filter((seg) => seg.length > 0);

  // Build each link path progressively
  const buildHref = (index: number) =>
    "/" + segments.slice(0, index + 1).join("/");

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {segments.map((segment, i) => {
        const href = buildHref(i);
        const label = decodeURIComponent(segment);

        const isLast = i === segments.length - 1;

        return (
          <div key={href} className="flex items-center">
            {i !== 0 && <span className="mx-2">/</span>}

            {isLast ? (
              <span className="font-medium text-foreground capitalize">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors capitalize"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
