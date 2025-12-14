import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | Seal\'n & Stripe\'n Specialist',
  description: 'Terms of Service for Seal\'n & Stripe\'n Specialist - the terms and conditions governing your use of our services.',
};

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-brand-navy mb-8">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using the services of Seal'n & Stripe'n Specialist ("Company," "we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Services</h2>
                <p>
                  Seal'n & Stripe'n Specialist provides professional parking lot maintenance services, including but not limited to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Sealcoating</li>
                  <li>Line striping and pavement markings</li>
                  <li>Crack filling and repair</li>
                  <li>General parking lot maintenance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">3. Estimates and Pricing</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All estimates are provided free of charge and are valid for 30 days unless otherwise specified.</li>
                  <li>Final pricing may vary based on actual conditions discovered during the project.</li>
                  <li>Any additional work beyond the original scope will be discussed and approved before proceeding.</li>
                  <li>Prices are subject to change without notice for new estimates.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Scheduling and Completion</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Work schedules are subject to weather conditions and other factors beyond our control.</li>
                  <li>We will make reasonable efforts to complete work within agreed timeframes.</li>
                  <li>Delays due to weather, material availability, or other unforeseen circumstances do not constitute a breach of these terms.</li>
                  <li>The customer is responsible for ensuring the work area is accessible and clear of vehicles during scheduled work.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Payment Terms</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment is due upon completion of services unless otherwise agreed in writing.</li>
                  <li>We accept cash, check, and major credit cards.</li>
                  <li>A deposit may be required for larger projects.</li>
                  <li>Late payments may be subject to a service charge of 1.5% per month.</li>
                  <li>Returned checks are subject to a $35 fee.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Warranty</h2>
                <p>
                  We stand behind our work and offer the following warranty terms:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Sealcoating: We guarantee proper application according to manufacturer specifications.</li>
                  <li>Line Striping: We guarantee visibility and durability under normal conditions.</li>
                  <li>Warranty does not cover damage from snow removal equipment, chemical spills, or vehicle damage.</li>
                  <li>Warranty claims must be submitted within 30 days of discovering the issue.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Our liability is limited to the amount paid for the specific service in question.</li>
                  <li>We are not liable for indirect, incidental, or consequential damages.</li>
                  <li>We are not responsible for pre-existing pavement conditions or damage.</li>
                  <li>Customer is responsible for informing us of underground utilities, sprinkler systems, or other buried items.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">8. Cancellation Policy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cancellations must be made at least 48 hours before scheduled work.</li>
                  <li>Cancellations with less than 48 hours notice may be subject to a cancellation fee.</li>
                  <li>If we must cancel due to weather, we will reschedule at the earliest available date.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">9. Website Use</h2>
                <p>By using our website, you agree to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Provide accurate information when submitting inquiries</li>
                  <li>Not use the website for any unlawful purpose</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Not submit false or spam inquiries</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">10. Intellectual Property</h2>
                <p>
                  All content on this website, including text, images, logos, and designs, is the property of Seal'n & Stripe'n Specialist and is protected by copyright laws. You may not reproduce, distribute, or use our content without written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">11. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless Seal'n & Stripe'n Specialist from any claims, damages, or expenses arising from your use of our services or violation of these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">12. Governing Law</h2>
                <p>
                  These Terms of Service are governed by the laws of the state in which services are performed. Any disputes shall be resolved in the appropriate courts of that jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">13. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this website. Your continued use of our services constitutes acceptance of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">14. Contact Information</h2>
                <p>
                  For questions about these Terms of Service, please contact us:
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
