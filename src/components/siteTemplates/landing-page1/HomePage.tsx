/* eslint-disable @typescript-eslint/no-explicit-any */
import Branding from "@/components/shared/Branding";
import { TemplateProps, TemplateComponentProps } from "@/lib/templates";
import TemplateImage from "@/components/shared/TemplateImage";
import CtaLink from "@/components/shared/CtaLinkModal";

export default function Home({ isEditor, content, onUpdate }: TemplateProps) {
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) onUpdate(path, value);
  };
  return (
    <>
      <Navbar isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Hero isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <TrustedBy
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
      />
      <Features isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Stats isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Testimonials
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
      />
      <Cta isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Footer isEditor={isEditor} content={content} onUpdate={handleUpdate} />
    </>
  );
}

function Navbar({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const links = content?.navbar?.links ?? [
    "Features",
    "About",
    "Pricing",
    "Contact",
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--qs-bg-alt) 88%, transparent)",
        borderBottom: "1px solid var(--qs-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl font-bold"
            style={{
              background: "var(--qs-primary)",
              color: "var(--qs-primary-fg)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("navbar.logo", e.currentTarget.textContent?.trim())
            }
          >
            {content?.navbar?.logo ?? "🚀"}
          </div>

          <h1
            className="text-lg font-bold tracking-tight md:text-xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("navbar.title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.navbar?.title ?? "My Business"}
          </h1>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link: string, i: number) => (
            <a key={i} href="#" className="transition-opacity hover:opacity-70">
              {link}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <div
            className="mb-5 inline-flex rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
              color: "var(--qs-text-muted)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.badge", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.badge ?? "✨ New & Improved"}
          </div>

          <h2
            className="max-w-xl text-4xl font-bold tracking-tight md:text-6xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.title ??
              "Transform Your Business With Our Solution"}
          </h2>

          <p
            className="mt-6 max-w-xl text-base leading-7 md:text-lg"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.desc", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.desc ??
              "We help businesses grow faster with innovative solutions designed to simplify your workflow and maximize results."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <CtaLink
              isEditor={isEditor}
              label={content?.hero?.primaryButton ?? "Get Started"}
              linkConfig={content?.hero?.primaryButtonLink}
              onLabelChange={(v) => onUpdate("hero.primaryButton", v)}
              onLinkChange={(cfg) => onUpdate("hero.primaryButtonLink", cfg)}
              className="rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.02] inline-block"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />

            <CtaLink
              isEditor={isEditor}
              label={content?.hero?.secondaryButton ?? "Learn More"}
              linkConfig={content?.hero?.secondaryButtonLink}
              onLabelChange={(v) => onUpdate("hero.secondaryButton", v)}
              onLinkChange={(cfg) => onUpdate("hero.secondaryButtonLink", cfg)}
              className="rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.02] inline-block"
              style={{
                background: "var(--qs-bg-alt)",
                color: "var(--qs-text)",
                border: "1px solid var(--qs-border)",
              }}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <span style={{ color: "var(--qs-text-muted)" }}>✓ Easy to use</span>
            <span style={{ color: "var(--qs-text-muted)" }}>
              ✓ Fast results
            </span>
            <span style={{ color: "var(--qs-text-muted)" }}>
              ✓ Great support
            </span>
          </div>
        </div>

        <div className="relative">
          <TemplateImage
            source={content.hero.image1}
            publicId={content?.hero?.image1PId}
            isEditor={isEditor}
            onImageChange={(url, publicId) => {
              onUpdate("hero", {
                ...content.hero,
                image1: url,
                image1PId: publicId,
              });
            }}
          />
        </div>
      </div>
    </section>
  );
}

function TrustedBy({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const logos = content?.trustedBy ?? [
    "TechCorp",
    "StartupHub",
    "Creative Co",
    "Innovation Labs",
    "Digital Agency",
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-10">
      <p
        className="mb-5 text-center text-sm font-medium uppercase tracking-[0.2em]"
        style={{ color: "var(--qs-text-muted)" }}
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("trustedByLabel", e.currentTarget.textContent?.trim())
        }
      >
        {content?.trustedByLabel ?? "Trusted by"}
      </p>

      <div
        className="grid grid-cols-2 gap-4 rounded-3xl p-6 md:grid-cols-5"
        style={{
          background: "var(--qs-bg-alt)",
          border: "1px solid var(--qs-border)",
        }}
      >
        {logos.map((logo: string, i: number) => (
          <div
            key={i}
            className="flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold"
            style={{
              background: "var(--qs-bg)",
              border: "1px solid var(--qs-border)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) => {
              const newLogos = [...logos];
              newLogos[i] = e.currentTarget.textContent?.trim() || logo;
              onUpdate("trustedBy", newLogos);
            }}
          >
            {logo}
          </div>
        ))}
      </div>
    </section>
  );
}

function Features({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const features = content?.features ?? [
    {
      title: "Quality Service",
      desc: "We deliver exceptional quality in everything we do, ensuring your complete satisfaction.",
    },
    {
      title: "Fast Delivery",
      desc: "Get results quickly without compromising on quality or attention to detail.",
    },
    {
      title: "Expert Support",
      desc: "Our team of experts is here to help you succeed every step of the way.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h3
          className="text-3xl font-bold tracking-tight md:text-4xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("featuresHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.featuresHeading ?? "Why Choose Us"}
        </h3>
        <p
          className="mt-4 text-base"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("featuresSubheading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.featuresSubheading ??
            "Discover what makes us different and how we can help you achieve your goals."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f: any, i: number) => (
          <div
            key={i}
            className="rounded-3xl p-6 transition-transform hover:-translate-y-1"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
            }}
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            >
              {["⚡", "🎯", "💎"][i]}
            </div>

            <h4
              className="text-xl font-semibold"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate(
                  `features.${i}.title`,
                  e.currentTarget.textContent?.trim(),
                )
              }
            >
              {f.title}
            </h4>

            <p
              className="mt-3 leading-7"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate(
                  `features.${i}.desc`,
                  e.currentTarget.textContent?.trim(),
                )
              }
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const stats = content?.stats ?? [
    { value: "500+", label: "Happy Customers" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div
        className="grid gap-4 rounded-3xl p-6 md:grid-cols-3"
        style={{
          background: "var(--qs-bg-alt)",
          border: "1px solid var(--qs-border)",
        }}
      >
        {stats.map((stat: any, i: number) => (
          <div key={i} className="text-center">
            <div
              className="text-3xl font-bold md:text-4xl"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newStats = [...stats];
                newStats[i].value =
                  e.currentTarget.textContent?.trim() || stat.value;
                onUpdate("stats", newStats);
              }}
            >
              {stat.value}
            </div>
            <div
              className="mt-1 text-sm"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newStats = [...stats];
                newStats[i].label =
                  e.currentTarget.textContent?.trim() || stat.label;
                onUpdate("stats", newStats);
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const testimonials = content?.testimonials ?? [
    {
      quote:
        "This has completely transformed how we do business. Highly recommend to anyone looking for quality.",
      name: "Sarah Johnson",
      role: "CEO, TechStart",
    },
    {
      quote:
        "Exceptional service and results. The team went above and beyond our expectations.",
      name: "Michael Chen",
      role: "Founder, Creative Studio",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h3
          className="text-3xl font-bold tracking-tight md:text-4xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("testimonialsHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.testimonialsHeading ?? "What Our Clients Say"}
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((item: any, i: number) => (
          <blockquote
            key={i}
            className="rounded-3xl p-6"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
            }}
          >
            <p
              className="text-lg leading-8"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate(
                  `testimonials.${i}.quote`,
                  e.currentTarget.textContent?.trim(),
                )
              }
            >
              &quot;{item.quote}&quot;
            </p>
            <footer className="mt-5">
              <div
                className="font-semibold"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate(
                    `testimonials.${i}.name`,
                    e.currentTarget.textContent?.trim(),
                  )
                }
              >
                {item.name}
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate(
                    `testimonials.${i}.role`,
                    e.currentTarget.textContent?.trim(),
                  )
                }
              >
                {item.role}
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Cta({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div
        className="rounded-4xl px-6 py-12 text-center md:px-10"
        style={{
          background: "var(--qs-primary)",
          color: "var(--qs-primary-fg)",
        }}
      >
        <h3
          className="text-3xl font-bold tracking-tight md:text-5xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("cta.title", e.currentTarget.textContent?.trim())
          }
        >
          {content?.cta?.title ?? "Ready to Get Started?"}
        </h3>

        <p
          className="mx-auto mt-4 max-w-2xl text-base md:text-lg"
          style={{ opacity: 0.92 }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("cta.desc", e.currentTarget.textContent?.trim())
          }
        >
          {content?.cta?.desc ??
            "Join thousands of satisfied customers and start your journey with us today."}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <CtaLink
            isEditor={isEditor}
            label={content?.cta?.button ?? "Get Started Now"}
            linkConfig={content?.cta?.buttonLink}
            onLabelChange={(v) => onUpdate("cta.button", v)}
            onLinkChange={(cfg) => onUpdate("cta.buttonLink", cfg)}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.02] inline-block"
          />
        </div>
      </div>
    </section>
  );
}

function Footer({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <footer
      className="mt-8 border-t"
      style={{
        background: "var(--qs-bg-alt)",
        borderColor: "var(--qs-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p
            className="font-semibold"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("footer.brand", e.currentTarget.textContent?.trim())
            }
          >
            {content?.footer?.brand ?? "My Business"}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--qs-text-muted)" }}>
            {content?.footer?.copyright ??
              `© ${new Date().getFullYear()} My Business. All rights reserved.`}
          </p>
          {!isEditor && <Branding />}
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <a href="#" className="transition-opacity hover:opacity-70">
            Privacy
          </a>
          <a href="#" className="transition-opacity hover:opacity-70">
            Terms
          </a>
          <a href="#" className="transition-opacity hover:opacity-70">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
