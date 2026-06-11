export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p className="mt-2">We process your images temporarily on our servers to provide the tools. Images are automatically deleted within 1 hour after processing is complete. We do not store your images permanently.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Data We Store</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Account information (email) if you sign up for a Pro plan</li>
            <li>Usage statistics (number of images processed, not the images themselves)</li>
            <li>Basic analytics data (page views, referrer)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Third-Party Services</h2>
          <p className="mt-2">We use the following third-party services:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Replicate</strong> — For AI image processing (background removal, upscaling)</li>
            <li><strong>LemonSqueezy</strong> — For payment processing</li>
            <li><strong>Vercel</strong> — For hosting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Your Rights</h2>
          <p className="mt-2">You have the right to request deletion of your account and all associated data. Contact us at privacy@pixelforge.ai.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Contact</h2>
          <p className="mt-2">For any privacy-related questions, contact us at privacy@pixelforge.ai.</p>
        </section>
      </div>
    </div>
  );
}
