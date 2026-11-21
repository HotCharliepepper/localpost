/* LocalScope R13.3 — shortened cinematic compass from the S07 eight-stage concept.
   This file only reads viewport/scroll and paints SVG + Canvas. No API, storage,
   billing, auth, analytics, or customer data operations. */
(() => {
  'use strict';

  const hero = document.getElementById('intro');
  const stage = document.getElementById('cinema-stage');
  const dial = stage?.querySelector('.dial');
  const needle = stage?.querySelector('.needle-mover');
  const dialMarks = document.getElementById('marks');
  const narration = stage?.querySelector('.content');
  const reveal = document.getElementById('scene-overlay');
  const storyLink = stage?.querySelector('a[href="#motion-start"]');
  if (!hero || !stage || !dial || !needle || !dialMarks) return;

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = media.matches;
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const smooth = (a, b, v) => {
    const t = clamp((v - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const lerp = (a, b, v) => a + (b - a) * v;

  // S07's eight micro-phases fit inside ONE short, reversible scroll interval.
  // The first four phases probe direction; the final phases accelerate into north.
  const MICRO_STARTS = [0, .22, .42, .59, .72, .82, .90, .95];
  const NEEDLE_ANGLES = [40, 26, 11, 0, 120, 345, 720, 1080];
  const DIAL_ANGLES = [0, 12, 34, 78, 172, 320, 530, 720];
  function angleAt(q, values) {
    if (q >= MICRO_STARTS[7]) return values[7];
    for (let i = 0; i < MICRO_STARTS.length - 1; i++) {
      if (q >= MICRO_STARTS[i] && q < MICRO_STARTS[i + 1]) {
        const t = (q - MICRO_STARTS[i]) / (MICRO_STARTS[i + 1] - MICRO_STARTS[i]);
        return lerp(values[i], values[i + 1], t);
      }
    }
    return values[0];
  }

  // The motion trails are visible only during acceleration.
  [1, 2].forEach((index) => {
    const clone = needle.cloneNode(true);
    clone.removeAttribute('id');
    clone.classList.remove('needle-mover');
    clone.classList.add('motion-trail', 'trail-' + index);
    clone.removeAttribute('style');
    needle.parentNode.insertBefore(clone, needle);
  });

  // A small precision arc rotates with the dial; bearings and the red N stay in place.
  const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arc.setAttribute('class', 'orbit-arc');
  arc.setAttribute('d', 'M 300 70 A 230 230 0 0 1 495 178');
  dial.insertBefore(arc, needle);

  // Particles have deterministic positions, and paint only when the scroll changes.
  const canvas = document.createElement('canvas');
  canvas.id = 'r13-motion-canvas';
  canvas.className = 'motion-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.insertBefore(canvas, stage.firstChild);
  let ctx = null;
  try { ctx = canvas.getContext('2d', { alpha: true }); } catch (_) {}

  let seed = 41721;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const particles = Array.from({ length: 150 }, () => ({
    angle: random() * Math.PI * 2,
    radius: Math.pow(random(), .72),
    size: .45 + random() * 1.1,
    gold: random() > .79,
    speed: .65 + random() * .75,
  }));
  let w = 0, h = 0;
  function resizeCanvas() {
    if (!ctx || reduced) return;
    w = Math.max(1, stage.clientWidth);
    h = Math.max(1, stage.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function particlesAt(p, q) {
    if (!ctx || reduced || w < 2) return;
    ctx.clearRect(0, 0, w, h);
    const mobile = w <= 700;
    const cx = w * (mobile ? .78 : .89);
    const cy = h * (mobile ? .74 : .51);
    const extent = Math.min(w, h) * (mobile ? .46 : .7);
    const intensity = .08 + .45 * smooth(.16, .6, p) * (1 - smooth(.78, .96, p));
    const turn = angleAt(q, DIAL_ANGLES) * Math.PI / 180;
    const count = mobile ? 70 : particles.length;
    for (let i = 0; i < count; i++) {
      const pt = particles[i];
      const t = pt.angle + turn * pt.speed + p * .7;
      const r = extent * pt.radius * (1 - smooth(.37, .85, p) * .22);
      const x = cx + Math.cos(t) * r;
      const y = cy + Math.sin(t) * r * .76;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const alpha = intensity * (.4 + .6 * (1 - pt.radius));
      ctx.beginPath();
      ctx.fillStyle = pt.gold ? 'rgba(249,209,155,' + alpha + ')' : 'rgba(158,213,201,' + alpha + ')';
      ctx.arc(x, y, pt.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let progress = 0;
  let running = 0;
  let previous = 0;
  let introFinished = false;

  function getTarget() {
    const room = Math.max(1, hero.offsetHeight - stage.clientHeight);
    return clamp(-hero.getBoundingClientRect().top / room);
  }
  function draw(p) {
    if (reduced) return;
    const q = clamp((p - .08) / .78);
    const needleAngle = angleAt(q, NEEDLE_ANGLES);
    const dialAngle = angleAt(q, DIAL_ANGLES);
    const enter = smooth(.68, .88, p);
    const exit = smooth(.50, .69, p);
    const clarity = smooth(.60, .95, p);
    const trail = smooth(.43, .67, p) * (1 - smooth(.82, .92, p)) * .36;

    stage.style.setProperty('--needle-angle', needleAngle.toFixed(3) + 'deg');
    stage.style.setProperty('--dial-angle', dialAngle.toFixed(3) + 'deg');
    stage.style.setProperty('--trail-strength', trail.toFixed(3));
    stage.style.setProperty('--compass-scale', (1 + .20 * smooth(.3, .84, p) - .05 * smooth(.88, 1, p)).toFixed(4));
    stage.style.setProperty('--clarity', clarity.toFixed(4));
    stage.style.setProperty('--text-exit', exit.toFixed(4));
    stage.style.setProperty('--text-enter', enter.toFixed(4));
    stage.style.setProperty('--motion-progress', p.toFixed(4));
    stage.dataset.phase = p >= .76 ? 'clarity' : 'question';

    if (narration) {
      const hidden = p >= .76;
      narration.inert = hidden;
      narration.setAttribute('aria-hidden', String(hidden));
    }
    if (reveal) {
      const hidden = p < .76;
      reveal.inert = hidden;
      reveal.setAttribute('aria-hidden', String(hidden));
    }
    particlesAt(p, q);
  }

  function tick(now) {
    running = 0;
    if (document.hidden || reduced) return;
    const target = getTarget();
    const dt = previous ? Math.min(64, now - previous) : 16.7;
    previous = now;
    progress += (target - progress) * (1 - Math.exp(-dt / 65));
    if (Math.abs(target - progress) < .0002) progress = target;
    if (!introFinished && progress > .015) {
      needle.style.animation = 'none';
      introFinished = true;
    }
    draw(progress);
    if (progress !== target) running = requestAnimationFrame(tick);
    else previous = 0;
  }
  function schedule() {
    if (!reduced && !running && !document.hidden) running = requestAnimationFrame(tick);
  }
  function refresh() {
    reduced = media.matches;
    if (running) cancelAnimationFrame(running);
    running = 0;
    previous = 0;
    if (storyLink) storyLink.setAttribute('href', reduced ? '#story' : '#motion-start');
    if (reduced) {
      narration?.removeAttribute('aria-hidden');
      if (narration) narration.inert = false;
      if (reveal) { reveal.inert = true; reveal.setAttribute('aria-hidden', 'true'); }
      if (ctx) ctx.clearRect(0, 0, w, h);
    } else {
      resizeCanvas();
      progress = getTarget();
      draw(progress);
      schedule();
    }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { resizeCanvas(); schedule(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { previous = 0; schedule(); });
  if (typeof media.addEventListener === 'function') media.addEventListener('change', refresh);
  else media.addListener(refresh);
  refresh();
})();
