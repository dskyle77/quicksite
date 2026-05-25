/* eslint-disable react-hooks/static-components */

import { useSiteEditorStore } from "@/store/useSiteEditorStore";
import { SectionProps } from "../../types";
import TemplateImage from "@/components/shared/TemplateImage";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";
import EditableLinkButton from "@/components/shared/EditableLink";
import { type MenuItem } from "../../types";

export const MenuSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  path,
}: SectionProps) => {
  const items: MenuItem[] = content?.items || [];
  const isEven = position % 2 === 0;

  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  const cardBg = isEven ? "var(--qs-card-bg)" : "var(--qs-card-bg-alt)";

  const settings = useSiteEditorStore((state) => state.settings);

  const { whatsappNumber } = settings;

  const update = (next: MenuItem[]) => onUpdate("items", next);

  const updateOne = (i: number, changes: Partial<MenuItem>) => {
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
        title: "Chicken Shawarma",
        desc: "Fresh, tasty, and served hot.",
        price: "₦4,500",
        tags: ["Popular"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "Order Now",
      },
    ]);
  };

  const buildOrderMessage = (item: MenuItem) => {
    return `Hello 👋 I want to order:

🍽️ Item: ${item.title}
💰 Price: ${item.price || "N/A"}

Please confirm availability.`;
  };

  const Header = () => (
    <div className="text-center mb-14">
      <h2
        className="text-4xl @md:text-5xl font-black tracking-tight"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("heading", e.currentTarget.textContent?.trim())}
      >
        {content?.heading ?? "Our Menu"}
      </h2>

      <p
        className="mt-5 max-w-2xl mx-auto text-lg opacity-70"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("subheading", e.currentTarget.textContent?.trim())
        }
      >
        {content?.subheading ?? "Fresh meals, drinks, and snacks made daily"}
      </p>
    </div>
  );

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

  const renderOrderButton = (item: MenuItem, i: number) => {
    const messageOverride = buildOrderMessage(item);

    return (
      <EditableLinkButton
        isEditor={isEditor}
        label={item.btnLabel ?? "Order Now"}
        linkConfig={{
          type: "whatsapp",
          phone: whatsappNumber,
          message: messageOverride,
        }}
        messageOverride={messageOverride}
        onLabelChange={(v) => updateOne(i, { btnLabel: v })}
        onLinkChange={() => {
          // Intentionally locked to system-generated WhatsApp link
        }}
        noPreview
        className="rounded-lg px-4 py-2 font-semibold transition-transform hover:scale-[1.02]"
        style={{
          background: "var(--qs-primary)",
          color: "var(--qs-primary-fg)",
          marginTop: 0,
        }}
      />
    );
  };

  // ───────────────────────── LIST VARIANT ─────────────────────────
  if (variant === "list") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-24">
          <Header />

          <div className="space-y-12">
            {items.map((item, i) => (
              <div
                key={i}
                className="relative grid @md:grid-cols-[180px_1fr] gap-6 p-6 rounded-3xl border transition"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-4 right-4">
                    <Xbutton onClick={() => remove(i)} color="red" />
                  </div>
                )}

                <div className="rounded-2xl overflow-hidden">
                  <TemplateImage
                    source={item.image}
                    path={path + `.items.${i}.image`}
                    isEditor={isEditor}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="text-2xl font-bold"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updateOne(i, {
                          title: e.currentTarget.textContent?.trim(),
                        })
                      }
                    >
                      {item.title}
                    </h3>

                    <span
                      className="shrink-0 text-lg font-extrabold"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updateOne(i, {
                          price: e.currentTarget.textContent?.trim(),
                        })
                      }
                    >
                      {item.price ?? "₦0"}
                    </span>
                  </div>

                  <p
                    className="mt-3 opacity-70 leading-7"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateOne(i, {
                        desc: e.currentTarget.textContent?.trim(),
                      })
                    }
                  >
                    {item.desc}
                  </p>

                  {!!item.tags?.length && (
                    <div className="mt-5 flex flex-wrap gap-2 items-center">
                      {item.tags.map((t, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <span
                            className="px-3 py-1 text-xs rounded-full border outline-none"
                            contentEditable={isEditor}
                            suppressContentEditableWarning
                            style={{
                              background: "var(--qs-bg)",
                              border: "1px solid var(--qs-border)",
                            }}
                            onBlur={(e) =>
                              updateTag(
                                i,
                                j,
                                e.currentTarget.textContent?.trim() || t,
                              )
                            }
                          >
                            {t}
                          </span>

                          {isEditor && (
                            <button
                              onClick={() => removeTag(i, j)}
                              className="w-5 h-5 text-xs rounded-full bg-red-500 text-white flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}

                      {isEditor && (
                        <button
                          onClick={() => addTag(i)}
                          className="px-3 py-1 text-xs rounded-full border border-dashed opacity-70 hover:opacity-100 transition"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mt-7">{renderOrderButton(item, i)}</div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-12 flex justify-center">
              <AddButton onClick={add}>Add Menu Item</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ───────────────────────── GRID VARIANT ─────────────────────────
  return (
    <section id={anchorName} style={{ background: sectionBg }}>
      <Container className="py-24">
        <Header />

        <div className="grid @md:grid-cols-2 @xl:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative rounded-3xl border overflow-hidden hover:-translate-y-1 transition"
              style={{
                background: cardBg,
                border: "1px solid var(--qs-border)",
              }}
            >
              {isEditor && (
                <div className="absolute top-3 right-3 z-10">
                  <Xbutton onClick={() => remove(i)} color="red" />
                </div>
              )}

              <TemplateImage
                source={item.image}
                isEditor={isEditor}
                path={path + `.items.${i}.image`}
              />

              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="text-xl font-bold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateOne(i, {
                        title: e.currentTarget.textContent?.trim(),
                      })
                    }
                  >
                    {item.title}
                  </h3>

                  <span
                    className="text-lg font-extrabold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateOne(i, {
                        price: e.currentTarget.textContent?.trim(),
                      })
                    }
                  >
                    {item.price ?? "₦0"}
                  </span>
                </div>

                <p
                  className="mt-3 text-sm opacity-70"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    updateOne(i, {
                      desc: e.currentTarget.textContent?.trim(),
                    })
                  }
                >
                  {item.desc}
                </p>

                {!!item.tags?.length && (
                  <div className="mt-5 flex flex-wrap gap-2 items-center">
                    {item.tags.map((t, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <span
                          className="px-3 py-1 text-xs rounded-full border outline-none"
                          contentEditable={isEditor}
                          suppressContentEditableWarning
                          style={{
                            background: "var(--qs-bg)",
                            border: "1px solid var(--qs-border)",
                          }}
                          onBlur={(e) =>
                            updateTag(
                              i,
                              j,
                              e.currentTarget.textContent?.trim() || t,
                            )
                          }
                        >
                          {t}
                        </span>

                        {isEditor && (
                          <button
                            onClick={() => removeTag(i, j)}
                            className="w-5 h-5 text-xs rounded-full bg-red-500 text-white flex items-center justify-center"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    {isEditor && (
                      <button
                        onClick={() => addTag(i)}
                        className="px-3 py-1 text-xs rounded-full border border-dashed opacity-70 hover:opacity-100 transition"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-7">{renderOrderButton(item, i)}</div>
              </div>
            </div>
          ))}
        </div>

        {isEditor && (
          <div className="mt-12 flex justify-center">
            <AddButton onClick={add}>Add Menu Item</AddButton>
          </div>
        )}
      </Container>
    </section>
  );
};
