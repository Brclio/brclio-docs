(() => {
  'use strict';

  try {
    if (window.self !== window.top && window.frameElement?.classList.contains('document-frame')) {
      return;
    }
  } catch (_) {
    // Cross-origin embeds keep their own control.
  }

  if (document.querySelector('[data-back-to-top]')) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top export-hidden';
  button.dataset.backToTop = '';
  button.dataset.noncommentable = '';
  button.setAttribute('aria-label', '回到页面顶部');
  button.setAttribute('aria-hidden', 'true');
  button.title = '回到顶部';
  button.tabIndex = -1;
  button.innerHTML = `
    <svg class="back-to-top__arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 10l6-6 6 6"></path>
      <path d="M12 4v16"></path>
    </svg>
    <span class="back-to-top__label" aria-hidden="true">TOP</span>
  `;
  document.body.appendChild(button);

  let isVisible = false;
  let scrollFrame = 0;
  let cleanupAdapter = () => {};

  const setVisible = (nextVisible) => {
    const next = Boolean(nextVisible);
    if (next === isVisible) return;
    isVisible = next;
    button.classList.toggle('is-visible', next);
    button.setAttribute('aria-hidden', String(!next));
    button.tabIndex = next ? 0 : -1;
  };

  const scrollThreshold = (view) => Math.min(480, view.innerHeight * 0.6);
  const scrollToTop = (view) => {
    view.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  };

  const attachScrollAdapter = (view) => {
    button.setAttribute('aria-label', '回到页面顶部');
    button.title = '回到顶部';

    const update = () => {
      scrollFrame = 0;
      setVisible(view.scrollY > scrollThreshold(view));
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = view.requestAnimationFrame(update);
    };

    view.addEventListener('scroll', onScroll, { passive: true });
    view.addEventListener('resize', onScroll, { passive: true });
    update();

    return {
      reset: () => scrollToTop(view),
      cleanup: () => {
        view.removeEventListener('scroll', onScroll);
        view.removeEventListener('resize', onScroll);
        if (scrollFrame) view.cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
      }
    };
  };

  const attachDeckAdapter = (deck) => {
    button.setAttribute('aria-label', '返回演示文稿第一页');
    button.title = '返回第一页';

    const update = (index = deck.index) => setVisible(Number(index) > 0);
    const onSlideChange = (event) => update(event.detail?.index);
    deck.addEventListener('slidechange', onSlideChange);

    deck.ownerDocument.defaultView.customElements.whenDefined('deck-stage').then(() => update());

    return {
      reset: () => {
        if (typeof deck.reset === 'function') deck.reset();
        else window.location.hash = '1';
      },
      cleanup: () => deck.removeEventListener('slidechange', onSlideChange)
    };
  };

  const frame = document.getElementById('documentFrame');
  let activeAdapter;

  if (frame) {
    const bindFrame = () => {
      cleanupAdapter();
      activeAdapter = undefined;
      setVisible(false);

      try {
        const frameDocument = frame.contentDocument;
        const frameWindow = frame.contentWindow;
        if (!frameDocument || !frameWindow) return;

        const deck = frameDocument.querySelector('deck-stage');
        activeAdapter = deck ? attachDeckAdapter(deck) : attachScrollAdapter(frameWindow);
        cleanupAdapter = activeAdapter.cleanup;
      } catch (_) {
        cleanupAdapter = () => {};
      }
    };

    frame.addEventListener('load', bindFrame);
    if (frame.contentDocument?.readyState === 'complete') bindFrame();

    button.addEventListener('click', () => {
      activeAdapter?.reset();
      button.blur();
    });
  } else {
    const deck = document.querySelector('deck-stage');
    activeAdapter = deck ? attachDeckAdapter(deck) : attachScrollAdapter(window);
    cleanupAdapter = activeAdapter.cleanup;

    button.addEventListener('click', () => {
      activeAdapter.reset();
      button.blur();
    });
  }
})();
