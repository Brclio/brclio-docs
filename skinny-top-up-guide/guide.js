'use strict';

(() => {
// The tutorial works as a static page; these controls only affect local reading.
const toast = document.querySelector('#toast');
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}

async function copyText(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
  } catch {
    const focused = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { copied = false; } finally {
      field.remove();
      if (focused instanceof HTMLElement && focused.isConnected) focused.focus({ preventScroll: true });
    }
    if (!copied) { notify('未能自动复制，请选中文字手动复制。'); return; }
  }
  notify('已复制');
}
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', () => copyText(button.dataset.copy));
});

const checklistKey = 'brclio-skinny-guide-checklist-v1';
const checkboxes = [...document.querySelectorAll('[data-check]')];
const storageStatus = document.querySelector('#storage-status');
let storageWorks = true;
try {
  const raw = localStorage.getItem(checklistKey);
  const saved = raw ? JSON.parse(raw) : {};
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    checkboxes.forEach(input => { input.checked = saved[input.dataset.check] === true; });
  }
} catch { storageWorks = false; }
function updateProgress(save = true) {
  const checked = checkboxes.filter(input => input.checked).length;
  const progress = document.querySelector('#completion-progress');
  progress.max = checkboxes.length;
  progress.value = checked;
  document.querySelector('#completion-copy').textContent = checked === checkboxes.length ? '4 / 4 项已检查 · 充值结果已核对' : `已检查 ${checked} / ${checkboxes.length} 项`;
  if (save) {
    try {
      localStorage.setItem(checklistKey, JSON.stringify(Object.fromEntries(checkboxes.map(input => [input.dataset.check, input.checked]))));
      storageWorks = true;
    } catch { storageWorks = false; }
  }
  storageStatus.textContent = storageWorks ? '清单仅保存在当前浏览器；勾选仅代表人工确认，本页不会检测账户、余额或付款结果。' : '当前浏览器无法保存进度，刷新后可能重置；勾选仅代表人工确认，本页不会检测账户、余额或付款结果。';
}
checkboxes.forEach(input => input.addEventListener('change', () => updateProgress()));
document.querySelector('#reset-checklist').addEventListener('click', () => {
  checkboxes.forEach(input => { input.checked = false; });
  updateProgress();
  notify('清单已重置');
});
// Confirm writing is available before claiming that local progress is saved.
updateProgress();

const dialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#dialog-image');
const imageCaption = document.querySelector('#image-caption');
const closeImage = document.querySelector('#close-image');
const imageTools = document.createElement('div');
imageTools.className = 'image-tools';
const imageModes = document.createElement('div');
imageModes.className = 'image-mode-group';
imageModes.setAttribute('role', 'group');
imageModes.setAttribute('aria-label', '截图显示比例');
const fitImage = document.createElement('button');
fitImage.type = 'button';
fitImage.className = 'image-mode-button';
fitImage.textContent = '适应窗口';
const actualImage = document.createElement('button');
actualImage.type = 'button';
actualImage.className = 'image-mode-button';
actualImage.textContent = '100% 原始尺寸';
imageModes.append(fitImage, actualImage);
const imageFiles = document.createElement('div');
imageFiles.className = 'image-file-actions';
const openOriginal = document.createElement('a');
openOriginal.className = 'image-original-link';
openOriginal.textContent = '打开原图 ↗';
openOriginal.target = '_blank';
openOriginal.rel = 'noopener noreferrer';
const downloadOriginal = document.createElement('a');
downloadOriginal.className = 'image-download-link';
downloadOriginal.textContent = '下载原图 ↓';
imageFiles.append(openOriginal, downloadOriginal);
imageTools.append(imageModes, imageFiles);
const imageInfo = document.createElement('div');
imageInfo.className = 'image-info';
const imageDimensions = document.createElement('span');
imageDimensions.id = 'image-dimensions';
imageDimensions.setAttribute('role', 'status');
const imageScale = document.createElement('span');
imageScale.className = 'image-scale';
const imageGuidance = document.createElement('span');
imageGuidance.id = 'image-guidance';
imageGuidance.textContent = '100% 模式可横向、纵向滚动查看小字。';
imageInfo.append(imageDimensions, imageScale, imageGuidance);
const imageViewport = document.createElement('div');
imageViewport.className = 'image-viewport';
imageViewport.tabIndex = 0;
imageViewport.setAttribute('role', 'region');
imageViewport.setAttribute('aria-label', '截图查看区域，可使用方向键滚动');
imageViewport.setAttribute('aria-describedby', 'image-dimensions image-guidance');
const imageStage = document.createElement('div');
imageStage.className = 'image-stage';
imageStage.append(dialogImage);
imageViewport.append(imageStage);
dialog.append(imageTools, imageInfo, imageViewport);

let imageOpener;
let imageMode = 'fit';
let imageLoaded = false;
let previousBodyOverflow = '';
function renderViewerImage(resetScroll = false) {
  const isActualSize = imageMode === 'actual';
  dialog.dataset.imageMode = imageMode;
  fitImage.setAttribute('aria-pressed', String(!isActualSize));
  actualImage.setAttribute('aria-pressed', String(isActualSize));
  if (!imageLoaded || !dialog.open) return;
  const availableWidth = Math.max(1, imageViewport.clientWidth - 32);
  const availableHeight = Math.max(1, imageViewport.clientHeight - 32);
  const scale = isActualSize ? 1 : Math.min(1, availableWidth / dialogImage.naturalWidth, availableHeight / dialogImage.naturalHeight);
  dialogImage.style.width = `${Math.max(1, Math.floor(dialogImage.naturalWidth * scale))}px`;
  dialogImage.style.height = `${Math.max(1, Math.floor(dialogImage.naturalHeight * scale))}px`;
  imageScale.textContent = isActualSize ? '100% · 原始尺寸' : `${Math.round(scale * 100)}% · 适应窗口`;
  if (resetScroll) imageViewport.scrollTo({ left: 0, top: 0, behavior: 'instant' });
}
function imageIsReady() {
  if (!dialogImage.naturalWidth || !dialogImage.naturalHeight) return;
  imageLoaded = true;
  dialogImage.hidden = false;
  fitImage.disabled = false;
  actualImage.disabled = false;
  imageDimensions.textContent = `${dialogImage.naturalWidth} × ${dialogImage.naturalHeight} 像素`;
  renderViewerImage(true);
}
dialogImage.addEventListener('load', imageIsReady);
dialogImage.addEventListener('error', () => {
  imageLoaded = false;
  dialogImage.hidden = true;
  fitImage.disabled = true;
  actualImage.disabled = true;
  imageDimensions.textContent = '图片加载失败，请尝试打开原图。';
  imageScale.textContent = '';
});
fitImage.addEventListener('click', () => { imageMode = 'fit'; renderViewerImage(true); });
actualImage.addEventListener('click', () => { imageMode = 'actual'; renderViewerImage(true); });
if (typeof ResizeObserver === 'function') {
  new ResizeObserver(() => renderViewerImage()).observe(imageViewport);
} else {
  window.addEventListener('resize', () => renderViewerImage());
}
document.querySelectorAll('.zoom-trigger').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    if (!image) return;
    const source = image.dataset.fullSrc || image.currentSrc || image.src;
    if (typeof dialog.showModal !== 'function') { window.open(source, '_blank', 'noopener'); return; }
    imageOpener = button;
    imageMode = 'fit';
    imageLoaded = false;
    dialogImage.hidden = true;
    fitImage.disabled = true;
    actualImage.disabled = true;
    imageDimensions.textContent = '正在加载原图…';
    imageScale.textContent = '';
    dialogImage.alt = image.alt;
    imageCaption.textContent = image.alt;
    openOriginal.href = source;
    downloadOriginal.href = source;
    try {
      downloadOriginal.download = decodeURIComponent(new URL(source, document.baseURI).pathname.split('/').pop()) || 'skinny-screenshot.png';
    } catch {
      downloadOriginal.download = 'skinny-screenshot.png';
    }
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    renderViewerImage(true);
    dialogImage.src = source;
    if (dialogImage.complete && dialogImage.naturalWidth) imageIsReady();
    closeImage.focus();
  });
});
closeImage.addEventListener('click', () => dialog.close());
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  dialog.close();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = previousBodyOverflow;
  if (imageOpener?.isConnected) imageOpener.focus({ preventScroll: true });
});

// Preserve reader-selected FAQ states across a print/save-PDF operation.
let closedBeforePrint = [];
window.addEventListener('beforeprint', () => {
  if (dialog.open) dialog.close();
  closedBeforePrint = [...document.querySelectorAll('details:not([open])')];
  closedBeforePrint.forEach(details => { details.open = true; });
});
window.addEventListener('afterprint', () => {
  closedBeforePrint.forEach(details => { details.open = false; });
  closedBeforePrint = [];
});
document.querySelector('#print-guide').addEventListener('click', () => window.print());

// Expand disclosures before the browser navigates to evidence, FAQ or source links.
function anchorTarget(hash) {
  if (!hash || hash === '#') return null;
  let id = hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* Keep malformed fragments literal. */ }
  return document.getElementById(id);
}
function revealAnchor(hash) {
  const target = anchorTarget(hash);
  if (!target) return;
  let disclosure = target.closest('details');
  let expanded = false;
  while (disclosure) {
    if (!disclosure.open) {
      disclosure.open = true;
      expanded = true;
    }
    disclosure = disclosure.parentElement?.closest('details');
  }
  // The initial fragment may have scrolled while its target was still collapsed.
  // Only correct positions after opening a disclosure; normal TOC links stay native.
  if (expanded) requestAnimationFrame(() => {
    if (anchorTarget(window.location.hash) === target) target.scrollIntoView({ block: 'start' });
  });
}
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  revealAnchor(link.getAttribute('href'));
});
window.addEventListener('hashchange', () => revealAnchor(window.location.hash));
revealAnchor(window.location.hash);

const tocLinks = [...document.querySelectorAll('.toc nav a')];
const chapters = [...document.querySelectorAll('.chapter')];
// A clicked directory entry updates immediately, including in background tabs.
tocLinks.forEach(selected => selected.addEventListener('click', () => {
  tocLinks.forEach(link => {
    const current = link === selected;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}));
let framePending = false;
function updateToc() {
  framePending = false;
  if (!chapters.length) return;
  let active = chapters[0];
  for (const chapter of chapters) {
    if (chapter.getBoundingClientRect().top <= 165) active = chapter;
  }
  tocLinks.forEach(link => {
    const current = link.hash === `#${active.id}`;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!framePending) { framePending = true; requestAnimationFrame(updateToc); }
}, { passive: true });
window.addEventListener('resize', updateToc, { passive: true });
window.addEventListener('hashchange', updateToc);
updateToc();

// Content remains visible when JavaScript, observers or motion are unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = [...document.querySelectorAll('.reveal')];
let revealObserver;
function showAllReveals() {
  revealObserver?.disconnect();
  document.documentElement.classList.remove('reveal-enabled');
  revealElements.forEach(element => element.classList.add('is-visible'));
}
if (typeof IntersectionObserver === 'function' && !reducedMotion.matches && revealElements.length) {
  try {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    document.documentElement.classList.add('reveal-enabled');
    revealElements.forEach(element => revealObserver.observe(element));
  } catch {
    showAllReveals();
  }
}
if (typeof reducedMotion.addEventListener === 'function') {
  reducedMotion.addEventListener('change', event => {
    if (event.matches) showAllReveals();
  });
}
window.addEventListener('beforeprint', showAllReveals);
})();
