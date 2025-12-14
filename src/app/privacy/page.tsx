import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Seal\'n & Stripe\'n Specialist',
  description: 'Privacy Policy for Seal\'n & Stripe\'n Specialist - how we collect, use, and protect your information.',
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-brand-navy mb-8">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Introduction</h2>
                <p>
                  Seal'n & Stripe'n Specialist ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide to us, including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Property address</li>
                  <li>Project details and requirements</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Automatically Collected Information</h3>
                <p>When you visit our website, we may automatically collect certain information, including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Respond to your inquiries and provide customer service</li>
                  <li>Prepare estimates and invoices for our services</li>
                  <li>Communicate with you about your projects</li>
                  <li>Send important updates about our services</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>256-bit AES encryption for data at rest</li>
                  <li>TLS 1.3 encryption for data in transit</li>
                  <li>Secure, SOC 2 Type II compliant hosting</li>
                  <li>Access controls limiting who can view your data</li>
                  <li>Regular security audits and monitoring</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Information Sharing</h2>
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>With service providers who assist in our operations (e.g., email services)</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, please contact us at gary@sealnstripenspecialist.com.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Cookies</h2>
                <p>
                  Our website may use cookies and similar technologies to enhance your experience. These are small files stored on your device that help us understand how you use our website. You can control cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">8. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">9. Children's Privacy</h2>
                <p>
                  Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">11. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="font-semibold">Seal'n & Stripe'n Specialist</p>
                  <p>Email: gary@sealnstripenspecialist.com</p>
                  <p>Website: www.sealnstripenspecialist.com</p>
                </div>
              </section>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <a href="/" className="text-brand-navy hover:text-brand-gold font-semibold">
                &larr; Back to Home
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
