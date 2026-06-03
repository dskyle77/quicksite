/* eslint-disable react-hooks/static-components */
import { SectionProps, MenuItem } from "../../types";
import TemplateImage from "@/components/shared/TemplateImage";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";
import EditableLinkButton from "@/components/shared/EditableLink";

export interface MenuSectionContent {
  heading?: string;
  subheading?: string;
  items: MenuItem[];
}

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
        title: "New Dish",
        desc: "Description of the dish...",
        price: "₦2,500",
        image: "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "Order Now",
        menuBtnLink: { type: "url", url: "" },
      },
    ]);
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
        {content?.heading ?? "Our Menu"}
      </h2>
      <p
        className="mx-auto mt-5 max-w-xl sm:max-w-2xl text-base sm:text-lg opacity-70"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("subheading", e.currentTarget.textContent?.trim() || "")
        }
      >
        {content?.subheading ?? "Freshly prepared for you"}
      </p>
    </div>
  );

  // ───────────────────────── LIST VARIANT ─────────────────────────
  if (variant === "list") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-10 sm:py-16 md:py-24">
          <Header />
          <div className="mx-auto max-w-4xl space-y-6">
            {items.map((p, i) => (
              <div
                key={i}
                className="group relative flex items-start gap-4 rounded-xl border p-4 transition hover:shadow-md"
                style={{ background: cardBg, border: "1px solid var(--qs-border)" }}
              >
                {isEditor && (
                  <div className="absolute -right-2 -top-2 z-10">
                    <Xbutton onClick={() => remove(i)} color="red" />
                  </div>
                )}
                
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                  <TemplateImage
                    source={p.image}
                    path={path + `.items.${i}.image`}
                    isEditor={isEditor}
                  />
                </div>

                <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className="text-lg font-bold sm:text-xl"
                        contentEditable={isEditor}
                        suppressContentEditableWarning
                        onBlur={(e) => updateOne(i, { title: e.currentTarget.textContent?.trim() || p.title })}
                      >
                        {p.title}
                      </h3>
                      <span
                        className="text-lg font-black text-[var(--qs-primary)]"
                        contentEditable={isEditor}
                        suppressContentEditableWarning
                        onBlur={(e) => updateOne(i, { price: e.currentTarget.textContent?.trim() || p.price })}
                      >
                        {p.price}
                      </span>
                    </div>
                    <p
                      className="mt-1 text-sm opacity-70"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) => updateOne(i, { desc: e.currentTarget.textContent?.trim() || p.desc })}
                    >
                      {p.desc}
                    </p>
                    <div className="mt-3">
                      <EditableLinkButton
                        isEditor={isEditor}
                        label={p.btnLabel ?? "Order Now"}
                        linkConfig={p.menuBtnLink}
                        onLabelChange={(v) => updateOne(i, { btnLabel: v })}
                        onLinkChange={(cfg) => updateOne(i, { menuBtnLink: cfg })}
                        className="text-xs font-bold uppercase tracking-wider text-[var(--qs-primary)] hover:underline"
                        messageOverride={`Hi, I'd like to order: ${p.title}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {isEditor && (
            <div className="mt-8 flex justify-center">
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
      <Container className="py-10 sm:py-16 md:py-24">
        <Header />
        <div className="grid gap-6 sm:gap-8 grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3">
          {items.map((p, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border transition hover:-translate-y-1"
              style={{ background: cardBg, border: "1px solid var(--qs-border)" }}
            >
              {isEditor && (
                <div className="absolute right-2 top-2 z-10">
                  <Xbutton onClick={() => remove(i)} color="red" />
                </div>
              )}
              <div className="aspect-4/3">
                <TemplateImage
                  source={p.image}
                  path={path + `.items.${i}.image`}
                  isEditor={isEditor}
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3
                    className="text-lg font-bold sm:text-xl"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => updateOne(i, { title: e.currentTarget.textContent?.trim() || p.title })}
                  >
                    {p.title}
                  </h3>
                  <span
                    className="text-lg font-black text-[var(--qs-primary)]"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => updateOne(i, { price: e.currentTarget.textContent?.trim() || p.price })}
                  >
                    {p.price}
                  </span>
                </div>
                <p
                  className="text-sm opacity-70"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => updateOne(i, { desc: e.currentTarget.textContent?.trim() || p.desc })}
                >
                  {p.desc}
                </p>
                <div className="mt-6">
                  <EditableLinkButton
                    isEditor={isEditor}
                    label={p.btnLabel ?? "Order Now"}
                    linkConfig={p.menuBtnLink}
                    onLabelChange={(v) => updateOne(i, { btnLabel: v })}
                    onLinkChange={(cfg) => updateOne(i, { menuBtnLink: cfg })}
                    className="w-full rounded-xl py-3 px-2 text-center font-bold"
                    style={{ background: "var(--qs-primary)", color: "var(--qs-primary-fg)" }}
                    messageOverride={`Hi, I'd like to order: ${p.title}`}
                  />
                </div>
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

export type MenuSectionVariant = "grid" | "list";
export const MenuVariantList: MenuSectionVariant[] = ["grid", "list"];
