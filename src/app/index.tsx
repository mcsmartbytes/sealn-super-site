import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section>
          <h1>Welcome to Seal’n & Stripe’n Specialist</h1>
          <p>Professional Parking Lot Services</p>
        </section>
        <section>
          <h2>Our Services</h2>
          <ul>
            <li>Sealcoating</li>
            <li>Line Striping</li>
            <li>Crack Filling</li>
            <li>Maintenance</li>
          </ul>
        </section>
        <section>
          <h2>Portfolio</h2>
          <p>[Gallery Placeholder]</p>
        </section>
        <section>
          <h2>Contact Us</h2>
          <p>[Contact Form Placeholder]</p>
        </section>
      </main>
      <Footer />
    </>
  );
}