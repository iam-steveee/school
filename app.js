(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const screens = $$('.intro-screen');
  const main = $('#main');
  const backTop = $('#backTop');

  // The chapter is always present underneath the intro screens. This is more
  // reliable than toggling display:none/display:block on GitHub Pages and
  // prevents a blank page if a browser handles the transition oddly.
  document.body.classList.add('intro-locked');

  function showScreen(id) {
    screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
  }

  function enterChapter() {
    screens.forEach(screen => screen.classList.remove('active'));
    document.body.classList.remove('intro-locked');
    if (main) main.classList.add('live');
    window.scrollTo(0, 0);
    revealVisible();
  }

  $$('.continue-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const next = button.dataset.next;
      if (next === 'main') {
        enterChapter();
      } else if (next && document.getElementById(next)) {
        showScreen(next);
        window.scrollTo(0, 0);
      }
    });
  });

  function revealVisible() {
    $$('.reveal', main || document).forEach(element => {
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

    $$('.reveal', main || document).forEach(element => observer.observe(element));
  } else {
    $$('.reveal', main || document).forEach(element => element.classList.add('visible'));
  }

  // Subtle card tilt on mouse/trackpad devices only.
  if (window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
    $$('[data-tilt]', main || document).forEach(card => {
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

  // If an external diagram fails, keep the themed frame instead of leaving
  // broken-image space.
  $$('img').forEach(img => {
    img.addEventListener('error', () => {
      if (img.closest('.meme-frame')) {
        img.style.display = 'none';
        const frame = img.closest('.meme-frame');
        frame.classList.add('image-missing');
      }
    });
  });

  // Initial reveal for the first viewport.
  revealVisible();
})();
