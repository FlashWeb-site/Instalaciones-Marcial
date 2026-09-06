/* ==================================================
   Instalaciones Marcial S.L. — Interacciones
   ================================================== */
(function () {
  'use strict';

  var d = document;
  d.documentElement.classList.add('js');

  /* ---------- Año actual en el pie ---------- */
  var yearEl = d.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Cabecera al hacer scroll ---------- */
  var header = d.getElementById('site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  var toggle = d.getElementById('nav-toggle');
  var nav = d.getElementById('site-nav');
  function closeMenu() {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }
  toggle.addEventListener('click', function () {
    var abierto = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Acordeón de preguntas frecuentes ---------- */
  var faqItems = d.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function () {
      var yaAbierto = item.classList.contains('open');
      faqItems.forEach(function (otro) {
        otro.classList.remove('open');
        otro.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!yaAbierto) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Animaciones al entrar en pantalla ---------- */
  var revealEls = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Enlace activo en el menú ---------- */
  var secciones = d.querySelectorAll('main section[id]');
  var enlaces = d.querySelectorAll('.site-nav a[href^="#"]');
  if ('IntersectionObserver' in window && secciones.length && enlaces.length) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          enlaces.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Estado abierto / cerrado según horario ----------
     L-J: 8:30–18:30 · V: 8:30–13:30 · S y D: cerrado        */
  var statusEls = d.querySelectorAll('[data-open-status]');
  var HORARIO = { 1: [510, 1110], 2: [510, 1110], 3: [510, 1110], 4: [510, 1110], 5: [510, 810] };
  var DIAS = { 0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miércoles', 4: 'jueves', 5: 'viernes', 6: 'sábado' };

  function fmt(mins) {
    var h = String(Math.floor(mins / 60)).padStart(2, '0');
    var m = String(mins % 60).padStart(2, '0');
    return h + ':' + m;
  }

  function actualizarEstado() {
    var ahora = new Date();
    var dia = ahora.getDay();
    var mins = ahora.getHours() * 60 + ahora.getMinutes();
    var hoy = HORARIO[dia];
    var abierto = !!(hoy && mins >= hoy[0] && mins < hoy[1]);
    var texto;

    if (abierto) {
      texto = 'Abierto ahora · hoy hasta las ' + fmt(hoy[1]);
    } else {
      for (var i = 0; i < 8; i++) {
        var dd = (dia + i) % 7;
        var s = HORARIO[dd];
        if (!s) continue;
        if (i === 0) texto = 'Cerrado · abrimos hoy a las ' + fmt(s[0]);
        else if (i === 1) texto = 'Cerrado · abrimos mañana a las ' + fmt(s[0]);
        else texto = 'Cerrado · abrimos el ' + DIAS[dd] + ' a las ' + fmt(s[0]);
        break;
      }
    }

    statusEls.forEach(function (el) { el.textContent = texto; });
    d.querySelectorAll('.status-dot').forEach(function (dot) {
      dot.classList.toggle('is-open', abierto);
    });
  }

  if (statusEls.length) {
    actualizarEstado();
    setInterval(actualizarEstado, 60000);
  }
})();
