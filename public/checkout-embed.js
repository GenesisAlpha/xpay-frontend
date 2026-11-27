import { allowedUrl } from './checkout-contract.js';

const checkoutOrigin = new URL(import.meta.url).origin;

/** The merchant server verifies payment independently before fulfillment. */
export function openCheckout(url, { onPaid, returnTo, redirectOrigins = [] } = {}) {
  const target = allowedUrl(url, [checkoutOrigin], location.origin);
  if (!target || !target.pathname.endsWith('/checkout.html')) throw new Error('URL de checkout inválido.');
  const demo = target.searchParams.get('demo') === '1';
  const sessionId = demo ? 'demo' : target.searchParams.get('session');
  if (!sessionId) throw new Error('Sessão de checkout em falta.');
  const back = allowedUrl(returnTo, [location.origin], location.origin);
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) {
    location.assign(target.href);
    return null;
  }
  target.searchParams.set('embed', '1');
  target.searchParams.set('parent', location.origin);

  if (!document.querySelector('link[data-xpay-embed]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('./checkout-embed.css', import.meta.url).href;
    css.dataset.xpayEmbed = '';
    document.head.append(css);
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'xpay-modal';
  dialog.setAttribute('aria-label', 'Checkout XPAY');
  const header = document.createElement('header');
  const title = document.createElement('strong');
  title.textContent = 'Checkout XPAY';
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Fechar';
  close.addEventListener('click', () => dialog.close());
  header.append(title, close);
  const iframe = document.createElement('iframe');
  iframe.title = 'Pagamento XPAY';
  iframe.allow = 'payment *';
  iframe.src = target.href;
  dialog.append(header, iframe);
  document.body.append(dialog);

  function onMessage(event) {
    if (event.origin !== checkoutOrigin || event.source !== iframe.contentWindow || event.data?.sessionId !== sessionId) return;
    if (event.data.type === 'xpay.checkout.paid') {
      dialog.close();
      onPaid?.({ sessionId, mode: event.data.mode, demo });
      if (back) location.assign(back.href);
    } else if (event.data.type === 'xpay.checkout.redirect') {
      const destination = allowedUrl(event.data.url, redirectOrigins, location.origin);
      if (destination) {
        dialog.close();
        location.assign(destination.href);
      }
    }
  }

  window.addEventListener('message', onMessage);
  dialog.addEventListener('close', () => {
    window.removeEventListener('message', onMessage);
    dialog.remove();
  }, { once: true });
  dialog.showModal();
  return dialog;
}
