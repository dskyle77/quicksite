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
  price?: string;
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
        price: "₦0",
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
        className="text-3xl sm:text-4xl font-black tracking-tight @md:text-5xl"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("heading", e.currentTarget.textContent?.trim() || "")
        }
      >
        {content?.heading ?? "Items"}
      </h2>

      <p
        className="mx-auto mt-5 max-w-xl sm:max-w-2xl text-base sm:text-lg opacity-70"
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
        className="rounded-lg px-4 py-2 font-semibold transition-transform hover:scale-[1.02] text-sm xs:text-base"
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
        <Container className="py-12 sm:py-16 md:py-24">
          <Header />

          <div className="flex flex-col gap-6 md:gap-8">
            {items.map((p, i) => (
              <div
                key={i}
                className="relative grid gap-6 p-2 sm:p-8 rounded-2xl md:rounded-3xl border border-(--qs-border) transition-all duration-300 hover:shadow-lg md:grid-cols-12 md:items-center"
                style={{ background: cardBg }}
              >
                {isEditor && (
                  <div className="absolute right-4 top-4 z-10">
                    <Xbutton onClick={() => remove(i)} color="red" />
                  </div>
                )}

                {/* Image Section */}
                <div className="md:col-span-5 w-full">
                  <div className="overflow-hidden rounded-xl md:rounded-2xl aspect-video md:aspect-4/3">
                    <TemplateImage
                      source={p.image}
                      path={`${path}.items.${i}.image`}
                      isEditor={isEditor}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col justify-center md:col-span-7 h-full p-4 sm:p-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <h3
                      className="text-xl sm:text-2xl font-bold tracking-tight text-balance"
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
                    {p.price && (
                      <span
                        className="text-xl font-extrabold text-[var(--qs-primary)]"
                        contentEditable={isEditor}
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateOne(i, {
                            price:
                              e.currentTarget.textContent?.trim() || p.price,
                          })
                        }
                      >
                        {p.price}
                      </span>
                    )}
                  </div>

                  <p
                    className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-prose"
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

                  {renderTags && <div className="mt-4">{renderTags(p, i)}</div>}

                  <div className="mt-6">{renderLinkButton(p, i)}</div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-10 flex justify-center">
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
        <Container className="py-10 sm:py-16 md:py-24">
          <Header />

          <div className="grid gap-6 sm:gap-8 grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @xl:grid-cols-4">
            {items.map((p, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl md:rounded-2xl border transition hover:-translate-y-1"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10">
                    <Xbutton onClick={() => remove(i)} color="red" />
                  </div>
                )}

               <div className="overflow-hidden aspect-4/3">
                 <TemplateImage
                  source={p.image}
                  isEditor={isEditor}
                  path={path + `.items.${i}.image`}
                />
               </div>

                <div className="flex h-full flex-col p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-base sm:text-lg md:text-xl font-bold"
                      contentEditable={isEditor}
                      suppressContentEditableWarning={true}
                      onBlur={(e) =>
                        isEditor &&
                        updateOne(i, {
                          title: e.currentTarget.textContent || "",
                        })
                      }
                    >
                      {p.title}
                    </h3>
                    {p.price && (
                      <span
                        className="text-base font-black text-[var(--qs-primary)] whitespace-nowrap"
                        contentEditable={isEditor}
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateOne(i, {
                            price:
                              e.currentTarget.textContent?.trim() || p.price,
                          })
                        }
                      >
                        {p.price}
                      </span>
                    )}
                  </div>

                  <p
                    className="mt-2 sm:mt-3 text-xs sm:text-sm opacity-70"
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

                  <div className="mt-4 sm:mt-7">{renderLinkButton(p, i)}</div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-8 sm:mt-12 flex justify-center">
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
      <Container className="py-10 sm:py-16 md:py-24">
        <Header />

        <div className="grid gap-6 sm:gap-8 grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3">
          {items.map((p, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl md:rounded-3xl border transition hover:-translate-y-1"
              style={{
                background: cardBg,
                border: "1px solid var(--qs-border)",
              }}
            >
              {isEditor && (
                <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10">
                  <Xbutton onClick={() => remove(i)} color="red" />
                </div>
              )}
              <div className="overflow-hidden aspect-4/3">
                <TemplateImage
                  source={p.image}
                  isEditor={isEditor}
                  path={path + `.items.${i}.image`}
                />
              </div>

              <div className="flex h-full flex-col p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="text-base sm:text-lg md:text-xl font-bold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      isEditor &&
                      updateOne(i, { title: e.currentTarget.textContent || "" })
                    }
                  >
                    {p.title}
                  </h3>
                  {p.price && (
                    <span
                      className="text-base font-black text-[var(--qs-primary)] whitespace-nowrap"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updateOne(i, {
                          price: e.currentTarget.textContent?.trim() || p.price,
                        })
                      }
                    >
                      {p.price}
                    </span>
                  )}
                </div>

                <p
                  className="mt-2 sm:mt-3 text-xs sm:text-sm opacity-70"
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

                <div className="mt-4 sm:mt-7">{renderLinkButton(p, i)}</div>
              </div>
            </div>
          ))}
        </div>

        {isEditor && (
          <div className="mt-8 sm:mt-12 flex justify-center">
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
