"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import EditorClient from "@/screen/editor/EditorClient";

export default function SiteEditorSubPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const subslug = params.subslug as string;

  useEffect(() => {
    if (!subslug && slug) {
      router.replace("/editor/" + slug);
    }
  }, [subslug, slug, router]);

  const editorHomeLink = (
    <Link
      href={`/editor/${slug}`}
      className="ml-2 px-3 py-1 bg-blue-50 text-xs text-blue-700 rounded-full font-semibold shadow-sm border border-blue-100 hover:bg-blue-100 hover:text-blue-900 transition-colors flex items-center gap-2"
    >
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M8 16v-1a4 4 0 014-4h4" />
        <rect x="3" y="6" width="18" height="13" rx="2" />
      </svg>
      Editor Home
    </Link>
  );

  return (
    <EditorClient slug={slug} subslug={subslug} headerExtra={editorHomeLink} />
  );
}
