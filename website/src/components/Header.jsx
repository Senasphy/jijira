import { motion } from "motion/react";
import { Github } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-bg-base/90 backdrop-blur-md py-5 shadow-2xl" 
          : "bg-transparent py-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <a href="#" className="flex items-center gap-1 group">
          <span className="text-2xl font-black tracking-tighter text-text-primary">
            JIJIRA<span className="text-accent group-hover:animate-pulse">_</span>ENGINE
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-12">
          {["Features", "Install", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-[14px] font-bold text-text-secondary hover:text-text-primary transition-colors group tracking-widest uppercase"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a 
            href="https://github.com/Senasphy/jijira" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent transition-colors p-1"
          >
            <Github size={22} />
          </a>
        </nav>
      </div>
    </header>
  );
}
