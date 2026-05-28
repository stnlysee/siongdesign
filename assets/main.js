
function money(value) {
  return '$' + Math.round(value).toLocaleString('en-SG');
}
function calcEstimate() {
  var item = document.getElementById('itemType');
  if (!item) return;

  var footRunInput = document.getElementById('footRun');
  var heightType = document.getElementById('heightType');
  var sinteredStone = document.getElementById('sinteredStone');
  var material = document.getElementById('material');
  var internal = document.getElementById('internal');
  var doors = document.getElementById('doors');
  var installation = document.getElementById('installation');
  var notesInput = document.getElementById('notes');
  var waQuote = document.getElementById('waQuote');

  var rate = Number(item.value);
  var footRun = Math.max(0, Number(footRunInput.value || 0));
  var base = rate * footRun;
  var adjusted = base * Number(heightType.value) * Number(material.value) * Number(internal.value);
  var adjustment = Math.max(0, adjusted - base);
  var stoneRate = Number((sinteredStone || {}).value || 0);
  var stone = stoneRate * footRun;
  var extras = Number(doors.value) + Number(installation.value);
  var total = adjusted + stone + extras;

  document.getElementById('baseRate').textContent = money(rate) + '/ft run';
  document.getElementById('runDisplay').textContent = footRun + ' ft';
  document.getElementById('baseCost').textContent = money(base);
  document.getElementById('adjustmentCost').textContent = money(adjustment);
  document.getElementById('stoneCost').textContent = money(stone);
  document.getElementById('extraCost').textContent = money(extras);
  document.getElementById('totalCost').textContent = money(total);

  var notes = notesInput.value.trim();
  var newline = String.fromCharCode(10);
  var message = [
    'Hi Siong Design, I used the website estimator.',
    '',
    'Carpentry: ' + item.options[item.selectedIndex].text,
    'Foot run: ' + footRun + ' ft',
    'Material: ' + material.options[material.selectedIndex].text,
    'Internal finishing: ' + internal.options[internal.selectedIndex].text,
    'Sintered stone: ' + (stoneRate ? sinteredStone.options[sinteredStone.selectedIndex].text + ' = ' + money(stone) : 'Not required'),
    'Estimated cost: ' + money(total),
    'Exclusion note: Sintered stone pricing excludes sinks, plumbing works and removal of existing kitchen.',
    '',
    'Notes: ' + (notes || 'N/A'),
    '',
    'Please advise the official quotation.'
  ].join(newline);

  waQuote.href = 'https://wa.me/6584514057?text=' + encodeURIComponent(message);
}
window.addEventListener('load', function() {
  var fields = document.querySelectorAll('#calculator input, #calculator select, #calculator textarea');
  fields.forEach(function(el) {
    el.addEventListener('input', calcEstimate);
    el.addEventListener('change', calcEstimate);
  });
  calcEstimate();
});

// V16 mobile one-page calculator
function calcMobileEstimate() {
  var item = document.getElementById('mItemType');
  if (!item) return;
  var run = Math.max(0, Number((document.getElementById('mFootRun') || {}).value || 0));
  var complexity = Number((document.getElementById('mComplexity') || {}).value || 1);
  var mStoneSelect = document.getElementById('mSinteredStone');
  var stoneRate = Number((mStoneSelect || {}).value || 0);
  var stone = stoneRate * run;
  var total = (Number(item.value) * run * complexity) + stone;
  var totalText = money(total);
  var totalEl = document.getElementById('mTotalCost');
  if (totalEl) totalEl.textContent = totalText;
  var wa = document.getElementById('mWaQuote');
  if (wa) {
    var message = [
      'Hi Siong Design, I used the mobile website estimator.',
      '',
      'Carpentry: ' + item.options[item.selectedIndex].text,
      'Foot run: ' + run + ' ft',
      'Sintered stone: ' + (stoneRate ? mStoneSelect.options[mStoneSelect.selectedIndex].text + ' = ' + money(stone) : 'Not required'),
      'Estimated from: ' + totalText,
      'Exclusion note: Sintered stone excludes sinks, plumbing and removal of existing kitchen.',
      '',
      'Please advise the official quotation.'
    ].join(String.fromCharCode(10));
    wa.href = 'https://wa.me/6584514057?text=' + encodeURIComponent(message);
  }
}
window.addEventListener('load', function() {
  ['mItemType','mFootRun','mSinteredStone','mComplexity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calcMobileEstimate);
      el.addEventListener('change', calcMobileEstimate);
    }
  });
  calcMobileEstimate();
});


// V37 calculator category loader: HDB / Condo support
(function () {
  function optionHtml(item) {
    return '<option value="' + Number(item.value || 0) + '">' + String(item.label || 'Option').replace(/</g, '&lt;') + '</option>';
  }

  function fillSelect(select, items) {
    if (!select || !Array.isArray(items)) return;
    select.innerHTML = items.map(optionHtml).join('');
  }

  function applyCalculatorData(data) {
    if (!data || !data.calculator) return;

    var calc = data.calculator;
    var categorySelect = document.getElementById('propertyCategory');
    var itemType = document.getElementById('itemType');

    if (categorySelect && itemType && Array.isArray(calc.categories) && calc.categories.length) {
      categorySelect.innerHTML = calc.categories.map(function (cat, index) {
        return '<option value="' + index + '">' + String(cat.label || ('Category ' + (index + 1))).replace(/</g, '&lt;') + '</option>';
      }).join('');

      function updateCarpentryItems() {
        var selectedCategory = calc.categories[Number(categorySelect.value)] || calc.categories[0];
        fillSelect(itemType, selectedCategory.items || []);
        if (typeof calcEstimate === 'function') calcEstimate();
      }

      categorySelect.addEventListener('change', updateCarpentryItems);
      updateCarpentryItems();
    }

    fillSelect(document.getElementById('sinteredStone'), calc.sinteredStoneOptions);
    fillSelect(document.getElementById('heightType'), calc.heightOptions);
    fillSelect(document.getElementById('material'), calc.materialOptions);
    fillSelect(document.getElementById('internal'), calc.internalOptions);
    fillSelect(document.getElementById('doors'), calc.accessoryOptions);
    fillSelect(document.getElementById('installation'), calc.installationOptions);

    if (typeof calcEstimate === 'function') calcEstimate();
  }

  function loadCalculatorData() {
    if (!document.getElementById('calculator')) return;

    fetch('content/site-content.json?v=' + Date.now())
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) { if (data) applyCalculatorData(data); })
      .catch(function () {
        // Keep the static calculator if JSON cannot be loaded.
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCalculatorData);
  } else {
    loadCalculatorData();
  }
})();
