(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const screens = $$('.intro-screen');
  const main = $('#main');
  $$('.continue-btn').forEach(btn => btn.addEventListener('click', () => {
    const next = btn.dataset.next;
    screens.forEach(s => s.classList.remove('active'));
    if (next === 'main') {
      main.classList.add('live');
      document.body.style.overflow = '';
      requestAnimationFrame(() => window.scrollTo({top:0, behavior:'instant'}));
      revealAll();
    } else {
      $('#' + next).classList.add('active');
    }
  }));
  function revealAll(){
    $$('.reveal', main).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * .95) el.classList.add('visible');
    });
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);} });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  $$('.reveal', main).forEach(el => observer.observe(el));
  $$('[data-tilt]', main).forEach(card => {
    if (!matchMedia('(pointer:fine)').matches) return;
    card.addEventListener('pointermove', e => {
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
  const backTop=$('#backTop');
  addEventListener('scroll',()=>backTop.classList.toggle('show',scrollY>700),{passive:true});
  backTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  // Keep the welcome overlay from locking the page before entry.
  document.body.style.overflow='hidden';
})();
