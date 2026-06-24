export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[#e8e8f0]">Terms of Service</h1>
      <p className="mt-2 text-sm text-[#8888a0]">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="mt-8 space-y-6 text-sm text-[#aaaabb] leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">1. Acceptance of Terms</h2>
          <p className="mt-2">By accessing or using PixelForge AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">2. Description of Service</h2>
          <p className="mt-2">PixelForge AI provides AI-powered and utility image processing tools, including background removal, image upscaling, compression, format conversion, and resizing. The Service is offered with both free and paid subscription tiers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">3. Usage Plans &amp; Quotas</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Free Plan:</strong> Includes 5 AI credits total (lifetime). Basic tools (Compress, Convert, Resize) are unlimited.</li>
            <li><strong>Starter Plan ($4.99/month):</strong> Includes 50 AI credits per month.</li>
            <li><strong>Pro Plan ($9.99/month):</strong> Includes 150 AI credits per month.</li>
            <li>Credits are non-transferable and do not roll over to the next billing period.</li>
            <li>When you exhaust your credits, you will be prompted to upgrade your plan.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">4. Acceptable Use</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>You may use our tools for personal and commercial purposes</li>
            <li>You must not use the Service for any illegal activities</li>
            <li>You must own or have the legal right to process all images you upload</li>
            <li>You must not attempt to reverse-engineer, scrape, or overload our servers</li>
            <li>You must not share your account credentials with others</li>
            <li>You must not use automated scripts or bots to bypass usage limits</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">5. Prohibited Content &amp; NSFW Policy</h2>
          <div className="mt-2 space-y-2">
            <p className="font-semibold text-[#e8e8f0]">PixelForge AI strictly prohibits the generation, upload, or processing of any Not Safe For Work (NSFW), adult, sexually explicit, or pornographic content.</p>
            <p>The following categories of content are explicitly prohibited on our platform:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Sexually explicit content:</strong> Any images, text, or media depicting nudity, sexual acts, or sexually suggestive material</li>
              <li><strong>Adult content:</strong> Pornographic, erotic, or obscene material in any form</li>
              <li><strong>NSFW prompts:</strong> Text prompts that request, encourage, or guide the generation of explicit or adult-oriented images</li>
              <li><strong>Child exploitation:</strong> Any content involving minors in inappropriate contexts — zero tolerance, will be reported to authorities</li>
              <li><strong>Violence &amp; gore:</strong> Excessively violent, gory, or disturbing imagery</li>
              <li><strong>Hate speech:</strong> Content promoting violence, hatred, or discrimination against any group</li>
              <li><strong>Illegal content:</strong> Content depicting or promoting illegal activities</li>
            </ul>
            <p className="mt-2"><strong>Enforcement:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All AI image and text generation prompts are automatically screened through our Content Moderation system before processing</li>
              <li>Attempts to circumvent content filters (e.g., coded language, hidden prompts) will result in immediate account suspension</li>
              <li>Violations may result in immediate account termination without refund</li>
              <li>Severe violations (especially involving minors) will be reported to the relevant legal authorities</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">6. Intellectual Property</h2>
          <p className="mt-2">You retain full ownership of all images you upload and the processed results. PixelForge AI does not claim any rights to your content. We only process your images as needed to provide the requested tool functionality.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">7. AI-Generated Content Disclaimer</h2>
          <p className="mt-2">AI-powered tools (background removal, upscaling, image generation, text generation, video generation, and audio processing) rely on machine learning models that may produce imperfect results. We are not liable for any losses arising from the use of AI-processed images. You are responsible for reviewing all output before use.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">8. Subscription &amp; Billing</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Paid subscriptions are billed monthly through CREEM</li>
            <li>You can cancel your subscription at any time; access continues until the end of the current billing period</li>
            <li>We do not offer refunds for partial billing periods</li>
            <li>Prices may change with at least 30 days&apos; notice before renewal</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">9. Service Availability</h2>
          <p className="mt-2">We strive for high availability but do not guarantee uninterrupted service. Scheduled maintenance will be announced in advance. We are not liable for downtime caused by third-party services.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">10. Limitation of Liability</h2>
          <p className="mt-2">PixelForge AI is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">11. Account Termination</h2>
          <p className="mt-2">You may delete your account at any time by contacting us. We reserve the right to suspend accounts that violate these Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">12. Changes to Terms</h2>
          <p className="mt-2">We may update these Terms at any time. Continued use after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">13. Contact</h2>
          <p className="mt-2">For questions about these Terms, contact us at <a href="mailto:1162093529@qq.com" className="text-violet-400 hover:underline">1162093529@qq.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
