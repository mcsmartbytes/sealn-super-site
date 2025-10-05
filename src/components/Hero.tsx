export default function Hero() {
  return (
    <section className="relative h-[600px] flex items-center justify-center text-white">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/Header Pic.jpg"
          alt="Parking lot sealing and striping"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Professional Parking Lot Sealing & Striping
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Quality workmanship, reliable service, and competitive pricing for <span className="text-brand-gold">all</span><br />
          your asphalt maintenance needs.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#contact"
            className="px-8 py-3 bg-brand-gold text-black font-bold text-lg rounded hover:bg-yellow-500 transition shadow-lg"
          >
            Get Free Quote
          </a>
          <a
            href="#portfolio"
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold text-lg rounded hover:bg-white hover:text-black transition"
          >
            View Our Work
          </a>
        </div>
      </div>
    </section>
  );
}
