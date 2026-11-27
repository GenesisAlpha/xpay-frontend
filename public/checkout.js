import { fieldsFor, normalizeCart, cartTotal, safeOrigin, allowedUrl, paymentPhase, paymentMethods } from './checkout-contract.js';
import { demoState, offerForLink, storeName, placeOrder, money } from './model.js';

const qp = new URLSearchParams(location.search);
const demo = qp.get('demo') === '1';
const isEmbed = qp.get('embed') === '1' && window.parent !== window;
const sessionId = qp.get('session') || '';
const demoLink = qp.get('link');
const root = document.querySelector('#app');
const env = document.querySelector('#environment');
const storageKey = 'xpay-commerce-demo-v1';
const fieldInfo = {
  email: ['Email', 'email', 'email', true],
  name: ['Nome completo', 'text', 'name', true],
  phone: ['Telemóvel', 'tel', 'tel', true],
  country: ['País', 'text', 'country-name'],
  postalCode: ['Código postal', 'text', 'postal-code'],
  taxId: ['Identificação fiscal', 'text', 'off', true],
};
const methodInfo = {
  card: { title: 'Cartão', label: 'Pagar' },
  mbway: { title: 'MB WAY', label: 'Enviar pedido', logo: './brands/mbway.png' },
  bizum: { title: 'Bizum', label: 'Continuar com Bizum', logo: './brands/bizum.svg' },
  multibanco: { title: 'Multibanco', label: 'Gerar referência', logo: './brands/multibanco.svg' },
  pix: { title: 'Pix', label: 'Gerar Pix' },
  iban: { title: 'Transferência bancária', label: 'Ver dados bancários' },
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const cardIcon = '<svg class="method-icon" viewBox="0 0 26 20" fill="none" aria-hidden="true"><rect x="1" y="3" width="24" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M1 8h24M5 13h5" stroke="currentColor" stroke-width="1.5"/></svg>';
const endpoint = '/api/checkout/' + encodeURIComponent(sessionId);
let checkout, items, method, attempt, refs, stripeUi, demoStore, phase = 'open', submitting = false, pollTimer, due, library, reportedPaid = false;
let details = {};

if (isEmbed) document.documentElement.classList.add('embed');

function readDemoOffers() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(saved?.offers) && Array.isArray(saved?.links) && Array.isArray(saved?.products) && Array.isArray(saved?.orders)) return saved;
  } catch {
    // The fixtures are valid on browsers without storage.
  }
  return demoState();
}

function demoCheckout() {
  demoStore = readDemoOffers();
  const offer = demoLink ? offerForLink(demoStore, demoLink)?.offer : null;
  if (demoLink && !offer) throw new Error('Este link de demonstração já não está disponível.');
  const merchant = offer ? storeName(offer.store) : 'AtlasHub';
  const name = offer?.name ?? 'Acesso ao AtlasClub';
  const fieldConfig = { email: 'required', name: 'optional' };
  try {
    const stored = JSON.parse(localStorage.getItem('xpay-checkout-fields:' + merchant));
    if (stored && typeof stored === 'object') Object.assign(fieldConfig, stored);
  } catch {
    // Default field configuration still works.
  }
  return {
    merchant, currency: offer?.currency ?? 'EUR', fieldConfig,
    items: [{ id: offer?.id ?? 'atlasclub', name, unitAmount: offer?.amount ?? 990, quantity: 1, maxQuantity: offer?.cycle === 'Mensal' || !offer ? 1 : 9 }],
    methods: ['card', 'mbway', 'bizum', 'multibanco'],
    cycle: !offer || offer.cycle === 'Mensal' ? 'month' : 'once',
    cancelAnytime: !offer, mode: 'test', status: 'open',
    parentOrigin: isEmbed ? safeOrigin(qp.get('parent'), location.origin) : null,
  };
}

async function api(path = '', options) {
  const result = await fetch(endpoint + path, {
    ...options, credentials: 'same-origin', cache: 'no-store',
    headers: { Accept: 'application/json', ...(options?.headers ?? {}) },
  });
  if (!result.ok) throw new Error('Não foi possível consultar o pagamento. Tenta novamente.');
  return result.json();
}

async function loadCheckout() {
  if (demo) return demoCheckout();
  if (!/^[A-Za-z0-9_-]{16,200}$/.test(sessionId)) throw new Error('Abre o link enviado pela loja para iniciares o pagamento.');
  return api();
}

function initials(text) {
  return text.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

function summary() {
  const note = checkout.cycle === 'month' ? ' por mês' : '';
  refs.items.innerHTML = items.map((item, index) =>
    '<div class="item"><span class="item-motif" aria-hidden="true">' + esc(initials(checkout.merchant)) + '</span><div>' +
    '<p class="item-name">' + esc(item.name) + '</p><small>' + esc(money(item.unitAmount, checkout.currency)) + esc(note) + '</small>' +
    (item.maxQuantity > 1 && phase === 'open' && !stripeUi ?
      '<div class="stepper" aria-label="Quantidade de ' + esc(item.name) + '"><button type="button" data-qty="-1" data-index="' + index + '" aria-label="Retirar uma unidade" ' + (item.quantity <= 1 ? 'disabled' : '') + '>−</button><output>' + item.quantity + '</output><button type="button" data-qty="1" data-index="' + index + '" aria-label="Adicionar uma unidade" ' + (item.quantity >= item.maxQuantity ? 'disabled' : '') + '>+</button></div>'
      : item.quantity > 1 ? '<small>Quantidade: ' + item.quantity + '</small>' : '') +
    '</div><span class="item-price">' + esc(money(item.unitAmount * item.quantity, checkout.currency)) + '</span></div>'
  ).join('');
  refs.total.textContent = money(cartTotal(items), checkout.currency);
  const recurring = checkout.cycle === 'month';
  refs.billing.hidden = !recurring;
  refs.billing.textContent = recurring
    ? method === 'card' ? 'Mensal' + (checkout.cancelAnytime ? ' · Sem fidelização' : '') : 'Pagamento deste mês. A renovação exige nova confirmação.'
    : '';
  const pay = document.querySelector('#pay');
  if (pay) pay.textContent = stripeUi ? 'Confirmar pagamento' : methodInfo[method].label + (['card','mbway'].includes(method) ? ' ' + refs.total.textContent : '');
}

function field(name, required) {
  const [label, type, auto, wide] = fieldInfo[name];
  const value = details[name] || '';
  const caption = '<span>' + label + (required ? '' : ' <span class="optional">(opcional)</span>') + '</span>';
  const ctrl = name === 'country'
    ? '<select name="' + name + '" autocomplete="' + auto + '" ' + (required ? 'required' : '') + '><option value="">Selecionar</option>' +
      [['PT','Portugal'],['ES','Espanha'],['BR','Brasil'],['GB','Reino Unido'],['US','Estados Unidos']].map(([id,text]) => '<option value="' + id + '" ' + (value === id ? 'selected' : '') + '>' + text + '</option>').join('') + '</select>'
    : '<input name="' + name + '" type="' + type + '" autocomplete="' + (demo ? 'off' : auto) + '" maxlength="180"' +
      (name === 'phone' ? ' placeholder="+351 912 345 678"' : '') +
      (required ? ' required' : '') + ' value="' + esc(value) + '">';
  return '<label class="field' + (wide ? ' wide' : '') + '">' + caption + ctrl + '</label>';
}

function updateFields() {
  const rules = fieldsFor(checkout.fieldConfig, method);
  refs.fieldset.hidden = !Object.values(rules).some(mode => mode !== 'hidden');
  refs.fields.innerHTML = Object.entries(rules).filter(([,mode]) => mode !== 'hidden').map(([name,mode]) => field(name, mode === 'required')).join('');
}

function renderForm() {
  refs.panel.className = 'panel entry';
  refs.panel.innerHTML = '<header class="intro"><span class="merchant">' + esc(checkout.merchant) + '</span><h1 class="title">Finalizar pagamento</h1>' +
    (demo ? '<p>Demonstração · usa dados fictícios.</p>' : '') + '</header>' +
    '<form id="paymentForm"><fieldset class="form-section" id="contacts"><legend>Os teus dados</legend><div class="fields" id="fields"></div></fieldset>' +
    '<fieldset class="form-section"><legend>Método de pagamento</legend><div class="method-list">' + checkout.methods.map(key => {
      const cfg = methodInfo[key];
      return '<label class="method"><input type="radio" name="method" value="' + key + '" ' + (key === method ? 'checked' : '') + '>' +
        '<span class="method-name">' + cfg.title + '</span>' + (cfg.logo ? '<img class="method-logo" src="' + cfg.logo + '" alt="" width="60" height="25">' : key === 'card' ? cardIcon : '') + '</label>';
    }).join('') + '</div><div class="method-detail" id="methodDetail"></div></fieldset>' +
    '<p class="error" id="error" role="alert" hidden></p><div class="form-action"><button class="pay" id="pay" type="submit"></button></div>' +
    '<div class="footer">' + (demo ? 'Sem cobranças reais' : 'Pagamento processado pela XPAY') + '</div></form>' +
    (demo && qp.get('customize') === '1' ? '<details class="notice"><summary>Configurar campos da demonstração</summary><div class="fields">' +
      Object.keys(fieldInfo).map(name => '<label class="field">' + fieldInfo[name][0] +
        '<select data-field-policy="' + name + '">' + Object.entries({hidden:'Oculto',optional:'Opcional',required:'Obrigatório'}).map(([v,l]) =>
          '<option value="' + v + '" ' + (fieldsFor(checkout.fieldConfig)[name] === v ? 'selected' : '') + '>' + l + '</option>').join('') + '</select></label>').join('') +
      '</div></details>' : '');
  refs.form = document.querySelector('#paymentForm');
  refs.fieldset = document.querySelector('#contacts');
  refs.fields = document.querySelector('#fields');
  refs.form.addEventListener('submit', submit);
  refs.form.addEventListener('input', event => {
    if (Object.hasOwn(fieldInfo, event.target.name)) details[event.target.name] = event.target.value;
  });
  refs.panel.querySelectorAll('.method-logo').forEach(img => img.addEventListener('error', () => { img.hidden = true; }, { once:true }));
  refs.panel.querySelectorAll('[data-field-policy]').forEach(select => select.addEventListener('change', () => {
    checkout.fieldConfig[select.dataset.fieldPolicy] = select.value;
    try { localStorage.setItem('xpay-checkout-fields:' + checkout.merchant, JSON.stringify(checkout.fieldConfig)); } catch { /* Preview is still updated. */ }
    updateFields();
  }));
  refs.form.addEventListener('change', event => {
    if (event.target.name !== 'method') return;
    method = event.target.value;
    unmountCard();
    updateFields();
    methodDetail();
    summary();
  });
  updateFields();
  methodDetail();
  summary();
}

function unmountCard() {
  if (stripeUi) stripeUi.payment.unmount();
  stripeUi = undefined;
}

function methodDetail() {
  const node = document.querySelector('#methodDetail');
  const help = {
    card: demo ? 'O formulário de cartão é gerido pela Stripe no ambiente ligado.' : 'Os dados do cartão são introduzidos no formulário seguro.',
    mbway: 'Confirma o pedido no teu telemóvel.',
    bizum: 'Continua para confirmar o pagamento com o teu banco.',
    multibanco: 'Recebe a entidade e a referência para pagar no teu banco.',
    pix: 'Paga com QR Code ou copia o código Pix.',
    iban: 'Recebe as instruções da transferência.',
  };
  node.innerHTML = '<div id="cardHost" class="card-host" hidden></div><p>' + esc(help[method]) + '</p>';
}

function showError(message) {
  const node = document.querySelector('#error');
  if (!node) return;
  node.hidden = !message;
  node.textContent = message || '';
}

function stripeScript() {
  if (window.Stripe) return Promise.resolve(window.Stripe);
  library ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/clover/stripe.js';
    script.onload = () => window.Stripe ? resolve(window.Stripe) : reject(new Error('O formulário de cartão está indisponível.'));
    script.onerror = () => { library = null; reject(new Error('O formulário de cartão está indisponível.')); };
    document.head.append(script);
  });
  return library;
}

async function mountCard(action) {
  const prefix = checkout.mode === 'test' ? 'pk_test_' : 'pk_live_';
  if (method !== 'card' || !action.publishableKey?.startsWith(prefix) || !action.clientSecret?.startsWith('pi_')) throw new Error('Configuração do cartão inválida.');
  const stripe = (await stripeScript())(action.publishableKey, { locale: 'pt' });
  const elements = stripe.elements({
    clientSecret: action.clientSecret,
    appearance: { theme: 'stripe', variables: { colorPrimary: '#244aeb', colorText: '#172133', borderRadius: '9px', fontFamily: 'Inter, Segoe UI, sans-serif', fontSizeBase: '16px' } },
  });
  const host = document.querySelector('#cardHost');
  host.hidden = false;
  const payment = elements.create('payment', { layout: 'tabs' });
  payment.mount(host);
  stripeUi = { stripe, elements, payment };
  refs.form.querySelectorAll('input[name=method]').forEach(input => { input.disabled = true; });
  summary();
}

function makeReturnPage() {
  const url = new URL('./checkout.html', location.href);
  url.searchParams.set('session', sessionId);
  if (isEmbed) url.searchParams.set('embed', '1');
  return url.href;
}

function parentMessage(type, extra) {
  const origin = safeOrigin(demo ? checkout.parentOrigin : checkout.merchantOrigin, location.origin);
  if (!origin || !isEmbed) return false;
  window.parent.postMessage({ type, sessionId: demo ? 'demo' : sessionId, mode: checkout.mode, ...extra }, origin);
  return true;
}

function returnToMerchant() {
  const url = allowedUrl(checkout.returnUrl, [checkout.merchantOrigin, location.origin].filter(Boolean), location.origin);
  if (url) location.assign(url.href);
  else if (demoLink) location.assign('./index.html#/orders');
  else {
    window.close();
    const hint = document.querySelector('#closeHint');
    if (hint) hint.hidden = false;
  }
}

function complete() {
  if (reportedPaid) return;
  reportedPaid = true;
  if (parentMessage('xpay.checkout.paid', {})) return;
  const url = allowedUrl(checkout.returnUrl, [checkout.merchantOrigin, location.origin].filter(Boolean), location.origin);
  if (url && !demo) setTimeout(returnToMerchant, 1300);
  else if (!demo && checkout.closeAfterPayment === true) window.close();
}

function statusView(status, action = {}) {
  phase = status;
  clearTimeout(pollTimer);
  unmountCard();
  const titles = { paid: demo ? 'Simulação concluída' : 'Pagamento confirmado', pending: 'A aguardar pagamento', failed: 'Pagamento recusado', cancelled: 'Pagamento cancelado', expired: 'Link expirado' };
  const help = {
    paid: demo ? 'O pedido de teste foi confirmado. Nenhum dinheiro foi movimentado.' : 'O pagamento deste pedido foi confirmado.',
    pending: 'Podes regressar a esta página para consultar o estado.',
    failed: 'O pagamento foi recusado. Podes tentar novamente.',
    cancelled: 'O pagamento foi interrompido.',
    expired: 'Pede à loja um novo link para concluíres a compra.',
  };
  let instructions = '';
  if (status === 'pending' && action.type === 'pix' && typeof action.copyCode === 'string') {
    const qr = typeof action.qrImage === 'string' && /^data:image\/png;base64,[a-zA-Z0-9+/=]+$/.test(action.qrImage) && action.qrImage.length < 400000
      ? action.qrImage : allowedUrl(action.qrImage, [location.origin], location.origin)?.href;
    instructions = (qr ? '<img class="qr" src="' + esc(qr) + '" alt="QR Code Pix">' : '') + '<p class="copy">' + esc(action.copyCode) + '</p><button class="action secondary" type="button" id="copyPix">Copiar código Pix</button>';
  }
  if (status === 'pending' && ['multibanco','iban'].includes(action.type)) {
    const keys = action.type === 'iban' ? [['beneficiary','Beneficiário'],['iban','IBAN'],['reference','Referência']] : [['entity','Entidade'],['reference','Referência']];
    instructions = '<dl class="payment-info">' + keys.filter(([k]) => action[k]).map(([k,l]) => '<div><dt>' + l + '</dt><dd>' + esc(action[k]) + '</dd></div>').join('') + '</dl>';
  }
  const actionLabel = status === 'paid' ? (checkout.returnUrl || demoLink ? 'Voltar à loja' : 'Fechar checkout') : status === 'pending' ? 'Consultar estado' : status === 'failed' || status === 'cancelled' ? 'Tentar novamente' : '';
  refs.panel.className = 'panel entry ' + status;
  refs.panel.innerHTML = '<section class="state"><span class="status-icon" aria-hidden="true">' + (status === 'paid' ? '✓' : '·') +
    '</span><h1 tabindex="-1">' + titles[status] + '</h1><p>' + esc(help[status]) + '</p>' + instructions +
    (actionLabel ? '<button type="button" class="action" id="statusAction">' + actionLabel + '</button>' : '') +
    '<p id="closeHint" hidden>Podes fechar este separador.</p><p class="error" id="statusError" role="alert" hidden></p></section>';
  refs.panel.querySelector('h1').focus({ preventScroll: true });
  document.querySelector('#copyPix')?.addEventListener('click', async event => {
    try { await navigator.clipboard.writeText(action.copyCode); event.target.textContent = 'Copiado'; }
    catch { event.target.textContent = 'Seleciona o código para copiar'; }
  });
  document.querySelector('#statusAction')?.addEventListener('click', () => {
    if (status === 'paid') returnToMerchant();
    else if (status === 'pending') { due = Date.now() + 120000; poll(); }
    else if (demo) { phase = 'open'; attempt = crypto.randomUUID(); renderForm(); }
    else location.reload();
  });
  summary();
  if (status === 'paid') complete();
}

let checking = false;
async function poll() {
  clearTimeout(pollTimer);
  if (checking) return;
  checking = true;
  try {
    const update = demo ? { status: 'paid' } : await api('/status');
    const next = paymentPhase(update.status);
    if (next !== 'pending' && next !== 'open') statusView(next);
  } catch {
    const message = document.querySelector('#statusError');
    if (message) { message.textContent = 'A confirmação ainda não está disponível.'; message.hidden = false; }
  } finally {
    checking = false;
    if (phase === 'pending' && Date.now() < due) pollTimer = setTimeout(poll, 2500);
  }
}

async function handleResult(result) {
  const action = result.action ?? {};
  if (action.type === 'stripe_elements') return mountCard(action);
  if (action.type === 'redirect') {
    const url = allowedUrl(action.url, checkout.redirectOrigins ?? [], location.origin);
    if (!url) throw new Error('O prestador devolveu um destino inválido.');
    if (!parentMessage('xpay.checkout.redirect', { url: url.href })) location.assign(url.href);
  }
  const next = paymentPhase(result.status);
  if (next === 'open') throw new Error('O pagamento não foi iniciado.');
  statusView(next, action);
  if (next === 'pending') {
    due = Date.now() + 120000;
    pollTimer = setTimeout(poll, 2500);
  }
}

async function submit(event) {
  event.preventDefault();
  if (submitting) return;
  const pay = document.querySelector('#pay');
  const methodInputs = [...refs.form.querySelectorAll('input[name="method"]:enabled')];
  submitting = true;
  pay.disabled = true;
  for (const input of methodInputs) input.disabled = true;
  showError('');
  try {
    const rules = fieldsFor(checkout.fieldConfig, method);
    const customer = Object.fromEntries([...new FormData(refs.form)].filter(([name]) => rules[name] && rules[name] !== 'hidden'));
    if (method === 'mbway' && (!/^\+?[0-9 ().-]+$/.test(customer.phone?.trim() || '') || !/^\d{9,15}$/.test(customer.phone.replace(/\D/g, '')))) {
      throw new Error('Introduz um número de telemóvel válido para MB WAY.');
    }
    if (stripeUi) {
      const response = await stripeUi.stripe.confirmPayment({
        elements: stripeUi.elements, confirmParams: { return_url: makeReturnPage() }, redirect: 'if_required',
      });
      if (response.error) throw new Error(response.error.message || 'Confirma os dados do cartão.');
      await handleResult(await api('/status'));
    } else if (demo) {
      await new Promise(resolve => setTimeout(resolve, 420));
      if (demoLink && method === 'card') {
        placeOrder(demoStore, { linkId: demoLink, name: 'Cliente de demonstração', email: 'demo@example.com',
          method: methodInfo[method].title, status: 'Pago', campaignId: qp.get('campaign'), quantity: items[0].quantity });
        try { localStorage.setItem(storageKey, JSON.stringify(demoStore)); } catch { /* Payment remains a demo. */ }
      }
      await handleResult({ status: method === 'card' ? 'paid' : 'pending' });
    } else {
      const response = await api('/pay', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt },
        body: JSON.stringify({ method, customer, items: items.map(({id,quantity}) => ({id,quantity})) }),
      });
      await handleResult(response);
    }
  } catch (error) {
    showError(error.message || 'Não foi possível iniciar o pagamento.');
  } finally {
    submitting = false;
    pay.disabled = false;
    for (const input of methodInputs) input.disabled = Boolean(stripeUi);
  }
}

async function start() {
  try {
    checkout = await loadCheckout();
    if (typeof checkout.merchant !== 'string' || !checkout.merchant.trim() || !/^[A-Z]{3}$/.test(checkout.currency) ||
        !['test','live'].includes(checkout.mode)) throw new Error('Sessão indisponível.');
    items = normalizeCart(checkout.items);
    checkout.fieldConfig ??= {};
    checkout.methods = [...new Set((Array.isArray(checkout.methods) ? checkout.methods : []).filter(key => paymentMethods.includes(key)))];
    if (!checkout.methods.length) throw new Error('Esta sessão ainda não tem meios de pagamento disponíveis.');
    method = checkout.methods[0];
    attempt = crypto.randomUUID();
    env.hidden = checkout.mode !== 'test';
    root.innerHTML = '<section id="panel" class="panel"></section><aside class="summary panel" aria-label="Resumo do pedido">' +
      '<h2>Resumo do pedido</h2><div id="items"></div><div class="total"><span>Total</span><strong id="total" aria-live="polite"></strong></div><p class="billing-note" id="billing" hidden></p></aside>';
    refs = Object.fromEntries(['panel','items','total','billing'].map(id => [id, document.getElementById(id)]));
    refs.items.addEventListener('click', event => {
      const element = event.target.closest('[data-qty]');
      if (!element || phase !== 'open' || submitting || stripeUi) return;
      const item = items[Number(element.dataset.index)];
      const next = item.quantity + Number(element.dataset.qty);
      if (next < 1 || next > item.maxQuantity) return;
      item.quantity = next;
      summary();
      refs.items.querySelector('[data-index="' + element.dataset.index + '"]:not(:disabled)')?.focus({ preventScroll: true });
    });
    const initial = paymentPhase(checkout.status);
    if (initial === 'open') renderForm();
    else statusView(initial, checkout.action);
    if (initial === 'pending') { due = Date.now() + 120000; pollTimer = setTimeout(poll, 2500); }
  } catch (error) {
    root.innerHTML = '<section class="panel empty state"><h1>Checkout indisponível</h1><p>' + esc(error.message) + '</p></section>';
  } finally {
    root.setAttribute('aria-busy','false');
  }
}

start();
