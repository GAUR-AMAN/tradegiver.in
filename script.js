/* ============================================================
   TRADE GIVER — script.js
   ============================================================ */

/* ── Loader ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // trigger hero reveal
    document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
  }, 1800);
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
    cx += (tx - cx) * .12;
    cy += (ty - cy) * .12;
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
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
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
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
    `;
    this.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  });
});

/* ── Intersection Observer for Scroll Reveals ────────────────── */
const revealOpts = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, revealOpts);

document.querySelectorAll(
  '.reveal-up, .reveal-right, .reveal-card, .reveal-tl'
).forEach(el => {
  // skip hero elements — controlled by loader callback
  if (!el.closest('#hero')) revealObserver.observe(el);
});

/* ── Animated Counters ───────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const startVal = 0;
  const isLarge = target >= 1000;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + eased * (target - startVal));
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

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── FAQ Accordion ───────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // close all
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

/* ── Ticker Strip ────────────────────────────────────────────── */
const tickerData = [
  { pair: 'XAU/USD', price: '2,634.50', change: '+0.84%', dir: 'up' },
  { pair: 'EUR/USD', price: '1.0882',   change: '+0.23%', dir: 'up' },
  { pair: 'GBP/USD', price: '1.2641',   change: '-0.15%', dir: 'dn' },
  { pair: 'BTC/USD', price: '68,240',   change: '+2.10%', dir: 'up' },
  { pair: 'ETH/USD', price: '3,810',    change: '+1.45%', dir: 'up' },
  { pair: 'USD/JPY', price: '151.35',   change: '-0.42%', dir: 'dn' },
  { pair: 'NIFTY 50',price: '24,530',   change: '-0.28%', dir: 'dn' },
  { pair: 'BANKNIFTY',price:'52,140',   change: '+0.11%', dir: 'up' },
  { pair: 'USD/INR',  price: '83.62',   change: '+0.06%', dir: 'up' },
  { pair: 'XAG/USD',  price: '30.45',   change: '+1.12%', dir: 'up' },
];

const tickerInner = document.getElementById('tickerInner');
if (tickerInner) {
  // double up for seamless loop
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

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  const COLORS = ['rgba(201,168,76,', 'rgba(245,245,245,'];
  const N = window.innerWidth < 700 ? 40 : 70;

  function makeParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      color,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: 1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: N }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      p.alpha += p.twinkleSpeed * p.twinkleDir;
      if (p.alpha > 0.55 || p.alpha < 0.05) p.twinkleDir *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha.toFixed(2) + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init, { passive: true });
})();

/* ── Hero Candlestick Chart ──────────────────────────────────── */
(function initHeroChart() {
  const canvas = document.getElementById('heroChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // generate fake OHLC data
  function genCandles(n) {
    const candles = [];
    let price = 2600;
    for (let i = 0; i < n; i++) {
      const open  = price;
      const move  = (Math.random() - 0.46) * 18;
      const close = open + move;
      const hi    = Math.max(open, close) + Math.random() * 8;
      const lo    = Math.min(open, close) - Math.random() * 8;
      candles.push({ open, close, hi, lo });
      price = close;
    }
    return candles;
  }

  let candles = genCandles(22);
  let drawCount = 0;

  function getRange() {
    const allVals = candles.flatMap(c => [c.hi, c.lo]);
    const min = Math.min(...allVals);
    const max = Math.max(...allVals);
    return { min, max };
  }

  function toY(val, min, max) {
    return H - 12 - ((val - min) / (max - min)) * (H - 24);
  }

  function drawChart(count) {
    ctx.clearRect(0, 0, W, H);

    // grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (H / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const { min, max } = getRange();
    const n = Math.floor(count);
    const cw = (W - 16) / candles.length;

    // draw area under close line
    ctx.beginPath();
    candles.slice(0, n).forEach((c, i) => {
      const x = 8 + i * cw + cw / 2;
      const y = toY(c.close, min, max);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    const lastX = 8 + (n - 1) * cw + cw / 2;
    ctx.lineTo(lastX, H);
    ctx.lineTo(8 + cw / 2, H);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   'rgba(201,168,76,0.18)');
    grad.addColorStop(1,   'rgba(201,168,76,0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // draw candles
    for (let i = 0; i < n; i++) {
      const c = candles[i];
      const x = 8 + i * cw;
      const bullish = c.close >= c.open;
      const color = bullish ? '#22c55e' : '#ef4444';
      const midX = x + cw / 2;

      // wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(midX, toY(c.hi, min, max));
      ctx.lineTo(midX, toY(c.lo, min, max));
      ctx.stroke();

      // body
      const bodyTop = toY(Math.max(c.open, c.close), min, max);
      const bodyH   = Math.max(1, toY(Math.min(c.open, c.close), min, max) - bodyTop);
      ctx.fillStyle = color;
      ctx.fillRect(x + cw * .18, bodyTop, cw * .64, bodyH);
    }

    // price line for last visible candle
    if (n > 0) {
      const lastClose = candles[n - 1].close;
      const ly = toY(lastClose, min, max);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(201,168,76,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, ly);
      ctx.lineTo(W, ly);
      ctx.stroke();
      ctx.setLineDash([]);

      // price label
      ctx.fillStyle = '#C9A84C';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.fillText(lastClose.toFixed(2), W - 56, ly - 3);
    }
  }

  // animate candle draw-in
  function animate() {
    if (drawCount < candles.length) {
      drawCount += 0.4;
      drawChart(drawCount);
      requestAnimationFrame(animate);
    } else {
      drawChart(candles.length);
      // subtle live update
      setInterval(() => {
        const last = candles[candles.length - 1];
        const nudge = (Math.random() - 0.48) * 4;
        const newClose = last.close + nudge;
        candles[candles.length - 1].close = newClose;
        candles[candles.length - 1].hi = Math.max(last.open, newClose) + Math.random() * 3;
        candles[candles.length - 1].lo = Math.min(last.open, newClose) - Math.random() * 3;

        // update displayed price
        const priceEl = document.getElementById('goldPrice');
        if (priceEl) priceEl.textContent = newClose.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        drawChart(candles.length);
      }, 1200);
    }
  }

  // start after loader hides
  setTimeout(animate, 1900);
})();

/* ── Smooth Scroll for anchor links ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Floating icon parallax on scroll ───────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    const hero = document.getElementById('hero');
    if (hero) {
      const speed = 0.25;
      const content = hero.querySelector('.hero-content');
      if (content) content.style.transform = `translateY(${scrollY * speed}px)`;
    }
    ticking = false;
  });
}, { passive: true });
