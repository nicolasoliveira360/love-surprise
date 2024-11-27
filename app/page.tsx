import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy-900 overflow-x-hidden">
        <Hero />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}