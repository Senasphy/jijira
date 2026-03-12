import { motion } from "motion/react";
import { 
  Zap, 
  ShoppingBag, 
  Search, 
  RotateCcw, 
  Wrench, 
  Settings2,
  Lock
} from "lucide-react";

const features = [
  {
    icon: <Zap className="text-accent" size={28} />,
    title: "In-place conversion",
    description: "Prices are replaced directly on the page. No popups, no side panels, and zero tab-switching required."
  },
  {
    icon: <ShoppingBag className="text-accent" size={28} />,
    title: "E-commerce adapters",
    description: "Dedicated handlers for Amazon and Alibaba surgically target price components without breaking site layouts."
  },
  {
    icon: <Search className="text-accent" size={28} />,
    title: "Recursive DOM scanning",
    description: "A non-blocking TreeWalker scans every text node, safely skipping scripts and interactive elements."
  },
  {
    icon: <RotateCcw className="text-accent" size={28} />,
    title: "Original value preservation",
    description: "Every element stores its original value in data attributes, preventing cumulative rounding errors."
  },
  {
    icon: <Wrench className="text-accent" size={28} />,
    title: "Auto-repair system",
    description: "Automatically detects tab sleep or script updates and restores the engine connection seamlessly."
  },
  {
    icon: <Settings2 className="text-accent" size={28} />,
    title: "Persistent settings",
    description: "Your default currency and engine preferences are saved and synchronized across browser restarts."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-bg-base relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black uppercase tracking-tighter mb-6"
          >
            What it actually does
          </motion.h2>
          <div className="h-1.5 w-24 bg-accent shadow-[0_0_10px_#10b981]"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, borderColor: "rgba(16,185,129,0.3)" }}
              className="bg-bg-surface border border-bg-elevated p-10 transition-all group relative overflow-hidden shadow-2xl"
            >
              <div className="mb-8 relative z-10">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-text-primary relative z-10">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed relative z-10 text-[15px]">{feature.description}</p>
              
              <div className="absolute inset-0 bg-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-bg-surface border border-accent/20 p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(16,185,129,0.05)]"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-accent/10 rounded-full">
              <Lock className="text-accent" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-widest">100% Free and Open Source</h3>
              <p className="text-text-secondary mt-2 text-[15px]">No trackers, no ads, no hidden costs. Forever.</p>
            </div>
          </div>
          <a 
            href="https://github.com/Senasphy/jijira" 
            target="_blank" 
            className="px-8 py-4 border-2 border-accent text-accent font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] active:scale-95"
          >
            Inspect the source
          </a>
        </motion.div>
      </div>
    </section>
  );
}
