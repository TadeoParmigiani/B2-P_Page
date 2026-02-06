import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../store/hooks";
import { useAppDispatch } from "../store/hooks";
import { logoutUser } from "../feature/authSlice";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  const { user } = useAuth();
  const dispatch = useAppDispatch();

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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-(--gray-900)/95 backdrop-blur-sm border-b border-(--gray-800)">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">B2-P</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              <a href="#reservar" className="text-white hover:text-primary transition-colors">
                Reservar
              </a>
              <a href="#info" className="text-white hover:text-primary transition-colors">
                Información
              </a>
              <a href="#contacto" className="text-white hover:text-primary transition-colors">
                Contacto
              </a>
            </nav>

            {/* User Section - Desktop */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">
                    {user.name} {user.lastName}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openLogin}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-(--green-600) text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Iniciar sesión
                </button>
              )}
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
            <div className="md:hidden py-4 border-t border-(--gray-800)">
              <nav className="flex flex-col gap-4">
                <a
                  href="#reservar"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-primary transition-colors"
                >
                  Reservar
                </a>
                <a
                  href="#info"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-primary transition-colors"
                >
                  Información
                </a>
                <a
                  href="#contacto"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-primary transition-colors"
                >
                  Contacto
                </a>
                
                {user ? (
                  <>
                    <div className="text-white font-medium px-4 py-2 bg-(--gray-800) rounded-lg">
                      {user.name} {user.lastName}
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openLogin();
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-(--green-600) text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Iniciar sesión
                  </button>
                )}
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