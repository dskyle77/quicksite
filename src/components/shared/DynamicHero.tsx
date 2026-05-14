import { TemplateComponentProps } from "@/lib/templates";
import TemplateImage from "./TemplateImage";
import TemplateImageBackground from "./TemplateImageBackground";
interface DynamicHeroProps extends TemplateComponentProps {
  renderText: (heroType: "side" | "background") => React.ReactNode;
  defaultType?: "side" | "background";
}

export default function DynamicHero({
  isEditor,
  content,
  onUpdate,
  renderText,
  defaultType = "side",
}: DynamicHeroProps) {
  const heroType = content?.type ?? defaultType;

  return (
    <section className="relative">
      {/* Universal Editor Toggle */}
      {isEditor && (
        <div className="absolute top-4 left-4 z-50">
          <button
            type="button"
            onClick={() =>
              onUpdate("type", heroType === "side" ? "background" : "side")
            }
            className="text-[10px] bg-zinc-900/80 backdrop-blur text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700 hover:text-white"
          >
            LAYOUT: {heroType.toUpperCase()}
          </button>
        </div>
      )}

      {heroType === "background" ? (
        <TemplateImageBackground
          source={content?.image1}
          publicId={content?.image1PId}
          isEditor={isEditor}
          onImageChange={(url, pId) =>
            onUpdate(null, { ...content, image1: url, image1PId: pId })
          }
        >
          <div className="mx-auto max-w-6xl px-4 py-24">
            {renderText("background")}
          </div>
        </TemplateImageBackground>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {renderText("side")}
            <div className="relative">
              <TemplateImage
                source={content?.image1}
                publicId={content?.image1PId}
                isEditor={isEditor}
                onImageChange={(url, pId) =>
                  onUpdate(null, {
                    ...content,
                    image1: url,
                    image1PId: pId,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
