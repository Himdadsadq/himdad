'use strict';

const menuToggle = document.querySelector('[data-menu-toggle]');
const headerNav = document.querySelector('.header-nav');
if (menuToggle && headerNav) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.addEventListener('click', () => {
    const open = headerNav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

const pageArticles = [...document.querySelectorAll('article[data-page]')];
const navLinks = [...document.querySelectorAll('[data-nav-link]')];
function showPage(page) {
  const target = page === 'contact' ? 'about' : page;
  pageArticles.forEach(article => article.classList.toggle('active', article.dataset.page === target));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', (link.dataset.page || '') === page || (page === 'contact' && link.dataset.page === 'contact')));
  document.querySelectorAll('.navbar-link').forEach(link => link.classList.toggle('active', link.textContent.trim().toLowerCase() === target));
}
navLinks.forEach(link => link.addEventListener('click', event => {
  const page = link.dataset.page || link.textContent.trim().toLowerCase();
  if (page === 'home') {
    event.preventDefault();
    showPage('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (page === 'contact') {
    event.preventDefault();
    showPage('contact');
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    event.preventDefault();
    showPage(page);
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  }
  headerNav?.classList.remove('active');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const scrollTopBtn = document.getElementById('scroll-top-btn');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  const updateScrollTop = () => {
    const visible = window.scrollY > 400;
    scrollTopBtn.style.visibility = visible ? 'visible' : 'hidden';
    scrollTopBtn.style.opacity = visible ? '0.95' : '0';
  };
  window.addEventListener('scroll', updateScrollTop, { passive: true });
  updateScrollTop();
}

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
sidebarBtn?.addEventListener('click', () => sidebar?.classList.toggle('active'));

const modalContainer = document.querySelector('[data-modal-container]');
const overlay = document.querySelector('[data-overlay]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');
function closeTestimonial() { modalContainer?.classList.remove('active'); overlay?.classList.remove('active'); }
document.querySelectorAll('[data-testimonials-item]').forEach(item => item.addEventListener('click', () => {
  const avatar = item.querySelector('[data-testimonials-avatar]');
  if (modalImg && avatar) { modalImg.src = avatar.src; modalImg.alt = avatar.alt; }
  if (modalTitle) modalTitle.textContent = item.querySelector('[data-testimonials-title]')?.textContent || '';
  if (modalText) modalText.textContent = item.querySelector('[data-testimonials-text]')?.textContent || '';
  modalContainer?.classList.add('active'); overlay?.classList.add('active');
}));
modalCloseBtn?.addEventListener('click', closeTestimonial);
overlay?.addEventListener('click', closeTestimonial);

const filterItems = [...document.querySelectorAll('[data-filter-item]')];
function filterProjects(value) {
  const category = value === 'mobile applications' ? 'applications' : value;
  filterItems.forEach(item => item.classList.toggle('active', category === 'all' || item.dataset.category === category));
}
let lastFilter = document.querySelector('[data-filter-btn].active');
document.querySelectorAll('[data-filter-btn]').forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.filterValue || button.textContent.trim().toLowerCase();
  filterProjects(value);
  lastFilter?.classList.remove('active');
  lastFilter?.setAttribute('aria-pressed', 'false');
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  lastFilter = button;
}));

const form = document.querySelector('[data-form]');
const formBtn = document.querySelector('[data-form-btn]');
form?.querySelectorAll('[data-form-input]').forEach(input => input.addEventListener('input', () => {
  if (form.checkValidity()) formBtn?.removeAttribute('disabled'); else formBtn?.setAttribute('disabled', '');
}));

const heroVideoOpenBtn = document.querySelector('[data-hero-video-open]');
const heroVideoModal = document.querySelector('[data-hero-video-modal]');
const heroVideoPlayer = document.querySelector('[data-hero-video-player]');
function setHeroVideoOpen(open) {
  if (!heroVideoModal) return;
  heroVideoModal.classList.toggle('active', open);
  heroVideoModal.setAttribute('aria-hidden', String(!open));
  if (!heroVideoPlayer) return;
  if (open) { heroVideoPlayer.currentTime = 0; heroVideoPlayer.play().catch(() => {}); }
  else { heroVideoPlayer.pause(); heroVideoPlayer.currentTime = 0; }
}
heroVideoOpenBtn?.addEventListener('click', event => { event.preventDefault(); setHeroVideoOpen(true); });
document.querySelectorAll('[data-hero-video-close]').forEach(element => element.addEventListener('click', () => setHeroVideoOpen(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setHeroVideoOpen(false); closeTestimonial();
    const imageModal = document.getElementById('imageModal'); if (imageModal) imageModal.style.display = 'none';
    headerNav?.classList.remove('active'); menuToggle?.setAttribute('aria-expanded', 'false');
  }
});
