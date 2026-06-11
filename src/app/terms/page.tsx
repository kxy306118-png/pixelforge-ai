export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-2">By using PixelForge AI, you agree to these terms. If you disagree, please do not use our service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Usage</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>You may use our tools for personal and commercial purposes</li>
            <li>You must not use the service for illegal activities</li>
            <li>You must own or have rights to the images you process</li>
            <li>Free tier has daily usage limits (3 images/day)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Intellectual Property</h2>
          <p className="mt-2">You retain full ownership of all images you upload. Processed images are yours to use as you wish.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Service Availability</h2>
          <p className="mt-2">We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance with prior notice.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Contact</h2>
          <p className="mt-2">For questions about these terms, contact us at legal@pixelforge.ai.</p>
        </section>
      </div>
    </div>
  );
}
