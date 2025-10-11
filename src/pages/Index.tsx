import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PalestrasSection from "@/components/PalestrasSection";
import ProgrammingSection from "@/components/ProgrammingSection";
import PortfolioSection from "@/components/PortfolioSection";
import CoursesSection from "@/components/CoursesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth relative z-[1]">

      <Navigation />
      <HeroSection />
      <AboutSection />
      <PalestrasSection />
      <ProgrammingSection />
      <PortfolioSection />
      <CoursesSection />
      <BlogSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
      <ScrollToTop />
      
      {/* Matrix Effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
  html, body { background:#0a0a0a; }

  /* Canvas: entre overlays e conteúdo */
  #matrix-canvas{
    position:fixed !important;
    top:0; left:0; width:100vw; height:100vh;
    display:block !important;
    pointer-events:none;
    z-index:5 !important;              /* acima dos overlays, abaixo do texto */
    opacity:.35;
    background:radial-gradient(900px 600px at 70% -10%, rgba(0,255,136,.08), transparent), #0a0a0a;
  }

  /* Conteúdo/menus SEMPRE acima do canvas */
  header, main, section, footer,
  #root, #__next, [data-lovable-root]{
    position:relative;
    z-index:10 !important;
  }
        `
      }} />
      
      <script dangerouslySetInnerHTML={{
        __html: `
(() => {
  /* 1) Garante o canvas no <body> */
  let cvs = document.getElementById('matrix-canvas');
  if (!cvs){
    cvs = document.createElement('canvas');
    cvs.id = 'matrix-canvas';
    cvs.setAttribute('aria-hidden','true');
    document.body.prepend(cvs);
  } else if (cvs.parentElement !== document.body){
    document.body.prepend(cvs);
  }

  /* 2) Rebaixa overlays da Hero (ficam ABAIXO do canvas) */
  const heroOverlays = document.querySelectorAll(
    '[data-lov-id^="src/components/HeroSection"] .absolute,'+
    '[data-lov-id^="src/components/HeroSection"] [class*="absolute"][class*="inset-0"]'
  );
  heroOverlays.forEach(el => {
    el.style.position = 'absolute';
    el.style.zIndex = '3';           // abaixo do canvas (5)
    el.style.pointerEvents = 'none'; // overlay não intercepta cliques
  });

  /* 3) Sobe Hero e Header (texto/menus) acima do canvas */
  const hero = document.querySelector('[data-lov-id^="src/components/HeroSection"]');
  if (hero){ hero.style.position='relative'; hero.style.zIndex='12'; }
  const nav  = document.querySelector('[data-lov-id^="src/components/Navigation"]');
  if (nav){  nav.style.position='relative';  nav.style.zIndex='14'; }

  /* 4) Botão toggle (reutiliza se já existir) */
  let btn = document.getElementById('toggle-matrix');
  if (!btn){
    btn = document.createElement('button');
    btn.id = 'toggle-matrix';
    btn.setAttribute('aria-label', 'Alternar animação Matrix');
    Object.assign(btn.style, {
      position:'fixed', right:'1rem', bottom:'1rem', zIndex:'50',
      padding:'.55rem .85rem', borderRadius:'.7rem',
      border:'1px solid rgba(255,255,255,.2)',
      background:'rgba(20,20,20,.6)', backdropFilter:'blur(8px)',
      color:'#E6FFE6', fontWeight:'600'
    });
    document.body.appendChild(btn);
  }

  /* 5) Animação */
  const ctx = cvs.getContext('2d', { alpha:true });
  const st = {
    run:true, cols:0, drops:[], fs:16,
    chars:'アァカサタナハマヤャラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#*@+-<>~',
    fade:0.08, color:'#00FF88'
  };

  const size = () => {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio||1, 2));
    const vw = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    cvs.width = Math.floor(vw*dpr); cvs.height = Math.floor(vh*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    st.fs = Math.max(14, Math.floor(vw/80));
    st.cols = Math.ceil(vw/st.fs);
    st.drops = Array.from({length:st.cols}, () => Math.floor(Math.random()*-50));
    ctx.font = \`\${st.fs}px monospace\`;
  };

  const draw = () => {
    if (!st.run) return;
    ctx.fillStyle = \`rgba(0,0,0,\${st.fade})\`;
    ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.fillStyle = st.color;
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    for (let i=0;i<st.cols;i++){
      const x=i*st.fs, y=st.drops[i]*st.fs;
      const ch=st.chars.charAt(Math.floor(Math.random()*st.chars.length));
      ctx.fillText(ch,x,y);
      if (y>vh && Math.random()>0.975) st.drops[i]=0; else st.drops[i]++;
    }
  };

  let raf;
  const loop=()=>{ if(!st.run) return; draw(); raf=requestAnimationFrame(loop); };

  const setLabel=()=>{ btn.textContent = \`Matrix: \${st.run?'On':'Off'}\`; btn.setAttribute('aria-pressed', String(st.run)); };
  btn.onclick=()=>{ st.run=!st.run; setLabel(); st.run?loop():cancelAnimationFrame(raf); };

  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) st.run=false;
  document.addEventListener('visibilitychange', ()=>{
    if (document.hidden){ st.run=false; cancelAnimationFrame(raf); setLabel(); }
    else if(!prefersReduced){ st.run=true; setLabel(); loop(); }
  });
  window.addEventListener('resize', size, { passive:true });

  size(); setLabel(); if (st.run) loop();
})();
        `
      }} />
    </div>
  );
};

export default Index;