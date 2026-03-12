/**
 * Jijira Content Script
 * Optimized for Amazon, Alibaba, and broad currency detection with state management.
 */

// Global state to track current page currency
let currentCurrency = null;

const SYMBOLS = '[$¢£¤¥֏؋৲৳৻૱௹฿៛₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₲₳₴₵₶₷₸₹₺₻₼₽₾₿]';
const ISO_CODES = '[A-Z]{3}';
const AMOUNT_PATTERN = '\\d{1,3}(?:[.,\\s]\\d{3})*(?:[.,]\\d{1,2})?';

// Individual price match (Symbol + Amount or Amount + Symbol)
const PRICE_SUB_PATTERN = `(?:(?:${SYMBOLS}|${ISO_CODES})\\s?${AMOUNT_PATTERN}|${AMOUNT_PATTERN}\\s?(?:${SYMBOLS}|${ISO_CODES}))`;

const CURRENCY_REGEX = new RegExp(
  `(?:^|\\s)(?:` +
  `(${SYMBOLS})\\s?(${AMOUNT_PATTERN})|` + // Symbol First
  `(${AMOUNT_PATTERN})\\s?(${SYMBOLS})|` + // Symbol Last
  `(${ISO_CODES})\\s?(${AMOUNT_PATTERN})|` + // ISO First
  `(${AMOUNT_PATTERN})\\s?(${ISO_CODES})` +   // ISO Last
  `)(?!\\d)`,
  'gi'
);

// Regex for ranges like "$10.00 - $20.00" or "10.00-20.00 USD"
// Improved to capture both sides more accurately on Alibaba
const RANGE_REGEX = new RegExp(
  `(${PRICE_SUB_PATTERN})\\s?[-–—]\\s?(${PRICE_SUB_PATTERN})`,
  'gi'
);

/**
 * Normalizes a price string into a float.
 */
function parseAmount(amountStr) {
  if (!amountStr) return null;
  // Remove currency symbols and ISO codes, keep numbers and separators
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
 * Helper to convert a range string (converts both values)
 */
function convertRange(rangeStr, rate, targetCurrency) {
  // Use the price regex to find and replace both prices within the range string
  return rangeStr.replace(new RegExp(PRICE_SUB_PATTERN, 'gi'), (match) => {
    const amount = parseAmount(match);
    if (amount === null) return match;
    return formatCurrency(amount * rate, targetCurrency);
  });
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

  // Check if it's a range
  if (originalValue.includes('-') || originalValue.includes('–')) {
    const converted = convertRange(originalValue, rate, targetCurrency);
    const offscreen = priceEl.querySelector('.a-offscreen');
    if (offscreen) offscreen.textContent = converted;
    
    const whole = priceEl.querySelector('.a-price-whole');
    if (whole) {
      whole.textContent = converted;
      const fraction = priceEl.querySelector('.a-price-fraction');
      const symbol = priceEl.querySelector('.a-price-symbol');
      if (fraction) fraction.style.display = 'none';
      if (symbol) symbol.style.display = 'none';
    } else {
      const ariaHidden = priceEl.querySelector('[aria-hidden="true"]');
      if (ariaHidden) ariaHidden.textContent = converted;
    }
  } else {
    // Single price logic
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

  const isRange = originalValue.includes('-') || originalValue.includes('–') || originalValue.includes('—');
  const converted = isRange
    ? convertRange(originalValue, rate, targetCurrency)
    : formatCurrency(parseAmount(originalValue) * rate, targetCurrency);
  
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

    // Try range first, then single
    let newText = originalText.replace(RANGE_REGEX, (match) => {
      totalCount++;
      return convertRange(match, rate, targetCurrency);
    });

    if (newText === originalText) {
      newText = originalText.replace(CURRENCY_REGEX, (match) => {
        const amount = parseAmount(match);
        if (amount === null) return match;
        totalCount++;
        return formatCurrency(amount * rate, targetCurrency);
      });
    }

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
