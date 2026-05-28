const ADMIN_PASSWORD = 'siongadmin';
const CONTENT_PATH = 'content/site-content.json';

let content = null;
let activeBlock = 'home';
let activeDevice = 'desktop';
let activePage = 'home';
let selectedPath = null;
let pendingImages = [];
let autoSaveTimer = null;
let isPublishing = false;

const $ = (id) => document.getElementById(id);
const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => [...root.querySelectorAll(sel)];
const esc = (value) => String(value ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const clone = (x) => JSON.parse(JSON.stringify(x));

function defaultContent(){
  return {
    site:{businessName:'Siong Design',tagline:'Premium Carpentry • Factory Price',phone:'+65 8451 4057',whatsappNumber:'6584514057',whatsappButtonText:'WhatsApp Us',whatsappDefaultMessage:'Hi Siong Design, I would like to request a quotation.',showWhatsappFloat:true,facebookUrl:'https://www.facebook.com/profile.php?id=61575290054499',facebookButtonText:'Facebook: Siong Design',showFacebookButton:true,address:'',defaultMetaDescription:''},
    navigation:[{label:'Home',url:'index.html',enabled:true},{label:'Services',url:'services.html',enabled:true},{label:'Get Quote',url:'contact.html',enabled:true,button:true}],
    home:{heroTag:'HDB • Condo • Landed • Commercial',heroTitle:'Premium carpentry at direct factory value.',heroLead:'Siong Design builds kitchen cabinets, wardrobes, TV feature walls and custom carpentry for Singapore homes and businesses.',primaryButtonText:'Calculate My Cost',primaryButtonUrl:'calculator.html',secondaryButtonText:'WhatsApp 8451 4057',secondaryButtonUrl:'https://wa.me/6584514057',thirdButtonText:'View Works',thirdButtonUrl:'works.html'},
    promo:{headline:'Kitchen & Wardrobe Promo',subheadline:'Direct Factory Value',fromPrice:'$110',unit:'/FT',note:'Kitchen top and bottom cabinets are calculated separately. Wardrobe promo starts from $220/ft. Terms and conditions apply.',chips:['E0 wood','Internal & external laminate','ABS trimming','Soft-close options']},
    promoBoxes:[{headline:'Kitchen & Wardrobe Promo',subheadline:'Direct Factory Value',fromPrice:'$110',unit:'/FT',note:'Kitchen top and bottom cabinets are calculated separately. Wardrobe promo starts from $220/ft. Terms and conditions apply.',chips:['E0 wood','Internal & external laminate','ABS trimming','Soft-close options']}],
    proof:[{title:'From $110/ft',text:'Kitchen top/bottom promo, counted separately'},{title:'Wardrobe $220/ft',text:'Selected casement wardrobe promo'},{title:'Free Measurement',text:'Quotation before confirmation'}],
    calculator:{carpentryTypes:[{label:'Kitchen Cabinet Promo from $110/ft run',value:110}],mobileTypes:[{label:'Kitchen Cabinet Promo from $110/ft',value:110}]},
    faq:[], ai:{summary:'Siong Design is a Singapore carpentry company.',keywords:['Singapore carpentry']}, images: defaultImages(), mobileSectionOrder:['m-home','m-services','m-why','m-works','m-calc','m-faq','m-contact']
  };
}

function defaultImages(){
  return [
    {label:'Hero Kitchen', path:'assets/hero-kitchen-grey.png', alt:'Siong Design kitchen cabinet and sintered stone interior'},
    {label:'Hero Wardrobe', path:'assets/hero-wardrobe-promo.png', alt:'Siong Design wardrobe promotion'},
    {label:'Kitchen Dark Luxury', path:'assets/kitchen-dark-luxury.png', alt:'Dark luxury kitchen cabinet'},
    {label:'Kitchen Grey Storage', path:'assets/kitchen-grey-storage.png', alt:'Grey kitchen storage cabinet'},
    {label:'Kitchen Wood Complete', path:'assets/kitchen-wood-complete.png', alt:'Wood kitchen cabinet complete set'},
    {label:'Kitchen Wood White', path:'assets/kitchen-wood-white.png', alt:'Wood and white kitchen cabinet'},
    {label:'Commercial Interior', path:'assets/commercial-interior.png', alt:'Commercial interior renovation'},
    {label:'Shoe Cabinet', path:'assets/shoe-cabinet.png', alt:'Custom shoe cabinet'},
    {label:'Vanity Drawer', path:'assets/vanity-drawer.png', alt:'Bathroom vanity drawer cabinet'},
    {label:'Wardrobe Glass', path:'assets/wardrobe-glass.png', alt:'Glass wardrobe cabinet'},
    {label:'Wardrobe LED', path:'assets/wardrobe-led.png', alt:'Wardrobe with LED lighting'},
    {label:'Wardrobe Open Shelves', path:'assets/wardrobe-open-shelves.png', alt:'Open shelf wardrobe cabinet'},
    {label:'Promo Board 1', path:'assets/promo-board-1.png', alt:'Promotional board design 1'},
    {label:'Promo Board 2', path:'assets/promo-board-2.png', alt:'Promotional board design 2'},
    {label:'Promo Board 3', path:'assets/promo-board-3.png', alt:'Promotional board design 3'},
    {label:'Promo Board 4', path:'assets/promo-board-4.png', alt:'Promotional board design 4'}
  ];
}

async function loadContent(){
  try{
    const res = await fetch('../' + CONTENT_PATH + '?v=' + Date.now(), {cache:'no-store'});
    if(!res.ok) throw new Error('Content file not found');
    content = await res.json();
  }catch(err){
    content = defaultContent();
  }
  normalizeContent();
}

function normalizeContent(){
  const base = defaultContent();
  content.site = {...base.site, ...(content.site || {})};
  content.home = {...base.home, ...(content.home || {})};
  content.pages = {...base.pages, ...(content.pages || {})};
  content.promo = {...base.promo, ...(content.promo || {})};
  if(!Array.isArray(content.promoBoxes) || !content.promoBoxes.length){
    content.promoBoxes = [clone(content.promo || base.promo)];
  }
  content.promoBoxes = content.promoBoxes.map(box => ({...base.promo, ...(box || {}), chips:Array.isArray(box && box.chips) ? box.chips : clone(base.promo.chips)}));
  content.promo = content.promoBoxes[0] || base.promo;
  content.navigation = Array.isArray(content.navigation) ? content.navigation : base.navigation;
  content.images = Array.isArray(content.images) && content.images.length ? content.images : defaultImages();
  content.calculator = content.calculator || base.calculator;
  content.calculator.categories = Array.isArray(content.calculator.categories) ? content.calculator.categories : (base.calculator.categories || []);
  content.calculator.carpentryTypes = content.calculator.carpentryTypes || [];
  content.calculator.mobileTypes = content.calculator.mobileTypes || [];
  content.faq = Array.isArray(content.faq) ? content.faq : (base.faq || []);
  content.ai = {...base.ai, ...(content.ai || {})};
  content.proof = Array.isArray(content.proof) && content.proof.length ? content.proof : base.proof;
  content.mobileSectionOrder = Array.isArray(content.mobileSectionOrder) ? content.mobileSectionOrder : base.mobileSectionOrder;
}

function get(path){return path.split('.').reduce((obj,key)=>obj && obj[key], content);}
function set(path, value){
  const parts = path.split('.');
  let obj = content;
  while(parts.length > 1){ const key = parts.shift(); obj[key] = obj[key] || {}; obj = obj[key]; }
  obj[parts[0]] = value;
  markChanged();
}

function markChanged(){
  $('saveState').textContent = 'Unsaved changes';
  renderPreview();
  if(getGithubSettings().autoSave === true){
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(saveToGithub, 3500);
  }
}

function showStatus(message, type='info'){
  const box = $('status');
  box.textContent = message;
  box.className = 'status ' + type;
  box.classList.remove('hidden');
}
function hideStatus(){ $('status').classList.add('hidden'); }

function switchBlock(block){
  activeBlock = block;
  selectedPath = null;
  qsa('.block-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.block === block));
  renderEditor();
  renderPreview();
}

function switchDevice(device){
  activeDevice = device;
  qsa('.device').forEach(btn => btn.classList.toggle('active', btn.dataset.device === device));
  renderPreview();
}


function switchPage(page){
  activePage = page;
  qsa('.page-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.page === page));
  renderPreview();
}

function renderPreview(){
  if(activePage === 'home'){
    renderHomePreview();
    return;
  }

  renderPagePreview(activePage);
}

function previewNavHtml(){
  return (content.navigation || [])
    .filter(n=>n.enabled !== false)
    .map(n=>`<a class="${n.button?'cta':''}" href="#" data-edit-list="nav">${esc(n.label)}</a>`)
    .join('');
}

function previewShell(inner){
  return `
    <div class="preview-shell ${activeDevice}">
      <div class="preview-nav editable" data-block="nav">
        <div class="preview-brand editable" data-block="home" data-path="site.businessName">
          <div class="preview-logo">SD</div>
          <div>${esc(content.site.businessName)}<br><small>${esc(content.site.tagline)}</small></div>
        </div>
        <div class="preview-links">${previewNavHtml()}</div>
      </div>
      ${inner}
    </div>`;
}

function renderHomePreview(){
  const promoBoxes = Array.isArray(content.promoBoxes) && content.promoBoxes.length ? content.promoBoxes : [content.promo];

  const promoHtml = promoBoxes.map((box, idx)=>{
    const chips = (box.chips || []).map(c=>`<span class="chip">${esc(c)}</span>`).join('');
    return `<div class="preview-promo editable" data-block="promo" data-path="promoBoxes.${idx}.headline">
      <h2>${esc(box.headline)}</h2>
      <div class="red">${esc(box.subheadline)}</div>
      <div class="preview-price"><small>FROM </small><strong>${esc(box.fromPrice)}</strong><span>${esc(box.unit)}</span></div>
      <p>${esc(box.note)}</p>
      <div class="chips">${chips}</div>
    </div>`;
  }).join('');

  const proof = (content.proof || [])
    .map((p,i)=>`<div class="proof-card editable" data-block="proof" data-path="proof.${i}.title"><b>${esc(p.title)}</b><span>${esc(p.text)}</span></div>`)
    .join('');

  const showImages = (content.images || []).slice(0,8)
    .map((img,i)=>`<div class="image-tile drop-target" data-image-index="${i}" data-block="images" style="background-image:url('../${esc(img.path)}?v=${Date.now()}')"><span>${esc(img.label)}</span></div>`)
    .join('');

  const html = previewShell(`
      <section class="preview-hero">
        <div>
          <span class="preview-tag editable" data-block="home" data-path="home.heroTag">${esc(content.home.heroTag)}</span>
          <h1 class="editable" data-block="home" data-path="home.heroTitle">${esc(content.home.heroTitle)}</h1>
          <p class="editable" data-block="home" data-path="home.heroLead">${esc(content.home.heroLead)}</p>
          <div class="preview-actions editable" data-block="home">
            <a href="#">${esc(content.home.primaryButtonText)}</a>
            <a href="#">${esc(content.home.secondaryButtonText)}</a>
            <a href="#">${esc(content.home.thirdButtonText)}</a>
          </div>
        </div>
        <div class="preview-promo-stack">${promoHtml}</div>
      </section>
      <div class="proof-grid">${proof}</div>
      <div class="image-strip">${showImages}</div>
  `);

  $('visualPreview').innerHTML = html;
  bindPreviewClicks();
}

function renderPagePreview(pageKey){
  const page = (content.pages && content.pages[pageKey]) || {};
  let body = '';

  if(pageKey === 'calculator'){
    const cats = content.calculator.categories || [];
    body = `
      <section class="preview-page-section editable" data-block="pages">
        <h1>${esc(page.title || 'Calculator')}</h1>
        <p>${esc(page.lead || '')}</p>
        <div class="preview-card-grid">
          ${cats.map(cat=>`<div class="preview-service-card editable" data-block="calculator">
            <h3>${esc(cat.label)}</h3>
            ${(cat.items||[]).slice(0,5).map(item=>`<p><b>${esc(item.label)}</b><br>$${esc(item.value)} / ft</p>`).join('')}
          </div>`).join('')}
        </div>
      </section>`;
  }else if(pageKey === 'faq'){
    const faqs = content.faq || [];
    body = `
      <section class="preview-page-section editable" data-block="faq">
        <h1>${esc(page.title || 'FAQ')}</h1>
        <p>${esc(page.lead || '')}</p>
        <div class="preview-faq-list">
          ${faqs.map(f=>`<div class="preview-faq-card">
            <h3>${esc(f.question)}</h3>
            <p>${esc(f.answer)}</p>
          </div>`).join('')}
        </div>
      </section>`;
  }else{
    const cards = page.cards || [];
    body = `
      <section class="preview-page-section editable" data-block="pages">
        <h1>${esc(page.title || pageKey)}</h1>
        <p>${esc(page.lead || '')}</p>
        <div class="preview-card-grid">
          ${cards.map(c=>`<div class="preview-service-card">
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.text)}</p>
          </div>`).join('')}
        </div>
      </section>`;
  }

  $('visualPreview').innerHTML = previewShell(body);
  bindPreviewClicks();
}

function bindPreviewClicks(){
  qsa('[data-block]', $('visualPreview')).forEach(el => {
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      switchBlock(el.dataset.block);
      if(el.dataset.path){
        selectedPath = el.dataset.path;
        renderEditor();
      }
    });
  });

  qsa('.drop-target', $('visualPreview')).forEach(bindDropTarget);
}

function renderEditor(){
  hideStatus();
  const titles = {home:'Homepage Hero',nav:'Nav / Dropdown Bar',promo:'Promo Box',proof:'Proof Points',calculator:'Calculator Dropdowns',
    faq:'FAQ Editor',images:'Photos',mobile:'Mobile Section Order',seo:'AI & SEO',pages:'Page Content',
    github:'Auto Save Setup',json:'Advanced JSON'};
  $('editorTitle').textContent = titles[activeBlock] || 'Editor';
  $('editorHelp').textContent = helpText(activeBlock);
  if(activeBlock === 'home') renderHomeEditor();
  if(activeBlock === 'nav') renderNavEditor();
  if(activeBlock === 'promo') renderPromoEditor();
  if(activeBlock === 'proof') renderProofEditor();
  if(activeBlock === 'calculator') renderCalculatorEditor();
  if(activeBlock === 'faq') renderFaqEditor();
  if(activeBlock === 'images') renderImagesEditor();
  if(activeBlock === 'mobile') renderMobileEditor();
  if(activeBlock === 'seo') renderSeoEditor();
  if(activeBlock === 'pages') renderPagesEditor();
  if(activeBlock === 'github') renderGithubEditor();
  if(activeBlock === 'json') renderJsonEditor();
}

function helpText(block){
  return {
    home:'Click text in the preview or edit the fields below.',
    nav:'Drag menu items to reorder. Edit labels and links here.',
    promo:'Edit the promotional price box and chips.',
    proof:'Drag proof cards to reorder or edit the short trust points.',
    calculator:'Edit calculator dropdown labels and prices.',
    faq:'Add, remove and edit FAQ questions for the website.',
    images:'Drag and drop new photos onto image cards or preview image tiles.',
    mobile:'Drag mobile website sections to change their order.',
    seo:'Make the website easier for Google and AI tools to understand.',
    pages:'Edit the page headings, descriptions and page cards.',
    github:'Set up GitHub token once so the portal can publish changes automatically.',
    json:'Advanced editor. Only edit this if you understand JSON.'
  }[block] || '';
}

function inputField(path,label,type='text',small=''){
  const val = get(path) ?? '';
  const selected = selectedPath === path ? ' style="box-shadow:0 0 0 3px rgba(195,145,46,.28);border-color:#c3912e"' : '';
  if(type === 'textarea') return `<div class="field"><label>${label}</label><textarea data-path="${path}"${selected}>${esc(val)}</textarea>${small?`<small>${small}</small>`:''}</div>`;
  return `<div class="field"><label>${label}</label><input data-path="${path}" value="${esc(val)}"${selected}>${small?`<small>${small}</small>`:''}</div>`;
}

function bindPathInputs(){
  qsa('[data-path]', $('editorFields')).forEach(el => {
    el.addEventListener('input', e => set(e.target.dataset.path, e.target.value));
  });
}

function renderHomeEditor(){
  $('editorFields').innerHTML = `
    ${inputField('site.businessName','Business name')}
    ${inputField('site.tagline','Tagline')}
    ${inputField('home.heroTag','Hero tag')}
    ${inputField('home.heroTitle','Main headline','textarea')}
    ${inputField('home.heroLead','Hero description','textarea')}
    ${inputField('home.primaryButtonText','Button 1 text')}
    ${inputField('home.primaryButtonUrl','Button 1 link')}
    ${inputField('home.secondaryButtonText','Button 2 text')}
    ${inputField('home.secondaryButtonUrl','Button 2 link')}
    ${inputField('home.thirdButtonText','Button 3 text')}
    ${inputField('home.thirdButtonUrl','Button 3 link')}
    <hr><div class="hint"><b>WhatsApp and Facebook buttons</b> These control the floating WhatsApp button, mobile WhatsApp buttons and Facebook links.</div>
    ${inputField('site.whatsappNumber','WhatsApp number','text','Use country code without +, example: 6584514057')}
    ${inputField('site.whatsappButtonText','Floating WhatsApp button text')}
    ${inputField('site.whatsappDefaultMessage','Default WhatsApp message','textarea')}
    <div class="repeat-card"><label><input type="checkbox" id="showWhatsappFloat" ${content.site.showWhatsappFloat!==false?'checked':''}> Show floating WhatsApp button</label></div>
    ${inputField('site.facebookUrl','Facebook URL')}
    ${inputField('site.facebookButtonText','Facebook button text')}
    <div class="repeat-card"><label><input type="checkbox" id="showFacebookButton" ${content.site.showFacebookButton!==false?'checked':''}> Show Facebook button</label></div>`;
  bindPathInputs();
  $('showWhatsappFloat').addEventListener('change', e=>{content.site.showWhatsappFloat = e.target.checked; markChanged();});
  $('showFacebookButton').addEventListener('change', e=>{content.site.showFacebookButton = e.target.checked; markChanged();});
}

function promoBoxFields(box,i){
  return `<div class="repeat-card" draggable="true" data-promo-index="${i}">
    <div class="drag-handle">☰ Drag promo box ${i+1}</div>
    <div class="field"><label>Headline</label><input data-promo-field="headline" data-index="${i}" value="${esc(box.headline)}"></div>
    <div class="field"><label>Subheadline</label><input data-promo-field="subheadline" data-index="${i}" value="${esc(box.subheadline)}"></div>
    <div class="field"><label>Price</label><input data-promo-field="fromPrice" data-index="${i}" value="${esc(box.fromPrice)}"></div>
    <div class="field"><label>Unit</label><input data-promo-field="unit" data-index="${i}" value="${esc(box.unit)}"></div>
    <div class="field"><label>Note</label><textarea data-promo-field="note" data-index="${i}">${esc(box.note)}</textarea></div>
    <div class="hint">Chips / highlights</div>
    ${(box.chips||[]).map((chip,j)=>`<div class="mini-row"><input data-promo-chip="${i}:${j}" value="${esc(chip)}"><button class="danger" type="button" data-remove-promo-chip="${i}:${j}">Remove</button></div>`).join('')}
    <div class="row-actions"><button type="button" data-add-promo-chip="${i}">+ Add chip</button><button class="danger" type="button" data-remove-promo="${i}">Remove promo box</button></div>
  </div>`;
}

function renderPromoEditor(){
  normalizeContent();
  $('editorFields').innerHTML = `<div class="hint">Add, remove, edit and drag promo boxes. The first promo box is also kept as the website's main promo for older pages.</div>` +
    (content.promoBoxes||[]).map((box,i)=>promoBoxFields(box,i)).join('') +
    `<button id="addPromoBox" type="button">+ Add promo box</button>`;
  qsa('[data-promo-field]').forEach(el=>el.addEventListener('input',e=>{
    const i=Number(e.target.dataset.index); const key=e.target.dataset.promoField;
    content.promoBoxes[i][key]=e.target.value; content.promo = content.promoBoxes[0]; markChanged();
  }));
  qsa('[data-promo-chip]').forEach(el=>el.addEventListener('input',e=>{
    const [i,j]=e.target.dataset.promoChip.split(':').map(Number);
    content.promoBoxes[i].chips[j]=e.target.value; content.promo = content.promoBoxes[0]; markChanged();
  }));
  qsa('[data-remove-promo-chip]').forEach(btn=>btn.onclick=()=>{
    const [i,j]=btn.dataset.removePromoChip.split(':').map(Number);
    content.promoBoxes[i].chips.splice(j,1); content.promo = content.promoBoxes[0]; markChanged(); renderPromoEditor();
  });
  qsa('[data-add-promo-chip]').forEach(btn=>btn.onclick=()=>{
    const i=Number(btn.dataset.addPromoChip); content.promoBoxes[i].chips.push('New highlight'); content.promo = content.promoBoxes[0]; markChanged(); renderPromoEditor();
  });
  qsa('[data-remove-promo]').forEach(btn=>btn.onclick=()=>{
    if(content.promoBoxes.length <= 1){showStatus('Keep at least one promo box.', 'error'); return;}
    content.promoBoxes.splice(Number(btn.dataset.removePromo),1); content.promo = content.promoBoxes[0]; markChanged(); renderPromoEditor();
  });
  $('addPromoBox').onclick=()=>{
    content.promoBoxes.push({headline:'New Promo',subheadline:'Special Offer',fromPrice:'$110',unit:'/FT',note:'Add your promo details here.',chips:['New highlight']});
    content.promo = content.promoBoxes[0]; markChanged(); renderPromoEditor();
  };
  bindDragSort('[data-promo-index]', content.promoBoxes, ()=>{content.promo = content.promoBoxes[0]; renderPromoEditor();}, 'promoIndex');
}

function renderNavEditor(){
  $('editorFields').innerHTML = `<div class="hint">Drag to reorder. Use Button Style for the Get Quote button.</div>` +
    (content.navigation||[]).map((item,i)=>`<div class="repeat-card" draggable="true" data-nav-index="${i}">
      <div class="drag-handle">☰ Drag menu item</div>
      <div class="field"><label>Label</label><input data-nav-field="label" data-index="${i}" value="${esc(item.label)}"></div>
      <div class="field"><label>Link</label><input data-nav-field="url" data-index="${i}" value="${esc(item.url)}"></div>
      <div class="row-actions"><label><input type="checkbox" data-nav-field="enabled" data-index="${i}" ${item.enabled!==false?'checked':''}> Show</label><label><input type="checkbox" data-nav-field="button" data-index="${i}" ${item.button?'checked':''}> Button style</label></div>
      <div class="row-actions"><button class="danger" type="button" data-remove-nav="${i}">Remove</button></div>
    </div>`).join('') + `<button id="addNav" type="button">+ Add nav item</button>`;
  qsa('[data-nav-field]').forEach(el=>el.addEventListener('input',e=>{const i=Number(e.target.dataset.index); const key=e.target.dataset.navField; content.navigation[i][key] = e.target.type==='checkbox'?e.target.checked:e.target.value; markChanged();}));
  qsa('[data-remove-nav]').forEach(btn=>btn.onclick=()=>{content.navigation.splice(Number(btn.dataset.removeNav),1); markChanged(); renderNavEditor();});
  $('addNav').onclick=()=>{content.navigation.push({label:'New Page',url:'#',enabled:true}); markChanged(); renderNavEditor();};
  bindDragSort('[data-nav-index]', content.navigation, renderNavEditor, 'navIndex');
}

function renderProofEditor(){
  $('editorFields').innerHTML = (content.proof||[]).map((item,i)=>`<div class="repeat-card" draggable="true" data-proof-index="${i}">
    <div class="drag-handle">☰ Drag proof point</div>
    <div class="field"><label>Title</label><input data-proof-field="title" data-index="${i}" value="${esc(item.title)}"></div>
    <div class="field"><label>Text</label><textarea data-proof-field="text" data-index="${i}">${esc(item.text)}</textarea></div>
    <button class="danger" type="button" data-remove-proof="${i}">Remove</button>
  </div>`).join('') + `<button id="addProof" type="button">+ Add proof point</button>`;
  qsa('[data-proof-field]').forEach(el=>el.addEventListener('input',e=>{const i=Number(e.target.dataset.index); content.proof[i][e.target.dataset.proofField]=e.target.value; markChanged();}));
  qsa('[data-remove-proof]').forEach(btn=>btn.onclick=()=>{content.proof.splice(Number(btn.dataset.removeProof),1); markChanged(); renderProofEditor();});
  $('addProof').onclick=()=>{content.proof.push({title:'New proof',text:'Short explanation'}); markChanged(); renderProofEditor();};
  bindDragSort('[data-proof-index]', content.proof, renderProofEditor, 'proofIndex');
}

function renderCalculatorEditor(){
  normalizeContent();

  if(!Array.isArray(content.calculator.categories)){
    content.calculator.categories = [
      {label:'HDB', value:'hdb', items: content.calculator.carpentryTypes || []},
      {label:'Condo', value:'condo', items: []}
    ];
  }

  $('editorFields').innerHTML =
    `<div class="hint">Create different calculator categories such as HDB and Condo. Each category can have its own pricing options.</div>` +
    content.calculator.categories.map((cat,ci)=>`
      <div class="repeat-card" draggable="true" data-cat-index="${ci}">
        <div class="drag-handle">☰ Drag category ${ci+1}</div>
        <div class="field"><label>Category name</label><input data-cat-field="label" data-cat="${ci}" value="${esc(cat.label)}"></div>
        <div class="field"><label>Category value</label><input data-cat-field="value" data-cat="${ci}" value="${esc(cat.value || cat.label.toLowerCase())}"></div>
        <div class="hint">Pricing options under ${esc(cat.label)}</div>
        ${(cat.items || []).map((item,ii)=>`
          <div class="mini-row calc-option-row">
            <input data-cat-item-field="label" data-cat="${ci}" data-item="${ii}" value="${esc(item.label)}" placeholder="Option label">
            <input type="number" data-cat-item-field="value" data-cat="${ci}" data-item="${ii}" value="${esc(item.value)}" placeholder="Price">
            <button class="danger" type="button" data-remove-cat-item="${ci}:${ii}">Remove</button>
          </div>
        `).join('')}
        <div class="row-actions">
          <button type="button" data-add-cat-item="${ci}">+ Add option</button>
          <button class="danger" type="button" data-remove-cat="${ci}">Remove category</button>
        </div>
      </div>
    `).join('') +
    `<button id="addCalcCategory" type="button">+ Add category</button>`;

  qsa('[data-cat-field]').forEach(el=>el.addEventListener('input',e=>{
    const ci = Number(e.target.dataset.cat);
    content.calculator.categories[ci][e.target.dataset.catField] = e.target.value;
    syncOldCalculatorArrays();
    markChanged();
  }));

  qsa('[data-cat-item-field]').forEach(el=>el.addEventListener('input',e=>{
    const ci = Number(e.target.dataset.cat);
    const ii = Number(e.target.dataset.item);
    const key = e.target.dataset.catItemField;
    content.calculator.categories[ci].items[ii][key] = key === 'value' ? Number(e.target.value) : e.target.value;
    syncOldCalculatorArrays();
    markChanged();
  }));

  qsa('[data-add-cat-item]').forEach(btn=>btn.onclick=()=>{
    const ci = Number(btn.dataset.addCatItem);
    content.calculator.categories[ci].items = content.calculator.categories[ci].items || [];
    content.calculator.categories[ci].items.push({label:'New option from $100/ft run', value:100});
    syncOldCalculatorArrays();
    markChanged();
    renderCalculatorEditor();
  });

  qsa('[data-remove-cat-item]').forEach(btn=>btn.onclick=()=>{
    const [ci,ii] = btn.dataset.removeCatItem.split(':').map(Number);
    content.calculator.categories[ci].items.splice(ii,1);
    syncOldCalculatorArrays();
    markChanged();
    renderCalculatorEditor();
  });

  qsa('[data-remove-cat]').forEach(btn=>btn.onclick=()=>{
    if(content.calculator.categories.length <= 1){
      showStatus('Keep at least one calculator category.', 'error');
      return;
    }
    content.calculator.categories.splice(Number(btn.dataset.removeCat),1);
    syncOldCalculatorArrays();
    markChanged();
    renderCalculatorEditor();
  });

  $('addCalcCategory').onclick=()=>{
    content.calculator.categories.push({label:'New Category', value:'new', items:[{label:'New option from $100/ft run', value:100}]});
    syncOldCalculatorArrays();
    markChanged();
    renderCalculatorEditor();
  };

  bindDragSort('[data-cat-index]', content.calculator.categories, ()=>{
    syncOldCalculatorArrays();
    renderCalculatorEditor();
  }, 'catIndex');
}

function syncOldCalculatorArrays(){
  const first = (content.calculator.categories && content.calculator.categories[0]) ? content.calculator.categories[0].items || [] : [];
  content.calculator.carpentryTypes = first;
  content.calculator.mobileTypes = first;
}

function renderFaqEditor(){
  normalizeContent();

  $('editorFields').innerHTML =
    `<div class="hint">Add, remove and edit FAQ items. These can explain materials, plywood thickness, melamine board, PVC board and quotation questions.</div>` +
    (content.faq || []).map((item,i)=>`
      <div class="repeat-card" draggable="true" data-faq-index="${i}">
        <div class="drag-handle">☰ Drag FAQ ${i+1}</div>
        <div class="field"><label>Question</label><input data-faq-field="question" data-index="${i}" value="${esc(item.question)}"></div>
        <div class="field"><label>Answer</label><textarea data-faq-field="answer" data-index="${i}">${esc(item.answer)}</textarea></div>
        <button class="danger" type="button" data-remove-faq="${i}">Remove FAQ</button>
      </div>
    `).join('') +
    `<button id="addFaq" type="button">+ Add FAQ</button>`;

  qsa('[data-faq-field]').forEach(el=>el.addEventListener('input',e=>{
    const i = Number(e.target.dataset.index);
    content.faq[i][e.target.dataset.faqField] = e.target.value;
    markChanged();
  }));

  qsa('[data-remove-faq]').forEach(btn=>btn.onclick=()=>{
    content.faq.splice(Number(btn.dataset.removeFaq),1);
    markChanged();
    renderFaqEditor();
  });

  $('addFaq').onclick=()=>{
    content.faq.push({
      question:'New FAQ question',
      answer:'Write the answer here.'
    });
    markChanged();
    renderFaqEditor();
  };

  bindDragSort('[data-faq-index]', content.faq, renderFaqEditor, 'faqIndex');
}

function renderPriceList(list,type){return (list||[]).map((item,i)=>`<div class="repeat-card" draggable="true" data-${type}-calc-index="${i}"><div class="drag-handle">☰ Drag option</div><div class="field"><label>Label</label><input data-price-list="${type}" data-price-field="label" data-index="${i}" value="${esc(item.label)}"></div><div class="field"><label>Price / ft</label><input type="number" data-price-list="${type}" data-price-field="value" data-index="${i}" value="${esc(item.value)}"></div><button class="danger" type="button" data-remove-price="${type}:${i}">Remove</button></div>`).join('');}
function bindPriceList(type,list,rerender){
  qsa(`[data-price-list="${type}"]`).forEach(el=>el.addEventListener('input',e=>{const i=Number(e.target.dataset.index); const key=e.target.dataset.priceField; list[i][key] = key==='value'?Number(e.target.value):e.target.value; markChanged();}));
  qsa(`[data-remove-price^="${type}:"]`).forEach(btn=>btn.onclick=()=>{list.splice(Number(btn.dataset.removePrice.split(':')[1]),1); markChanged(); rerender();});
  bindDragSort(`[data-${type}-calc-index]`, list, rerender, `${type}CalcIndex`);
}

function renderImagesEditor(){
  $('editorFields').innerHTML = `<div class="hint">Drop a photo onto any image card. Then click Publish to GitHub. The image will replace the selected file path.</div>` +
    (content.images||[]).map((img,i)=>`<div class="image-card">
      <div class="thumb-drop" data-image-index="${i}" style="background-image:url('../${esc(img.path)}?v=${Date.now()}')">Drop photo here</div>
      <div class="field"><label>Image name</label><input data-img-field="label" data-index="${i}" value="${esc(img.label)}"></div>
      <div class="field"><label>File path</label><input data-img-field="path" data-index="${i}" value="${esc(img.path)}"><small>Example: assets/hero-kitchen-grey.png</small></div>
      <div class="field"><label>Alt text for SEO / AI</label><input data-img-field="alt" data-index="${i}" value="${esc(img.alt)}"></div>
      <button class="danger" type="button" data-remove-image="${i}">Remove slot</button>
    </div>`).join('') + `<button id="addImage" type="button">+ Add image slot</button>`;
  qsa('[data-img-field]').forEach(el=>el.addEventListener('input',e=>{const i=Number(e.target.dataset.index); content.images[i][e.target.dataset.imgField]=e.target.value; markChanged();}));
  qsa('[data-remove-image]').forEach(btn=>btn.onclick=()=>{content.images.splice(Number(btn.dataset.removeImage),1); markChanged(); renderImagesEditor();});
  $('addImage').onclick=()=>{content.images.push({label:'New Image',path:'assets/new-image.png',alt:'Describe this image'}); markChanged(); renderImagesEditor();};
  qsa('.thumb-drop').forEach(bindDropTarget);
}

function bindDropTarget(zone){
  zone.addEventListener('dragover', e=>{e.preventDefault(); zone.classList.add('over','dragover');});
  zone.addEventListener('dragleave', ()=>zone.classList.remove('over','dragover'));
  zone.addEventListener('drop', async e=>{
    e.preventDefault(); zone.classList.remove('over','dragover');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if(!file || !file.type.startsWith('image/')){showStatus('Please drop an image file.', 'error'); return;}
    const index = Number(zone.dataset.imageIndex);
    const dataUrl = await fileToDataUrl(file);
    pendingImages = pendingImages.filter(x => x.index !== index);
    pendingImages.push({index, dataUrl, fileName:file.name});
    zone.style.backgroundImage = `url('${dataUrl}')`;
    showStatus(`Photo ready: ${file.name}. Click Publish to GitHub to update it.`, 'success');
    markChanged();
  });
}

function renderMobileEditor(){
  const labels = { 'm-home':'Home', 'm-services':'Services', 'm-why':'Why Us', 'm-works':'Works', 'm-calc':'Calculator', 'm-faq':'FAQ', 'm-contact':'Contact' };
  $('editorFields').innerHTML = `<div class="hint">This controls the order of mobile one-page sections. Publish after reordering.</div>` +
    content.mobileSectionOrder.map((id,i)=>`<div class="repeat-card" draggable="true" data-mobile-index="${i}"><div class="drag-handle">☰ Drag section</div><b>${esc(labels[id] || id)}</b><br><small>${esc(id)}</small></div>`).join('') +
    `<button id="resetMobile" type="button">Reset mobile order</button>`;
  $('resetMobile').onclick=()=>{content.mobileSectionOrder = defaultContent().mobileSectionOrder; markChanged(); renderMobileEditor();};
  bindDragSort('[data-mobile-index]', content.mobileSectionOrder, renderMobileEditor, 'mobileIndex');
}

function renderSeoEditor(){
  $('editorFields').innerHTML = `
    ${inputField('site.defaultMetaDescription','Default meta description','textarea')}
    ${inputField('ai.summary','AI summary','textarea')}
    <div class="field"><label>AI keywords, one per line</label><textarea id="keywordBox">${esc((content.ai.keywords||[]).join('\n'))}</textarea></div>
    ${inputField('site.address','Address','textarea')}`;
  bindPathInputs();
  $('keywordBox').addEventListener('input', e=>{content.ai.keywords = e.target.value.split('\n').map(x=>x.trim()).filter(Boolean); markChanged();});
}

function renderGithubEditor(){
  const s = getGithubSettings();
  $('editorFields').innerHTML = `<div class="hint"><b>Important:</b> The token is stored only in this browser. Use a fine-grained GitHub token with Repository Contents: Read and Write.</div>
    <div class="field"><label>GitHub owner / username</label><input id="ghOwner" value="${esc(s.owner)}" placeholder="stnlysee"></div>
    <div class="field"><label>Repository name</label><input id="ghRepo" value="${esc(s.repo)}" placeholder="siongdesign"></div>
    <div class="field"><label>Branch</label><input id="ghBranch" value="${esc(s.branch || 'main')}"></div>
    <div class="field"><label>GitHub token</label><input id="ghToken" type="password" value="${esc(s.token)}" placeholder="github_pat_..."></div>
    <div class="repeat-card"><label><input id="autoSaveToggle" type="checkbox" ${s.autoSave?'checked':''}> Auto publish about 3.5 seconds after every edit</label><small>This creates many GitHub commits. Recommended only after testing.</small></div>
    <div class="row-actions"><button id="saveSettings" class="primary" type="button">Save Settings</button><button id="testSettings" type="button">Test Connection</button><button id="reloadLatest" type="button">Reload Latest Content</button><button id="clearSettings" class="danger" type="button">Clear Token</button></div>`;
  $('saveSettings').onclick=()=>{saveSettingsFromForm(); showStatus('GitHub settings saved in this browser.', 'success');};
  $('testSettings').onclick=async()=>{saveSettingsFromForm(); await testGithubConnection();};
  $('reloadLatest').onclick=async()=>{saveSettingsFromForm(); await reloadLatestContentFromGithub();};
  $('clearSettings').onclick=()=>{localStorage.removeItem('siongGithubSettings'); showStatus('Saved token cleared.', 'success'); renderGithubEditor();};
}

function renderPagesEditor(){
  normalizeContent();

  const pageKeys = ['services','why','works','calculator','faq','contact'];

  $('editorFields').innerHTML =
    `<div class="hint">Edit page headings and page cards. Choose the page from the live preview toolbar to view it.</div>` +
    pageKeys.map(key=>{
      const page = content.pages[key] || {title:key, lead:'', cards:[]};
      const cards = page.cards || [];
      return `<div class="repeat-card">
        <h3>${esc(key.toUpperCase())}</h3>
        <div class="field"><label>Page title</label><input data-page-field="title" data-page="${key}" value="${esc(page.title || '')}"></div>
        <div class="field"><label>Page description</label><textarea data-page-field="lead" data-page="${key}">${esc(page.lead || '')}</textarea></div>
        ${cards.map((card,i)=>`
          <div class="mini-card">
            <div class="field"><label>Card title</label><input data-page-card-field="title" data-page="${key}" data-card="${i}" value="${esc(card.title || '')}"></div>
            <div class="field"><label>Card text</label><textarea data-page-card-field="text" data-page="${key}" data-card="${i}">${esc(card.text || '')}</textarea></div>
            <button class="danger" type="button" data-remove-page-card="${key}:${i}">Remove card</button>
          </div>
        `).join('')}
        <button type="button" data-add-page-card="${key}">+ Add card</button>
      </div>`;
    }).join('');

  qsa('[data-page-field]').forEach(el=>el.addEventListener('input',e=>{
    const key = e.target.dataset.page;
    content.pages[key] = content.pages[key] || {};
    content.pages[key][e.target.dataset.pageField] = e.target.value;
    markChanged();
  }));

  qsa('[data-page-card-field]').forEach(el=>el.addEventListener('input',e=>{
    const key = e.target.dataset.page;
    const i = Number(e.target.dataset.card);
    content.pages[key].cards = content.pages[key].cards || [];
    content.pages[key].cards[i][e.target.dataset.pageCardField] = e.target.value;
    markChanged();
  }));

  qsa('[data-add-page-card]').forEach(btn=>btn.onclick=()=>{
    const key = btn.dataset.addPageCard;
    content.pages[key] = content.pages[key] || {};
    content.pages[key].cards = content.pages[key].cards || [];
    content.pages[key].cards.push({title:'New card', text:'Write card description here.'});
    markChanged();
    renderPagesEditor();
  });

  qsa('[data-remove-page-card]').forEach(btn=>btn.onclick=()=>{
    const [key,i] = btn.dataset.removePageCard.split(':');
    content.pages[key].cards.splice(Number(i),1);
    markChanged();
    renderPagesEditor();
  });
}

function renderJsonEditor(){
  $('editorFields').innerHTML = `<div class="hint">Be careful: invalid JSON will not save correctly.</div><textarea id="jsonArea" class="json-area">${esc(JSON.stringify(content,null,2))}</textarea>`;
  $('jsonArea').addEventListener('input', e=>{
    try{ content = JSON.parse(e.target.value); normalizeContent(); markChanged(); }
    catch(err){ $('saveState').textContent = 'JSON error'; }
  });
}

function bindDragSort(selector, arr, rerender, datasetKey){
  let from = null;
  qsa(selector, $('editorFields')).forEach(card=>{
    card.addEventListener('dragstart',()=>{ from = Number(card.dataset[datasetKey]); card.classList.add('dragging'); });
    card.addEventListener('dragend',()=>card.classList.remove('dragging'));
    card.addEventListener('dragover', e=>e.preventDefault());
    card.addEventListener('drop', e=>{
      e.preventDefault();
      const to = Number(card.dataset[datasetKey]);
      if(Number.isNaN(from) || Number.isNaN(to) || from === to) return;
      const [item] = arr.splice(from,1);
      arr.splice(to,0,item);
      from = null;
      markChanged();
      rerender();
    });
  });
}

function fileToDataUrl(file){return new Promise((resolve,reject)=>{const r = new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(file);});}
function dataUrlToBase64(dataUrl){return dataUrl.split(',')[1];}

function getGithubSettings(){
  try{return JSON.parse(localStorage.getItem('siongGithubSettings')) || {owner:'',repo:'',branch:'main',token:'',autoSave:false};}
  catch{return {owner:'',repo:'',branch:'main',token:'',autoSave:false};}
}
function saveSettingsFromForm(){
  const settings = {owner:$('ghOwner').value.trim(), repo:$('ghRepo').value.trim(), branch:$('ghBranch').value.trim() || 'main', token:$('ghToken').value.trim(), autoSave:$('autoSaveToggle').checked};
  localStorage.setItem('siongGithubSettings', JSON.stringify(settings));
}
async function githubFetch(path, options={}){
  const s = getGithubSettings();
  if(!s.owner || !s.repo || !s.branch || !s.token) throw new Error('Missing GitHub settings. Open Auto Save Setup first.');
  const cleanPath = path.replace(/^\/+/, '');
  const url = `https://api.github.com/repos/${encodeURIComponent(s.owner)}/${encodeURIComponent(s.repo)}/contents/${cleanPath}`;
  const res = await fetch(url, {...options, headers:{Authorization:`Bearer ${s.token}`,Accept:'application/vnd.github+json','Content-Type':'application/json',...(options.headers||{})}});
  const body = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(body.message || `GitHub error ${res.status}`);
  return body;
}
async function testGithubConnection(){
  try{await githubFetch(`${CONTENT_PATH}?ref=${encodeURIComponent(getGithubSettings().branch)}`, {method:'GET'}); showStatus('Connection successful. Publishing is ready.', 'success');}
  catch(err){showStatus('Connection failed: ' + err.message, 'error');}
}
async function saveToGithub(){
  if(isPublishing){showStatus('Already publishing. Please wait a moment.', 'info'); return;}
  isPublishing = true;
  try{
    showStatus('Publishing content to GitHub...', 'info');
    normalizeContent();
    await putFile(CONTENT_PATH, JSON.stringify(content,null,2), 'Update website content from visual admin builder');

    // Image upload is disabled in GitHub Pages mode to avoid browser upload issues.
    pendingImages = [];

    $('saveState').textContent = 'Published to GitHub';
    showStatus('Published successfully. GitHub Pages may take 1-3 minutes to update.', 'success');
  }catch(err){console.error(err); showStatus('Publish failed: ' + err.message, 'error');}
  finally{isPublishing = false;}
}

async function reloadLatestContentFromGithub(){
  try{
    showStatus('Reloading latest content from GitHub...', 'info');
    const latest = await githubFetch(`${CONTENT_PATH}?ref=${encodeURIComponent(getGithubSettings().branch)}`, {method:'GET'});
    const jsonText = decodeURIComponent(escape(atob(latest.content.replace(/\n/g,''))));
    content = JSON.parse(jsonText);
    normalizeContent();
    pendingImages = [];
    $('saveState').textContent = 'Latest content loaded';
    renderEditor();
    renderPreview();
    showStatus('Latest content loaded from GitHub. You can edit and publish again.', 'success');
  }catch(err){showStatus('Reload failed: ' + err.message, 'error');}
}

async function putFile(path, data, message, isBase64=false){
  const s = getGithubSettings();

  if(!s.owner || !s.repo || !s.branch || !s.token){
    throw new Error('Missing GitHub settings. Open Auto Save Setup first.');
  }

  const cleanPath = path.replace(/^\/+/, '');
  const contentEncoded = isBase64 ? data : btoa(unescape(encodeURIComponent(data)));
  let lastError = null;

  for(let attempt = 1; attempt <= 5; attempt++){
    try{
      let sha = null;
      try{
        const existing = await githubFetch(`${cleanPath}?ref=${encodeURIComponent(s.branch.trim())}&t=${Date.now()}`, {method:'GET'});
        sha = existing.sha;
      }catch(err){
        if(!String(err.message).includes('Not Found')) throw err;
      }

      return await githubFetch(cleanPath, {
        method:'PUT',
        body:JSON.stringify({
          message,
          content:contentEncoded,
          branch:s.branch.trim(),
          ...(sha ? {sha} : {})
        })
      });

    }catch(err){
      lastError = err;
      const msg = String(err.message || '');
      if(!msg.includes('does not match') && !msg.includes('sha') && !msg.includes('409')) break;
      await new Promise(resolve => setTimeout(resolve, 900 * attempt));
    }
  }
  throw lastError || new Error('GitHub publish failed after retrying.');
}

function backupJson(){
  const blob = new Blob([JSON.stringify(content,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'site-content-backup.json';
  a.click();
}
function previewSite(){
  localStorage.setItem('siongPreviewContent', JSON.stringify(content));
  window.open('../index.html?preview=1', '_blank');
}

async function init(){
  $('loginBtn').addEventListener('click', async()=>{
    if($('password').value !== ADMIN_PASSWORD){ alert('Wrong password'); return; }
    await loadContent();
    $('loginScreen').classList.add('hidden');
    $('builder').classList.remove('hidden');
    renderEditor();
    renderPreview();
  });
  $('password').addEventListener('keydown', e=>{ if(e.key==='Enter') $('loginBtn').click(); });
  qsa('.block-btn').forEach(btn=>btn.addEventListener('click',()=>switchBlock(btn.dataset.block)));
  qsa('.device').forEach(btn=>btn.addEventListener('click',()=>switchDevice(btn.dataset.device)));
  $('publishBtn').addEventListener('click', saveToGithub);
  $('backupBtn').addEventListener('click', backupJson);
  $('previewSiteBtn').addEventListener('click', previewSite);
}
init();
