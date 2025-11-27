// Front-end prototype for a service directory marketplace
// No backend — sample data + UI logic only.

const sampleProviders = [
  {
    id: "p1",
    name: "Amina's Home Care",
    category: "health",
    subtitle: "Home health & elderly care",
    location: "Toronto, ON",
    rating: 4.9,
    reviews: 62,
    price: 45,
    featured: true,
    about: "Experienced home health provider offering compassionate care and companionship.",
    services: ["Personal care","Medication reminders","Companionship"],
    reviewsList: [
      {author: "T. Johnson", text: "Very kind and professional. Highly recommended.", rating: 5},
      {author: "S. Miller", text: "Flexible schedule, trustworthy.", rating: 5}
    ]
  },
  {
    id: "p2",
    name: "Northside IT Support",
    category: "it",
    subtitle: "Remote & on-site IT help",
    location: "Ottawa, ON",
    rating: 4.7,
    reviews: 41,
    price: 80,
    featured: true,
    about: "Small IT company offering managed support and one-off fixes.",
    services: ["Network setup","Virus removal","Cloud migration"],
    reviewsList: [
      {author: "R. Patel", text: "Quick response and solved our issue.", rating: 5},
      {author: "L. Cruz", text: "Good value.", rating: 4}
    ]
  },
  {
    id: "p3",
    name: "Sparkle Cleaning Co.",
    category: "cleaning",
    subtitle: "Residential & commercial cleaning",
    location: "Vancouver, BC",
    rating: 4.5,
    reviews: 120,
    price: 55,
    featured: false,
    about: "Trusted cleaners with eco-friendly products.",
    services: ["Deep cleaning","Regular cleaning","Move-out cleaning"],
    reviewsList: [{author: "M. Nguyen", text: "Excellent job.", rating: 5}]
  },
  {
    id: "p4",
    name: "Bright Ledger Accounting",
    category: "accounting",
    subtitle: "Bookkeeping, taxes & consulting",
    location: "Montreal, QC",
    rating: 4.8,
    reviews: 25,
    price: 120,
    featured: false,
    about: "Seasoned accountants for small businesses and freelancers.",
    services: ["Tax filing","Payroll","Bookkeeping"],
    reviewsList: [{author: "F. Gomez", text: "Detail-oriented and timely.", rating: 5}]
  },
  {
    id: "p5",
    name: "LegalWorx",
    category: "legal",
    subtitle: "Small claims & contracts",
    location: "Calgary, AB",
    rating: 4.6,
    reviews: 33,
    price: 200,
    featured: false,
    about: "Affordably priced legal advice for startups and individuals.",
    services: ["Contract review","Legal advice","Small claims"],
    reviewsList: [{author: "A. Brown", text: "Clear guidance.", rating: 4}]
  },
  // Add more sample providers to demonstrate pagination/search
  ...Array.from({length:12}).map((_,i)=>({
    id:`gen${i}`,
    name:`Local Pro ${i+1}`,
    category: ["home","cleaning","it","legal","health","accounting"][i%6],
    subtitle: "Reliable local professional",
    location: ["Halifax, NS", "Regina, SK", "Edmonton, AB", "Windsor, ON", "Winnipeg, MB"][i%5],
    rating: +(4 + Math.random()).toFixed(1),
    reviews: Math.floor(Math.random()*120),
    price: Math.floor(30 + Math.random()*200),
    featured: Math.random()>0.8,
    about: "Friendly pro offering great service.",
    services: ["Service A","Service B"],
    reviewsList:[]
  }))
];

let providers = sampleProviders.slice();
let currentPage = 1;
const pageSize = 6;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  renderProviders();
  setupEventListeners();
});

function setupEventListeners(){
  document.getElementById('search-form').addEventListener('submit', e=>{
    e.preventDefault();
    currentPage = 1;
    applyFiltersAndRender();
  });

  document.getElementById('sort-select').addEventListener('change', () => { currentPage=1; applyFiltersAndRender(); });
  document.getElementById('rating-filter').addEventListener('change', () => { currentPage=1; applyFiltersAndRender(); });
  document.getElementById('price-filter').addEventListener('change', () => { currentPage=1; applyFiltersAndRender(); });

  // Modal toggles
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('home-btn').addEventListener('click', closeModal);
  document.getElementById('auth-close').addEventListener('click', closeAuth);
  document.getElementById('sign-in-btn').addEventListener('click', openAuth);
  document.getElementById('add-listing').addEventListener('click', () => {
    openAuth(true); // open auth as join
  });

  document.getElementById('auth-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('This prototype does not implement authentication. Backend integration required.');
    closeAuth();
  });
}

function renderProviders(){
  const grid = document.getElementById('providers-grid');
  grid.innerHTML = '';

  const start = (currentPage - 1) * pageSize;
  const visible = providers.slice(start, start + pageSize);

  visible.forEach(p => {
    const card = document.createElement('article');
    card.className = 'provider-card';
    // Select Unsplash image based on provider name
    let imgUrl = '';
    if (p.name.includes("Amina")) {
      imgUrl = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'; // Home care
    } else if (p.name.includes("Sparkle")) {
      imgUrl = 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80'; // Cleaning
    } else if (p.name.includes("Northside IT")) {
      imgUrl = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'; // IT
    } else if (p.name.includes("Bright Ledger")) {
      imgUrl = 'https://images.unsplash.com/photo-1515165562835-cf7743f1b7eb?auto=format&fit=crop&w=400&q=80'; // Accounting
    } else if (p.name.includes("LegalWorx")) {
      imgUrl = 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80'; // Legal
    } else {
      imgUrl = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'; // Default
    }
    card.innerHTML = `
      <div class="card-top">
        <div class="avatar" aria-hidden="true">
          <img src="${imgUrl}" alt="${escapeHtml(p.name)}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">
        </div>
        <div>
          <div class="provider-name">${escapeHtml(p.name)}</div>
          <div class="provider-meta">${escapeHtml(p.subtitle)} • ${escapeHtml(p.location)}</div>
          <div class="provider-meta">${escapeHtml(capitalize(p.category))} • <span class="stars">${p.rating}★</span> <small class="provider-meta">(${p.reviews})</small></div>
        </div>
        <div class="price">$${p.price.toFixed(0)}</div>
      </div>
      <p class="provider-meta" style="margin:6px 0 6px">${escapeHtml(truncate(p.about, 120))}</p>
      <div class="card-cta">
        <button class="btn view-btn" data-id="${p.id}">View profile</button>
        <button class="btn btn-outline contact-btn" data-id="${p.id}">Contact</button>
      </div>
    `;

    grid.appendChild(card);
  });

  document.getElementById('result-count').textContent = providers.length;
  renderPagination();
  // hookup view buttons
  document.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', e=>{
    const id = e.currentTarget.dataset.id;
    openProviderModal(id);
  }));
  document.querySelectorAll('.contact-btn').forEach(b => b.addEventListener('click', (e)=>{
    const id = e.currentTarget.dataset.id;
    alert('Contact flow not implemented in prototype. Would open contact/booking UI for provider ' + id);
  }));
}

// Filtering & sort
function applyFiltersAndRender(){
  const term = document.getElementById('search-input').value.trim().toLowerCase();
  const location = document.getElementById('location-input').value.trim().toLowerCase();
  const category = document.getElementById('category-select').value;
  const ratingMin = parseFloat(document.getElementById('rating-filter').value) || 0;
  const priceFilter = document.getElementById('price-filter').value;
  const sort = document.getElementById('sort-select').value;

  providers = sampleProviders.filter(p => {
    if (category && p.category !== category) return false;
    if (ratingMin && p.rating < ratingMin) return false;
    if (term){
      const inText = (p.name + ' ' + p.subtitle + ' ' + p.about + ' ' + p.services.join(' ')).toLowerCase();
      if (!inText.includes(term)) return false;
    }
    if (location){
      if (!p.location.toLowerCase().includes(location)) return false;
    }
    if (priceFilter){
      if (priceFilter === '0-50' && !(p.price <= 50)) return false;
      if (priceFilter === '50-150' && !(p.price >= 50 && p.price <= 150)) return false;
      if (priceFilter === '150+' && !(p.price >= 150)) return false;
    }
    return true;
  });

  // sort
  providers.sort((a,b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    // featured or default: featured first then rating
    if (a.featured === b.featured) return b.rating - a.rating;
    return a.featured ? -1 : 1;
  });

  // reset to page 1 if current page now beyond count
  currentPage = 1;
  renderProviders();
}

function renderPagination(){
  const total = providers.length;
  const pages = Math.ceil(total / pageSize);
  const container = document.getElementById('pagination');
  container.innerHTML = '';
  if (pages <= 1) return;

  const prev = document.createElement('button'); prev.className='page-btn'; prev.textContent='‹ Prev';
  prev.disabled = currentPage === 1;
  prev.addEventListener('click', ()=>{ if (currentPage>1) currentPage--; renderProviders(); });
  container.appendChild(prev);

  for(let i=1;i<=pages;i++){
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.textContent = i;
    if (i === currentPage) btn.style.fontWeight = '700';
    btn.addEventListener('click', ()=>{ currentPage = i; renderProviders(); });
    container.appendChild(btn);
  }

  const next = document.createElement('button'); next.className='page-btn'; next.textContent='Next ›';
  next.disabled = currentPage === pages;
  next.addEventListener('click', ()=>{ if (currentPage<pages) currentPage++; renderProviders(); });
  container.appendChild(next);
}

// Modal
function openProviderModal(id){
  const p = sampleProviders.find(x => x.id === id);
  if(!p) return;
  const modal = document.getElementById('provider-modal');
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div class="profile-photo" aria-hidden="true"></div>
    <div>
      <h3>${escapeHtml(p.name)}</h3>
      <div class="provider-meta">${escapeHtml(p.subtitle)} • ${escapeHtml(p.location)}</div>
      <div style="margin-top:8px"><strong>Rating:</strong> <span class="stars">${p.rating}★</span> <small>(${p.reviews} reviews)</small></div>
      <p style="margin-top:10px">${escapeHtml(p.about)}</p>

      <h4 style="margin-top:12px">Services</h4>
      <ul>${p.services.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>

      <div style="margin-top:12px">
        <button class="btn" id="book-now">Book / Contact</button>
        <button class="btn btn-outline" id="close-modal-cta">Close</button>
      </div>

      <div class="reviews">
        <h4>Reviews</h4>
        ${p.reviewsList.length ? p.reviewsList.map(r => `<div class="review"><strong>${escapeHtml(r.author)}</strong> — <span class="stars">${r.rating}★</span><div>${escapeHtml(r.text)}</div></div>`).join('') : '<div class="provider-meta">No reviews yet.</div>'}
      </div>
    </div>
  `;
  document.getElementById('book-now').addEventListener('click', ()=>{
    alert('Booking flow not implemented in prototype. Backend required for bookings & messaging.');
  });
  document.getElementById('close-modal-cta').addEventListener('click', closeModal);

  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  document.getElementById('provider-modal').setAttribute('aria-hidden','true');
}

function openAuth(join=false){
  const m = document.getElementById('auth-modal');
  document.getElementById('auth-title').textContent = join ? 'Join as Provider' : 'Sign In';
  m.setAttribute('aria-hidden','false');
  if(join){
    // prefill UI action for joining
  }
}
function closeAuth(){ document.getElementById('auth-modal').setAttribute('aria-hidden','true'); }

// helpers
function truncate(s,n){ return s.length>n ? s.slice(0,n-1)+'…' : s }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }
function capitalize(s){ if(!s) return s; return s[0].toUpperCase()+s.slice(1); }