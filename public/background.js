const API_ENDPOINT = 'https://open.er-api.com/v6/latest/USD';

async function syncExchangeRates() {
  console.log('[JIJIRA] Initializing rate synchronization...');
  
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && data.rates) {
      await chrome.storage.local.set({ 
        exchangeRates: data.rates,
        baseCurrency: data.base_code,
        lastUpdated: Date.now()
      });
      console.log('[JIJIRA] Rates successfully synchronized.');
      return true;
    }
  } catch (error) {
    console.error('[JIJIRA] Synchronization failed:', error);
    return false;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  syncExchangeRates();
});

chrome.runtime.onStartup.addListener(() => {
  syncExchangeRates();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REFRESH_RATES') {
    syncExchangeRates().then(success => {
      sendResponse({ success });
    });
    return true; 
  }
});
