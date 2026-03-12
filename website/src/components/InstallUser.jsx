import { motion } from "motion/react";
import { ExternalLink, Info } from "lucide-react";

const steps = [
  {
    title: "Download",
    description: "Visit the GitHub Releases page and download the latest .zip file.",
    link: "https://github.com/Senasphy/jijira/releases"
  },
  {
    title: "Extract",
    description: "Extract the contents of the downloaded .zip file to a permanent folder on your computer.",
    link: null
  },
  {
    title: "Extension Settings",
    description: "Open Chrome and navigate to chrome://extensions in the address bar.",
    link: null
  },
  {
    title: "Developer Mode",
    description: "Enable Developer Mode using the toggle in the top right corner.",
    link: null
  },
  {
    title: "Load Unpacked",
    description: "Click Load unpacked and select the folder where you extracted the files.",
    link: null
  }
];

export default function InstallUser() {
  return (
    <section id="install" className="py-32 bg-bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black uppercase tracking-tighter mb-6"
          >
            Don't want to touch a terminal? <br />
            <span className="text-accent">No problem.</span>
          </motion.h2>
          <div className="h-1.5 w-24 bg-accent shadow-[0_0_10px_#10b981]"></div>
        </div>

        <div className="space-y-6 max-w-4xl">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-8 group"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-bg-surface border border-bg-elevated text-accent flex items-center justify-center font-black text-lg rounded-sm group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-2xl">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-[2px] h-full bg-bg-elevated/50 mt-4"></div>
                )}
              </div>
              <div className="pb-12">
                <h3 className="text-2xl font-bold text-text-primary mb-3 flex items-center gap-4">
                  {step.title}
                  {step.link && (
                    <a 
                      href={step.link} 
                      target="_blank" 
                      className="text-accent hover:text-accent-strong transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 inline-flex items-center gap-4 px-8 py-5 bg-bg-surface border border-bg-elevated text-[15px] text-text-secondary italic shadow-2xl"
        >
          <Info size={22} className="text-accent shrink-0" />
          <span>JIJIRA will be available on the Chrome Web Store soon. This is a temporary installation method while the listing is being processed.</span>
        </motion.div>
      </div>
    </section>
  );
}
