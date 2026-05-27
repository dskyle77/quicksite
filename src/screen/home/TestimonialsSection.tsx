import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    initials: "AO",
    name: "Amaka Okafor",
    business: "Amaka's Kitchen — Lagos",
    quote:
      "I created my business page in less than 20 minutes. Customers now find us online and order directly on WhatsApp.",
  },
  {
    initials: "TB",
    name: "Tunde Bakare",
    business: "TB Cuts Barbershop — Ibadan",
    quote:
      "Quicksite helped my barbershop look professional online. Clients now book appointments without stress.",
  },
  {
    initials: "CE",
    name: "Chiamaka Eze",
    business: "ChiChi Fashion House — Abuja",
    quote:
      "I’m not a tech person, but setting everything up was easy. My business finally has an online presence that feels premium.",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-border/60 bg-background py-24"
    >
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <header className="mb-14 max-w-2xl">
          <aside className="mb-4 inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium">
            Loved across Nigeria
          </aside>

          <h2
            id="testimonials-heading"
            className="text-4xl font-bold tracking-tight text-balance sm:text-5xl"
          >
            Real businesses. <span className="text-primary">Real growth.</span>
          </h2>
        </header>

        {/* Testimonials grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <article
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:shadow-xl"
            >
              <div>
                {/* Rating */}
                <div
                  aria-label="5 star rating"
                  className="mb-5 flex gap-0.5 text-secondary"
                >
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mb-6 text-lg leading-relaxed text-balance">
                  “{testimonial.quote}”
                </blockquote>
              </div>

              {/* Author */}
              <footer className="flex items-center gap-3 border-t border-border pt-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {testimonial.initials}
                </div>

                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {testimonial.business}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
