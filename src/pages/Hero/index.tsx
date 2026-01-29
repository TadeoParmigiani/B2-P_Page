function HeroSection() {
  return (
    <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80')`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          El Ovalo
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-200 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Av. Dante Alighieri 2485, Rosario</span>
        </div>
        <a 
          href="#reservar"
          className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--green-600)] text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Reservar Cancha
        </a>
        <a 
          href="https://maps.google.com/?q=Av.+Dante+Alighieri+2485,+Rosario"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-[var(--primary)] hover:text-[var(--green-600)] font-medium transition-colors"
        >
          (ver en mapa)
        </a>
      </div>
    </section>
  );
}

export default HeroSection;