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
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12 flex justify-center items-start font-mono selection:bg-emerald-500/30 text-zinc-100">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 p-8 md:p-10 shadow-2xl relative">
        <header className="mb-12 flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-lg font-black tracking-[0.3em] uppercase">
              JIJIRA_ENGINE // SETTINGS
            </h1>
            <p className="text-[10px] text-zinc-500 mt-1 tracking-widest uppercase font-bold">Configure system defaults</p>
          </div>
          <div className="relative w-48">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              type="text"
              placeholder="SEARCH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-2 pr-10 text-[10px] text-zinc-100 focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-zinc-700 uppercase font-bold"
            />
          </div>
        </header>

        <main className="space-y-10">
          {/* Default Currency Section */}
          <section className="space-y-4">
            <label className="text-[15px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
              DEFAULT_TARGET_CURRENCY
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-px bg-zinc-800 border border-zinc-800 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
              {filteredCurrencies.map(c => (
                <div 
                  key={c}
                  onClick={() => setDefaultCurrency(c)}
                  className={`px-2 py-3 text-[10px] font-bold cursor-pointer transition-all text-center
                    ${defaultCurrency === c 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200'
                    }`}
                >
                  {c}
                </div>
              ))}
            </div>
          </section>

          {/* Connection Repair Section */}
          <section className="space-y-4 pt-8 border-t border-zinc-800">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <label className="text-[15px] font-black text-emerald-500 uppercase tracking-widest">
                  AUTO-REPAIR CONNECTION
                </label>
                <p className="text-[15px] text-zinc-500 max-w-md">
                  Automatically re-injects the engine into pre-opened tabs to fix connection issues.
                </p>
              </div>
              <div 
                onClick={() => setAutoRepair(!autoRepair)}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${autoRepair ? 'bg-emerald-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoRepair ? 'left-6' : 'left-1'}`}></div>
              </div>
            </div>
          </section>

          <section className="pt-10 border-t border-zinc-800 flex justify-end items-center gap-6">
            {status && (
              <span className="text-[10px] text-emerald-500 font-bold uppercase">
                {status}
              </span>
            )}
            
            <button 
              onClick={saveSettings}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] tracking-widest transition-all active:scale-95 uppercase cursor-pointer"
            >
              <Save size={14} />
              Save changes
            </button>
          </section>
        </main>

        <footer className="mt-20 flex justify-between items-end text-[9px] text-zinc-600 font-bold tracking-widest uppercase">
          <span>JIJIRA_ENGINEV1.1.0</span>
          <div className="flex items-center gap-2">
             <span className="text-zinc-500">SIGNAL_STABLE</span>
             <ShieldCheck size={12} className="text-emerald-500" />
          </div>
        </footer>
      </div>
    </div>
  );
}
