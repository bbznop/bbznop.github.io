(function () {
  'use strict';

  const body = document.querySelector('article.post [itemprop="articleBody"]');
  if (!body) return;

  const linksById = new Map();
  document.querySelectorAll('.article-toc nav .toc-link, #toc-footer .toc-link').forEach(link => {
    let id;
    try {
      id = decodeURIComponent(link.hash.slice(1));
    } catch (_) {
      return;
    }
    if (!linksById.has(id)) linksById.set(id, []);
    linksById.get(id).push(link);
  });
  const headings = Array.from(body.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'))
    .filter(heading => linksById.has(heading.id));
  if (!headings.length) return;

  let current;
  let pending = false;

  function revealCurrent() {
    if (!current) return;
    for (const link of linksById.get(current.id)) {
      const container = link.closest('.article-toc, #toc-footer');
      if (!link.getClientRects().length || container.scrollHeight <= container.clientHeight) continue;
      const item = link.getBoundingClientRect();
      const panel = container.getBoundingClientRect();
      // Scroll only the TOC, so tracking a section never moves the article.
      if (item.top < panel.top + 8) {
        container.scrollTop += item.top - panel.top - 8;
      } else if (item.bottom > panel.bottom - 8) {
        container.scrollTop += item.bottom - panel.bottom + 8;
      }
    }
  }

  function update() {
    pending = false;
    // Match the heading offset used by native anchor navigation.
    const offset = (parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0) + 2;
    let next = headings[0];
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top > offset) break;
      next = heading;
    }
    const root = document.scrollingElement;
    if (root.scrollTop > 0 && root.scrollTop + root.clientHeight >= root.scrollHeight - 2) {
      next = headings[headings.length - 1];
    }
    if (next === current) return;
    if (current) {
      linksById.get(current.id).forEach(link => link.removeAttribute('aria-current'));
    }
    current = next;
    linksById.get(current.id).forEach(link => link.setAttribute('aria-current', 'location'));
    revealCurrent();
  }

  function scheduleUpdate() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', () => {
    scheduleUpdate();
    requestAnimationFrame(revealCurrent);
  });
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  if (window.ResizeObserver) new ResizeObserver(scheduleUpdate).observe(body);

  document.querySelector('.article-toc details')?.addEventListener('toggle', () => {
    requestAnimationFrame(revealCurrent);
  });
  document.querySelector('#actions-footer > #toc')?.addEventListener('click', () => {
    requestAnimationFrame(revealCurrent);
  });
  scheduleUpdate();
})();
