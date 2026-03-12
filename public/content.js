/**
 * Jijira Content Script
 * Optimized for Amazon, Alibaba, and broad currency detection with state management.
 */

// Global state to track current page currency
let currentCurrency = null;

const SYMBOLS = '[$¢£¤¥֏؋৲৳৻૱௹฿៛₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₲₳₴₵₶₷₸₹₺₻₼₽₾₿]';
const ISO_CODES = '[A-Z]{3}';
const AMOUNT_PATTERN = '\\d{1,3}(?:[.,\\s]\\d{3})*(?:[.,]\\d{1,2})?';

const CURRENCY_REGEX = new RegExp(
  `(?:^|\\s)(?:` +
  `(${SYMBOLS})\\s?(${AMOUNT_PATTERN})|` + // Symbol First
  `(${AMOUNT_PATTERN})\\s?(${SYMBOLS})|` + // Symbol Last
  `(${ISO_CODES})\\s?(${AMOUNT_PATTERN})|` + // ISO First
  `(${AMOUNT_PATTERN})\\s?(${ISO_CODES})` +   // ISO Last
  `)(?!\\d)`,
  'gi'
);

/**
 * Normalizes a price string into a float.
 */
function parseAmount(amountStr) {
  if (!amountStr) return null;
  let cleanStr = amountStr.replace(new RegExp(`[${SYMBOLS}]|[A-Z]{3}`, 'g'), '').replace(/[^\d.,\s]/g, '').trim();
  
  if (/\d\s\d{3}/.test(cleanStr)) cleanStr = cleanStr.replace(/\s/g, '');
  const lastDot = cleanStr.lastIndexOf('.');
  const lastComma = cleanStr.lastIndexOf(',');

  if (lastComma > lastDot && (cleanStr.length - 1 - lastComma) <= 2) {
    cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma && (cleanStr.length - 1 - lastDot) <= 2) {
    cleanStr = cleanStr.replace(/,/g, '');
  } else {
    if (lastComma !== -1 && (cleanStr.length - 1 - lastComma) <= 2) {
       cleanStr = cleanStr.replace(/,/g, '.');
    } else {
       cleanStr = cleanStr.replace(/[,]/g, '');
    }
  }
  const value = parseFloat(cleanStr);
  return isNaN(value) ? null : value;
}

/**
 * Formats a number back into a localized currency string.
 */
function formatCurrency(amount, currencyCode) {
  try {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (e) {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

/**
 * Specialized handler for Amazon's complex price structures.
 */
function handleAmazonPrice(priceEl, targetCurrency, rate) {
  let originalValue = priceEl.dataset.jijiraOriginal;
  
  if (!originalValue) {
    const offscreen = priceEl.querySelector('.a-offscreen');
    originalValue = offscreen ? offscreen.textContent : priceEl.textContent;
    priceEl.dataset.jijiraOriginal = originalValue.trim();
  }

  const amount = parseAmount(originalValue);
  if (amount === null) return 0;
  const converted = formatCurrency(amount * rate, targetCurrency);
  
  const offscreen = priceEl.querySelector('.a-offscreen');
  if (offscreen) offscreen.textContent = converted;

  const symbol = priceEl.querySelector('.a-price-symbol');
  const whole = priceEl.querySelector('.a-price-whole');
  const fraction = priceEl.querySelector('.a-price-fraction');

  if (whole) {
    const match = converted.match(/(\D*?)(\d+(?:[.,]\d+)*)(\D*)/);
    if (match) {
      const fullNumber = match[2];
      const currencySymbol = match[1] || match[3] || '';
      const lastSepIndex = Math.max(fullNumber.lastIndexOf('.'), fullNumber.lastIndexOf(','));
      if (lastSepIndex !== -1 && (fullNumber.length - 1 - lastSepIndex) <= 2) {
        whole.textContent = fullNumber.substring(0, lastSepIndex) + (fullNumber[lastSepIndex] === '.' ? '.' : ',');
        if (fraction) {
           fraction.textContent = fullNumber.substring(lastSepIndex + 1);
           fraction.style.display = '';
        }
      } else {
        whole.textContent = fullNumber;
        if (fraction) fraction.textContent = '';
      }
      if (symbol) {
        symbol.textContent = currencySymbol.trim();
        symbol.style.display = '';
      }
    }
  } else {
    const ariaHidden = priceEl.querySelector('[aria-hidden="true"]');
    if (ariaHidden) ariaHidden.textContent = converted;
  }

  return 1;
}

/**
 * Generic handler for sites like Alibaba
 */
function handleGenericPrice(el, targetCurrency, rate) {
  let originalValue = el.dataset.jijiraOriginal;
  if (!originalValue) {
    originalValue = el.textContent.trim();
    el.dataset.jijiraOriginal = originalValue;
  }

  const amount = parseAmount(originalValue);
  if (amount === null) return 0;
  
  const converted = formatCurrency(amount * rate, targetCurrency);
  
  if (converted && !converted.includes("null")) {
    el.textContent = converted;
    return 1;
  }
  return 0;
}

/**
 * Global conversion runner.
 */
function runConversion(targetCurrency, rate) {
  if (currentCurrency === targetCurrency) return 0;

  let totalCount = 0;

  // 1. Amazon
  document.querySelectorAll('.a-price, .a-text-price, .a-color-price').forEach(el => {
    totalCount += handleAmazonPrice(el, targetCurrency, rate);
  });

  // 2. Alibaba and others (specific selectors)
  const genericSelectors = [
    '.price-range', '.price-value', '.ma-ref-price', '.pre-inquiry-price', 
    '.promotion-price', '.price-number', '.val-wrapper', '.elements-title-normal'
  ];
  document.querySelectorAll(genericSelectors.join(',')).forEach(el => {
    totalCount += handleGenericPrice(el, targetCurrency, rate);
  });

  // 3. Process Generic Text Nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentNode;
        if (!parent || parent.closest('[data-jijira-original]')) return NodeFilter.FILTER_REJECT;
        const tagName = parent.tagName.toUpperCase();
        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT'].includes(tagName)) return NodeFilter.FILTER_REJECT;
        return /\d/.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    }
  );

  const nodes = [];
  while(walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const parent = node.parentNode;
    let originalText = parent.getAttribute('data-jijira-original-text') || node.textContent;
    if (!parent.hasAttribute('data-jijira-original-text')) {
      parent.setAttribute('data-jijira-original-text', originalText);
    }

    const newText = originalText.replace(CURRENCY_REGEX, (match) => {
      const amount = parseAmount(match);
      if (amount === null) return match;
      totalCount++;
      return formatCurrency(amount * rate, targetCurrency);
    });

    if (originalText !== newText) {
      node.textContent = newText;
    }
  });

  currentCurrency = targetCurrency;
  return totalCount;
}

// Communication Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CONVERT_CURRENCY') {
    const { targetCurrency, rate } = message;
    if (!rate || !targetCurrency) {
      sendResponse({ success: false });
      return;
    }
    const count = runConversion(targetCurrency, rate);
    sendResponse({ success: true, count });
  }
});
