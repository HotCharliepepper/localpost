(() => {
  'use strict';

  // S07 only reads scroll/viewport state and paints SVG + Canvas. There are no
  // service, storage, analytics or API calls in this independent prototype.
  const root = document.documentElement;
  const experience = document.getElementById('intro');
  const stage = document.getElementById('cinema-stage');
  if (!experience || !stage) return;
  const $ = selector => document.querySelector(selector);
  const sn = $('#sn-glyph');
  const spiralField = $('#spiral-field');
  const point = $('#point-stage');
  const compass = $('#compass');
  const ring = $('.seed-ring');
  const axes = $('.compass-axes');
  const dial = $('.dial-body');
  const marks = $('.direction-marks');
  const needle = $('.needle');
  const trails = $('.needle-trails');
  const world = $('#world');
  const canvas = $('#vortex');
  let ctx = null;
  try { ctx = canvas?.getContext('2d', { alpha: true }); } catch (_) { /* SVG remains usable. */ }
  const toggle = $('#motion-toggle');
  const bar = $('#scroll-progress');
  const number = $('#scene-number');
  const microNumber = $('#micro-number');
  const microLabel = $('#micro-label');
  const microTrack = [...document.querySelectorAll('.micro-track span')];
  const chapters = [...document.querySelectorAll('.chapter')];
  const previous = $('#prev-step');
  const next = $('#next-step');
  const pathways = $('#pathways');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, value) => {
    const t = clamp((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  // Units are stage heights, not wheel events. All native inputs share this
  // reversible timeline. Scene 04 is one interval, not eight snap chapters.
  const RESOLUTION_START = 3.75;
  const RESOLUTION_LENGTH = 3;
  const CTA_START = 6.85;
  const MACRO_STOPS = [0, 1, 2, 3, RESOLUTION_START, 7];
  const CHAPTER_BOUNDS = [.70, 1.70, 2.70, RESOLUTION_START, CTA_START];
  const MICRO_STARTS = [0, .22, .42, .59, .72, .82, .90, .95];
  const MICRO_LABELS = [
    '한 점에서', '기준을 그리고', '축을 세우고', '방향을 읽고',
    '가능성을 좁혀', '하나로 모이는', '마침내 일치하는', '선명한 방향',
  ];

  // Shorter intervals and larger turns increase angular velocity. Whole-turn
  // endpoints give an exact northward lock at .95, with no idle spin at 4-8.
  const NEEDLE_ANGLES = [-120, -105, -65, 0, 110, 300, 660, 1080];
  const DIAL_ANGLES = [-60, -40, 0, 80, 170, 310, 500, 720];
  function angleAt(q, angles) {
    if (q >= MICRO_STARTS[7]) return angles[7];
    const index = Math.max(0, MICRO_STARTS.findIndex((start, i) => q >= start && q < MICRO_STARTS[i + 1]));
    return lerp(angles[index], angles[index + 1], (q - MICRO_STARTS[index]) / (MICRO_STARTS[index + 1] - MICRO_STARTS[index]));
  }
  function svgNode(tag, attributes) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
    return node;
  }

  // Retain S06's editable four-arm spiral with a lighter path budget.
  if (spiralField) {
    const fragment = document.createDocumentFragment();
    for (let arm = 0; arm < 4; arm++) {
      const points = [];
      for (let k = 0; k <= 460; k++) {
        const v = k / 460;
        const radius = 447 * (1 - v) ** 1.32 + 4 + arm * 11 * (1 - v);
        const angle = v * 9.1 * Math.PI + arm * Math.PI / 2;
        points.push(`${k ? 'L' : 'M'}${(500 + radius * Math.cos(angle)).toFixed(2)} ${(500 + radius * Math.sin(angle)).toFixed(2)}`);
      }
      fragment.appendChild(svgNode('path', {
        d: points.join(' '), class: 'spiral-arm',
        'stroke-width': arm === 0 ? 2.4 : Math.max(.8, 1.9 - arm * .3),
        opacity: .86 - arm * .13,
      }));
    }
    spiralField.replaceChildren(fragment);
  }

  // True-vector divisions stay crisp at any viewport or pixel density.
  const tickGroup = $('#dial-ticks');
  const degreeGroup = $('#dial-degrees');
  if (tickGroup) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 120; i++) {
      const angle = (i * 3 - 90) * Math.PI / 180;
      const major = i % 10 === 0;
      const medium = i % 5 === 0;
      const innerRadius = major ? 304 : medium ? 307 : 310;
      fragment.appendChild(svgNode('line', {
        x1: 500 + innerRadius * Math.cos(angle), y1: 500 + innerRadius * Math.sin(angle),
        x2: 500 + 320 * Math.cos(angle), y2: 500 + 320 * Math.sin(angle),
        class: `dial-tick${major ? ' major' : medium ? ' medium' : ''}`,
      }));
    }
    tickGroup.replaceChildren(fragment);
  }
  if (degreeGroup) {
    const fragment = document.createDocumentFragment();
    for (let degree = 0; degree < 360; degree += 30) {
      const angle = (degree - 90) * Math.PI / 180;
      const label = svgNode('text', {
        x: 500 + 286 * Math.cos(angle), y: 500 + 286 * Math.sin(angle),
        'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'dial-degree',
      });
      label.textContent = String(degree).padStart(3, '0');
      fragment.appendChild(label);
    }
    degreeGroup.replaceChildren(fragment);
  }

  // Seeded particles make reviews reproducible. Density and pixel ratio are
  // capped; the canvas paints only when scroll/viewport state changes.
  const particles = Array.from({ length: 156 }, (_, i) => ({
    radius: Math.sqrt((i + .5) / 156), angle: i * 2.399963229728653,
    speed: .50 + (i % 11) * .045, size: .45 + (i % 5) * .27,
    gold: i % 7 === 0,
  }));
  let width = 0, height = 0, stageHeight = 1, maxUnits = 7.4;
  let reduced = media.matches;
  let units = 0, running = 0, lastTime = 0, currentChapter = -1, currentMicro = -1;
  let sceneVisible = true;
  let continuousScrolling = false;
  const originalSnapType = root.style.scrollSnapType;

  // Proximity snapping is useful for the four opening scenes, but its browser-
  // chosen capture radius can swallow the short final beats. Suspend it before
  // the resolution starts and through the CTA/pathways; re-enable only when
  // returning to the opening scenes. No wheel or touch event is intercepted.
  function syncSnap(u) {
    const continuous = u >= 3.35;
    if (continuous === continuousScrolling) return;
    continuousScrolling = continuous;
    root.style.scrollSnapType = continuous ? 'none' : originalSnapType;
  }

  function resize() {
    stageHeight = Math.max(1, stage.clientHeight);
    maxUnits = Math.max(1, (experience.offsetHeight - stageHeight) / stageHeight);
    if (!canvas || !ctx) return;
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || stageHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function renderParticles(u, q, chapter) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (reduced || width < 2) return;
    const mobile = width <= 700;
    const shortMobile = mobile && height <= 730;
    const centered = chapter === 4;
    const cx = width * (mobile || centered ? .50 : width <= 1000 ? .72 : .70);
    const centerY = centered
      ? (mobile ? (shortMobile ? .38 : .39) : height <= 650 ? .40 : .43)
      : mobile ? (chapter === 5 ? (shortMobile ? .27 : .29) : (shortMobile ? .31 : .34)) : .48;
    const cy = height * centerY;
    const extent = Math.min(width, height) * (mobile ? .64 : .77);
    const spiralStrength = smooth(.4, 1.1, u) * (1 - smooth(2.35, 3.4, u));
    const converging = smooth(.68, .89, q) * (1 - smooth(.90, .95, q));
    const strength = .15 + spiralStrength * .68 + converging * .35;
    const fixedU = Math.min(u, RESOLUTION_START + RESOLUTION_LENGTH * .95);
    const twist = fixedU * 2.4 + angleAt(Math.min(q, .95), DIAL_ANGLES) * Math.PI / 180 * .18;
    const count = mobile ? 96 : particles.length;
    for (let i = 0; i < count; i++) {
      const particle = particles[i];
      const depth = particle.radius ** 1.3;
      const angle = particle.angle + twist * particle.speed + (1 - depth) * 3;
      const radius = extent * depth * (1 - smooth(2.4, 3.5, u) * .12);
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle) * .8;
      if (x < 0 || x > width || y < 0 || y > height) continue;
      const alpha = strength * (.18 + .52 * (1 - depth));
      ctx.beginPath();
      ctx.fillStyle = particle.gold ? `rgba(236,204,144,${alpha})` : `rgba(120,200,198,${alpha})`;
      ctx.arc(x, y, particle.size * (.7 + .6 * (1 - depth)), 0, Math.PI * 2);
      ctx.fill();
      if (converging > .1 && i % 4 === 0) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(120,200,198,${alpha * .24 * converging})`;
        ctx.lineWidth = .65;
        ctx.moveTo(x, y);
        ctx.lineTo(x - Math.sin(angle) * 12 * converging, y + Math.cos(angle) * 9 * converging);
        ctx.stroke();
      }
    }
  }

  // Scope variables to affected SVG groups, not every descendant of the stage.
  function setVar(node, name, value) { node?.style.setProperty(name, String(value)); }
  const opacity = (node, name, value) => setVar(node, name, value.toFixed(4));
  function getUnits() { return clamp(-experience.getBoundingClientRect().top / stageHeight, 0, maxUnits); }
  function chapterAt(u) { return CHAPTER_BOUNDS.filter(bound => u >= bound).length; }
  function microAt(q) { return Math.max(0, MICRO_STARTS.filter(start => q >= start).length - 1); }

  function updateNarration(chapter, micro, q) {
    if (chapter !== currentChapter) {
      chapters.forEach(node => {
        const active = Number(node.dataset.chapter) === chapter;
        node.classList.toggle('active', active);
        node.setAttribute('aria-hidden', String(!active));
        node.inert = !active;
      });
      if (number) number.textContent = `${String(chapter).padStart(2, '0')} / 05`;
      if (previous) previous.disabled = chapter === 0;
      root.dataset.scene = String(chapter);
      currentChapter = chapter;
    }
    if (micro !== currentMicro) {
      root.dataset.micro = String(micro + 1);
      if (microNumber) microNumber.textContent = `4–${micro + 1}`;
      if (microLabel) microLabel.textContent = MICRO_LABELS[micro];
      microTrack.forEach((node, i) => {
        node.classList.toggle('complete', i < micro);
        node.classList.toggle('active', i === micro);
      });
      currentMicro = micro;
    }
    root.dataset.resolved = String(q >= .95);
    if (next) {
      const label = chapter === 5 ? '시작 방법 보기 ↓' : chapter === 4 ? (micro === 7 ? '분석으로 이어가기 ↓' : '다음 단계 ↓') : '다음 장면 ↓';
      if (next.textContent !== label) next.textContent = label;
    }
  }

  function draw(u) {
    root.classList.toggle('past-hero', experience.getBoundingClientRect().bottom < stageHeight);
    const q = clamp((u - RESOLUTION_START) / RESOLUTION_LENGTH);
    const chapter = chapterAt(u);
    const micro = microAt(q);
    const glyphChange = smooth(.28, 1.1, u);
    const spiralOpacity = smooth(.35, 1.0, u) * (1 - smooth(2.30, 2.95, u));
    const entrance = (start, end, beat) => reduced ? Number(micro >= beat) : smooth(start, end, q);
    opacity(sn, '--sn-opacity', 1 - glyphChange);
    setVar(sn, '--sn-scale', reduced ? 1 : lerp(1, .18, glyphChange).toFixed(4));
    setVar(sn, '--sn-rotation', `${reduced ? 0 : -62 * glyphChange}deg`);
    opacity(spiralField, '--spiral-opacity', spiralOpacity);
    setVar(spiralField, '--spiral-scale', reduced ? 1 : lerp(.68, 2.6, smooth(.7, 3.3, u)).toFixed(4));
    setVar(spiralField, '--spiral-rotation', `${reduced ? 0 : 460 * smooth(.6, 3.3, u)}deg`);
    opacity(point, '--dot-opacity', smooth(2.6, 3.0, u));
    setVar(point, '--dot-scale', reduced ? 1 : lerp(.88, 1, smooth(2.6, 3.4, u)).toFixed(4));
    opacity(compass, '--compass-opacity', u >= RESOLUTION_START ? 1 : 0);
    opacity(ring, '--ring-opacity', entrance(.205, .239, 1));
    opacity(axes, '--axis-opacity', entrance(.405, .442, 2));
    opacity(dial, '--dial-opacity', entrance(.575, .612, 3) * (reduced ? 1 : lerp(.78, 1, smooth(.88, .95, q))));
    opacity(marks, '--marks-opacity', entrance(.705, .744, 4));
    opacity(needle, '--needle-opacity', entrance(.80, .84, 5));
    opacity(trails, '--trail-opacity', reduced ? 0 : smooth(.80, .865, q) * (1 - smooth(.92, .95, q)) * .45);
    const needleRotation = `${reduced ? 0 : angleAt(q, NEEDLE_ANGLES).toFixed(3)}deg`;
    setVar(needle, '--needle-rotation', needleRotation);
    setVar(trails, '--needle-rotation', needleRotation);
    const dialRotation = `${reduced ? 0 : angleAt(q, DIAL_ANGLES).toFixed(3)}deg`;
    setVar(dial, '--dial-rotation', dialRotation);
    setVar(ring, '--dial-rotation', dialRotation);
    setVar(axes, '--dial-rotation', dialRotation);
    setVar(world, '--world-scale', 1);
    setVar(stage, '--resolve-glow', lerp(.16, 1, smooth(.82, .95, q)).toFixed(4));
    if (bar) {
      bar.style.transformOrigin = 'left';
      bar.style.width = '100%';
      bar.style.transform = `scaleX(${clamp(u / maxUnits).toFixed(5)})`;
    }
    updateNarration(chapter, micro, q);
    renderParticles(u, q, chapter);
  }

  function tick(time) {
    running = 0;
    if (document.hidden) return;
    const target = getUnits();
    const dt = lastTime ? Math.min(64, time - lastTime) : 16.67;
    lastTime = time;
    // Frame-rate-independent smoothing; idle means no scheduled frames at all.
    units = reduced ? target : units + (target - units) * (1 - Math.exp(-dt / 65));
    if (Math.abs(target - units) < .00015) units = target;
    draw(units);
    if (units !== target && sceneVisible) running = requestAnimationFrame(tick);
    else lastTime = 0;
  }
  function schedule() {
    if (!running && !document.hidden) running = requestAnimationFrame(tick);
  }
  function refreshMotion() {
    root.classList.toggle('reduced-motion', reduced);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(reduced));
      toggle.textContent = reduced ? '모션 켜기' : '모션 줄이기';
    }
    if (running) cancelAnimationFrame(running);
    running = 0;
    lastTime = 0;
    units = getUnits();
    syncSnap(units);
    draw(units);
  }

  function jumpTo(u, event) {
    if (u >= 3.35) syncSnap(u);
    const top = experience.getBoundingClientRect().top + window.scrollY + u * stageHeight;
    const instant = reduced || event?.detail === 0;
    window.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' });
    if (instant) { units = getUnits(); draw(units); }
  }
  function microStop(index) {
    const span = (MICRO_STARTS[index + 1] ?? 1) - MICRO_STARTS[index];
    return RESOLUTION_START + RESOLUTION_LENGTH * (MICRO_STARTS[index] + Math.min(.022, span * .24));
  }
  previous?.addEventListener('click', event => {
    // Use the displayed beat so an interrupted smooth scroll cannot skip ahead.
    const chapter = currentChapter;
    const micro = currentMicro;
    if (chapter === 5) jumpTo(microStop(7), event);
    else if (chapter === 4 && micro > 0) jumpTo(microStop(micro - 1), event);
    else jumpTo(MACRO_STOPS[Math.max(0, chapter - 1)], event);
  });
  next?.addEventListener('click', event => {
    const chapter = currentChapter;
    const micro = currentMicro;
    if (chapter === 5) {
      pathways?.scrollIntoView({ behavior: reduced || event.detail === 0 ? 'instant' : 'smooth', block: 'start' });
      pathways?.focus({ preventScroll: true });
    }
    else if (chapter === 4 && micro < 7) jumpTo(microStop(micro + 1), event);
    else if (chapter === 3) jumpTo(microStop(0), event);
    else jumpTo(MACRO_STOPS[chapter + 1], event);
  });
  toggle?.addEventListener('click', () => { reduced = !reduced; refreshMotion(); });
  const changeReduced = event => { reduced = event.matches; refreshMotion(); };
  if (typeof media.addEventListener === 'function') media.addEventListener('change', changeReduced);
  else media.addListener(changeReduced);
  window.addEventListener('scroll', () => { syncSnap(getUnits()); schedule(); }, { passive: true });
  window.addEventListener('resize', () => { resize(); units = getUnits(); schedule(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (running) cancelAnimationFrame(running);
      running = 0;
      lastTime = 0;
    } else schedule();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      sceneVisible = entries[0]?.isIntersecting ?? true;
      if (sceneVisible) schedule();
    });
    observer.observe(experience);
  }

  root.classList.add('motion-ready');
  resize();
  refreshMotion();
})();
