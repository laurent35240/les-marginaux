/* Les Marginaux — script.js */

// ===== UTILITIES =====

function typewrite(el, text, speed, cb) {
  el.textContent = '';
  let i = 0;
  function next() {
    if (i < text.length) { el.textContent += text[i++]; setTimeout(next, speed); }
    else if (cb) cb();
  }
  next();
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = '';
}

function closePopup(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = '';
  resetInactivityTimer();
}

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#FF6B00','#00E5FF','#FFD700','#FF69B4','#39FF14','#fff'];
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random()*100}vw;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${0.9+Math.random()*1.8}s;
      animation-delay:${Math.random()*0.6}s;
      width:${6+Math.random()*10}px;
      height:${6+Math.random()*12}px;
      border-radius:${Math.random()>.5?'50%':'2px'};
    `;
    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

function wrongAnswer(msg, evt) {
  document.querySelectorAll('.wrong-popup').forEach(p => p.remove());
  const pop = document.createElement('div');
  pop.className = 'wrong-popup';
  pop.innerHTML = '<span class="wrong-prefix">❌ PERDU !</span><br>' + msg;
  if (evt) {
    pop.style.left = evt.clientX + 'px';
    pop.style.top  = evt.clientY + 'px';
  }
  document.body.appendChild(pop);
  pop.addEventListener('animationend', () => pop.remove());
}

// ===== HEADER HOVER =====

function initHeaderHover() {
  const header = document.getElementById('header');
  const layer = document.getElementById('header-hover-layer');
  const roads = layer.querySelectorAll('.road-path');
  const faces = layer.querySelectorAll('.cartoon-face');

  const configs = [
    { l:'18%', t:'40%', tx1:'70px',  ty1:'-90px', tx2:'220px', ty2:'-30px', tx3:'320px', ty3:'70px',  d:'3.5s' },
    { l:'32%', t:'62%', tx1:'-90px', ty1:'-70px', tx2:'-210px',ty2:'35px',  tx3:'-110px',ty3:'110px', d:'2.8s' },
    { l:'55%', t:'20%', tx1:'110px', ty1:'90px',  tx2:'160px', ty2:'-55px', tx3:'-55px', ty3:'-90px', d:'4.0s' },
    { l:'72%', t:'70%', tx1:'-160px',ty1:'-45px', tx2:'-85px', ty2:'-130px',tx3:'90px',  ty3:'65px',  d:'3.2s' },
    { l:'82%', t:'30%', tx1:'-210px',ty1:'65px',  tx2:'-310px',ty2:'-35px', tx3:'-110px',ty3:'110px', d:'2.5s' },
    { l:'8%',  t:'75%', tx1:'130px', ty1:'-110px',tx2:'290px', ty2:'55px',  tx3:'190px', ty3:'-90px', d:'3.8s' },
  ];

  faces.forEach((face, i) => {
    const c = configs[i] || configs[0];
    face.style.left = c.l; face.style.top = c.t;
    face.style.setProperty('--duration', c.d);
    face.style.setProperty('--tx1', c.tx1); face.style.setProperty('--ty1', c.ty1);
    face.style.setProperty('--tx2', c.tx2); face.style.setProperty('--ty2', c.ty2);
    face.style.setProperty('--tx3', c.tx3); face.style.setProperty('--ty3', c.ty3);
  });

  header.addEventListener('mouseenter', () => {
    roads.forEach(r => { r.classList.remove('animate'); void r.offsetWidth; r.classList.add('animate'); });
    faces.forEach(f => f.classList.add('fly'));
  });
  header.addEventListener('mouseleave', () => {
    faces.forEach(f => f.classList.remove('fly'));
    roads.forEach(r => r.classList.remove('animate'));
  });
}

// ===== TOURMALET SPEECH BUBBLE =====

function observeTourmalet() {
  const bubble = document.getElementById('tourmalet-bubble');
  const typer  = document.getElementById('tourmalet-typer');
  let played = false;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !played) {
        played = true;
        bubble.classList.add('visible');
        const cursor = document.createElement('span');
        cursor.className = 'cursor-blink'; cursor.textContent = '|';
        typewrite(typer, "Ça c'est les Pyrénées.", 80, () => typer.appendChild(cursor));
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  obs.observe(bubble);
}

// ===== MATRIX RAIN =====

function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF!@#$%^&';
  const fontSize = 14;
  let cols = [];

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth  || canvas.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight || canvas.offsetHeight;
    cols = Array.from({ length: Math.floor(canvas.width / fontSize) }, () => Math.random() * -50);
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
    cols.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = y < 2 ? '#fff' : '#39FF14';
      ctx.fillText(ch, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) cols[i] = 0;
      cols[i]++;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== BAR CHART (animated on scroll) =====

function observeMatrix() {
  const section = document.querySelector('.matrix-section');
  if (!section) return;
  const bars = section.querySelectorAll('.bar');
  let played = false;

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !played) {
        played = true;
        bars.forEach((bar, i) => {
          setTimeout(() => { bar.style.height = bar.getAttribute('data-h'); }, i * 250);
        });
      }
    });
  }, { threshold: 0.3 }).observe(section);
}

// ===== NICO COUNTDOWN =====

function startNicoCountdown() {
  const target = new Date('2026-12-20T09:00:00').getTime();
  const el = document.getElementById('nico-cdown-display');
  if (!el) return;
  function tick() {
    const d = target - Date.now();
    if (d <= 0) return;
    el.querySelector('.n-d').textContent  = String(Math.floor(d/86400000)).padStart(3,'0');
    el.querySelector('.n-h').textContent  = String(Math.floor((d%86400000)/3600000)).padStart(2,'0');
    el.querySelector('.n-m').textContent  = String(Math.floor((d%3600000)/60000)).padStart(2,'0');
    el.querySelector('.n-s').textContent  = String(Math.floor((d%60000)/1000)).padStart(2,'0');
    el.querySelector('.n-ms').textContent = String(d%1000).padStart(3,'0');
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== DAMIEN COUNTDOWN =====

function getNextSeason() {
  const now = new Date();
  const y = now.getFullYear();
  const seasons = [
    { name: 'PRINTEMPS', emoji: '🌸', m: 2,  d: 20 },
    { name: 'ÉTÉ',       emoji: '☀️', m: 5,  d: 21 },
    { name: 'AUTOMNE',   emoji: '🍂', m: 8,  d: 23 },
    { name: 'HIVER',     emoji: '❄️', m: 11, d: 21 },
  ];
  for (const s of seasons) {
    const date = new Date(y, s.m, s.d, 0, 0, 0);
    if (date > now) return { ...s, date };
  }
  // Toutes passées cette année → printemps suivant
  const s = seasons[0];
  return { ...s, date: new Date(y + 1, s.m, s.d, 0, 0, 0) };
}

const DAMIEN_TEXTS = {
  'PRINTEMPS': (d) => `
    <p>Selon les calculs de Damien (certifié CNRS★), le solstice d'hiver du <strong>21 décembre ${d.getFullYear()-1}</strong> à 09h48 UTC+1 a enclenché le compte à rebours biologique du retour de la végétation pyrénéenne, conformément au Traité de la Chlorophylle Montagnarde (§2.7, Damien, 2022).</p>
    <p>Le <strong>Printemps ${d.getFullYear()}</strong> est donc officiellement prévu pour le <strong>${d.getDate()} mars ${d.getFullYear()} à 00h00</strong>, avec une marge d'erreur de ±3 millisecondes.</p>
    <p>Damien recommande de préparer les chaussures de trail dès maintenant.</p>`,
  'ÉTÉ': (d) => `
    <p>Selon les calculs de Damien (certifié CNRS★), l'équinoxe de printemps du <strong>20 mars ${d.getFullYear()}</strong> à 05h23 UTC+1 a déclenché l'augmentation irréversible de l'ensoleillement pyrénéen, conformément aux lois de la thermodynamique solaire (§3.1, Traité des Saisons, Damien, 2023).</p>
    <p>L'<strong>Été ${d.getFullYear()}</strong> est donc officiellement prévu pour le <strong>${d.getDate()} juin ${d.getFullYear()} à 00h00</strong>, avec une marge d'erreur de ±3 millisecondes.</p>
    <p>Damien a déjà réservé les kayaks.</p>`,
  'AUTOMNE': (d) => `
    <p>Selon les calculs de Damien (certifié CNRS★), le solstice d'été du <strong>21 juin ${d.getFullYear()}</strong> à 12h51 UTC+2 a amorcé la décroissance photonique caractéristique de l'hémisphère nord, conformément au Modèle de Dégradation Foliaire Pyrénéenne (§5.4, Damien, 2024).</p>
    <p>L'<strong>Automne ${d.getFullYear()}</strong> est donc officiellement prévu pour le <strong>${d.getDate()} septembre ${d.getFullYear()} à 00h00</strong>, avec une marge d'erreur de ±3 millisecondes.</p>
    <p>Damien a déjà identifié les meilleures pistes pour la saison suivante.</p>`,
  'HIVER': (d) => `
    <p>Selon les calculs de Damien (certifié CNRS★), l'équinoxe d'automne du <strong>23 septembre ${d.getFullYear()}</strong> à 14h29 UTC+2 déclenche automatiquement la formation du manteau neigeux sur le Tourmalet, conformément aux lois de la thermodynamique pyrénéenne (§4.2.1, Traité des Pistes, Damien, 2023).</p>
    <p>L'<strong>Hiver ${d.getFullYear()}</strong> est donc officiellement prévu pour le <strong>${d.getDate()} décembre ${d.getFullYear()} à 00h00</strong>, avec une marge d'erreur de ±3 millisecondes.</p>
    <p>Damien a déjà réservé les forfaits.</p>`,
};

function startDamienCountdown() {
  const el = document.getElementById('damien-time-display');
  const labelEl = document.querySelector('.damien-sub');
  const bodyEl = document.getElementById('damien-popup-body');
  if (!el) return;

  const season = getNextSeason();
  const target = season.date.getTime();
  if (labelEl) labelEl.textContent = `${season.emoji} ${season.name} ${season.date.getFullYear()}`;
  if (bodyEl && DAMIEN_TEXTS[season.name]) bodyEl.innerHTML = DAMIEN_TEXTS[season.name](season.date);

  function tick() {
    const d = target - Date.now();
    if (d <= 0) { el.innerHTML = `<span>C'EST LÀ !</span>`; return; }
    el.innerHTML = `
      <span>${String(Math.floor(d/86400000)).padStart(3,'0')}</span>j<br>
      <span>${String(Math.floor((d%86400000)/3600000)).padStart(2,'0')}</span>h
      <span>${String(Math.floor((d%3600000)/60000)).padStart(2,'0')}</span>m
      <span>${String(Math.floor((d%60000)/1000)).padStart(2,'0')}</span>s<br>
      <span>${String(d%1000).padStart(3,'0')}</span>ms
    `;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== TRICOUNT =====

function observeTricount() {
  const section = document.querySelector('.tricount-section');
  if (!section) return;
  let started = false;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        obs.unobserve(section);
        runTricountBar();
      }
    });
  }, { threshold: 0.4 });
  obs.observe(section);
}

function runTricountBar() {
  const bar    = document.getElementById('tricount-bar');
  const status = document.getElementById('tricount-status');
  const steps  = [
    [600,  12, "Récupération des dépenses..."],
    [500,  28, "Calcul des remboursements..."],
    [700,  43, "Vérification PA (0 virements trouvés)..."],
    [900,  57, "Ajustement pour les saucisses du Tourmalet..."],
    [600,  68, "Réconciliation des Ti-Punch de Nico..."],
    [1000, 79, "Validation en cours..."],
    [1200, 88, "Presque là..."],
    [1800, 92, "Presque là... (toujours)"],
    [2500, 95, "Connexion lente... PA est sur WhatsApp..."],
    [3000, 97, "97%... (depuis 3 minutes)"],
  ];
  let i = 0;
  function next() {
    if (i >= steps.length) { setTimeout(() => openModal('tricount-modal'), 800); return; }
    const [delay, pct, msg] = steps[i++];
    setTimeout(() => { bar.style.width = pct + '%'; status.textContent = msg; next(); }, delay);
  }
  setTimeout(next, 600);
}

// ===== INACTIVITY (Nico légumes) =====

let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    const pop = document.getElementById('nico-vegetal-popup');
    if (pop) pop.classList.remove('hidden');
  }, 10000);
}

function initInactivityTimer() {
  ['mousemove','keydown','scroll','click','touchstart'].forEach(evt =>
    document.addEventListener(evt, resetInactivityTimer, { passive: true })
  );
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(inactivityTimer);
    else resetInactivityTimer();
  });
  resetInactivityTimer();
}

// ===== TI-PUNCH =====

function initTiPunch() {
  const btn  = document.getElementById('tipunch-btn');
  const wrap = document.getElementById('tipunch-glass');
  const rum  = document.getElementById('rum-fill');
  if (!btn) return;
  let done = false;
  btn.addEventListener('click', () => {
    if (done) return;
    done = true;
    wrap.classList.remove('hidden');
    setTimeout(() => { rum.style.height = '78%'; }, 100);
    btn.textContent = '🍹 TCHIN TCHIN !';
  });
}

// ===== VTT TOGGLE =====

function initVTTToggle() {
  const before = document.querySelector('.vtt-rider-wrap.before-state');
  const after  = document.querySelector('.vtt-rider-wrap.after-state');
  if (!before || !after) return;
  setInterval(() => {
    before.classList.toggle('hidden');
    after.classList.toggle('hidden');
  }, 2500);
}

// ===== CANYONING FULLSCREEN =====

function observeCanyoning() {
  const panel   = document.getElementById('canyoning-panel');
  const overlay = document.getElementById('splash-overlay');
  if (!panel) return;
  let played = false;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !played) {
        played = true;
        panel.classList.add('fullscreen-active');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          panel.classList.remove('fullscreen-active');
          overlay.classList.remove('visible');
          document.body.style.overflow = '';
        }, 2500);
      }
    });
  }, { threshold: 0.8 }).observe(panel);
}

// ===== GALETTE DUEL =====

function initFightButton() {
  const btn = document.getElementById('fight-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = '⚔️ LE DÉBAT EST LANCÉ !';
    const lBar = document.getElementById('health-left');
    const lFtr = document.querySelector('.fighter.fighter-left');
    const timeline = [
      [350, 80], [450, 65], [400, 50], [600, 36], [500, 22], [700, 9], [800, 0],
    ];
    let i = 0;
    function step() {
      if (i >= timeline.length) return;
      const [delay, pct] = timeline[i++];
      setTimeout(() => {
        lBar.style.width = pct + '%';
        lFtr.classList.add('shake');
        setTimeout(() => lFtr.classList.remove('shake'), 360);
        if (pct === 0) setTimeout(() => { btn.textContent = "💀 GALETTE K.O. — C'EST UNE CRÊPE !"; }, 500);
        step();
      }, delay);
    }
    step();
  });
}

// ===== THIBAULT GAME =====

let repoCount = 0;
const spots = [
  [34,58],[72,18],[15,75],[85,42],[50,10],
  [28,63],[68,80],[8,35],[91,68],[45,85],[60,30],[20,50]
];

function foundThibault() {
  const target = document.getElementById('thibault-target');
  const banner = document.getElementById('thibault-found-banner');
  launchConfetti();
  banner.classList.remove('hidden');
  target.style.transition = 'transform .4s,opacity .4s';
  target.style.transform = 'rotate(15deg) scale(0)';
  target.style.opacity = '0';
  setTimeout(() => {
    repoCount++;
    document.getElementById('repo-count').textContent = repoCount;
    const pos = spots[repoCount % spots.length];
    target.style.transition = 'none';
    target.style.left = pos[0] + '%';
    target.style.top  = pos[1] + '%';
    target.style.transform = 'rotate(15deg) scale(.9)';
    target.style.opacity = '.75';
    setTimeout(() => banner.classList.add('hidden'), 1800);
  }, 2200);
}

function buildChaosBackground() {
  const chaos = document.querySelector('.chaos-bg');
  if (!chaos) return;
  const items = ['🌲','🌿','🍀','🌸','☁️','⭐','💧','✨','🌺','🌾','🍃','❄️'];
  for (let i = 0; i < 35; i++) {
    const el = document.createElement('span');
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.cssText = `position:absolute;left:${Math.random()*97}%;top:${Math.random()*95}%;font-size:${0.6+Math.random()*0.7}rem;opacity:${0.08+Math.random()*0.15};transform:rotate(${Math.random()*360}deg);pointer-events:none;`;
    chaos.appendChild(el);
  }
}

// ===== INIT =====

document.addEventListener('DOMContentLoaded', () => {
  initHeaderHover();
  observeTourmalet();
  initMatrixRain();
  observeMatrix();
  startNicoCountdown();
  startDamienCountdown();
  observeTricount();
  initInactivityTimer();
  initTiPunch();
  initVTTToggle();
  observeCanyoning();
  initFightButton();
  buildChaosBackground();

  // ESC to close modals/popups
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal:not(.hidden),.popup:not(.hidden)').forEach(m => {
        m.classList.add('hidden');
      });
      document.body.style.overflow = '';
    }
  });

  // Click backdrop to close modals
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) { modal.classList.add('hidden'); document.body.style.overflow = ''; }
    });
  });
});
