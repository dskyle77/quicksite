import React from "react";
import { SectionProps } from "../../types";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";
import TemplateImage from "@/components/shared/TemplateImage";

type GalleryItem = {
  image: string;
  imagePId?: string;
  image2?: string;
  image2PId?: string;
  caption?: string;
};

const BeforeAfterSlider = ({
  before,
  beforePath,
  after,
  afterPath,
  isEditor,
}: {
  before: string;
  beforePath: string;
  after: string;
  afterPath: string;
  isEditor: boolean;
}) => {
  const [sliderPos, setSliderPos] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isEditor) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x =
      "touches" in e
        ? (e as React.TouchEvent).touches[0].clientX
        : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl overflow-hidden cursor-ew-resize group border border-(--qs-border) shadow-2xl touch-none"
      onMouseMove={(e) => !("touches" in e) && handleMove(e)}
      onTouchMove={handleMove}
    >
      {/* After Image */}
      <TemplateImage
        source={after}
        path={afterPath}
        isEditor={isEditor}
        className="inset-0 w-full h-full object-cover"
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <TemplateImage
          source={before}
          path={beforePath}
          isEditor={isEditor}
          className="inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-stone-100">
          <svg
            className="w-5 h-5 text-stone-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M8 9l-4 3 4 3m8-6l4 3-4 3"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest pointer-events-none select-none">
        Before
      </div>
      <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-primary/60 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest pointer-events-none select-none">
        After
      </div>
    </div>
  );
};

export const GallerySection = ({
  content,
  isEditor,
  onUpdate,
  variant,
  position,
  anchorName,
  path,
}: SectionProps) => {
  const items: GalleryItem[] = content?.items ?? [];
  const isEven = position % 2 === 0;
  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";

  const handleDelete = (idx: number) => {
    const next = [...items];
    next.splice(idx, 1);
    onUpdate("items", next);
  };

  const handleAdd = () => {
    onUpdate("items", [
      ...items,
      {
        image: "https://image-source-sk.vercel.app/projects/default-image.jpg",
        image2: "https://image-source-sk.vercel.app/projects/default-image.jpg",
        caption: "New Comparison",
      },
    ]);
  };

  const renderHeader = () => (
    <div className="text-center mb-12">
      <h2
        className="text-4xl @md:text-5xl font-black tracking-tight"
        style={{ color: "var(--qs-text)" }}
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("heading", e.currentTarget.textContent?.trim())}
      >
        {content?.heading ?? "Gallery"}
      </h2>
      {content?.subheading && (
        <p
          className="mt-4 text-lg text-(--qs-text-muted) max-w-2xl mx-auto"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("subheading", e.currentTarget.textContent?.trim())
          }
        >
          {content.subheading}
        </p>
      )}
    </div>
  );

  // ─────────────────────────────────────────────
  // BEFORE-AFTER VARIANT
  // ─────────────────────────────────────────────

  if (variant === "before-after") {
    return (
      <section
        id={anchorName}
        style={{ background: sectionBg }}
        className="py-24"
      >
        <Container className="max-w-4xl">
          {renderHeader()}
          <div className="space-y-12">
            {items.map((item, i) => (
              <div key={i} className="relative">
                {isEditor && (
                  <div className="absolute -top-4 -right-4 z-30">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}
                <BeforeAfterSlider
                  before={item.image2 || item.image}
                  beforePath={`${path}.items.${i}.image2`}
                  after={item.image}
                  afterPath={`${path}.items.${i}.image`}
                  isEditor={isEditor}
                />
                {item.caption && (
                  <div className="mt-6 text-center">
                    <p
                      className="text-xl font-bold tracking-tight text-(--qs-text)"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.caption`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isEditor && (
            <div className="mt-12 flex justify-center">
              <AddButton onClick={handleAdd}>Add Comparison</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // GRID VARIANT
  // ─────────────────────────────────────────────

  if (variant === "grid") {
    return (
      <section
        id={anchorName}
        style={{ background: sectionBg }}
        className="py-24"
      >
        <Container>
          {renderHeader()}
          <div className="grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="relative group rounded-2xl overflow-hidden border border-(--qs-border) bg-(--qs-primary)"
              >
                <TemplateImage
                  source={item.image}
                  path={`${path}.items.${i}.image`}
                  isEditor={isEditor}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {isEditor && (
                  <div className="absolute top-3 right-3 z-20">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/70 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <p
                      className="text-white text-sm font-medium"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.caption`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isEditor && (
            <div className="mt-10 flex justify-center">
              <AddButton onClick={handleAdd}>Add Image</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // MASONRY VARIANT (Simplified Columns)
  // ─────────────────────────────────────────────

  if (variant === "masonry") {
    return (
      <section
        id={anchorName}
        style={{ background: sectionBg }}
        className="py-24"
      >
        <Container>
          {renderHeader()}
          <div className="columns-1 @sm:columns-2 @md:columns-3 gap-4 space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-(--qs-border) bg-(--qs-bg-alt)"
              >
                <TemplateImage
                  source={item.image}
                  path={`${path}.items.${i}.image`}
                  isEditor={isEditor}
                  className="w-full h-auto object-cover"
                />
                {isEditor && (
                  <div className="absolute top-3 right-3 z-20">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}
                <div className="p-4 bg-(--qs-bg-alt)">
                  <p
                    className="text-(--qs-text) text-sm font-bold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        `items.${i}.caption`,
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {item.caption || "Image Caption"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {isEditor && (
            <div className="mt-10 flex justify-center">
              <AddButton onClick={handleAdd}>Add Image</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // CAROUSEL VARIANT
  // ─────────────────────────────────────────────

  return (
    <section
      id={anchorName}
      style={{ background: sectionBg }}
      className="py-24 overflow-hidden"
    >
      <Container>{renderHeader()}</Container>
      <div className="flex gap-4 overflow-x-auto px-6 @md:px-20 pb-8 no-scrollbar snap-x">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative group min-w-[240px] @sm:min-w-[320px] rounded-3xl overflow-hidden border border-(--qs-border) snap-center bg-(--qs-primary)"
          >
            <TemplateImage
              source={item.image}
              path={`${path}.items.${i}.image`}
              isEditor={isEditor}
            />
            {isEditor && (
              <div className="absolute top-4 right-4 z-20">
                <Xbutton onClick={() => handleDelete(i)} color="red" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <p
                className="text-white text-lg font-black tracking-tight drop-shadow-md"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate(
                    `items.${i}.caption`,
                    e.currentTarget.textContent?.trim(),
                  )
                }
              >
                {item.caption || "View Project"}
              </p>
            </div>
          </div>
        ))}
      </div>
      {isEditor && (
        <div className="mt-4 flex justify-center">
          <AddButton onClick={handleAdd}>Add to Carousel</AddButton>
        </div>
      )}
    </section>
  );
};

export const GalleryVariantList = [
  "grid",
  "masonry",
  "carousel",
  "before-after",
];
