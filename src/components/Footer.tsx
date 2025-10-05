export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-brand-gold mb-4">Seal'n & Stripe'n Specialist</h3>
            <p className="text-gray-300">Professional parking lot services for commercial properties.</p>
          </div>
          <div>
            <h4 className="font-bold text-brand-gold mb-4">Contact</h4>
            <p className="text-gray-300">Email: sealnstripenspecialist@example.com</p>
            <p className="text-gray-300">Phone: (555) 123-4567</p>
          </div>
          <div>
            <h4 className="font-bold text-brand-gold mb-4">Services</h4>
            <ul className="text-gray-300 space-y-2">
              <li>Sealcoating</li>
              <li>Line Striping</li>
              <li>Crack Filling</li>
              <li>Maintenance</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 MC Smart Bytes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}