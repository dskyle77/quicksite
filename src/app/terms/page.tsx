export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Last Updated: May 07, 2026
          </p>
        </header>

        {/* Intro */}
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200 space-y-4">
          <p>
            Welcome to <span className="font-semibold">Quicksite</span>. By
            using our platform, you agree to these Terms of Service.
          </p>

          <p>
            If you do not agree with these terms, you should not use Quicksite.
          </p>
        </section>

        {/* Sections */}
        {[
          {
            title: "1. Use of the Service",
            content: (
              <p>
                Quicksite provides tools for creating and publishing mini-sites.
                You agree to use the platform only for lawful purposes and in a
                way that does not harm the service or other users.
              </p>
            ),
          },
          {
            title: "2. Accounts",
            content: (
              <p>
                You are responsible for maintaining the security of your account
                and all activity under it. You must provide accurate information
                when creating an account.
              </p>
            ),
          },
          {
            title: "3. User Content",
            content: (
              <p>
                You retain ownership of content you create. By using Quicksite,
                you grant us permission to host, display, and distribute your
                content solely to operate the service.
              </p>
            ),
          },
          {
            title: "4. Prohibited Use",
            content: (
              <ul className="list-disc pl-5 text-neutral-700">
                <li>Illegal or fraudulent activity</li>
                <li>Hate speech or harmful content</li>
                <li>Phishing or scams</li>
                <li>Abusing or overloading the system</li>
              </ul>
            ),
          },
          {
            title: "5. AI Features",
            content: (
              <p>
                Quicksite may use AI to generate content. AI outputs may not be
                accurate, and you are responsible for reviewing and editing any
                generated content before publishing.
              </p>
            ),
          },
          {
            title: "6. Payments (Future Feature)",
            content: (
              <p>
                Some features may require payment in the future. Pricing and
                billing terms will be clearly communicated before purchase.
              </p>
            ),
          },
          {
            title: "7. Service Availability",
            content: (
              <p>
                We do not guarantee uninterrupted access. The service may be
                updated, modified, or temporarily unavailable at any time.
              </p>
            ),
          },
          {
            title: "8. Termination",
            content: (
              <p>
                We may suspend or terminate access if you violate these terms or
                misuse the platform.
              </p>
            ),
          },
          {
            title: "9. Limitation of Liability",
            content: (
              <p>
                Quicksite is provided “as is”. We are not liable for any damages
                resulting from the use of the platform.
              </p>
            ),
          },
          {
            title: "10. Changes to Terms",
            content: (
              <p>
                We may update these Terms at any time. Continued use of
                Quicksite means you accept the updated Terms.
              </p>
            ),
          },
          {
            title: "11. Contact",
            content: (
              <a
                href="mailto:galaxanionstudios@gmail.com"
                className="text-blue-600 underline"
              >
                galaxanionstudios@gmail.com
              </a>
            ),
          },
        ].map((section, i) => (
          <section
            key={i}
            className="mt-6 rounded-2xl bg-white p-6 shadow-sm border border-neutral-200"
          >
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <div className="text-neutral-700 leading-relaxed">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
