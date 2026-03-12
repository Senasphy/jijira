import { Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-base border-t border-bg-elevated pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="space-y-6">
            <a href="#" className="flex items-center gap-1 group">
              <span className="text-3xl font-black tracking-tighter text-text-primary">
                JIJIRA<span className="text-accent group-hover:animate-pulse">_</span>ENGINE
              </span>
            </a>
            <p className="text-text-secondary text-lg max-w-sm leading-relaxed font-bold uppercase tracking-widest">
              Real-time currency transformation for the modern web.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 md:gap-32">
            <div className="space-y-6">
              <h4 className="text-[14px] font-black uppercase tracking-[0.4em] text-accent">Links</h4>
              <ul className="space-y-4">
                <li>
                  <a href="https://github.com/Senasphy/jijira" target="_blank" rel="noopener noreferrer" className="text-[15px] font-bold text-text-secondary hover:text-accent transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://sena-works.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[15px] font-bold text-text-secondary hover:text-accent transition-colors">
                    Portfolio
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[14px] font-black uppercase tracking-[0.4em] text-accent">Product</h4>
              <ul className="space-y-4">
                {["Features", "Install"].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-[15px] font-bold text-text-secondary hover:text-accent transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-bg-elevated flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[13px] text-text-muted uppercase font-black tracking-[0.3em]">
            MIT License · Built by Sena · {currentYear}
          </p>
          <div className="flex items-center gap-4 text-[13px] text-text-muted font-black tracking-[0.3em] uppercase">
             <a 
              href="https://github.com/Senasphy/jijira" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-accent transition-all cursor-pointer"
             >
              github.com/Senasphy/jijira
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
