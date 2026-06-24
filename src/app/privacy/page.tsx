export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-[#e8e8f0]">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[#8888a0]">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="mt-8 space-y-6 text-sm text-[#aaaabb] leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">1. Information We Collect</h2>
          <p className="mt-2">When you create an account, we collect your email address and a securely hashed password. We do not collect or store your real name, phone number, or payment card details.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">2. How We Process Your Images</h2>
          <p className="mt-2">When you use our tools, your uploaded images are processed as follows:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Local processing tools</strong> (Compress, Convert, Resize): Images are processed entirely on our servers and deleted from memory immediately after processing. They are never stored on disk.</li>
            <li><strong>AI-powered tools</strong> (Background Removal, Upscaling): Your image is sent to <strong>Replicate</strong> for AI processing. Replicate may temporarily cache the image to generate results. We do not store the image or the processed result permanently.</li>
            <li>Processed results are returned directly to your browser. We do not keep copies unless processing fails for debugging (in which case only error metadata is logged, not the image itself).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">3. Data We Store</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Account data:</strong> Email address and hashed password</li>
            <li><strong>Usage logs:</strong> Which tools you used and when (for quota tracking). Does not include the images themselves.</li>
            <li><strong>Subscription records:</strong> Plan tier, billing period, and subscription status (managed via CREEM)</li>
            <li><strong>Contact messages:</strong> If you submit our contact form, we store your name, email, and message</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">4. Third-Party Services</h2>
          <p className="mt-2">We use the following third-party services. Each has its own privacy policy:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Replicate</strong> — Processes AI image tasks. <a href="https://replicate.com/privacy" className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">Their Privacy Policy</a></li>
            <li><strong>CREEM</strong> — Handles payments and subscriptions. Card data never touches our servers. <a href="https://creem.io/privacy-policy" className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">Their Privacy Policy</a></li>
            <li><strong>Vercel</strong> — Hosts our web application. <a href="https://vercel.com/legal/privacy-policy" className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">Their Privacy Policy</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">5. Cookies</h2>
          <p className="mt-2">We use essential cookies for authentication (keeping you logged in) and session management. We do not use third-party tracking cookies or advertising cookies at this time.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">6. Data Retention</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Uploaded images: Deleted immediately after processing (never persisted)</li>
            <li>Usage logs: Retained for as long as your account is active</li>
            <li>Account data: Retained until you request deletion</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">7. Your Rights (GDPR / CCPA)</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Access:</strong> Request a copy of your data</li>
            <li><strong>Deletion:</strong> Request deletion of your account and all associated data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from any marketing emails</li>
            <li><strong>Data portability:</strong> Export your usage data in a machine-readable format</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact us at <a href="mailto:1162093529@qq.com" className="text-violet-400 hover:underline">1162093529@qq.com</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">8. Security</h2>
          <p className="mt-2">Passwords are hashed using bcrypt. All API communication uses HTTPS. We do not store payment card information — all payments are processed by CREEM, a PCI-DSS compliant provider.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">9. Contact</h2>
          <p className="mt-2">For any privacy-related questions, contact us at <a href="mailto:1162093529@qq.com" className="text-violet-400 hover:underline">1162093529@qq.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
