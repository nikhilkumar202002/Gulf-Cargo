"use client";

import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1 text-sm"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:underline"
                style={{ color: "#ED2624" }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: "white" }}>{item.label}</span>
            )}

            {!isLast && (
              <IoIosArrowForward
                className="mx-2 h-4 w-4"
                style={{ color: "white" }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
