(() => {
  'use strict';
  const experience = document.getElementById('intro');
  const stage = document.getElementById('cinema-stage');
  const sn = document.getElementById('sn-glyph');
  const spiralField = document.getElementById('spiral-field');
  const canvas = document.getElementById('vortex');
  const ctx = canvas.getContext('2d', { alpha: true });
  const toggle = document.getElementById('motion-toggle');
  const bar = document.getElementById('scroll-progress');
  const number = document.getElementById('scene-number');
  const chapters = [...document.querySelectorAll('.chapter')];
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const bounds = [0, .16, .32, .49, .64, .80, 1.01];
  const clamp = (x, min=0, max=1) => Math.min(max, Math.max(min, x));
  const smooth = (a, b, x) => { const t = clamp((x-a)/(b-a)); return t*t*(3-2*t); };
  const lerp = (a,b,t) => a+(b-a)*t;

  // Each editable spiral arm is real SVG, not a pre-rendered video.
  // Scroll changes opacity/rotation/scale; the small particles add spatial depth.
  for (let arm=0; arm<4; arm++) {
    const maxA = 9.1*Math.PI;
    const pts = [];
    for (let k=0; k<=660; k++) {
      const v = k/660;
      const r = 447*Math.pow(1-v,1.32) + 4 + arm*11*(1-v);
      const a = v*maxA + arm*Math.PI/2;
      pts.push((k ? 'L' : 'M') + (500+r*Math.cos(a)).toFixed(2) + ' ' + (500+r*Math.sin(a)).toFixed(2));
    }
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pts.join(' '));
    path.setAttribute('stroke-width', arm===0 ? '3.4' : String(Math.max(1.0, 2.7-arm*.45)));
    path.setAttribute('opacity', String(.91-arm*.14));
    path.classList.add('spiral-arm');
    spiralField.appendChild(path);
  }

  // Consistent seeded geometry allows reproducible visual QA screenshots.
  const particles = Array.from({length:260}, (_,i) => ({
    radius: Math.sqrt((i+.5)/260),
    angle: i*2.399963229728653,
    speed: .55+(i%11)*.052,
    size: .5+(i%6)*.31,
    hue: i%9===0 ? 1 : 0,
    phase: (i*53%97)/97,
  }));
  let width=0,height=0,dpr=1;
  function resize() {
    width=canvas.clientWidth || window.innerWidth;
    height=canvas.clientHeight || window.innerHeight;
    dpr=Math.min(window.devicePixelRatio || 1, 2);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function renderParticles(p) {
    ctx.clearRect(0,0,width,height);
    if (reduced || !ctx || width<2) return;
    const strength = smooth(.12,.25,p)*(1-smooth(.45,.54,p));
    if(strength < .004) return;
    const mobile=width<860;
    const cx=width*(mobile?.50:.56), cy=height*(mobile?.38:.46);
    const extent=Math.min(width,height)*(mobile?.65:.77);
    const twist = p*24;
    for(const q of particles){
      const depth=Math.pow(q.radius,1.3);
      const angle=q.angle + twist*q.speed + (1-depth)*5;
      const radius=extent*depth*(1.05-smooth(.29,.54,p)*.53);
      const x=cx+radius*Math.cos(angle);
      const y=cy+radius*Math.sin(angle)*.76;
      if(x<0||x>width||y<0||y>height) continue;
      const alpha=strength*(.10+.70*(1-depth))*(.65+.35*Math.sin(p*16+q.phase*5)**2);
      ctx.beginPath();ctx.fillStyle=q.hue?`rgba(248,208,140,${alpha})`:`rgba(119,205,204,${alpha})`;
      ctx.arc(x,y,q.size*(.7+1.25*(1-depth)),0,2*Math.PI);ctx.fill();
    }
  }

  let reduced=media.matches, progress=0, nextProgress=0, running=0, currentChapter=-1;
  let sceneVisible=true;
  function getProgress(){
    const box=experience.getBoundingClientRect();
    const len=Math.max(1,experience.offsetHeight-window.innerHeight);
    return clamp(-box.top/len);
  }
  function setVar(name, val){stage.style.setProperty(name,String(val));}
  function draw(value){
    const p=reduced ? .985 : value;
    const snChange=smooth(.14,.35,p);
    const spiralAppear=smooth(.12,.25,p)*(1-smooth(.44,.54,p));
    const tunnel=smooth(.23,.51,p);
    const dotAppear=smooth(.43,.55,p)*(1-smooth(.68,.81,p));
    const compassAppear=smooth(.62,.80,p);
    const flash=smooth(.47,.51,p)*(1-smooth(.58,.65,p));
    setVar('--sn-opacity',(1-snChange).toFixed(3));
    setVar('--sn-scale',lerp(1,.09,snChange).toFixed(3));
    setVar('--sn-rotation',(-62*snChange).toFixed(2)+'deg');
    setVar('--spiral-opacity',spiralAppear.toFixed(3));
    setVar('--spiral-scale',lerp(.55,3.85,tunnel).toFixed(3));
    setVar('--spiral-rotation',(720*smooth(.16,.55,p)).toFixed(1)+'deg');
    setVar('--dot-opacity',dotAppear.toFixed(3));
    setVar('--dot-scale',lerp(.20,1.0,smooth(.50,.66,p)).toFixed(3));
    setVar('--compass-opacity',compassAppear.toFixed(3));
    setVar('--compass-scale',lerp(.14,1,compassAppear).toFixed(3));
    setVar('--compass-rotation',(-160*(1-compassAppear)).toFixed(2)+'deg');
    setVar('--world-scale',lerp(.94,1.16,smooth(.12,.40,p)).toFixed(3));
    setVar('--grid-scale',lerp(1,1.75,smooth(.24,.58,p)).toFixed(3));
    setVar('--flash-opacity',(.4*flash).toFixed(3));
    canvas.style.opacity=spiralAppear.toFixed(3);
    const chapter = Math.max(0, Math.min(5, bounds.findIndex((lo,j)=>p>=lo&&p<bounds[j+1])));
    if(chapter!==currentChapter){
      chapters.forEach((node,i)=>{const active=i===chapter;node.classList.toggle('active',active);node.setAttribute('aria-hidden',String(!active));});
      number.textContent=String(chapter+1).padStart(2,'0')+' / 06';
      currentChapter=chapter;
    }
    bar.style.width=(p*100).toFixed(1)+'%';
    renderParticles(p);
    document.documentElement.dataset.scene=String(chapter+1);
  }
  function tick(){
    nextProgress=getProgress();
    if(reduced){progress=.985;draw(progress);running=0;return;}
    progress+=(nextProgress-progress)*.18;
    if(Math.abs(nextProgress-progress)<.0003)progress=nextProgress;
    draw(progress);
    if(Math.abs(nextProgress-progress)>.0003 && sceneVisible){running=requestAnimationFrame(tick);}else running=0;
  }
  function schedule(){if(!running){running=requestAnimationFrame(tick);}}
  function refreshMotion(){
    document.documentElement.classList.toggle('reduced-motion',reduced);
    toggle.setAttribute('aria-pressed',String(reduced));
    toggle.textContent=reduced?'모션 다시 켜기':'모션 줄이기';
    if(running)cancelAnimationFrame(running);
    running=0;
    if(!reduced){progress=getProgress();}
    schedule();
  }
  toggle.addEventListener('click',()=>{reduced=!reduced;refreshMotion();});
  const changeReduced=e=>{reduced=e.matches;refreshMotion();};
  if(typeof media.addEventListener==='function')media.addEventListener('change',changeReduced);
  else if(typeof media.addListener==='function')media.addListener(changeReduced);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',()=>{resize();schedule();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
  const observer=new IntersectionObserver(entries=>{sceneVisible=entries[0]?.isIntersecting??true;if(sceneVisible)schedule();},{threshold:0});
  observer.observe(experience);
  resize();refreshMotion();
})();
