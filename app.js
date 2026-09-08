(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const backTop = $('#backTop');

  // Everything is intentionally on one scrollable page. No screen switching,
  // no hidden chapter, and no transition state that can produce a blank page.
  function revealVisible() {
    $$('.reveal').forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.08) element.classList.add('visible');
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    $$('.reveal').forEach(element => observer.observe(element));
  } else {
    $$('.reveal').forEach(element => element.classList.add('visible'));
  }

  if (window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 700);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // A failed remote image never gets to break the layout.
  $$('img').forEach(img => {
    img.addEventListener('error', () => {
      if (img.closest('.meme-frame')) {
        img.style.display = 'none';
        img.closest('.meme-frame').classList.add('image-missing');
      }
    });
  });

  revealVisible();
})();
