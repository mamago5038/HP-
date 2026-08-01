(function () {
  if (window.__ga4EventsInit) return;
  window.__ga4EventsInit = true;

  // セクションid → GA4 button_locationラベル
  var SECTION_LABELS = {
    sale: 'セール欄',
    'line-coupon': 'LINE友だち追加欄',
    pickup: '無料集配欄',
    services: 'サービス一覧欄',
    corporate: '法人向け欄',
    faq: 'FAQ欄',
    company: '会社紹介欄',
    shops: '店舗・アクセス欄',
    contact: 'お問い合わせCTA欄'
  };

  function getButtonLocation(el) {
    if (el.closest('header')) return 'ヘッダー';
    if (el.closest('footer')) return 'フッター';
    var section = el.closest('section[id]');
    if (section && SECTION_LABELS[section.id]) return SECTION_LABELS[section.id];
    if (el.closest('.cta-section')) return 'お問い合わせCTA欄';
    return 'その他';
  }

  function getStoreName(el) {
    var card = el.closest('.main-shop-card, .local-shop-item');
    if (!card) return undefined;
    var nameEl = card.querySelector('.main-shop__name, .local-shop__name');
    return nameEl ? nameEl.textContent.trim() : undefined;
  }

  function getLinkText(el) {
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) text = el.getAttribute('aria-label') || '';
    return text;
  }

  function sendEvent(name, params) {
    if (typeof gtag !== 'function') return;
    var payload = {
      link_url: params.link_url || '',
      link_text: params.link_text || '',
      page_location: window.location.href,
      button_location: params.button_location
    };
    if (params.store_name) payload.store_name = params.store_name;
    if (params.contact_method) payload.contact_method = params.contact_method;
    gtag('event', name, payload);
  }

  function handleClick(e) {
    var el = e.target.closest('a, button');
    if (!el) return;

    var href = el.getAttribute('href') || '';
    var isLine = /lin\.ee/i.test(href);
    var isTel = /^tel:/i.test(href);
    var isMap = /maps\.app\.goo\.gl|google\.com\/maps|maps\.google\.com|goo\.gl\/maps/i.test(href) ||
                el.classList.contains('map-lightbox-trigger');

    if (!isLine && !isTel && !isMap) return;

    var buttonLocation = getButtonLocation(el);
    var storeName = getStoreName(el);
    var linkText = getLinkText(el);
    var isReservation = isLine || isTel ? !!el.closest('#pickup') : false;

    if (isLine) {
      sendEvent('line_click', { link_url: href, link_text: linkText, button_location: buttonLocation, store_name: storeName });
    }
    if (isTel) {
      sendEvent('tel_click', { link_url: href, link_text: linkText, button_location: buttonLocation, store_name: storeName });
    }
    if (isMap) {
      var mapUrl = href || el.getAttribute('data-map-src') || '';
      sendEvent('map_click', { link_url: mapUrl, link_text: linkText, button_location: buttonLocation, store_name: storeName });
    }
    if (isReservation) {
      sendEvent('reservation_click', {
        link_url: href,
        link_text: linkText,
        button_location: buttonLocation,
        store_name: storeName,
        contact_method: isLine ? 'line' : 'tel'
      });
    }
  }

  document.addEventListener('click', handleClick, true);
})();
