"use client";

import { useParams } from "next/navigation";
import EditorClient from "@/screen/editor/EditorClient";

export default function SiteEditorPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <EditorClient slug={slug} />;
}
