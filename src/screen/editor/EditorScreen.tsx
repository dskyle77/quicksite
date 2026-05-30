/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type { Site } from "@/lib/types";
import { setDeep } from "@/lib/helpers";

import { getTemplateByType } from "@/lib/templates";
import { getTheme } from "@/lib/themes";
import Template from "@/components/siteTemplates/Template";

interface EditorScreenProps {
  data: Site;
  onChange: (updated: Site) => void;
  slugs: Record<string, any>;
  canEdit: boolean;
}

export default function EditorScreen({
  data,
  onChange,
  canEdit,
}: EditorScreenProps) {
  const templateEntry = getTemplateByType(data.type);
  const theme = getTheme(data.theme);

  if (!templateEntry) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border">
        <p className="text-red-500 font-bold">
          Error: Template Type &quot;{data.type}&quot; not found.
        </p>
      </div>
    );
  }

  const handleUpdate = (path: string, value: any) => {
    const updated = setDeep(data.content, path, value);
    onChange({ ...data, content: updated });
  };

  const canCustomize = templateEntry.config.canCustomize;
  return (
    <div className={`w-full h-full ${theme.className}`}>
      <style>{theme.css}</style>
      <Template
        isPreview={!canEdit}
        isEditor={true}
        content={data.content}
        onUpdate={handleUpdate}
        canCustomize={canCustomize}
        hasNavbar={true}
      />
    </div>
  );
}
