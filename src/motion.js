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
