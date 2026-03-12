import { useState, useEffect, useMemo } from 'react';
import { Search, Save, ShieldCheck, ShieldAlert } from 'lucide-react';

/**
 * JIJIRA_ENGINE // Configuration System
 * Refined with custom emerald UI components and consistent palette.
 */
export default function OptionsApp() {
  const [defaultCurrency, setDefaultCurrency] = useState('ETB');
  const [autoRepair, setAutoRepair] = useState(true);
  const [rates, setRates] = useState({});
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const data = await chrome.storage.local.get(['exchangeRates', 'defaultCurrency', 'autoRepair']);
      if (data.exchangeRates) setRates(data.exchangeRates);
      if (data.defaultCurrency) setDefaultCurrency(data.defaultCurrency);
      if (data.autoRepair !== undefined) setAutoRepair(data.autoRepair);
    };
    loadSettings();
  }, []);

  const saveSettings = () => {
    chrome.storage.local.set({ defaultCurrency, autoRepair }, () => {
      setStatus('> CONFIG_SAVED_SUCCESS');
      setTimeout(() => setStatus(''), 3000);
    });
  };

  const filteredCurrencies = useMemo(() => {
    return Object.keys(rates)
      .filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [rates, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 flex justify-center items-start font-mono selection:bg-emerald-500/30">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-slate-800 p-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.3)]"></div>
        
        <header className="mb-12 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tighter text-slate-100 flex items-center">
            <span className="mr-3 text-emerald-500 text-xl">◆</span> JIJIRA_ENGINE // CONFIG_SYS
          </h1>
          <p className="text-[10px] text-slate-500 mt-2 tracking-[0.3em] uppercase font-bold">Manage global conversion parameters and system defaults</p>
        </header>

        <main className="space-y-12">
          {/* Default Currency Section */}
          <section className="space-y-6">
            <div className="flex flex-col space-y-4">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center">
                <span className="w-2 h-2 bg-emerald-500 mr-3 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                Default Target Currency
              </label>
              
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text"
                  placeholder="Filter_Currencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border-2 border-slate-700 p-2 pl-9 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 h-48 bg-slate-800 border-2 border-slate-700 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-600/50 scrollbar-track-slate-900">
                {filteredCurrencies.map(c => (
                  <div 
                    key={c}
                    onClick={() => setDefaultCurrency(c)}
                    className={`px-2 py-2 text-[10px] font-bold cursor-pointer transition-all border text-center
                      ${defaultCurrency === c 
                        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50' 
                        : 'hover:bg-emerald-500/10 text-slate-400 border-transparent hover:text-emerald-300'
                      }`}
                  >
                    {c}
                  </div>
                ))}
                {filteredCurrencies.length === 0 && (
                  <div className="col-span-full p-4 text-[10px] text-slate-600 italic text-center">No matching currencies found.</div>
                )}
              </div>
            </div>
          </section>

          {/* Connection Repair Section */}
          <section className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 mr-3 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                  Auto-Repair Connection
                </label>
                <div 
                  onClick={() => setAutoRepair(!autoRepair)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${autoRepair ? 'bg-emerald-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoRepair ? 'left-6' : 'left-1'}`}></div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium max-w-lg">
                Automatically attempts to re-inject the engine into tabs that were opened before the extension was loaded. This prevents connection errors without requiring a manual page refresh.
              </p>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-800 flex items-center space-x-8">
            <button 
              onClick={saveSettings}
              className="flex items-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-emerald-950/40 uppercase cursor-pointer"
            >
              <Save size={14} />
              Save changes
            </button>
            
            {status && (
              <span className="text-[10px] text-emerald-400 font-bold animate-pulse uppercase tracking-tighter">
                {status}
              </span>
            )}
          </section>
        </main>

        <footer className="mt-24 flex justify-between items-end text-[10px] text-slate-400 font-bold tracking-widest uppercase">
          <div className="flex flex-col space-y-1">
            <span className="text-slate-400">Kernel: 1.1.0_STABLE</span>
            <span>Auth: sys_admin</span>
          </div>
          <div className="text-right flex items-center">
             {status && status.startsWith('!') ? (
               <>
                 <span className="mr-3 text-rose-500 animate-pulse">Signal: Issue</span>
                 <ShieldAlert size={14} className="text-rose-500" />
               </>
             ) : (
               <>
                 <span className="mr-3 text-slate-500">Signal: Stable</span>
                 <ShieldCheck size={14} className="text-emerald-500" />
               </>
             )}
          </div>
        </footer>
      </div>
    </div>
  );
}
