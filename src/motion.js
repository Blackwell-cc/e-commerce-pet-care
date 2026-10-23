const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const image = document.querySelector('.hero-image');
const stamp = document.querySelector('.hero-stamp');
const ribbon = document.querySelector('.ribbon > div');
const targets = document.querySelectorAll('.section-heading, .intro > div, .story-content, .ritual-grid article, .faq-list, .newsletter > div');
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }
}, { threshold: 0.12 });
for (const [i, target] of [...targets].entries()) {
  target.classList.add('motion-reveal');
  target.style.setProperty('--reveal-delay', `${i % 3 * 80}ms`);
  observer.observe(target);
}
let pending = false;
function paint() {
  pending = false;
  if (reduced.matches) {
    image.style.transform = '';
    stamp.style.transform = '';
    ribbon.style.transform = '';
    return;
  }
  const y = Math.max(0, -hero.getBoundingClientRect().top);
  image.style.transform = `translate3d(0,${Math.min(y * .075, 32)}px,0) scale(1.035)`;
  stamp.style.transform = `rotate(${Math.min(y * .035, 24)}deg)`;
  ribbon.style.transform = `translate3d(${-scrollY * .12 % 240}px,0,0)`;
  document.documentElement.style.setProperty('--reading-progress', `${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100}%`);
}
function schedule() { if (!pending) { pending = true; requestAnimationFrame(paint); } }
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
reduced.addEventListener('change', schedule);
schedule();
// A short branded entrance, followed by scroll-paced storytelling.
const loader = document.createElement('div');
loader.className = 'intro-loader';
loader.setAttribute('aria-hidden', 'true');
loader.innerHTML = '<div class="intro-window"><img src="' + image.src + '" alt="" /></div><div class="intro-word"><span>goodkind<span class="intro-paw">✦</span></span></div>';
if (!reduced.matches && !location.hash) {
  document.body.append(loader);
  document.documentElement.classList.add('intro-active');
  const app = document.querySelector('#app'); app.inert = true;
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    document.documentElement.classList.remove('intro-active');
    document.body.classList.add('entrance-complete');
    app.inert = false; loader.remove();
  };
  const ready = Promise.all([document.fonts.ready, image.decode().catch(() => {})]);
  const frame = loader.querySelector('.intro-window');
  const preview = frame.querySelector('img');
  let expanding = false;
  const alignImage = () => {
    const rect = hero.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const style = getComputedStyle(image);
    Object.assign(preview.style, {
      position: 'absolute', width: imageRect.width + 'px', height: imageRect.height + 'px',
      left: (imageRect.left - rect.left) + 'px', top: (imageRect.top - rect.top) + 'px',
      objectPosition: style.objectPosition, objectFit: style.objectFit, maxWidth: 'none'
    });
    return rect;
  };
  const expand = async () => {
    if (finished) return;
    expanding = true;
    const start = frame.getBoundingClientRect();
    const rect = alignImage();
    Object.assign(frame.style, { position: 'absolute', margin: '0', minWidth: '0', minHeight: '0',
      left: start.left + 'px', top: start.top + 'px', width: start.width + 'px', height: start.height + 'px', opacity: '1' });
    preview.animate([
      { width: start.width + 'px', height: start.height + 'px', left: '0px', top: '0px' },
      { width: preview.style.width, height: preview.style.height, left: preview.style.left, top: preview.style.top }
    ], { duration: 1250, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'forwards' });
    const animation = frame.animate([
      { left: start.left + 'px', top: start.top + 'px', width: start.width + 'px', height: start.height + 'px', borderRadius: '18px' },
      { left: rect.left + 'px', top: rect.top + 'px', width: rect.width + 'px', height: rect.height + 'px', borderRadius: getComputedStyle(hero).borderRadius }
    ], { duration: 1250, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'forwards' });
    await animation.finished.catch(() => {});
    if (finished) return;
    finish();
  };
  Promise.race([ready, new Promise(resolve => setTimeout(resolve, 1800))]).then(() => {
    if (finished) return;
    loader.classList.add('playing');
    setTimeout(expand, 1700);
  });
  addEventListener('resize', () => { if (expanding) finish(); }, { passive: true });
  setTimeout(finish, 6500);
  addEventListener('pageshow', event => { if (event.persisted) finish(); });
  reduced.addEventListener('change', event => { if (event.matches) finish(); });
}
const scene = document.createElement('section');
scene.className = 'care-scene';
scene.setAttribute('aria-label', 'Little rituals, a lifetime of love');
scene.innerHTML = `<div class="care-stage"><span class="care-orbit" aria-hidden="true">✦</span><p class="eyebrow">LITTLE RITUALS. A LIFETIME OF LOVE.</p><h2><span>A LITTLE TREAT.</span><span>A FRESH START.</span><span>A HAPPIER TAIL.</span></h2><div class="care-track" aria-hidden="true"><i></i></div><p class="care-caption">Good care grows in the everyday.</p></div>`;
document.querySelector('.intro').after(scene);
const sceneLines = scene.querySelectorAll('h2 span');
const clamp = value => Math.min(1, Math.max(0, value));
const originalPaint = paint;
paint = function () {
  originalPaint();
  if (reduced.matches) { scene.style.setProperty('--scene-progress', 1); return; }
  const rect = scene.getBoundingClientRect();
  const progress = clamp(-rect.top / Math.max(1, rect.height - innerHeight));
  scene.style.setProperty('--scene-progress', progress);
  sceneLines.forEach((line, i) => line.style.opacity = .18 + .82 * clamp((progress - i * .25) * 4));
  image.style.opacity = String(1 - clamp(-hero.getBoundingClientRect().top / hero.offsetHeight) * .65);
};
const extraObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('arrived'); extraObserver.unobserve(entry.target); } });
}, { threshold: .12 });
function watchCards() { document.querySelectorAll('.product-card:not(.cinematic-card), .story-photo, .good-days h2, .faq h2').forEach((el, i) => { el.classList.add('cinematic-card'); el.style.setProperty('--card-delay', `${i % 4 * 90}ms`); extraObserver.observe(el); }); }
watchCards();
new MutationObserver(watchCards).observe(document.querySelector('#products'), { childList: true });
schedule();
