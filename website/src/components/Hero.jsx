import { motion } from "motion/react";
import { Github, Chrome } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#11141b_1px,transparent_1px),linear-gradient(to_bottom,#11141b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-10"
        >
          <h1 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight text-text-primary">
            Stop guessing prices. <br />
            <span className="text-accent">See them in your local currency.</span>
          </h1>
          
          <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
            Built out of pure frustration with switching between tabs and currency apps while shopping. 
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#install"
              className="px-6 py-5 bg-accent hover:bg-accent-strong text-white font-black text-[14px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all border-2 border-accent-strong"
            >
              <Chrome size={20} />
              Get the Extension
            </motion.a>
            
            <motion.a
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(16,185,129,0.1)",
                borderColor: "rgba(16,185,129,0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com/Senasphy/jijira"
              target="_blank"
              className="px-10 py-5 bg-accent/5 border border-accent/20 text-accent font-black text-[14px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-300"
            >
              <Github size={20} />
              View on GitHub
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          {/* Main Visual Container */}
          <div className="relative z-10 bg-bg-surface border border-bg-elevated p-1 rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.9)] group">
             <div className="bg-bg-base border border-bg-elevated overflow-hidden relative flex items-center justify-center">
                <img 
                  src="/hero-preview.png" 
                  alt="Jijira Extension Preview" 
                  className="w-full h-auto object-contain block opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Decorative scanning line animation */}
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-accent/20 z-20 shadow-[0_0_20px_#10b981] pointer-events-none"
                />
                
                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/40 via-transparent to-bg-base/20 pointer-events-none"></div>
             </div>
          </div>
          
          {/* Floating Accents */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-20 h-20 border border-accent/20 rounded-sm z-0"
          />
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-16 -left-16 w-40 h-40 border border-accent/10 rounded-sm z-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
