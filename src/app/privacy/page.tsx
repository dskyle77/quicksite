export default function PrivacyPolicyPage() {
    return (
      <main className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-4xl px-6 py-16">
  
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Last Updated: May 07, 2026
            </p>
          </header>
  
          {/* Intro Card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200 space-y-4">
            <p>
              Welcome to <span className="font-semibold">Quicksite</span>, accessible at{" "}
              <a
                href="https://quicksiteio.vercel.app/"
                target="_blank"
                rel="noopener"
                className="text-blue-600 underline"
              >
                https://quicksiteio.vercel.app/
              </a>.
            </p>
  
            <p>
              Your privacy matters to us. This policy explains how we collect, use,
              and protect your information when you use our platform.
            </p>
          </section>
  
          {/* Section helper */}
          {[
            {
              title: "Information We Collect",
              content: (
                <>
                  <h3 className="font-semibold mt-4">Personal Information</h3>
                  <ul className="list-disc pl-5 text-neutral-700">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Account information</li>
                    <li>Website content you create</li>
                  </ul>
  
                  <h3 className="font-semibold mt-6">Usage Data</h3>
                  <ul className="list-disc pl-5 text-neutral-700">
                    <li>IP address</li>
                    <li>Browser & device info</li>
                    <li>Pages visited</li>
                    <li>Time spent</li>
                    <li>Referral sources</li>
                  </ul>
                </>
              ),
            },
  
            {
              title: "Cookies & Analytics",
              content: (
                <p>
                  We use cookies and tools like Google Analytics to understand usage
                  and improve Quicksite. You can disable cookies in your browser settings.
                </p>
              ),
            },
  
            {
              title: "AI-Generated Content",
              content: (
                <p>
                  Quicksite may use AI to generate content. Outputs may contain
                  errors, and users are responsible for reviewing before publishing.
                </p>
              ),
            },
  
            {
              title: "How We Use Information",
              content: (
                <ul className="list-disc pl-5 text-neutral-700">
                  <li>Operate and improve Quicksite</li>
                  <li>Monitor performance</li>
                  <li>Prevent abuse</li>
                  <li>Provide support</li>
                </ul>
              ),
            },
  
            {
              title: "User Content",
              content: (
                <p>
                  You own your content. You grant Quicksite permission to host and
                  display it. Illegal or abusive content is not allowed.
                </p>
              ),
            },
  
            {
              title: "Data Security",
              content: (
                <p>
                  We use reasonable security measures, but no system is 100% secure.
                </p>
              ),
            },
  
            {
              title: "Contact",
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
              <h2 className="text-xl font-semibold mb-3">
                {section.title}
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </main>
    );
  }