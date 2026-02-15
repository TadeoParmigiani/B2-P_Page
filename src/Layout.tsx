import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./pages/Hero/index";
import BookingSection from "./pages/Booking/index";
import InfoPageSection from "./pages/info/index";
import { useAppDispatch } from "./store/hooks";
import { observeUser } from "./feature/authSlice";
import './index.css'

function Layout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(observeUser());
  }, [dispatch]);

  return (
    <main className="min-h-screen w-full">
      <Header />
      <div className="pt-16 w-full">
        <HeroSection />
        <BookingSection />
        <InfoPageSection />
        <Footer />
      </div>
    </main>
  );
}

export default Layout;