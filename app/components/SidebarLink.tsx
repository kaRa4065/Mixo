"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded hover:bg-gray-50 mt-12 bg-gray-100 font-medium tracking-wide text-secondary"
    >
      {label}
    </Link>
  );
}
