import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/Home/HeroSection';
import SharedCursor from '@/components/ui/SharedCursor';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16"> {/* Offset for sticky header */}
        <HeroSection />
      </main>
      <Footer />
      {/* <SharedCursor /> */}
    </>
  );
}