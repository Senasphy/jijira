import { motion } from "motion/react";
import { Github, Linkedin, Instagram, Send, ExternalLink, Cpu } from "lucide-react";

export default function About() {
  const socialLinks = [
    { icon: <Send size={20} />, url: "https://t.me/SM10AR", label: "Telegram" },
    { icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/sena-abebe-430460289", label: "LinkedIn" },
    { icon: <Instagram size={20} />, url: "https://www.instagram.com/senasphy?igsh=MTEzejc1anI2YmlqdQ==", label: "Instagram" },
    { icon: <Github size={20} />, url: "https://github.com/Senasphy", label: "GitHub" }
  ];

  const devStats = [
    { label: "Role", value: "Full Stack Engineer" },
    { label: "Focus", value: "Systems & UX" },
    { label: "Status", value: "Building Tools" },
  ];

  return (
    <section id="about" className="py-32 bg-bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Terminal-style Bio Card */}
            <div className="bg-bg-surface border border-bg-elevated rounded-sm overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)]">
               <div className="bg-bg-elevated/30 border-b border-bg-elevated px-6 py-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30"></div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">PROFILE_METADATA</div>
               </div>
               
               <div className="p-10 space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/5 border border-accent/20 rounded-sm">
                        <Cpu size={32} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-text-primary tracking-tighter">SENA</h3>
                        <div className="text-[11px] text-accent font-black tracking-widest uppercase">System_Architect</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-px bg-bg-elevated border border-bg-elevated">
                    {devStats.map((stat) => (
                      <div key={stat.label} className="bg-bg-surface p-4 flex justify-between items-center group">
                        <span className="text-[10px] text-text-muted uppercase font-black tracking-widest">{stat.label}</span>
                        <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Redesigned Socials with better hit area */}
                  <div className="flex gap-3 pt-4">
                    {socialLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ 
                          scale: 1.1,
                          color: "#10b981",
                        }}
                        className="w-12 h-12 flex items-center justify-center text-text-muted border border-transparent rounded-sm transition-all duration-300"
                        title={link.label}
                      >
                        {link.icon}
                      </motion.a>
                    ))}
                  </div>
               </div>
            </div>
            
            {/* Background geometric accent */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/5 -z-10 border border-accent/10"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-accent">The Goal</h2>
              <div className="h-1.5 w-16 bg-accent shadow-[0_0_12px_#10b981]"></div>
            </div>
            
            <p className="text-3xl font-bold text-text-primary leading-tight tracking-tight">
              I am a developer who builds tools to solve actual problems.
            </p>

            <p className="text-xl text-text-secondary leading-relaxed">
              JIJIRA was born out of my own frustration with the friction of online shopping. 
              I wanted to build something that felt intentional, high-quality, and completely open and I believe this chrome extension is the first step towards that goal.
            </p>

            <div className="pt-4">
              <a 
                href="https://sena-works.vercel.app" 
                target="_blank" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-bg-surface border border-bg-elevated text-accent font-black uppercase text-xs tracking-[0.2em] group hover:border-accent hover:bg-accent/5 transition-all shadow-xl"
              >
                Explore Portfolio
                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
