// ============================================================
  // IMAGE SETUP
  // ============================================================
  const IMAGES = {
    heroPhoto:     "58551785398886756.jpeg",
    aboutPhoto:    "fab00efed15151ee843e1e2b0d716dcd.jpg",
    doctorPhoto:   "Screenshot 2026-09-09 141227.png",
    gallery1:      "78251785399695371.jpeg",
    gallery2:      "28101785399680933.jpeg",
    gallery3:      "48781785399733046.jpeg",
    gallery4:      "93701785399630973.jpeg",
    gallery5:      "",
    testimonial1:  "35361785399940268.jpeg",
    testimonial2:  "16171785399894957.jpeg",
    testimonial3:  "89201785399816841.jpeg"
  };

  document.querySelectorAll('.img-slot').forEach(slot => {
    const key = slot.dataset.slot;
    const url = IMAGES[key];
    if (url) {
      const img = slot.querySelector('img');
      if (!img) return;
      img.src = url;
      img.addEventListener('load', () => slot.classList.add('has-img'));
      img.addEventListener('error', () => slot.classList.remove('has-img'));
    }
  });

  // Put the same hospital logo used in the header above the footer paragraph.
  const headerLogo = document.querySelector('.brand img');
  const footerLogo = document.getElementById('footerLogo');
  if (headerLogo && footerLogo) {
    footerLogo.src = headerLogo.src;
  }

  // Header shadow + scroll progress + back-to-top.
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  let ticking = false;

  function updateScrollUI(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = percent + '%';
    header.classList.toggle('scrolled', window.scrollY > 12);
    backTop.classList.toggle('show', window.scrollY > 500);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, {passive:true});
  updateScrollUI();

  backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Mobile nav toggle.
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
    }));
  }

  // Smooth anchor scrolling with sticky-header offset.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      const target = id && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 12;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({top:y, behavior:'smooth'});
    });
  });

  // Hero entrance.
  window.addEventListener('load', () => {
    const heroText = document.getElementById('heroText');
    const heroArt = document.getElementById('heroArt');
    if (heroText) heroText.classList.add('play');
    if (heroArt) heroArt.classList.add('play');
  });

  // Scroll reveal for sections/cards.
  const revealTargets = [
    '.sec-head', '.about-visual', '.about-copy', '.vm-card', '.doc-card', '.doc-copy',
    '.svc-card', '.stat', '.feat', '.gtile', '.testi-card', '.faq-list', '.contact-info', '.map-frame'
  ];
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal-on-scroll');
      if (index % 4 === 1) el.classList.add('delay-1');
      if (index % 4 === 2) el.classList.add('delay-2');
      if (index % 4 === 3) el.classList.add('delay-3');
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

  // FAQ accordion.
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    if(item.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px';
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Stat counters — animate once when visible.
  const counters = document.querySelectorAll('.stat b');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1200;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + (p === 1 ? suffix : '');
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      }
    });
  }, {threshold:0.6});
  counters.forEach(c => counterObs.observe(c));

  // Gentle image parallax while scrolling.
  const parallaxItems = document.querySelectorAll('.hero-art, .about-visual');
  window.addEventListener('scroll', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    parallaxItems.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const center = rect.top + rect.height / 2;
        const distance = (center - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = 'translate3d(0,' + (distance * -10).toFixed(2) + 'px,0)';
      }
    });
  }, {passive:true});

  // Lightweight 3D tilt for cards on pointer devices.
  const tiltCards = document.querySelectorAll('.svc-card, .testi-card, .vm-card, .doc-card, .feat');
  const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (canHover) {
    tiltCards.forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 3).toFixed(2) + 'deg) rotateY(' + (x * 3).toFixed(2) + 'deg) translateY(-5px)';
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
