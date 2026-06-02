import { SectionProps } from "../../types";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";

export const FaqSection = ({
  content,
  isEditor,
  onUpdate,
  variant,
  position,
  anchorName,
}: SectionProps) => {
  const list = content?.items || [];
  const isEven = position % 2 === 0;
  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";

  // Handler to delete FAQ item
  const handleDelete = (idx: number) => {
    const next = [...list];
    next.splice(idx, 1);
    onUpdate("items", next);
  };

  // Handler to add new FAQ
  const handleAdd = () => {
    onUpdate("items", [
      ...list,
      {
        question: "New Question",
        answer: "Type your answer here.",
      },
    ]);
  };

  if (variant === "accordion") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-20">
          <h2
            className="text-4xl @md:text-5xl font-black mb-10 text-center tracking-tight"
            style={{ color: "var(--qs-text)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {list.map(
              (item: { question: string; answer: string }, i: number) => (
                <div
                  key={i}
                  className="relative border rounded-3xl bg-(--qs-card) overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    border: "1px solid var(--qs-border)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {isEditor && (
                    <div className="absolute top-4 right-4 z-20">
                      <Xbutton onClick={() => handleDelete(i)} color="red" />
                    </div>
                  )}
                  <div className="p-7">
                    <div
                      className="font-bold text-lg mb-2"
                      style={{ color: "var(--qs-text)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.question`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.question}
                    </div>
                    <div
                      className="text-base leading-relaxed"
                      style={{ color: "var(--qs-text-muted)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.answer`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
          {isEditor && (
            <div className="mt-8 flex justify-center">
              <AddButton onClick={handleAdd}>Add FAQ</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  if (variant === "numbered") {
    // Numbered list FAQ
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-20">
          <h2
            className="text-3xl @md:text-4xl font-black mb-10 text-center tracking-tight"
            style={{ color: "var(--qs-text)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "FAQs"}
          </h2>
          <ol className="list-decimal pl-8 space-y-10">
            {list.map(
              (item: { question: string; answer: string }, i: number) => (
                <li key={i} className="relative">
                  {isEditor && (
                    <div className="absolute top-1 right-0 z-10">
                      <Xbutton onClick={() => handleDelete(i)} color="red" />
                    </div>
                  )}
                  <div
                    className="font-bold text-lg mb-2"
                    style={{ color: "var(--qs-text)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        `items.${i}.question`,
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {item.question}
                  </div>
                  <div
                    className="text-base leading-relaxed pb-1"
                    style={{ color: "var(--qs-text-muted)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        `items.${i}.answer`,
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {item.answer}
                  </div>
                </li>
              ),
            )}
          </ol>
          {isEditor && (
            <div className="mt-8 flex justify-center">
              <AddButton onClick={handleAdd}>Add FAQ</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // Default (grid) FAQ
  return (
    <section id={anchorName} style={{ background: sectionBg }}>
      <Container className="py-20">
        <h2
          className="text-4xl @md:text-5xl font-black mb-12 text-center tracking-tight"
          style={{ color: "var(--qs-text)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("heading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.heading ?? "FAQ"}
        </h2>
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8">
          {list.map((item: { question: string; answer: string }, i: number) => (
            <div
              key={i}
              className="relative group rounded-3xl border p-7 transition-all hover:-translate-y-1 hover:shadow-2xl bg-(--qs-card)"
              style={{
                border: "1px solid var(--qs-border)",
                backdropFilter: "blur(10px)",
              }}
            >
              {isEditor && (
                <div className="absolute top-4 right-4 z-10">
                  <Xbutton onClick={() => handleDelete(i)} color="red" />
                </div>
              )}
              <div
                className="font-bold text-lg mb-2"
                style={{ color: "var(--qs-text)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate(
                    `items.${i}.question`,
                    e.currentTarget.textContent?.trim(),
                  )
                }
              >
                {item.question}
              </div>
              <div
                className="text-base leading-relaxed"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate(
                    `items.${i}.answer`,
                    e.currentTarget.textContent?.trim(),
                  )
                }
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
        {isEditor && (
          <div className="mt-10 flex justify-center">
            <AddButton onClick={handleAdd}>Add FAQ</AddButton>
          </div>
        )}
      </Container>
    </section>
  );
};
