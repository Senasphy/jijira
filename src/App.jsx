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
    <div className="w-80 bg-slate-900 text-slate-100 font-mono p-5 border-2 border-slate-800 select-none shadow-2xl">
      <Header />

      <div className="space-y-4">
        <section>
          <div className="flex justify-between items-end mb-2">
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Target_Currency</label>
            <span className="text-[9px] text-slate-500 font-bold">TS: {formattedTime}</span>
          </div>
          
          <div className="space-y-2">
            <input 
              type="text"
              placeholder="Search_Filter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border-2 border-slate-700 p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
            />
            
            {/* Custom Emerald-Themed List Container */}
            <div className="w-full h-32 bg-slate-800 border-2 border-slate-700 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-emerald-600/50 scrollbar-track-slate-900">
              {filteredCurrencies.map(currency => (
                <div 
                  key={currency} 
                  onClick={() => setTargetCurrency(currency)}
                  className={`px-3 py-1.5 text-xs cursor-pointer transition-colors flex justify-between items-center
                    ${targetCurrency === currency 
                      ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500' 
                      : 'hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-300 border-l-2 border-transparent'
                    }`}
                >
                  <span className="font-bold">{currency}</span>
                  {currency === 'ETB' && <span className="text-[9px] opacity-60">BIRR</span>}
                  {targetCurrency === currency && <span className="text-[8px] animate-pulse">●</span>}
                </div>
              ))}
              {filteredCurrencies.length === 0 && (
                <div className="p-3 text-[10px] text-slate-600 italic">No matches found...</div>
              )}
            </div>
          </div>
        </section>

        <button 
          onClick={handleConvertAction}
          className="group relative w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 text-xs tracking-[0.2em] transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-950/40 uppercase cursor-pointer"
        >
          Execute_Conversion
        </button>
        
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
    <header className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
      <h1 className="text-sm font-bold tracking-tighter text-slate-50 flex items-center">
        <Triangle className="mr-2 text-emerald-500 fill-emerald-500" size={12} /> JIJIRA_ENGINE
      </h1>
      <button 
        onClick={openSettings} 
        className="text-slate-500 hover:text-emerald-500 transition-colors cursor-pointer"
        title="Settings"
      >
        <Settings size={16} />
      </button>
    </header>
  );
}

function LoadingState() {
  return (
    <div className="w-80 h-64 bg-slate-900 flex flex-col items-center justify-center space-y-3 border-2 border-slate-800">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent animate-spin"></div>
      <p className="text-[10px] tracking-[0.2em] text-slate-400 uppercase font-bold">Syncing_Core...</p>
    </div>
  );
}

function StatusFooter({ status }) {
  if (!status) return <div className="h-6" />;
  
  const isError = status.startsWith('!');
  return (
    <div className="h-6 flex items-center justify-center">
      <p className={`text-[10px] font-bold tracking-tighter uppercase ${isError ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
        {status}
      </p>
    </div>
  );
}

function AppFooter({ isRefreshing, onRefresh }) {
  return (
    <footer className="mt-6 pt-2 border-t border-slate-800 flex justify-between items-center text-[8px] text-slate-300 font-bold tracking-[0.2em] uppercase">
      <span>v1.0.0</span>
      <button 
        onClick={onRefresh} 
        disabled={isRefreshing}
        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${isRefreshing ? 'animate-spin text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}
        title="Refresh Exchange Rates"
      >
        <span>Refresh</span>
        <RefreshCw size={12} />
      </button>
    </footer>
  );
}

