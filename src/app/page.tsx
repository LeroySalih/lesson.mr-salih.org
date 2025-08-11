export default function Page() {
  return (
    <div>
      {/* HERO fills the remaining viewport below the fixed header */}
      <section
        className="
          min-h-[calc(100svh-var(--header-h))]
          flex items-center
        "
      >
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Launch faster with a polished landing.
            </h1>
            <p className="mt-4 text-lg text-neutral-700">
              Fixed header. Perfectly sized hero. Smooth scroll to everything else below.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#cta"
                className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-white"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-neutral-300 px-5 py-3"
              >
                Learn more
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl border border-neutral-200 overflow-hidden">
            {/* Placeholder visual */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
          </div>
        </div>
      </section>

      {/* Rest of the page */}
      <section id="features" className="py-24 border-t border-neutral-200 ">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-semibold">Features</h2>
          <ul className="mt-6 grid md:grid-cols-3 gap-6 text-neutral-700">
            <li className="rounded-lg border p-6">Feature one</li>
            <li className="rounded-lg border p-6">Feature two</li>
            <li className="rounded-lg border p-6">Feature three</li>
          </ul>
        </div>
      </section>

      <section id="pricing" className="py-24 border-t border-neutral-200 ">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-semibold">Pricing</h2>
          <p className="mt-4 text-neutral-700">Simple, transparent pricing.</p>
        </div>
      </section>

      <section id="faq" className="py-24 border-t border-neutral-200 ">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-semibold">FAQ</h2>
          <details className="mt-6 border rounded-md p-4">
            <summary className="cursor-pointer font-medium">How does this layout work?</summary>
            <p className="mt-3 text-neutral-700">
              The header is fixed. The main gets padding-top equal to the header height, and the hero
              uses <code>min-height: calc(100svh - headerHeight)</code> so it fills the rest.
            </p>
          </details>
        </div>
      </section>

      <section id="cta" className="py-24 border-t border-neutral-200 ">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-semibold">Ready to go?</h2>
          <a
            href="#"
            className="mt-6 inline-flex rounded-md bg-black px-6 py-3 text-white"
          >
            Start your trial
          </a>
        </div>
      </section>
    </div>
  );
}
