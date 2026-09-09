'use strict';

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
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } finally { field.remove(); }
    if (!copied) { notify('未能自动复制，请选中文字手动复制。'); return; }
  }
  notify('已复制');
}
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', () => copyText(button.dataset.copy));
});

const form = document.querySelector('#address-form');
const domainInput = document.querySelector('#example-domain');
const aliasInput = document.querySelector('#example-alias');
const addressStatus = document.querySelector('#address-status');
[domainInput, aliasInput].forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
form.addEventListener('submit', event => {
  event.preventDefault();
  const domain = domainInput.value.trim().toLowerCase();
  const alias = aliasInput.value.trim().toLowerCase();
  const labels = domain.split('.');
  const validDomain = domain.length <= 253 && labels.length >= 2 && labels.every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) && /^[a-z]{2,63}$/.test(labels.at(-1));
  const validAlias = alias.length <= 64 && /^[a-z0-9](?:[a-z0-9._+-]*[a-z0-9])?$/.test(alias) && !alias.includes('..');
  if (!validDomain || !validAlias) {
    const input = !validDomain ? domainInput : aliasInput;
    const message = !validDomain ? '请输入完整英文域名，例如 example.com，不含 https://、空格或路径。' : '请输入简单的邮箱前缀，例如 hello；不要包含 @、连续句点或空格。';
    input.setCustomValidity(message);
    addressStatus.textContent = message;
    input.reportValidity();
    return;
  }
  domainInput.value = domain;
  aliasInput.value = alias;
  const address = `${alias}@${domain}`;
  document.querySelector('#generated-address').textContent = address;
  document.querySelector('#copy-address').dataset.copy = address;
  document.querySelector('#generated-rule').textContent = `Email pattern：${alias} · 域名：${domain} · Destination：你已验证的现有邮箱`;
  addressStatus.textContent = domain === 'example.com' ? 'example.com 仅作格式示例，请换成自己的域名。' : '填写示例已生成。请回到 Cloudflare 创建规则；这里不会检查域名所有权或修改设置。';
});

const checklistKey = 'brclio-cloudflare-guide-checklist-v1';
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
  document.querySelector('#completion-progress').value = checked;
  document.querySelector('#completion-copy').textContent = checked === checkboxes.length ? '6 / 6 项已检查 · 第一封信，收到了！' : `已检查 ${checked} / ${checkboxes.length} 项`;
  if (save) {
    try {
      localStorage.setItem(checklistKey, JSON.stringify(Object.fromEntries(checkboxes.map(input => [input.dataset.check, input.checked]))));
      storageWorks = true;
    } catch { storageWorks = false; }
  }
  storageStatus.textContent = storageWorks ? '清单仅保存在当前浏览器；勾选代表你的人工确认。' : '当前浏览器不允许保存进度；清单仍可使用，但刷新后可能重置。';
}
checkboxes.forEach(input => input.addEventListener('change', () => updateProgress()));
document.querySelector('#reset-checklist').addEventListener('click', () => {
  checkboxes.forEach(input => { input.checked = false; });
  updateProgress();
  notify('清单已重置');
});
updateProgress(false);

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
      downloadOriginal.download = decodeURIComponent(new URL(source, document.baseURI).pathname.split('/').pop()) || 'cloudflare-screenshot.png';
    } catch {
      downloadOriginal.download = 'cloudflare-screenshot.png';
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
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = previousBodyOverflow;
  imageOpener?.focus({ preventScroll: true });
});

// Preserve reader-selected FAQ states across a print/save-PDF operation.
let closedBeforePrint = [];
window.addEventListener('beforeprint', () => {
  closedBeforePrint = [...document.querySelectorAll('details:not([open])')];
  closedBeforePrint.forEach(details => { details.open = true; });
});
window.addEventListener('afterprint', () => {
  closedBeforePrint.forEach(details => { details.open = false; });
  closedBeforePrint = [];
});
document.querySelector('#print-guide').addEventListener('click', () => window.print());

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
updateToc();
