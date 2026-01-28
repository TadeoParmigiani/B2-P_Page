import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--gray-900)]/95 backdrop-blur-sm border-b border-[var(--gray-800)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[var(--primary)]">b2-p</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#reservar" className="text-white hover:text-[var(--primary)] transition-colors">
                Reservar
              </a>
              <a href="#info" className="text-white hover:text-[var(--primary)] transition-colors">
                Información
              </a>
              <a href="#contacto" className="text-white hover:text-[var(--primary)] transition-colors">
                Contacto
              </a>
            </nav>

            {/* Login Button */}
            <div className="hidden md:block">
              <button
                type="button"
                onClick={openLogin}
                className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--green-600)] text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Iniciar sesión
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[var(--gray-800)]">
              <nav className="flex flex-col gap-4">
                <a
                  href="#reservar"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-[var(--primary)] transition-colors"
                >
                  Reservar
                </a>
                <a
                  href="#info"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-[var(--primary)] transition-colors"
                >
                  Información
                </a>
                <a
                  href="#contacto"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-[var(--primary)] transition-colors"
                >
                  Contacto
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openLogin();
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--green-600)] text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Iniciar sesión
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeModals} 
        onSwitchToRegister={openRegister} 
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={closeModals} 
        onSwitchToLogin={openLogin} 
      />
    </>
  );
}

export default Header;