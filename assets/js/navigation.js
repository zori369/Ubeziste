(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const links = [...header.querySelectorAll('[data-section]')];
  const sections = ['home','about','project','found','helpUs','contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  let frame = 0;
  function update() {
    frame = 0;
    const height = header.getBoundingClientRect().height;
    document.documentElement.style.scrollPaddingTop = (height + 12) + 'px';
    if (!links.length || !sections.length) return;
    const marker = height + Math.min(90, window.innerHeight * 0.15);
    let current = sections[0].id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) current = section.id;
    }
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].id;
    for (const link of links) {
      const selected = link.dataset.section === current;
      link.classList.toggle('nav-current', selected);
      if (selected) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('load', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(header);
  update();
})();
