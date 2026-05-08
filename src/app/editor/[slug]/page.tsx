"use client";

import { useParams, useSearchParams } from "next/navigation";

import EditorClient from "@/screen/editor/EditorClient";

export default function CatchAllEditorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const searchParams = useSearchParams();

  const subslug = searchParams.get("sp");

  return <EditorClient slug={slug} subslug={subslug} />;
}
