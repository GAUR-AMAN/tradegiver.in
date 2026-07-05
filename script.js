/* ============================================================
   TRADE GIVER — script.js
   ============================================================ */

/* ── Loader ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
  }, 1900);
});

/* ── Year ───────────────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Cursor Glow ─────────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let tx = cx, ty = cy;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function animCursor() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    cursorGlow.style.left = cx + 'px';
    cursorGlow.style.top  = cy + 'px';
    requestAnimationFrame(animCursor);
  })();
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}

/* ── Scroll Progress ─────────────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const doc = document.documentElement;
  const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ── Sticky Navbar ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile Nav Toggle ───────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── Ripple Effect ───────────────────────────────────────────── */
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    const size = Math.max(rect.width, rect.height);
    wave.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
    `;
    this.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  });
});

/* ── Scroll Reveal ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-right, .reveal-card, .reveal-tl').forEach(el => {
  if (!el.closest('#hero')) revealObserver.observe(el);
});

/* ── Animated Counters ───────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const isLarge = target >= 1000;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = isLarge ? current.toLocaleString() : current;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isLarge ? target.toLocaleString() : target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target)) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ── FAQ Accordion ───────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Ticker ──────────────────────────────────────────────────── */
const tickerData = [
  { pair: 'XAU/USD',  price: '2,634.50', change: '+0.84%', dir: 'up' },
  { pair: 'EUR/USD',  price: '1.0882',   change: '+0.23%', dir: 'up' },
  { pair: 'GBP/USD',  price: '1.2641',   change: '-0.15%', dir: 'dn' },
  { pair: 'BTC/USD',  price: '68,240',   change: '+2.10%', dir: 'up' },
  { pair: 'ETH/USD',  price: '3,810',    change: '+1.45%', dir: 'up' },
  { pair: 'USD/JPY',  price: '151.35',   change: '-0.42%', dir: 'dn' },
  { pair: 'XAG/USD',  price: '30.45',    change: '+1.12%', dir: 'up' },
  { pair: 'GBP/JPY',  price: '191.20',   change: '-0.30%', dir: 'dn' },
  { pair: 'AUD/USD',  price: '0.6524',   change: '+0.18%', dir: 'up' },
  { pair: 'USD/CAD',  price: '1.3612',   change: '+0.08%', dir: 'up' },
];

const tickerInner = document.getElementById('tickerInner');
if (tickerInner) {
  [...tickerData, ...tickerData].forEach(item => {
    const span = document.createElement('span');
    span.className = 'ticker-item';
    span.innerHTML = `
      <span class="t-pair">${item.pair}</span>
      <span>${item.price}</span>
      <span class="t-${item.dir}">${item.dir === 'up' ? '▲' : '▼'} ${item.change}</span>
    `;
    tickerInner.appendChild(span);
  });
}

/* ── Particle Canvas ─────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const N = window.innerWidth < 700 ? 35 : 65;

  // Two colour sets: blue dots & yellow dots
  const POOLS = [
    'rgba(37,99,235,',
    'rgba(96,165,250,',
    'rgba(255,215,0,',
    'rgba(255,255,255,',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.08,
      color: POOLS[Math.floor(Math.random() * POOLS.length)],
      td: Math.random() * 0.018 + 0.004,
      tDir: 1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: N }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      p.alpha += p.td * p.tDir;
      if (p.alpha > 0.5 || p.alpha < 0.04) p.tDir *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha.toFixed(2) + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  init(); draw();
  window.addEventListener('resize', init, { passive: true });
})();

/* ── Hero XAUUSD Candlestick Chart ───────────────────────────── */
(function initHeroChart() {
  const canvas = document.getElementById('heroChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  /* Generate realistic-looking XAUUSD OHLC */
  function genCandles(n) {
    const candles = [];
    let price = 2620;
    for (let i = 0; i < n; i++) {
      const open  = price;
      const drift = (Math.random() - 0.44) * 14;  // slight upward bias like gold
      const close = open + drift;
      const range = Math.abs(drift) + Math.random() * 10;
      const hi = Math.max(open, close) + Math.random() * range * 0.6;
      const lo = Math.min(open, close) - Math.random() * range * 0.4;
      candles.push({ open, close, hi, lo });
      price = close;
    }
    return candles;
  }

  const TOTAL = 26;
  let candles = genCandles(TOTAL);
  let drawCount = 0;

  function getMinMax() {
    const vals = candles.flatMap(c => [c.hi, c.lo]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.08;
    return { min: min - pad, max: max + pad };
  }

  function toY(val, min, max) {
    return H - 10 - ((val - min) / (max - min)) * (H - 20);
  }

  function drawChart(count) {
    ctx.clearRect(0, 0, W, H);
    const { min, max } = getMinMax();
    const n  = Math.floor(count);
    const cw = (W - 12) / TOTAL;

    /* ── Grid ── */
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(f => {
      const y = H * f;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    });

    /* ── Area fill under close line ── */
    ctx.beginPath();
    candles.slice(0, n).forEach((c, i) => {
      const x = 6 + i * cw + cw / 2;
      const y = toY(c.close, min, max);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    if (n > 0) {
      const lastX = 6 + (n - 1) * cw + cw / 2;
      ctx.lineTo(lastX, H);
      ctx.lineTo(6 + cw / 2, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,   'rgba(37,99,235,0.18)');
      grad.addColorStop(0.7, 'rgba(37,99,235,0.04)');
      grad.addColorStop(1,   'rgba(37,99,235,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    /* ── Candles ── */
    for (let i = 0; i < n; i++) {
      const c   = candles[i];
      const x   = 6 + i * cw;
      const midX = x + cw / 2;
      const bull = c.close >= c.open;
      const col  = bull ? '#22C55E' : '#EF4444';

      // wick
      ctx.strokeStyle = col + 'CC';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(midX, toY(c.hi, min, max));
      ctx.lineTo(midX, toY(c.lo, min, max));
      ctx.stroke();

      // body
      const bodyTop = toY(Math.max(c.open, c.close), min, max);
      const bodyH   = Math.max(1.5, toY(Math.min(c.open, c.close), min, max) - bodyTop);
      ctx.fillStyle = col;
      ctx.fillRect(x + cw * 0.2, bodyTop, cw * 0.6, bodyH);
    }

    /* ── Dashed current price line ── */
    if (n > 0) {
      const lastClose = candles[n - 1].close;
      const ly = toY(lastClose, min, max);

      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = 'rgba(255,215,0,0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke();
      ctx.setLineDash([]);

      // price label bubble
      const label = lastClose.toFixed(2);
      ctx.font = '700 9.5px Helvetica Neue, Helvetica, Arial, sans-serif';
      const tw = ctx.measureText(label).width;
      const px = W - tw - 10, py = ly;
      ctx.fillStyle = 'rgba(255,215,0,0.15)';
      ctx.beginPath();
      ctx.roundRect(px - 4, py - 8, tw + 8, 14, 3);
      ctx.fill();
      ctx.fillStyle = '#FFD700';
      ctx.fillText(label, px, py + 3);
    }

    /* ── Volume bars at bottom ── */
    const volH = 18;
    for (let i = 0; i < n; i++) {
      const c   = candles[i];
      const x   = 6 + i * cw;
      const vol = (Math.abs(c.close - c.open) / (c.hi - c.lo)) * volH;
      const bull = c.close >= c.open;
      ctx.fillStyle = bull ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)';
      ctx.fillRect(x + cw * 0.2, H - vol, cw * 0.6, vol);
    }
  }

  /* Draw-in animation */
  function animate() {
    if (drawCount < TOTAL) {
      drawCount += 0.5;
      drawChart(drawCount);
      requestAnimationFrame(animate);
    } else {
      drawChart(TOTAL);
      /* Live tick simulation */
      setInterval(() => {
        const last  = candles[TOTAL - 1];
        const nudge = (Math.random() - 0.46) * 3.5;
        last.close += nudge;
        last.hi = Math.max(last.open, last.close) + Math.random() * 2.5;
        last.lo = Math.min(last.open, last.close) - Math.random() * 2.5;

        /* Update displayed price */
        const priceEl  = document.getElementById('goldPrice');
        const changeEl = document.getElementById('goldChange');
        if (priceEl) {
          const basePrice = candles[0].open;
          const diff = last.close - basePrice;
          const pct  = ((diff / basePrice) * 100).toFixed(2);
          priceEl.textContent = last.close.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          if (changeEl) {
            const up = diff >= 0;
            changeEl.textContent = (up ? '▲ +' : '▼ ') + pct + '%';
            changeEl.className = 'chart-change ' + (up ? 'up' : 'dn');
          }
        }
        drawChart(TOTAL);
      }, 1100);
    }
  }

  setTimeout(animate, 2000);
})();

/* ── Smooth Scroll ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Subtle Hero Parallax ────────────────────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    const content = document.querySelector('#hero .hero-content');
    if (content && window.innerWidth > 900) {
      content.style.transform = `translateY(${scrollY * 0.18}px)`;
    }
    ticking = false;
  });
}, { passive: true });
