// 3D depth for the rest of the page: cards tilt towards the pointer, and sections turn into view as you scroll.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Tilt: the card leans towards the pointer, with a soft glare
  var TILT = '.flip-card, .fl-card, .certificate-card, .about-photo-3d';
  if (finePointer && !reduce) {
    document.querySelectorAll(TILT).forEach(function (el) {
      el.classList.add('tilt3d');
      var glare = document.createElement('span'); glare.className = 'tilt3d-glare'; glare.setAttribute('aria-hidden', 'true');
      el.appendChild(glare);
      var max = el.classList.contains('flip-card') ? 6 : 9, raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * max) + 'deg) rotateY(' + ((x - 0.5) * max) + 'deg) translateZ(6px)';
          el.style.setProperty('--gx', (x * 100) + '%'); el.style.setProperty('--gy', (y * 100) + '%');
        });
      });
      el.addEventListener('pointerleave', function () { cancelAnimationFrame(raf); el.style.transform = ''; });
    });
  }

  // Reveal: blocks rise and turn into place as they enter the screen
  if (reduce || !('IntersectionObserver' in window)) return;
  var REVEAL = '.section h2, #certificates h2, .flip-card, .fl-card, .certificate-card, .skills-shell, .testimonial, #contact .row > div';
  var items = Array.prototype.slice.call(document.querySelectorAll(REVEAL)).filter(function (el) { return !el.closest('[data-aos]') && !el.hasAttribute('data-aos'); });
  items.forEach(function (el) { el.classList.add('reveal3d'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sibs, 5) * 70 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
      setTimeout(function () { el.style.transitionDelay = ''; }, 1200);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
