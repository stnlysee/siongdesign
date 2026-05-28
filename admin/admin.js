
const ADMIN_PASSWORD = 'siongadmin';
const CONTENT_PATH = 'content/site-content.json';

let content = null;
let activeBlock = 'home';
let activePage = 'home';
let activeDevice = 'desktop';
let isPublishing = false;

const $ = id => document.getElementById(id);
const qsa = (sel, root=document) => [...root.querySelectorAll(sel)];
const esc = value => String(value ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const clone = x => JSON.parse(JSON.stringify(x));

function defaultContent(){
  return {
    site:{
      businessName:'Siong Design',
      tagline:'Premium Carpentry • Factory Price',
      adminPassword:'siongadmin',
      whatsappNumber:'6584514057',
      whatsappButtonText:'WhatsApp Us',
      whatsappDefaultMessage:'Hi Siong Design, I would like to request a quotation.',
      showWhatsappFloat:true,
      facebookUrl:'https://www.facebook.com/profile.php?id=61575290054499',
      facebookButtonText:'Facebook: Siong Design',
      showFacebookButton:true,
      defaultMetaDescription:'',
      address:''
    },
    navigation:[
      {label:'Home',url:'index.html',enabled:true},
      {label:'Services',url:'services.html',enabled:true},
      {label:'Why Us',url:'why-us.html',enabled:true},
      {label:'Works',url:'works.html',enabled:true},
      {label:'Calculator',url:'calculator.html',enabled:true},
      {label:'FAQ',url:'faq.html',enabled:true},
      {label:'Get Quote',url:'contact.html',enabled:true,button:true}
    ],
    home:{
      heroTag:'HDB • Condo • Landed • Commercial',
      heroTitle:'Premium carpentry at direct factory value.',
      heroLead:'Siong Design builds kitchen cabinets, wardrobes, TV feature walls and custom carpentry for Singapore homes and businesses.',
      primaryButtonText:'Calculate My Cost',
      primaryButtonUrl:'calculator.html',
      secondaryButtonText:'WhatsApp 8451 4057',
      secondaryButtonUrl:'https://wa.me/6584514057',
      thirdButtonText:'View Works',
      thirdButtonUrl:'works.html'
    },
    promo:{
      headline:'Kitchen & Wardrobe Promo',
      subheadline:'Direct Factory Value',
      fromPrice:'$110',
      unit:'/FT',
      note:'Kitchen top and bottom cabinets are calculated separately. Wardrobe promo starts from $220/ft. Terms and conditions apply.',
      chips:['E0 wood','Internal & external laminate','ABS trimming','Soft-close options']
    },
    promoBoxes:[],
    proof:[
      {title:'From $110/ft',text:'Kitchen top/bottom promo, counted separately'},
      {title:'Wardrobe $220/ft',text:'Selected casement wardrobe promo'},
      {title:'Free Measurement',text:'Quotation before confirmation'}
    ],
    calculator:{
      categories:[
        {label:'HDB',value:'hdb',items:[
          {label:'HDB Kitchen Cabinet - Top Unit Promo from $110/ft run',value:110},
          {label:'HDB Kitchen Cabinet - Bottom Unit Promo from $110/ft run',value:110},
          {label:'HDB Casement Wardrobe Promo from $220/ft run',value:220},
          {label:'HDB Kitchen Cabinet - Top Unit Standard from $180/ft run',value:180},
          {label:'HDB Kitchen Cabinet - Bottom Unit Standard from $220/ft run',value:220},
          {label:'HDB TV Feature Wall from $280/ft run',value:280},
          {label:'HDB Commercial Display from $300/ft run',value:300}
        ]},
        {label:'Condo',value:'condo',items:[
          {label:'Condo Kitchen Cabinet - Top Unit from $130/ft run',value:130},
          {label:'Condo Kitchen Cabinet - Bottom Unit from $130/ft run',value:130},
          {label:'Condo Casement Wardrobe from $240/ft run',value:240},
          {label:'Condo Kitchen Cabinet - Top Unit Premium from $200/ft run',value:200},
          {label:'Condo Kitchen Cabinet - Bottom Unit Premium from $240/ft run',value:240},
          {label:'Condo TV Feature Wall from $300/ft run',value:300},
          {label:'Condo Commercial Display from $320/ft run',value:320}
        ]}
      ],
      carpentryTypes:[],
      mobileTypes:[],
      sinteredStoneOptions:[
        {label:'Not Required',value:0},
        {label:'Width ≤ 700mm +$100/ft run',value:100},
        {label:'Width 701-900mm +$150/ft run',value:150},
        {label:'Width 901-1200mm +$180/ft run',value:180}
      ],
      heightOptions:[
        {label:'Standard',value:1},
        {label:'Tall / More Compartments +15%',value:1.15},
        {label:'Complex Design +30%',value:1.3}
      ],
      materialOptions:[
        {label:'Standard Laminate',value:1},
        {label:'Premium Laminate +18%',value:1.18},
        {label:'Eco Friendly Low Formaldehyde +28%',value:1.28},
        {label:'High-End Special Finish +35%',value:1.35}
      ],
      internalOptions:[
        {label:'Premium: Laminate Both Sides +12%',value:1.12},
        {label:'Basic Internal Finish',value:1}
      ],
      accessoryOptions:[
        {label:'Standard Hinges Included',value:0},
        {label:'Soft-Closing / Drawer Set +$350',value:350},
        {label:'Sliding / Special Mechanism +$800',value:800}
      ],
      installationOptions:[
        {label:'Standard Installation +$350',value:350},
        {label:'Large / Complex Installation +$650',value:650},
        {label:'Exclude Installation',value:0}
      ]
    },
    faq:[
      {
            "question": "How do I get an accurate quotation?",
            "answer": "Send your floor plan, area photos, rough measurements and preferred design. Siong Design can advise an estimated range before site measurement."
      },
      {
            "question": "Is the calculator price final?",
            "answer": "No. It is for budgeting only. Final price depends on measurement, material, accessories, layout complexity and installation condition."
      },
      {
            "question": "How is kitchen cabinet pricing calculated?",
            "answer": "Kitchen top cabinet and bottom cabinet are treated as separate items. For example, 10 ft top + 10 ft bottom means two separate 10 ft runs."
      },
      {
            "question": "What does per foot run mean?",
            "answer": "Foot run usually refers to the horizontal length of the cabinet or wardrobe. Height, depth and internal layout may affect final price."
      },
      {
            "question": "Do you provide free measurement?",
            "answer": "Yes, for suitable enquiries. Customers can WhatsApp photos and requirements first before arranging measurement."
      },
      {
            "question": "What materials can I choose?",
            "answer": "Options may include standard laminate, premium laminate, low formaldehyde board and special finishes."
      },
      {
            "question": "What is included in the wardrobe promo?",
            "answer": "The wardrobe promo is for selected casement wardrobe works from $220/ft. Terms and conditions apply."
      },
      {
            "question": "How long does fabrication take?",
            "answer": "Timeline depends on project size, material availability and site readiness. A schedule is advised after confirmation."
      },
      {
            "question": "Can I customise the layout?",
            "answer": "Yes. Shelves, drawers, hanging areas, display sections and LED lighting can be discussed."
      },
      {
            "question": "Do you handle commercial carpentry?",
            "answer": "Yes. Siong Design supports office, retail, pantry, showroom, gallery and exhibition carpentry works."
      },
      {
            "question": "Are BLUM parts included in the estimate?",
            "answer": "BLUM parts are charged separately unless stated in the quotation. Pricing follows BLUM’s Recommended Retail Price from connect.blum.com, plus GST, plus an additional 5% handling and coordination charge."
      },
      {
            "question": "What board and finishing standard do you use?",
            "answer": "Our boards come with edge binding, internal and external laminate, E0 formaldehyde-free wood, ABS trimming doors, soft-close drawer options and soft-close hinges based on the confirmed package."
      },
      {
            "question": "Are kitchen top and bottom cabinets counted together?",
            "answer": "No. Top cabinet and bottom cabinet are treated as separate carpentry items and are calculated separately by foot run."
      },
      {
            "question": "Why do we use melamine board instead of cheap PVC board?",
            "answer": "For most dry interior carpentry, melamine board gives a more solid, premium and cabinet-like finish compared with cheap PVC board. It usually has better screw holding, a wider choice of colours and textures, and feels more suitable for wardrobes, kitchen cabinets, TV consoles and storage cabinets. PVC board can still be useful in wet areas, but cheap PVC boards may feel more hollow, flex more easily and may not look as refined."
      },
      {
            "question": "What type of plywood do we use?",
            "answer": "We use different plywood thicknesses depending on the cabinet part and purpose. For backing panels, we use 6mm plywood because it keeps the cabinet neat and lightweight while providing proper rear support. For internal shelving, we use 9mm solid plywood because shelves need better strength and stability to hold daily items."
      },
      {
            "question": "Why do we use 6mm plywood for backing?",
            "answer": "6mm plywood is suitable for cabinet backing because it keeps the cabinet neat and lightweight while still giving the rear panel proper support. It is commonly used for back panels because this area does not carry the same load as shelves."
      },
      {
            "question": "Why do we use 9mm solid plywood for internal shelving?",
            "answer": "Internal shelves need to hold daily items, so 9mm solid plywood gives better strength and stability compared with thinner backing material. It helps the shelf feel more solid and reduces flexing during normal use."
      }
],
    pages:{
      services:{title:'Services organised by what customers need.',lead:'Simple categories make the website easier to scan and help customers quickly choose what to enquire about.',cards:[
        {title:'Kitchen Cabinets',text:'Top and bottom cabinets, tall units, drawers, sink and hob planning.'},
        {title:'Wardrobes',text:'Casement wardrobes, full-height wardrobes, shelves, drawers and LED displays.'},
        {title:'TV Feature Walls',text:'TV consoles, hidden storage, feature walls and cable management.'},
        {title:'Commercial Works',text:'Office, retail, pantry, gallery, showroom and exhibition carpentry.'}
      ]},
      why:{title:'Cleaner, safer and more transparent carpentry.',lead:'Siong Design is positioned as a factory-direct carpenter with proper finishing, low formaldehyde material options and a customer-friendly quotation process.',cards:[
        {title:'Direct factory pricing',text:'Clear promo pricing and per-foot estimates help customers understand budget before meeting.'},
        {title:'E0 formaldehyde-free wood',text:'Suitable for families who care about indoor comfort and cleaner material choices.'},
        {title:'Internal & external laminate',text:'Boards come with laminate finishing inside and outside, plus ABS trimming doors.'},
        {title:'Tailored to your space',text:'Built according to site measurements, storage needs, preferred colours and layout.'}
      ]},
      works:{title:'Completed works and project references.',lead:'Use this page to showcase kitchen, wardrobe, TV console and commercial project photos.',cards:[
        {title:'Kitchen works',text:'Modern kitchen cabinets and storage solutions.'},
        {title:'Wardrobe works',text:'Casement and full-height wardrobe designs.'},
        {title:'Feature walls',text:'TV feature walls, consoles and hidden storage.'}
      ]},
      calculator:{title:'Instant carpentry cost calculator.',lead:'Choose HDB or Condo pricing category, then estimate by foot run and item type.'},
      faq:{title:'Frequently asked questions.',lead:'Common material, quotation and installation questions customers usually ask.'},
      contact:{title:'Get a quote from Siong Design.',lead:'Send photos, floor plan, rough measurements and preferred design for a clearer estimate.'}
    },
    images:[
      {label:'Hero Kitchen', path:'assets/hero-kitchen-grey.png', alt:'Siong Design kitchen cabinet and sintered stone interior'},
      {label:'Hero Wardrobe', path:'assets/hero-wardrobe-promo.png', alt:'Siong Design wardrobe promotion'}
    ],
    ai:{summary:'Siong Design is a Singapore carpentry company.',keywords:['Singapore carpentry','Kitchen cabinet Singapore']},
    mobileSectionOrder:['m-home','m-services','m-why','m-works','m-calc','m-faq','m-contact']
  };
}

async function loadContent(){
  try{
    const res = await fetch('../' + CONTENT_PATH + '?v=' + Date.now());
    if(!res.ok) throw new Error('Content file not found');
    content = await res.json();
  }catch(e){
    content = defaultContent();
  }
  normalizeContent();
}

function normalizeContent(){
  const base = defaultContent();
  content.site = {...base.site, ...(content.site || {})};
  content.navigation = Array.isArray(content.navigation) && content.navigation.length ? content.navigation : base.navigation;
  content.home = {...base.home, ...(content.home || {})};
  content.promo = {...base.promo, ...(content.promo || {})};
  content.promoBoxes = Array.isArray(content.promoBoxes) && content.promoBoxes.length ? content.promoBoxes : [content.promo];
  content.proof = Array.isArray(content.proof) && content.proof.length ? content.proof : base.proof;
  content.calculator = {...base.calculator, ...(content.calculator || {})};
  content.calculator.categories = Array.isArray(content.calculator.categories) && content.calculator.categories.length ? content.calculator.categories : base.calculator.categories;
  ['sinteredStoneOptions','heightOptions','materialOptions','internalOptions','accessoryOptions','installationOptions'].forEach(k=>{
    content.calculator[k] = Array.isArray(content.calculator[k]) ? content.calculator[k] : base.calculator[k];
  });
  content.calculator.carpentryTypes = content.calculator.categories[0]?.items || [];
  content.calculator.mobileTypes = content.calculator.carpentryTypes;
  content.faq = Array.isArray(content.faq) && content.faq.length ? content.faq : base.faq;
  content.pages = {...base.pages, ...(content.pages || {})};
  ['services','why','works'].forEach(k=>{
    content.pages[k] = {...base.pages[k], ...(content.pages[k] || {})};
    content.pages[k].cards = Array.isArray(content.pages[k].cards) ? content.pages[k].cards : base.pages[k].cards;
  });
  ['calculator','faq','contact'].forEach(k=> content.pages[k] = {...base.pages[k], ...(content.pages[k] || {})});
  content.images = Array.isArray(content.images) && content.images.length ? content.images : base.images;
  content.ai = {...base.ai, ...(content.ai || {})};
  content.mobileSectionOrder = Array.isArray(content.mobileSectionOrder) ? content.mobileSectionOrder : base.mobileSectionOrder;
}

function get(path){ return path.split('.').reduce((o,k)=>o && o[k], content); }
function set(path,value){
  const parts = path.split('.');
  let obj = content;
  while(parts.length > 1){ const k = parts.shift(); obj[k] = obj[k] || {}; obj = obj[k]; }
  obj[parts[0]] = value;
  markChanged();
}
function markChanged(){ $('saveState').textContent = 'Unsaved changes'; renderPreview(); }
function showStatus(msg,type='info'){ const box=$('status'); box.textContent=msg; box.className='status '+type; box.classList.remove('hidden'); }
function hideStatus(){ $('status').classList.add('hidden'); }

function switchBlock(block){
  activeBlock = block;
  const map = {faq:'faq', calculator:'calculator', pages: activePage};
  if(map[block]){
    activePage = map[block];
    qsa('.page-btn').forEach(b=>b.classList.toggle('active', b.dataset.page === activePage));
  }
  qsa('.block-btn').forEach(b=>b.classList.toggle('active', b.dataset.block === block));
  renderEditor();
  renderPreview();
}
function switchPage(page){
  activePage = page;
  qsa('.page-btn').forEach(b=>b.classList.toggle('active', b.dataset.page === page));
  renderPreview();
}
function switchDevice(device){
  activeDevice = device;
  qsa('.device').forEach(b=>b.classList.toggle('active', b.dataset.device === device));
  renderPreview();
}

function previewNav(){
  return content.navigation.filter(n=>n.enabled!==false).map(n=>`<a class="${n.button?'cta':''}" href="#">${esc(n.label)}</a>`).join('');
}
function shell(inner){
  return `<div class="preview-shell ${activeDevice}">
    <div class="preview-nav" data-block="nav">
      <div class="preview-brand"><div class="preview-logo">SD</div><div>${esc(content.site.businessName)}<br><small>${esc(content.site.tagline)}</small></div></div>
      <div class="preview-links">${previewNav()}</div>
    </div>${inner}</div>`;
}
function renderPreview(){
  if(activePage === 'home') return renderHomePreview();
  return renderPagePreview(activePage);
}
function renderHomePreview(){
  const boxes = content.promoBoxes || [content.promo];
  const promo = boxes.map(b=>`<div class="preview-promo"><h2>${esc(b.headline)}</h2><div class="red">${esc(b.subheadline)}</div><div class="preview-price"><small>FROM </small><strong>${esc(b.fromPrice)}</strong><span>${esc(b.unit)}</span></div><p>${esc(b.note)}</p><div class="chips">${(b.chips||[]).map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div></div>`).join('');
  const proof = content.proof.map(p=>`<div class="proof-card"><b>${esc(p.title)}</b><span>${esc(p.text)}</span></div>`).join('');
  $('visualPreview').innerHTML = shell(`<section class="preview-hero"><div><span class="preview-tag">${esc(content.home.heroTag)}</span><h1>${esc(content.home.heroTitle)}</h1><p>${esc(content.home.heroLead)}</p><div class="preview-actions"><a>${esc(content.home.primaryButtonText)}</a><a>${esc(content.home.secondaryButtonText)}</a><a>${esc(content.home.thirdButtonText)}</a></div></div><div class="preview-promo-stack">${promo}</div></section><div class="proof-grid">${proof}</div>`);
}
function renderPagePreview(key){
  const page = content.pages[key] || {};
  let body = '';
  if(key === 'faq'){
    body = `<section class="preview-page-section"><h1>${esc(page.title)}</h1><p>${esc(page.lead)}</p><div class="preview-faq-list">${content.faq.map(f=>`<div class="preview-faq-card"><h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p></div>`).join('')}</div></section>`;
  }else if(key === 'calculator'){
    body = `<section class="preview-page-section"><h1>${esc(page.title)}</h1><p>${esc(page.lead)}</p><div class="hint">Property Type categories below will appear on the real calculator page.</div><div class="preview-card-grid">${content.calculator.categories.map(cat=>`<div class="preview-service-card"><h3>${esc(cat.label)}</h3>${cat.items.map(i=>`<p><b>${esc(i.label)}</b><br>$${esc(i.value)} / ft</p>`).join('')}</div>`).join('')}</div></section>`;
  }else{
    const cards = page.cards || [];
    body = `<section class="preview-page-section"><h1>${esc(page.title || key)}</h1><p>${esc(page.lead || '')}</p><div class="preview-card-grid">${cards.map(c=>`<div class="preview-service-card"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div>`).join('')}</div></section>`;
  }
  $('visualPreview').innerHTML = shell(body);
}

function inputField(path,label,type='text',small=''){
  const val = get(path) ?? '';
  return `<div class="field"><label>${label}</label>${type==='textarea'?`<textarea data-path="${path}">${esc(val)}</textarea>`:`<input data-path="${path}" value="${esc(val)}">`}${small?`<small>${small}</small>`:''}</div>`;
}
function bindPathInputs(){
  qsa('[data-path]', $('editorFields')).forEach(el=>el.addEventListener('input', e=>set(e.target.dataset.path, e.target.value)));
}

function renderEditor(){
  hideStatus();
  const titles={home:'Homepage Hero',password:'Admin Password',nav:'Nav / Dropdown Bar',promo:'Promo Box',proof:'Proof Points',calculator:'Calculator Dropdowns',faq:'FAQ Editor',aiGenerator:'AI Generator',images:'Photos',mobile:'Mobile Section Order',seo:'AI & SEO',pages:'Page Content',github:'Auto Save Setup',json:'Advanced JSON'};
  const help={home:'Edit homepage content.',password:'Change the admin password.',nav:'Edit menu items.',promo:'Edit promo boxes.',proof:'Edit proof points.',calculator:'Edit the full calculator options.',faq:'Add, remove and edit FAQ questions.',aiGenerator:'Generate draft FAQ answers and page copy inside the admin.',images:'Edit image paths and alt text.',mobile:'Edit mobile section order.',seo:'Edit AI and SEO information.',pages:'Edit page headings and cards.',github:'Set up GitHub direct publish.',json:'Advanced JSON editor.'};
  $('editorTitle').textContent=titles[activeBlock]||'Editor';
  $('editorHelp').textContent=help[activeBlock]||'';
  if(activeBlock==='home') return renderHomeEditor();
  if(activeBlock==='password') return renderPasswordEditor();
  if(activeBlock==='nav') return renderNavEditor();
  if(activeBlock==='promo') return renderPromoEditor();
  if(activeBlock==='proof') return renderProofEditor();
  if(activeBlock==='calculator') return renderCalculatorEditor();
  if(activeBlock==='faq') return renderFaqEditor();
  if(activeBlock==='aiGenerator') return renderAiGeneratorEditor();
  if(activeBlock==='images') return renderImagesEditor();
  if(activeBlock==='mobile') return renderMobileEditor();
  if(activeBlock==='seo') return renderSeoEditor();
  if(activeBlock==='pages') return renderPagesEditor();
  if(activeBlock==='github') return renderGithubEditor();
  if(activeBlock==='json') return renderJsonEditor();
}
function renderHomeEditor(){
  $('editorFields').innerHTML = inputField('site.businessName','Business name')+inputField('site.tagline','Tagline')+inputField('home.heroTag','Hero tag')+inputField('home.heroTitle','Main headline','textarea')+inputField('home.heroLead','Hero description','textarea')+inputField('home.primaryButtonText','Button 1 text')+inputField('home.primaryButtonUrl','Button 1 link')+inputField('home.secondaryButtonText','Button 2 text')+inputField('home.secondaryButtonUrl','Button 2 link')+inputField('home.thirdButtonText','Button 3 text')+inputField('home.thirdButtonUrl','Button 3 link')+'<hr>'+inputField('site.whatsappNumber','WhatsApp number')+inputField('site.whatsappButtonText','WhatsApp button text')+inputField('site.whatsappDefaultMessage','Default WhatsApp message','textarea')+inputField('site.facebookUrl','Facebook URL')+inputField('site.facebookButtonText','Facebook button text');
  bindPathInputs();
}
function renderPasswordEditor(){
  $('editorFields').innerHTML = `<div class="hint"><b>Admin password</b><br>Change this password, then publish to GitHub.</div>`+inputField('site.adminPassword','Admin password','text','Do not use your GitHub token as the password.');
  bindPathInputs();
}

function renderNavEditor(){
  $('editorFields').innerHTML = `<div class="hint">Tick Show to display. Tick Button style for Get Quote.</div>` + content.navigation.map((n,i)=>`<div class="repeat-card"><div class="field"><label>Label</label><input data-nav="${i}" data-field="label" value="${esc(n.label)}"></div><div class="field"><label>Link</label><input data-nav="${i}" data-field="url" value="${esc(n.url)}"></div><label><input type="checkbox" data-nav="${i}" data-field="enabled" ${n.enabled!==false?'checked':''}> Show</label> <label><input type="checkbox" data-nav="${i}" data-field="button" ${n.button?'checked':''}> Button style</label><br><button class="danger" data-remove-nav="${i}" type="button">Remove</button></div>`).join('') + `<button id="addNav" type="button">+ Add nav item</button><button id="restoreNav" type="button">Restore full default menu</button>`;
  qsa('[data-nav]').forEach(el=>el.addEventListener('input',e=>{ const i=+e.target.dataset.nav; const f=e.target.dataset.field; content.navigation[i][f]=e.target.type==='checkbox'?e.target.checked:e.target.value; markChanged(); }));
  qsa('[data-nav][type="checkbox"]').forEach(el=>el.addEventListener('change',e=>{ const i=+e.target.dataset.nav; const f=e.target.dataset.field; content.navigation[i][f]=e.target.checked; markChanged(); }));
  qsa('[data-remove-nav]').forEach(b=>b.onclick=()=>{ content.navigation.splice(+b.dataset.removeNav,1); markChanged(); renderNavEditor(); });
  $('addNav').onclick=()=>{content.navigation.push({label:'New Page',url:'#',enabled:true}); markChanged(); renderNavEditor();};
  $('restoreNav').onclick=()=>{content.navigation=defaultContent().navigation; markChanged(); renderNavEditor();};
}
function renderPromoEditor(){
  $('editorFields').innerHTML = content.promoBoxes.map((b,i)=>`<div class="repeat-card"><h3>Promo ${i+1}</h3><div class="field"><label>Headline</label><input data-promo="${i}" data-field="headline" value="${esc(b.headline)}"></div><div class="field"><label>Subheadline</label><input data-promo="${i}" data-field="subheadline" value="${esc(b.subheadline)}"></div><div class="field"><label>Price</label><input data-promo="${i}" data-field="fromPrice" value="${esc(b.fromPrice)}"></div><div class="field"><label>Unit</label><input data-promo="${i}" data-field="unit" value="${esc(b.unit)}"></div><div class="field"><label>Note</label><textarea data-promo="${i}" data-field="note">${esc(b.note)}</textarea></div><button class="danger" data-remove-promo="${i}" type="button">Remove</button></div>`).join('')+`<button id="addPromo" type="button">+ Add promo</button>`;
  qsa('[data-promo]').forEach(el=>el.addEventListener('input',e=>{content.promoBoxes[+e.target.dataset.promo][e.target.dataset.field]=e.target.value; content.promo=content.promoBoxes[0]; markChanged();}));
  qsa('[data-remove-promo]').forEach(b=>b.onclick=()=>{ if(content.promoBoxes.length>1) content.promoBoxes.splice(+b.dataset.removePromo,1); markChanged(); renderPromoEditor();});
  $('addPromo').onclick=()=>{content.promoBoxes.push(clone(defaultContent().promo)); markChanged(); renderPromoEditor();};
}
function renderProofEditor(){
  $('editorFields').innerHTML = content.proof.map((p,i)=>`<div class="repeat-card"><div class="field"><label>Title</label><input data-proof="${i}" data-field="title" value="${esc(p.title)}"></div><div class="field"><label>Text</label><textarea data-proof="${i}" data-field="text">${esc(p.text)}</textarea></div><button class="danger" data-remove-proof="${i}" type="button">Remove</button></div>`).join('')+`<button id="addProof" type="button">+ Add proof point</button>`;
  qsa('[data-proof]').forEach(el=>el.addEventListener('input',e=>{content.proof[+e.target.dataset.proof][e.target.dataset.field]=e.target.value; markChanged();}));
  qsa('[data-remove-proof]').forEach(b=>b.onclick=()=>{content.proof.splice(+b.dataset.removeProof,1); markChanged(); renderProofEditor();});
  $('addProof').onclick=()=>{content.proof.push({title:'New proof',text:'Short explanation'}); markChanged(); renderProofEditor();};
}
function renderCalculatorEditor(){
  const groups=[['Sintered Stone Countertop','sinteredStoneOptions'],['Height / Complexity','heightOptions'],['Material Selection','materialOptions'],['Internal Finishing','internalOptions'],['Accessories','accessoryOptions'],['Installation','installationOptions']];
  let html = `<div class="hint">This controls the actual calculator page dropdowns.</div><h3>HDB / Condo Categories</h3>` + content.calculator.categories.map((cat,ci)=>`<div class="repeat-card"><div class="field"><label>Category name</label><input data-cat="${ci}" data-field="label" value="${esc(cat.label)}"></div>${cat.items.map((it,ii)=>`<div class="mini-row calc-option-row"><input data-catitem="${ci}:${ii}" data-field="label" value="${esc(it.label)}"><input type="number" data-catitem="${ci}:${ii}" data-field="value" value="${esc(it.value)}"><button class="danger" data-rem-catitem="${ci}:${ii}" type="button">Remove</button></div>`).join('')}<button data-add-catitem="${ci}" type="button">+ Add item</button></div>`).join('') + `<button id="addCat" type="button">+ Add category</button>`;
  groups.forEach(([title,key])=>{ html += `<h3>${title}</h3><div class="repeat-card">${(content.calculator[key]||[]).map((it,i)=>`<div class="mini-row calc-option-row"><input data-opt="${key}:${i}" data-field="label" value="${esc(it.label)}"><input type="number" step="0.01" data-opt="${key}:${i}" data-field="value" value="${esc(it.value)}"><button class="danger" data-rem-opt="${key}:${i}" type="button">Remove</button></div>`).join('')}<button data-add-opt="${key}" type="button">+ Add option</button></div>`; });
  $('editorFields').innerHTML = html;
  qsa('[data-cat]').forEach(el=>el.oninput=e=>{content.calculator.categories[+e.target.dataset.cat][e.target.dataset.field]=e.target.value; markChanged();});
  qsa('[data-catitem]').forEach(el=>el.oninput=e=>{const [ci,ii]=e.target.dataset.catitem.split(':').map(Number); const f=e.target.dataset.field; content.calculator.categories[ci].items[ii][f]=f==='value'?Number(e.target.value):e.target.value; syncCalc(); markChanged();});
  qsa('[data-rem-catitem]').forEach(b=>b.onclick=()=>{const [ci,ii]=b.dataset.remCatitem.split(':').map(Number); content.calculator.categories[ci].items.splice(ii,1); syncCalc(); markChanged(); renderCalculatorEditor();});
  qsa('[data-add-catitem]').forEach(b=>b.onclick=()=>{content.calculator.categories[+b.dataset.addCatitem].items.push({label:'New calculator item',value:100}); syncCalc(); markChanged(); renderCalculatorEditor();});
  $('addCat').onclick=()=>{content.calculator.categories.push({label:'New Category',value:'new',items:[{label:'New item',value:100}]}); syncCalc(); markChanged(); renderCalculatorEditor();};
  qsa('[data-opt]').forEach(el=>el.oninput=e=>{const [key,i]=e.target.dataset.opt.split(':'); const f=e.target.dataset.field; content.calculator[key][+i][f]=f==='value'?Number(e.target.value):e.target.value; markChanged();});
  qsa('[data-rem-opt]').forEach(b=>b.onclick=()=>{const [key,i]=b.dataset.remOpt.split(':'); content.calculator[key].splice(+i,1); markChanged(); renderCalculatorEditor();});
  qsa('[data-add-opt]').forEach(b=>b.onclick=()=>{content.calculator[b.dataset.addOpt].push({label:'New option',value:0}); markChanged(); renderCalculatorEditor();});
}
function syncCalc(){content.calculator.carpentryTypes=content.calculator.categories[0]?.items||[]; content.calculator.mobileTypes=content.calculator.carpentryTypes;}

function renderFaqEditor(){
  $('editorFields').innerHTML = `<div class="hint">Add, remove and edit FAQ questions. These appear on the FAQ page.</div>` + content.faq.map((f,i)=>`<div class="repeat-card"><div class="field"><label>Question</label><input data-faq="${i}" data-field="question" value="${esc(f.question)}"></div><div class="field"><label>Answer</label><textarea data-faq="${i}" data-field="answer">${esc(f.answer)}</textarea></div><button class="danger" data-remove-faq="${i}" type="button">Remove FAQ</button></div>`).join('') + `<button id="addFaq" type="button">+ Add FAQ</button>`;
  qsa('[data-faq]').forEach(el=>el.addEventListener('input',e=>{content.faq[+e.target.dataset.faq][e.target.dataset.field]=e.target.value; markChanged();}));
  qsa('[data-remove-faq]').forEach(b=>b.onclick=()=>{content.faq.splice(+b.dataset.removeFaq,1); markChanged(); renderFaqEditor();});
  $('addFaq').onclick=()=>{content.faq.push({question:'New FAQ question',answer:'Write the answer here.'}); markChanged(); renderFaqEditor();};
}

function materialAnswer(topic){
  const t = String(topic || '').toLowerCase();

  if(t.includes('melamine') || t.includes('pvc')){
    return {
      question:'Why do we use melamine board instead of cheap PVC board?',
      answer:'For most dry interior carpentry, melamine board gives a more solid, premium and cabinet-like finish compared with cheap PVC board. It usually has better screw holding, a wider choice of colours and textures, and feels more suitable for wardrobes, kitchen cabinets, TV consoles and storage cabinets. PVC board can still be useful in wet areas, but cheap PVC boards may feel more hollow, flex more easily and may not look as refined.'
    };
  }

  if(t.includes('6mm') || t.includes('backing')){
    return {
      question:'Why do we use 6mm plywood for backing?',
      answer:'6mm plywood is suitable for cabinet backing because it keeps the cabinet neat and lightweight while still giving the rear panel proper support. It is commonly used for back panels because this area does not carry the same load as shelves.'
    };
  }

  if(t.includes('9mm') || t.includes('shelving') || t.includes('shelf')){
    return {
      question:'Why do we use 9mm solid plywood for internal shelving?',
      answer:'Internal shelves need to hold daily items, so 9mm solid plywood gives better strength and stability compared with thinner backing material. It helps the shelf feel more solid and reduces flexing during normal use.'
    };
  }

  if(t.includes('quotation') || t.includes('quote')){
    return {
      question:'How do I get an accurate quotation?',
      answer:'Send your floor plan, area photos, rough measurements and preferred design. This helps us understand the layout, material needs and installation condition before advising an estimated range.'
    };
  }

  if(t.includes('water') || t.includes('waterproof')){
    return {
      question:'Is melamine board waterproof?',
      answer:'Melamine board is water-resistant on the surface, but it is not fully waterproof if water enters through exposed edges or joints. Proper edging, sealing and workmanship are important, especially around sink areas.'
    };
  }

  return {
    question:'New FAQ question about ' + (topic || 'carpentry'),
    answer:'This answer can explain the material choice, practical benefit, cost consideration and what customers should note before confirming the quotation.'
  };
}

function renderAiGeneratorEditor(){
  $('editorFields').innerHTML = `
    <div class="hint">
      <b>Simple AI-style content generator</b><br>
      This works inside GitHub Pages without a paid AI API. Type a topic, generate a draft, then add it to FAQ or copy it into page content.
    </div>
    <div class="field">
      <label>Topic / question idea</label>
      <textarea id="aiTopic" placeholder="Example: why melamine board instead of cheap PVC board, 6mm backing, 9mm shelving, quotation, waterproof"></textarea>
    </div>
    <div class="row-actions">
      <button id="genFaqBtn" type="button">Generate FAQ draft</button>
      <button id="addGeneratedFaqBtn" type="button">Add generated FAQ</button>
    </div>
    <div class="field">
      <label>Generated question</label>
      <input id="genQuestion" value="">
    </div>
    <div class="field">
      <label>Generated answer</label>
      <textarea id="genAnswer"></textarea>
    </div>
    <div class="hint">
      For real AI writing, GitHub Pages cannot securely store an AI API key. This generator is a safe built-in helper. If you want actual AI API generation, it needs a backend like Vercel, Netlify Functions or Cloudflare Workers.
    </div>
  `;

  $('genFaqBtn').onclick = () => {
    const draft = materialAnswer($('aiTopic').value);
    $('genQuestion').value = draft.question;
    $('genAnswer').value = draft.answer;
  };

  $('addGeneratedFaqBtn').onclick = () => {
    const q = $('genQuestion').value.trim();
    const a = $('genAnswer').value.trim();

    if(!q || !a){
      showStatus('Generate or write a question and answer first.', 'error');
      return;
    }

    content.faq.push({question:q, answer:a});
    markChanged();
    showStatus('Generated FAQ added. Go to FAQ Editor to edit/reorder it.', 'success');
  };
}


function renderImagesEditor(){
  $('editorFields').innerHTML = `<div class="hint">Edit image paths and alt text. Upload actual image files manually to assets folder.</div>` + content.images.map((img,i)=>`<div class="repeat-card"><div class="field"><label>Image name</label><input data-img="${i}" data-field="label" value="${esc(img.label)}"></div><div class="field"><label>File path</label><input data-img="${i}" data-field="path" value="${esc(img.path)}"></div><div class="field"><label>Alt text</label><input data-img="${i}" data-field="alt" value="${esc(img.alt)}"></div></div>`).join('');
  qsa('[data-img]').forEach(el=>el.oninput=e=>{content.images[+e.target.dataset.img][e.target.dataset.field]=e.target.value; markChanged();});
}
function renderMobileEditor(){ $('editorFields').innerHTML = `<div class="hint">Mobile order is stored here. Use Advanced JSON for detailed edits.</div><textarea id="mobileJson">${esc(JSON.stringify(content.mobileSectionOrder,null,2))}</textarea>`; $('mobileJson').oninput=e=>{try{content.mobileSectionOrder=JSON.parse(e.target.value); markChanged();}catch{}}; }
function renderSeoEditor(){ $('editorFields').innerHTML = inputField('site.defaultMetaDescription','Default meta description','textarea')+inputField('ai.summary','AI summary','textarea')+`<div class="field"><label>Keywords, one per line</label><textarea id="kw">${esc((content.ai.keywords||[]).join('\n'))}</textarea></div>`; bindPathInputs(); $('kw').oninput=e=>{content.ai.keywords=e.target.value.split('\n').map(x=>x.trim()).filter(Boolean); markChanged();}; }
function renderPagesEditor(){
  const keys=['services','why','works','calculator','faq','contact'];
  $('editorFields').innerHTML = `<div class="hint">Edit page titles, descriptions and cards. This controls Services, Why Us, Works, Calculator, FAQ and Contact previews/pages.</div>` + keys.map(k=>{const p=content.pages[k]||{}; return `<div class="repeat-card"><h3>${esc(k.toUpperCase())}</h3><div class="field"><label>Page title</label><input data-page="${k}" data-field="title" value="${esc(p.title||'')}"></div><div class="field"><label>Page description</label><textarea data-page="${k}" data-field="lead">${esc(p.lead||'')}</textarea></div>${(p.cards||[]).map((c,i)=>`<div class="mini-card"><div class="field"><label>Card title</label><input data-card="${k}:${i}" data-field="title" value="${esc(c.title)}"></div><div class="field"><label>Card text</label><textarea data-card="${k}:${i}" data-field="text">${esc(c.text)}</textarea></div></div>`).join('')}<button data-add-card="${k}" type="button">+ Add card</button></div>`}).join('');
  qsa('[data-page]').forEach(el=>el.oninput=e=>{const k=e.target.dataset.page; content.pages[k]=content.pages[k]||{}; content.pages[k][e.target.dataset.field]=e.target.value; markChanged();});
  qsa('[data-card]').forEach(el=>el.oninput=e=>{const [k,i]=e.target.dataset.card.split(':'); content.pages[k].cards[+i][e.target.dataset.field]=e.target.value; markChanged();});
  qsa('[data-add-card]').forEach(b=>b.onclick=()=>{const k=b.dataset.addCard; content.pages[k].cards=content.pages[k].cards||[]; content.pages[k].cards.push({title:'New card',text:'Write description here.'}); markChanged(); renderPagesEditor();});
}
function getGithubSettings(){ try{return JSON.parse(localStorage.getItem('siongGithubSettings')) || {owner:'stnlysee',repo:'siongdesign',branch:'main',token:'',autoSave:false};}catch{return {owner:'stnlysee',repo:'siongdesign',branch:'main',token:'',autoSave:false};} }
function renderGithubEditor(){ const s=getGithubSettings(); $('editorFields').innerHTML=`<div class="hint">GitHub Pages direct publish. Token must have Contents: Read and write.</div><div class="field"><label>Owner</label><input id="ghOwner" value="${esc(s.owner)}"></div><div class="field"><label>Repo</label><input id="ghRepo" value="${esc(s.repo)}"></div><div class="field"><label>Branch</label><input id="ghBranch" value="${esc(s.branch)}"></div><div class="field"><label>GitHub token</label><input id="ghToken" type="password" value="${esc(s.token)}"></div><button id="saveSettings" type="button">Save Settings</button><button id="testSettings" type="button">Test Connection</button>`; $('saveSettings').onclick=saveSettings; $('testSettings').onclick=()=>{saveSettings(); testConnection();}; }
function saveSettings(){localStorage.setItem('siongGithubSettings',JSON.stringify({owner:$('ghOwner').value.trim(),repo:$('ghRepo').value.trim(),branch:$('ghBranch').value.trim()||'main',token:$('ghToken').value.trim()})); showStatus('GitHub settings saved.','success');}
async function githubFetch(path,options={}){const s=getGithubSettings(); if(!s.owner||!s.repo||!s.branch||!s.token) throw new Error('Missing GitHub settings. Open Auto Save Setup first.'); const clean=path.replace(/^\/+/,''); const url=`https://api.github.com/repos/${encodeURIComponent(s.owner)}/${encodeURIComponent(s.repo)}/contents/${clean}`; let res=await fetch(url,{...options,headers:{'Accept':'application/vnd.github+json','Authorization':`Bearer ${s.token}`,'X-GitHub-Api-Version':'2022-11-28',...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}}); const text=await res.text(); let body={}; try{body=text?JSON.parse(text):{};}catch{body={message:text};} if(!res.ok) throw new Error(body.message||`GitHub error ${res.status}`); return body;}
async function testConnection(){try{const s=getGithubSettings(); await githubFetch(`${CONTENT_PATH}?ref=${encodeURIComponent(s.branch)}&t=${Date.now()}`,{method:'GET'}); showStatus('Connection successful.','success');}catch(e){showStatus('Connection failed: '+e.message,'error');}}
async function putFile(path,data,message){const s=getGithubSettings(); const clean=path.replace(/^\/+/,''); const encoded=btoa(unescape(encodeURIComponent(data))); let sha=null; try{const existing=await githubFetch(`${clean}?ref=${encodeURIComponent(s.branch)}&t=${Date.now()}`,{method:'GET'}); sha=existing.sha;}catch(e){if(!String(e.message).includes('Not Found')) throw e;} return githubFetch(clean,{method:'PUT',body:JSON.stringify({message,content:encoded,branch:s.branch,...(sha?{sha}:{})})});}
async function saveToGithub(){ if(isPublishing) return; isPublishing=true; try{normalizeContent(); await putFile(CONTENT_PATH,JSON.stringify(content,null,2),'Update website content from admin builder'); $('saveState').textContent='Published to GitHub'; showStatus('Published successfully. Wait 1-3 minutes then refresh.','success');}catch(e){showStatus('Publish failed: '+e.message,'error');}finally{isPublishing=false;}}
function backupJson(){ const blob=new Blob([JSON.stringify(content,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='site-content.json'; a.click();}
function previewSite(){localStorage.setItem('siongPreviewContent',JSON.stringify(content)); window.open('../index.html?preview=1','_blank');}
function renderJsonEditor(){ $('editorFields').innerHTML=`<textarea id="jsonArea" class="json-area">${esc(JSON.stringify(content,null,2))}</textarea>`; $('jsonArea').oninput=e=>{try{content=JSON.parse(e.target.value); normalizeContent(); markChanged();}catch{}}; }

async function init(){
  await loadContent();
  $('loginBtn').onclick=()=>{ const pass = String(content.site.adminPassword || ADMIN_PASSWORD); if($('password').value.trim()!==pass){alert('Wrong password'); return;} $('loginScreen').classList.add('hidden'); $('builder').classList.remove('hidden'); renderEditor(); renderPreview(); };
  $('password').onkeydown=e=>{if(e.key==='Enter') $('loginBtn').click();};
  document.addEventListener('click', e=>{
    const pb=e.target.closest('.page-btn'); if(pb){e.preventDefault(); switchPage(pb.dataset.page); return;}
    const db=e.target.closest('.device'); if(db){e.preventDefault(); switchDevice(db.dataset.device); return;}
    const bb=e.target.closest('.block-btn'); if(bb){e.preventDefault(); switchBlock(bb.dataset.block); return;}
  }, true);
  $('publishBtn').onclick=saveToGithub;
  $('backupBtn').onclick=backupJson;
  $('previewSiteBtn').onclick=previewSite;
}
init();
