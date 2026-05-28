(function () {
  var CONTENT_URL = 'content/site-content.json';

  function text(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setHref(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.setAttribute('href', value);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"]/g, function (ch) { return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch] || ch; });
  }

  function whatsappUrl(site) {
    var number = site && site.whatsappNumber ? site.whatsappNumber : '6584514057';
    var message = site && site.whatsappDefaultMessage ? site.whatsappDefaultMessage : 'Hi Siong Design, I would like to request a quotation.';
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
  }

  function optionList(select, items) {
    if (!select || !Array.isArray(items)) return;
    select.innerHTML = items.map(function (item) {
      return '<option value="' + Number(item.value) + '">' + String(item.label).replace(/</g, '&lt;') + '</option>';
    }).join('');
  }

  function buildNavigation(data) {
    if (!Array.isArray(data.navigation)) return;
    var nav = document.querySelector('header nav.links');
    if (!nav) return;
    var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var facebook = data.site && data.site.facebookUrl;
    var showFacebook = !data.site || data.site.showFacebookButton !== false;
    var facebookText = data.site && data.site.facebookButtonText ? data.site.facebookButtonText : 'Facebook';
    nav.innerHTML = data.navigation.filter(function (item) { return item.enabled !== false; }).map(function (item) {
      var url = item.url || '#';
      var label = item.label || 'Page';
      var active = current === url.toLowerCase() ? ' active' : '';
      var cls = item.button ? ' class="btn btn-navy' + active + '"' : ' class="' + active.trim() + '"';
      return '<a' + cls + ' href="' + escapeHtml(url) + '">' + escapeHtml(label) + '</a>';
    }).join('') + (facebook && showFacebook ? '<a class="social-link" href="' + escapeHtml(facebook) + '" target="_blank" rel="noopener"><span class="fb-icon">f</span><em>' + escapeHtml(facebookText.replace(/^Facebook:\s*/i,'')) + '</em></a>' : '');
  }

  function applyHome(data) {
    if (!data.home) return;
    text('.hero-copy .tag', data.home.heroTag);
    text('.hero-copy h1', data.home.heroTitle);
    text('.hero-copy .lead', data.home.heroLead);
    var buttons = document.querySelectorAll('.hero-actions a');
    if (buttons[0]) { buttons[0].textContent = data.home.primaryButtonText || buttons[0].textContent; buttons[0].href = data.home.primaryButtonUrl || buttons[0].href; }
    if (buttons[1]) { buttons[1].textContent = data.home.secondaryButtonText || buttons[1].textContent; buttons[1].href = data.home.secondaryButtonUrl || buttons[1].href; }
    if (buttons[2]) { buttons[2].textContent = data.home.thirdButtonText || buttons[2].textContent; buttons[2].href = data.home.thirdButtonUrl || buttons[2].href; }
  }

  function promoHtml(box) {
    var chips = Array.isArray(box.chips) ? box.chips.map(function (chip) { return '<span class="chip">' + escapeHtml(chip) + '</span>'; }).join('') : '';
    return '<div class="promo-box"><h2>' + escapeHtml(box.headline) + '</h2><div class="red">' + escapeHtml(box.subheadline) + '</div><div class="price"><small>FROM</small><strong>' + escapeHtml(box.fromPrice) + '</strong><span>' + escapeHtml(box.unit) + '</span></div><p>' + escapeHtml(box.note) + '</p><div class="chips">' + chips + '</div></div>';
  }

  function applyPromo(data) {
    var boxes = Array.isArray(data.promoBoxes) && data.promoBoxes.length ? data.promoBoxes : (data.promo ? [data.promo] : []);
    if (!boxes.length) return;
    var heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) {
      heroPhoto.innerHTML = '<div class="promo-stack">' + boxes.map(promoHtml).join('') + '</div>';
      return;
    }
    var first = boxes[0];
    text('.promo-box h2', first.headline);
    text('.promo-box .red', first.subheadline);
    text('.promo-box .price strong', first.fromPrice);
    text('.promo-box .price span', first.unit);
    text('.promo-box p', first.note);
    var chips = document.querySelector('.promo-box .chips');
    if (chips && Array.isArray(first.chips)) chips.innerHTML = first.chips.map(function (chip) { return '<span class="chip">' + escapeHtml(chip) + '</span>'; }).join('');
  }




  function applyProof(data) {
    if (!Array.isArray(data.proof)) return;
    var boxes = document.querySelectorAll('.proof-row .proof');
    data.proof.slice(0, boxes.length).forEach(function (item, index) {
      var box = boxes[index];
      if (!box) return;
      var strong = box.querySelector('strong');
      var span = box.querySelector('span');
      if (strong && item.title) strong.textContent = item.title;
      if (span && item.text) span.textContent = item.text;
    });
  }

  function applyMobileSectionOrder(data) {
    if (!Array.isArray(data.mobileSectionOrder)) return;
    var mobile = document.querySelector('main.mobile-site');
    if (!mobile) return;
    data.mobileSectionOrder.forEach(function (id) {
      var section = document.getElementById(id);
      if (section && section.parentNode === mobile) mobile.appendChild(section);
    });
  }


  function applyImages(data) {
    if (!Array.isArray(data.images)) return;
    data.images.forEach(function (img) {
      if (!img || !img.path) return;
      var filename = img.path.split('/').pop();
      document.querySelectorAll('img').forEach(function (el) {
        var src = el.getAttribute('src') || '';
        if (src === img.path || src.indexOf(filename) !== -1) {
          el.setAttribute('src', img.path);
          if (img.alt) el.setAttribute('alt', img.alt);
        }
      });
    });
  }

  function applyCalculator(data) {
    if (!data.calculator) return;
    var calc = data.calculator;

    function ensurePropertyCategory(categories) {
      var itemType = document.getElementById('itemType');
      if (!itemType || !Array.isArray(categories) || !categories.length) return null;
      var existing = document.getElementById('propertyCategory');
      if (existing) return existing;
      var parentField = itemType.closest ? itemType.closest('.field') : itemType.parentNode;
      if (!parentField || !parentField.parentNode) return null;
      var wrap = document.createElement('div');
      wrap.className = 'field full';
      wrap.innerHTML = '<label for="propertyCategory">Property Type</label><select id="propertyCategory"></select>';
      parentField.parentNode.insertBefore(wrap, parentField);
      var select = document.getElementById('propertyCategory');
      select.innerHTML = categories.map(function (cat, index) {
        return '<option value="' + index + '">' + escapeHtml(cat.label || ('Category ' + (index + 1))) + '</option>';
      }).join('');
      return select;
    }

    if (Array.isArray(calc.categories) && calc.categories.length) {
      var catSelect = ensurePropertyCategory(calc.categories);
      var itemType = document.getElementById('itemType');
      function fillCategory() {
        var index = catSelect ? Number(catSelect.value || 0) : 0;
        var cat = calc.categories[index] || calc.categories[0];
        optionList(itemType, cat.items || []);
        if (window.calcEstimate) window.calcEstimate();
      }
      if (catSelect) { catSelect.onchange = fillCategory; fillCategory(); }
    } else {
      optionList(document.getElementById('itemType'), calc.carpentryTypes);
    }

    optionList(document.getElementById('sinteredStone'), calc.sinteredStoneOptions);
    optionList(document.getElementById('heightType'), calc.heightOptions);
    optionList(document.getElementById('material'), calc.materialOptions);
    optionList(document.getElementById('internal'), calc.internalOptions);
    optionList(document.getElementById('doors'), calc.accessoryOptions);
    optionList(document.getElementById('installation'), calc.installationOptions);
    optionList(document.getElementById('mItemType'), calc.mobileTypes || calc.carpentryTypes);

    if (window.calcEstimate) window.calcEstimate();
    if (window.calcMobileEstimate) window.calcMobileEstimate();
  }


  function applyPages(data) {
    if (!data.pages) return;
    var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var map = {'services.html':'services','why-us.html':'why','works.html':'works','calculator.html':'calculator','faq.html':'faq','contact.html':'contact'};
    var key = map[current];
    var page = key && data.pages[key];
    if (!page) return;
    var head = document.querySelector('.section-head');
    if (head) {
      var h = head.querySelector('h1, h2');
      var p = head.querySelector('p');
      if (h && page.title) h.textContent = page.title;
      if (p && page.lead) p.textContent = page.lead;
    }
    if (Array.isArray(page.cards)) {
      var cards = document.querySelectorAll('.card');
      page.cards.forEach(function(card, i){
        if (!cards[i]) return;
        var h = cards[i].querySelector('h3');
        var p = cards[i].querySelector('p');
        if (h && card.title) h.textContent = card.title;
        if (p && card.text) p.textContent = card.text;
      });
    }
  }

  function applyFaq(data) {
    if (!Array.isArray(data.faq) || !data.faq.length) return;
    var wrap = document.querySelector('.faq-wrap');
    if (!wrap) return;
    wrap.innerHTML = data.faq.map(function(item, i){
      return '<details class="faq" ' + (i === 0 ? 'open' : '') + '><summary>' + escapeHtml(item.question || 'FAQ') + '</summary><p>' + escapeHtml(item.answer || '') + '</p></details>';
    }).join('');
  }

  function applySite(data) {
    if (data.site) {
      text('.brand strong', data.site.businessName);
      text('.brand span', data.site.tagline);
      document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) {
        if (data.site.whatsappNumber) a.href = whatsappUrl(data.site);
        if (data.site.whatsappButtonText && a.classList.contains('whatsapp-float')) a.innerHTML = '<span>☘</span> ' + escapeHtml(data.site.whatsappButtonText);
      });
      document.querySelectorAll('.whatsapp-float').forEach(function (a) {
        a.style.display = data.site.showWhatsappFloat === false ? 'none' : '';
      });
      document.querySelectorAll('.footer-social, .social-link, .m-facebook').forEach(function (a) {
        if (data.site.facebookUrl) a.href = data.site.facebookUrl;
        a.style.display = data.site.showFacebookButton === false ? 'none' : '';
        if (data.site.facebookButtonText) {
          var span = a.querySelector('span:last-child, em');
          if (span) span.textContent = data.site.facebookButtonText.replace(/^Facebook:\s*/i,'');
          else a.textContent = data.site.facebookButtonText;
        }
      });
    }
    buildNavigation(data);
    applyHome(data);
    applyPromo(data);
    applyProof(data);
    applyMobileSectionOrder(data);
    applyImages(data);
    applyPages(data);
    applyFaq(data);
    applyCalculator(data);
  }

  window.SIONG_CONTENT = { applySite: applySite };

  if (new URLSearchParams(location.search).get('preview') === '1' && localStorage.getItem('siongPreviewContent')) {
    try { applySite(JSON.parse(localStorage.getItem('siongPreviewContent'))); return; } catch (e) {}
  }

  fetch(CONTENT_URL + '?v=' + Date.now())
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) { if (data) applySite(data); })
    .catch(function () { /* keep original static content if JSON is unavailable */ });
})();
