import { useState, useEffect, useMemo } from 'react';
import { Settings, RefreshCw, Triangle } from 'lucide-react';

/**
 * JIJIRA_ENGINE // Main Entry Point
 * Implements custom list rendering for pixel-perfect emerald theme consistency.
 */
export default function App() {
  const [targetCurrency, setTargetCurrency] = useState('ETB');
  const [rates, setRates] = useState({});
  const [status, setStatus] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const data = await chrome.storage.local.get(['exchangeRates', 'lastUpdated', 'defaultCurrency']);
      if (data.exchangeRates) {
        setRates(data.exchangeRates);
        setLastUpdated(data.lastUpdated);
        if (data.defaultCurrency) setTargetCurrency(data.defaultCurrency);
        setLoading(false);
      } else {
        fetchLatestRates();
      }
    };
    init();
  }, []);

  const fetchLatestRates = () => {
    setIsRefreshing(true);
    chrome.runtime.sendMessage({ type: 'REFRESH_RATES' }, (response) => {
      chrome.storage.local.get(['exchangeRates', 'lastUpdated'], (res) => {
        if (res.exchangeRates) {
          setRates(res.exchangeRates);
          setLastUpdated(res.lastUpdated);
        }
        setLoading(false);
        setIsRefreshing(false);
      });
    });
  };

  const filteredCurrencies = useMemo(() => {
    return Object.keys(rates)
      .filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [rates, searchTerm]);

  const handleConvertAction = async () => {
    if (!rates[targetCurrency]) {
      updateStatus('! ERR_INVALID_CURRENCY');
      return;
    }

    updateStatus('> EXEC_CONVERSION...');
    
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs[0]?.id) return;
      
      const sendConversionMessage = (tabId) => {
        chrome.tabs.sendMessage(tabId, {
          type: 'CONVERT_CURRENCY',
          targetCurrency,
          rate: rates[targetCurrency]
        }, async (response) => {
          if (chrome.runtime.lastError) {
            // Attempt Auto-Repair if enabled
            const { autoRepair } = await chrome.storage.local.get('autoRepair');
            if (autoRepair !== false) {
              updateStatus('> REPAIRING_CONNECTION...');
              try {
                await chrome.scripting.executeScript({
                  target: { tabId },
                  files: ['content.js']
                });
                // Retry once after injection
                setTimeout(() => sendConversionMessage(tabId), 500);
              } catch (e) {
                updateStatus('! REFRESH_REQUIRED');
              }
            } else {
              updateStatus('! ERR_TAB_CONNECTION');
            }
          } else if (response?.success) {
            updateStatus(`> OK: ${response.count} ITEMS`);
          } else {
            updateStatus('! ERR_CONVERSION_FAILED');
          }
        });
      };

      sendConversionMessage(tabs[0].id);
    });
  };

  const updateStatus = (msg) => {
    setStatus(msg);
    if (msg.startsWith('> OK')) setTimeout(() => setStatus(''), 4000);
  };

  const formattedTime = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  if (loading) return <LoadingState />;

  return (
    <div className="w-96 bg-zinc-950 text-zinc-100 font-mono p-6 border border-zinc-800 select-none shadow-2xl overflow-hidden">
      <Header />

      <div className="space-y-5">
        <section>
          <div className="flex justify-between items-end mb-2">
            <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">Target</label>
            <span className="text-[10px] text-zinc-600 font-bold">TS: {formattedTime}</span>
          </div>
          
          <div className="space-y-3">
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-[13px] text-zinc-100 focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-zinc-700"
            />
            
            {/* Minimal Square List Container */}
            <div className="w-full h-44 bg-zinc-900/50 border border-zinc-800 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-800">
              {filteredCurrencies.map(currency => (
                <div 
                  key={currency} 
                  onClick={() => setTargetCurrency(currency)}
                  className={`px-4 py-3 text-[13px] cursor-pointer transition-all flex justify-between items-center border-b border-zinc-800/50
                    ${targetCurrency === currency 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  <span className="font-bold tracking-tight">{currency}</span>
                  {currency === 'ETB' && <span className="text-[10px] opacity-40 uppercase">Birr</span>}
                  {targetCurrency === currency && <div className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>}
                </div>
              ))}
              {filteredCurrencies.length === 0 && (
                <div className="p-4 text-[11px] text-zinc-700 italic">No matches found...</div>
              )}
            </div>
          </div>
        </section>

        <button 
          onClick={handleConvertAction}
          className="group relative w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 text-[13px] tracking-[0.2em] transition-all duration-200 active:scale-[0.98] uppercase cursor-pointer"
        >Convert</button>
        
        <StatusFooter status={status} />
      </div>

      <AppFooter isRefreshing={isRefreshing} onRefresh={fetchLatestRates} />
    </div>
  );
}

function Header() {
  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
      <h1 className="text-[13px] font-black tracking-[0.3em] text-zinc-100 flex items-center">
        JIJIRA_ENGINE
      </h1>
      <button 
        onClick={openSettings} 
        className="text-zinc-600 hover:text-emerald-500 transition-colors cursor-pointer p-1"
        title="Settings"
      >
        <Settings size={18} />
      </button>
    </header>
  );
}

function LoadingState() {
  return (
    <div className="w-96 h-80 bg-zinc-950 flex flex-col items-center justify-center space-y-4 border border-zinc-800">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent animate-spin"></div>
      <p className="text-[11px] tracking-[0.3em] text-zinc-600 uppercase font-bold">Syncing_Core...</p>
    </div>
  );
}

function StatusFooter({ status }) {
  if (!status) return <div className="h-6" />;
  
  const isError = status.startsWith('!');
  return (
    <div className="h-6 flex items-center justify-center">
      <p className={`text-[11px] font-bold tracking-tighter uppercase ${isError ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
        {status}
      </p>
    </div>
  );
}

function AppFooter({ isRefreshing, onRefresh }) {
  return (
    <footer className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-[15px] text-zinc-600 font-bold tracking-[0.2em] uppercase">
      <span>v1.1.0</span>
      <button 
        onClick={onRefresh} 
        disabled={isRefreshing}
        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${isRefreshing ? 'animate-spin text-emerald-500' : 'text-zinc-600 hover:text-emerald-500'}`}
      >
        <span>Reload</span>
        <RefreshCw size={12} />
      </button>
    </footer>
  );
}

