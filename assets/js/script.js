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

const showreelOpenBtn = document.querySelector('[data-hero-video-open]');
const showreelModal = document.querySelector('[data-hero-video-modal]');
const showreelStage = document.querySelector('[data-showreel-stage]');
const showreelCounter = document.querySelector('[data-showreel-count]');
const showreelProgress = document.querySelector('[data-showreel-progress]');
const showreelPlayBtn = document.querySelector('[data-showreel-play]');
const showreelPlayIcon = document.querySelector('[data-showreel-play-icon]');
const showreelPlayLabel = document.querySelector('[data-showreel-play-label]');
const showreelPrevBtn = document.querySelector('[data-showreel-prev]');
const showreelNextBtn = document.querySelector('[data-showreel-next]');
const showreelCloseBtn = document.querySelector('.showreel-close');
const reducedMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let showreelProjects = [];
let showreelIndex = -1;
let showreelTimer = null;
let showreelTransitionTimer = null;
let showreelPlaying = false;
let showreelKeyHandler = null;

const textOf = (element, selector) => element.querySelector(selector)?.textContent.trim() || '';
function readPortfolioProjects() {
  return [...document.querySelectorAll('.project-list [data-filter-item]')].map((card, index) => {
    const image = card.querySelector('.project-img img');
    const category = card.dataset.category === 'web development' ? 'Web Development' : 'Mobile App';
    const projectLinks = [...card.querySelectorAll('a[href]')]
      .map(anchor => {
        const rawHref = anchor.getAttribute('href')?.trim() || '';
        if (!rawHref || rawHref.startsWith('#') || /^(javascript|mailto|tel):/i.test(rawHref)) return null;
        const url = new URL(rawHref, window.location.href);
        return /^https?:$/.test(url.protocol) ? { href: url.href, label: anchor.textContent.trim() } : null;
      })
      .filter(Boolean);
    const preferredLink = card.querySelector('.project-preview-link[href], .project-img a[href]');
    const preferredRawHref = preferredLink?.getAttribute('href')?.trim() || '';
    const preferredHref = preferredRawHref && !preferredRawHref.startsWith('#') && !/^(javascript|mailto|tel):/i.test(preferredRawHref)
      ? new URL(preferredRawHref, window.location.href)
      : null;
    const link = (preferredHref && /^https?:$/.test(preferredHref.protocol))
      ? { href: preferredHref.href, label: preferredLink.textContent.trim() }
      : projectLinks[0];
    const description = textOf(card, '.project-description, [data-project-description], .project-summary')
      || (category === 'Mobile App' ? 'Mobile application project.' : 'Web development project.');
    const technologySource = card.querySelector('.project-technologies, .project-tech, [data-project-technologies]');
    const technologies = technologySource ? technologySource.textContent.split(/[|,]/).map(value => value.trim()).filter(Boolean) : [];
    return {
      index: index + 1,
      name: textOf(card, '.project-title') || `Project ${index + 1}`,
      category,
      description,
      image: image?.getAttribute('src') || '',
      imageAlt: image?.getAttribute('alt') || textOf(card, '.project-title'),
      link,
      technologies
    };
  });
}

function clearShowreelTimer() {
  if (showreelTimer !== null) window.clearTimeout(showreelTimer);
  showreelTimer = null;
}
function updateShowreelControls() {
  const total = showreelProjects.length;
  const shown = Math.max(0, Math.min(total, showreelIndex + 1));
  showreelCounter.textContent = `${String(shown).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  showreelProgress.style.width = `${total ? (shown / total) * 100 : 0}%`;
  showreelPrevBtn.disabled = showreelIndex < 0;
  showreelNextBtn.disabled = showreelIndex >= total;
  showreelPlayIcon.setAttribute('name', showreelPlaying ? 'pause-outline' : 'play-outline');
  showreelPlayLabel.textContent = showreelPlaying ? 'Pause' : 'Play';
  showreelPlayBtn.setAttribute('aria-label', showreelPlaying ? 'Pause presentation' : 'Play presentation');
}
function addText(parent, tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = content;
  parent.append(node);
  return node;
}
function makeIntroSlide() {
  const slide = document.createElement('article');
  slide.className = 'showreel-slide showreel-intro';
  addText(slide, 'span', 'showreel-intro-mark', 'H');
  addText(slide, 'p', 'showreel-kicker', 'A collection of selected work');
  addText(slide, 'h1', '', 'Welcome to My Creative World').id = 'showreel-title';
  addText(slide, 'p', 'showreel-intro-subtitle', 'Explore My Work & Projects');
  addText(slide, 'p', 'showreel-intro-caption', 'Mobile applications · Web development · Digital experiences');
  return slide;
}
function makeProjectSlide(project) {
  const slide = document.createElement('article');
  slide.className = 'showreel-slide showreel-project-slide';
  const preview = document.createElement('div');
  preview.className = 'showreel-preview';
  if (project.image) {
    const image = document.createElement('img');
    image.src = new URL(project.image, window.location.href).href;
    image.alt = project.imageAlt;
    image.loading = 'eager';
    preview.append(image);
  } else {
    addText(preview, 'span', 'showreel-preview-fallback', project.name);
  }
  slide.append(preview);

  const details = document.createElement('div');
  details.className = 'showreel-details';
  const meta = document.createElement('div');
  meta.className = 'showreel-project-meta';
  addText(meta, 'span', 'showreel-project-number', `PROJECT ${String(project.index).padStart(2, '0')}`);
  addText(meta, 'span', 'showreel-project-category', project.category);
  details.append(meta);
  addText(details, 'h2', '', project.name).id = 'showreel-title';
  addText(details, 'p', 'showreel-description', project.description);

  if (project.technologies.length) {
    const techList = document.createElement('ul');
    techList.className = 'showreel-technologies';
    project.technologies.forEach(technology => addText(techList, 'li', '', technology));
    details.append(techList);
  }
  if (project.link) {
    const link = document.createElement('a');
    link.className = 'showreel-project-link';
    link.href = project.link.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(document.createTextNode('View Project '));
    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'arrow-up-outline');
    icon.setAttribute('aria-hidden', 'true');
    link.append(icon);
    details.append(link);
  }
  slide.append(details);
  return slide;
}
function makeFinalSlide() {
  const slide = document.createElement('article');
  slide.className = 'showreel-slide showreel-final';
  addText(slide, 'span', 'showreel-intro-mark', 'H');
  addText(slide, 'p', 'showreel-kicker', 'That’s the collection');
  addText(slide, 'h1', '', 'Thanks for Watching!').id = 'showreel-title';
  addText(slide, 'p', 'showreel-intro-subtitle', "Have a project in mind? Let's work together.");
  const contact = document.createElement('button');
  contact.type = 'button';
  contact.className = 'showreel-contact-link';
  contact.append(document.createTextNode('Contact Me '));
  const icon = document.createElement('ion-icon');
  icon.setAttribute('name', 'arrow-forward-outline');
  icon.setAttribute('aria-hidden', 'true');
  contact.append(icon);
  contact.addEventListener('click', () => {
    closeShowreel();
    document.querySelector('.nav-link[data-page="contact"]')?.click();
  });
  slide.append(contact);
  return slide;
}
function renderShowreelSlide(index) {
  showreelIndex = Math.max(-1, Math.min(showreelProjects.length, index));
  if (showreelTransitionTimer !== null) window.clearTimeout(showreelTransitionTimer);
  showreelStage.querySelectorAll('.showreel-slide-leaving').forEach(slide => slide.remove());
  const previousSlide = showreelStage.firstElementChild;
  if (previousSlide) {
    previousSlide.querySelector('#showreel-title')?.removeAttribute('id');
    previousSlide.classList.add('showreel-slide-leaving');
    showreelTransitionTimer = window.setTimeout(() => { previousSlide.remove(); showreelTransitionTimer = null; }, reducedMotionPreference.matches ? 0 : 360);
  }
  const slide = showreelIndex < 0
    ? makeIntroSlide()
    : showreelIndex >= showreelProjects.length
      ? makeFinalSlide()
      : makeProjectSlide(showreelProjects[showreelIndex]);
  showreelStage.append(slide);
  updateShowreelControls();
  if (showreelPlaying && showreelIndex >= showreelProjects.length) setShowreelPlaying(false);
  else if (showreelPlaying) scheduleShowreelAdvance();
}
function scheduleShowreelAdvance() {
  clearShowreelTimer();
  if (!showreelPlaying) return;
  const delay = showreelIndex < 0 ? 2800 : 5600;
  showreelTimer = window.setTimeout(() => {
    if (showreelIndex < showreelProjects.length) renderShowreelSlide(showreelIndex + 1);
    else setShowreelPlaying(false);
  }, delay);
}
function setShowreelPlaying(playing) {
  showreelPlaying = playing;
  if (!playing) clearShowreelTimer();
  updateShowreelControls();
  if (playing) scheduleShowreelAdvance();
}
function handleShowreelKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeShowreel();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (showreelIndex < showreelProjects.length) renderShowreelSlide(showreelIndex + 1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    if (showreelIndex > -1) renderShowreelSlide(showreelIndex - 1);
  }
}
function openShowreel() {
  if (!showreelModal || !showreelStage) return;
  showreelProjects = readPortfolioProjects();
  if (!showreelProjects.length) return;
  clearShowreelTimer();
  if (showreelTransitionTimer !== null) window.clearTimeout(showreelTransitionTimer);
  showreelTransitionTimer = null;
  showreelIndex = -1;
  showreelPlaying = !reducedMotionPreference.matches;
  showreelStage.replaceChildren();
  showreelModal.inert = false;
  showreelModal.classList.add('active');
  showreelModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('showreel-open');
  showreelKeyHandler = handleShowreelKeydown;
  document.addEventListener('keydown', showreelKeyHandler);
  renderShowreelSlide(-1);
  showreelCloseBtn.focus();
}
function closeShowreel() {
  if (!showreelModal?.classList.contains('active')) return;
  clearShowreelTimer();
  if (showreelTransitionTimer !== null) window.clearTimeout(showreelTransitionTimer);
  showreelTransitionTimer = null;
  showreelPlaying = false;
  if (showreelKeyHandler) document.removeEventListener('keydown', showreelKeyHandler);
  showreelKeyHandler = null;
  showreelModal.classList.remove('active');
  showreelModal.setAttribute('aria-hidden', 'true');
  showreelModal.inert = true;
  document.body.classList.remove('showreel-open');
  showreelStage.replaceChildren();
  showreelOpenBtn?.focus();
}
showreelOpenBtn?.addEventListener('click', event => { event.preventDefault(); openShowreel(); });
document.querySelectorAll('[data-hero-video-close]').forEach(element => element.addEventListener('click', closeShowreel));
showreelPrevBtn?.addEventListener('click', () => { if (showreelIndex > -1) renderShowreelSlide(showreelIndex - 1); });
showreelNextBtn?.addEventListener('click', () => { if (showreelIndex < showreelProjects.length) renderShowreelSlide(showreelIndex + 1); });
showreelPlayBtn?.addEventListener('click', () => {
  if (showreelPlaying) setShowreelPlaying(false);
  else {
    if (showreelIndex >= showreelProjects.length) renderShowreelSlide(-1);
    else if (!showreelStage.firstElementChild) renderShowreelSlide(-1);
    setShowreelPlaying(true);
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeTestimonial();
    const imageModal = document.getElementById('imageModal'); if (imageModal) imageModal.style.display = 'none';
    headerNav?.classList.remove('active'); menuToggle?.setAttribute('aria-expanded', 'false');
  }
});
