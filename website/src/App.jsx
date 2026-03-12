import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import InstallUser from "./components/InstallUser";
import About from "./components/About";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen selection:bg-accent/30">
      <Header />
      <main>
        <Hero />
        <Features />
        <InstallUser />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;
