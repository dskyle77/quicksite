/* eslint-disable react-hooks/static-components */

import { SectionProps } from "../../types";
import TemplateImage from "@/components/shared/TemplateImage";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";
import EditableLinkButton, {
  LinkConfig,
} from "@/components/shared/EditableLink";

// Type for individual item
export type ItemsItem = {
  title: string;
  desc: string;
  tags?: string[];
  image?: string;
  imagePId?: string;
  btnLabel?: string;
  btnMessage?: string;
  projectBtnLink?: LinkConfig;
};

// Interface for the section data (content)
export interface ItemsSectionContent {
  heading?: string;
  subheading?: string;
  items: ItemsItem[];
}

export const ItemsSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  path,
}: SectionProps) => {
  const items: ItemsItem[] = content?.items || [];
  const isEven = position % 2 === 0;

  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  const cardBg = isEven ? "var(--qs-card-bg)" : "var(--qs-card-bg-alt)";

  const update = (next: ItemsItem[]) => onUpdate("items", next);

  const updateOne = (i: number, changes: Partial<ItemsItem>) => {
    const next = [...items];
    next[i] = { ...next[i], ...changes };
    update(next);
  };

  const remove = (i: number) => {
    const next = [...items];
    next.splice(i, 1);
    update(next);
  };

  const add = () => {
    update([
      ...items,
      {
        title: "New Item",
        desc: "Item description...",
        tags: ["Tag"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "View Item",
        btnMessage: "",
        projectBtnLink: { type: "url", url: "" },
      },
    ]);
  };

  const addTag = (i: number) => {
    updateOne(i, {
      tags: [...(items[i].tags || []), "New Tag"],
    });
  };

  const removeTag = (i: number, j: number) => {
    const next = [...(items[i].tags || [])];
    next.splice(j, 1);
    updateOne(i, { tags: next });
  };

  const updateTag = (i: number, j: number, value: string) => {
    const next = [...(items[i].tags || [])];
    next[j] = value;
    updateOne(i, { tags: next });
  };

  const Header = () => (
    <div className="mb-14 text-center">
      <h2
        className="text-4xl font-black tracking-tight @md:text-5xl"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("heading", e.currentTarget.textContent?.trim() || "")
        }
      >
        {content?.heading ?? "Items"}
      </h2>

      <p
        className="mx-auto mt-5 max-w-2xl text-lg opacity-70"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("subheading", e.currentTarget.textContent?.trim() || "")
        }
      >
        {content?.subheading ?? "Showcase of my items"}
      </p>
    </div>
  );

  const renderTags = (p: ItemsItem, i: number) => {
    if (!p.tags?.length) return null;

    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {p.tags.map((t, j) => (
          <div key={j} className="flex items-center gap-1">
            <span
              className="rounded-full border px-2 py-1 text-xs outline-none"
              contentEditable={isEditor}
              suppressContentEditableWarning
              style={{
                background: "var(--qs-bg)",
                border: "1px solid var(--qs-border)",
              }}
              onBlur={(e) =>
                updateTag(i, j, e.currentTarget.textContent?.trim() || t)
              }
            >
              {t}
            </span>

            {isEditor && (
              <button
                onClick={() => removeTag(i, j)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {isEditor && (
          <button
            onClick={() => addTag(i)}
            className="rounded-full border border-dashed px-3 py-1 text-xs opacity-70 transition hover:opacity-100"
          >
            + Add
          </button>
        )}
      </div>
    );
  };

  const renderLinkButton = (p: ItemsItem, i: number) => {
    // Generate a message based on the item title (for WhatsApp or similar)
    const autoMessage = p.title
      ? `Hi, I want to know more about "${p.title}"`
      : "Hi, I want to know more about this item";

    return (
      <EditableLinkButton
        isEditor={isEditor}
        label={p.btnLabel ?? "View Item"}
        linkConfig={p.projectBtnLink}
        onLabelChange={(v) => updateOne(i, { btnLabel: v })}
        onLinkChange={(cfg) => updateOne(i, { projectBtnLink: cfg })}
        className="rounded-lg px-4 py-2 font-semibold transition-transform hover:scale-[1.02]"
        messageOverride={autoMessage}
        style={{
          background: "var(--qs-primary)",
          color: "var(--qs-primary-fg)",
          marginTop: 0,
        }}
      />
    );
  };

  // ───────────────────────── LIST ─────────────────────────
  if (variant === "list") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-24">
          <Header />

          <div className="space-y-12">
            {items.map((p, i) => (
              <div
                key={i}
                className="relative grid gap-10 rounded-3xl border p-8 transition @md:grid-cols-2"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute right-4 top-4">
                    <Xbutton onClick={() => remove(i)} color="red" />
                  </div>
                )}

                <div className="overflow-hidden rounded-2xl">
                  <TemplateImage
                    source={p.image}
                    path={path + `.items.${i}.image`}
                    isEditor={isEditor}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h3
                    className="text-3xl font-bold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateOne(i, {
                        title: e.currentTarget.textContent?.trim() || p.title,
                      })
                    }
                  >
                    {p.title}
                  </h3>

                  <p
                    className="mt-4 leading-7 opacity-70"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateOne(i, {
                        desc: e.currentTarget.textContent?.trim() || p.desc,
                      })
                    }
                  >
                    {p.desc}
                  </p>

                  {renderTags(p, i)}

                  <div className="mt-7">{renderLinkButton(p, i)}</div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-12 flex justify-center">
              <AddButton onClick={add}>Add Item</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ───────────────────────── GRID ─────────────────────────
  if (variant === "grid-small") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-24">
          <Header />

          <div className="grid gap-8 @sm:grid-cols-2 @md:grid-cols-3 @xl:grid-cols-4">
            {items.map((p, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border transition hover:-translate-y-1"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute right-3 top-3 z-10">
                    <Xbutton onClick={() => remove(i)} color="red" />
                  </div>
                )}

                <TemplateImage
                  source={p.image}
                  isEditor={isEditor}
                  path={path + `.items.${i}.image`}
                />

                <div className="flex h-full flex-col p-6">
                  <h3
                    className="text-xl font-bold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      isEditor &&
                      updateOne(i, { title: e.currentTarget.textContent || "" })
                    }
                  >
                    {p.title}
                  </h3>

                  <p
                    className="mt-3 text-sm opacity-70"
                    contentEditable={isEditor}
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      isEditor &&
                      updateOne(i, { desc: e.currentTarget.textContent || "" })
                    }
                  >
                    {p.desc}
                  </p>

                  {renderTags(p, i)}

                  <div className="mt-7">{renderLinkButton(p, i)}</div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-12 flex justify-center">
              <AddButton onClick={add}>Add Item</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }
  // ───────────────────────── GRID ─────────────────────────
  return (
    <section id={anchorName} style={{ background: sectionBg }}>
      <Container className="py-24">
        <Header />

        <div className="grid gap-8 @md:grid-cols-2 @xl:grid-cols-3">
          {items.map((p, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl border transition hover:-translate-y-1"
              style={{
                background: cardBg,
                border: "1px solid var(--qs-border)",
              }}
            >
              {isEditor && (
                <div className="absolute right-3 top-3 z-10">
                  <Xbutton onClick={() => remove(i)} color="red" />
                </div>
              )}

              <TemplateImage
                source={p.image}
                isEditor={isEditor}
                path={path + `.items.${i}.image`}
              />

              <div className="flex h-full flex-col p-6">
                <h3
                  className="text-xl font-bold"
                  contentEditable={isEditor}
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    isEditor &&
                    updateOne(i, { title: e.currentTarget.textContent || "" })
                  }
                >
                  {p.title}
                </h3>

                <p
                  className="mt-3 text-sm opacity-70"
                  contentEditable={isEditor}
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    isEditor &&
                    updateOne(i, { desc: e.currentTarget.textContent || "" })
                  }
                >
                  {p.desc}
                </p>

                {renderTags(p, i)}

                <div className="mt-7">{renderLinkButton(p, i)}</div>
              </div>
            </div>
          ))}
        </div>

        {isEditor && (
          <div className="mt-12 flex justify-center">
            <AddButton onClick={add}>Add Item</AddButton>
          </div>
        )}
      </Container>
    </section>
  );
};

export type ItemsSectionVariant = "grid" | "list" | "grid-small";
export const ItemsVariantList: ItemsSectionVariant[] = [
  "grid",
  "list",
  "grid-small",
];
