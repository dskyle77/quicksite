/* eslint-disable @typescript-eslint/no-explicit-any */
import { SectionProps } from "../../types";

export const FaqSection = ({
  content,
  isEditor,
  onUpdate,
  variant,
  position,
}: SectionProps) => {
  const list = content?.items || [];
  const isEven = position % 2 === 0;
  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";

  if (variant === "accordion") {
    return (
      <section className="py-16" style={{ background: sectionBg }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="text-3xl font-bold mb-6 text-center"
            style={{ color: "var(--qs-text)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "Frequently Asked Questions"}
          </h2>
          <div className="space-y-4">
            {list.map(
              (item: { question: string; answer: string }, i: number) => (
                <div
                  key={i}
                  className="border-b"
                  style={{ borderColor: "var(--qs-border)" }}
                >
                  <div
                    className="font-medium text-base py-2"
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
                    className="text-sm pb-3"
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
              ),
            )}
          </div>
        </div>
      </section>
    );
  }
  if (variant === "numbered") {
    // Numbered list FAQ
    return (
      <section className="py-16" style={{ background: sectionBg }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="text-2xl font-bold mb-8 text-center"
            style={{ color: "var(--qs-text)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "FAQs"}
          </h2>
          <ol className="list-decimal pl-6 space-y-6">
            {list.map(
              (item: { question: string; answer: string }, i: number) => (
                <li key={i}>
                  <div
                    className="font-semibold text-base"
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
                    className="text-sm"
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
        </div>
      </section>
    );
  }
  // Default (grid) FAQ
  return (
    <section className="py-16" style={{ background: sectionBg }}>
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: "var(--qs-text)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("heading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.heading ?? "FAQ"}
        </h2>
        <div className="grid gap-6">
          {list.map((item: { question: string; answer: string }, i: number) => (
            <div
              key={i}
              className="rounded-md border px-6 py-4 backdrop-blur-sm"
              style={{
                border: "1px solid var(--qs-border)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div
                className="font-semibold mb-2"
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
                className="text-sm"
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
      </div>
    </section>
  );
};
