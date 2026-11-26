import { currencies, stores, storeName, statuses, stages, paid, today, makeId, amountMinor, money, demoState, offerForLink, placeOrder, wallet, requestPayout } from './model.js';
import { navigation, descriptions, integrations, definitions } from './catalog.js';

const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const toast = document.querySelector('#toast');
const key = 'xpay-commerce-demo-v1';
const nav = navigation.flatMap(([, entries]) => entries);
const glyphs = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  box: 'm12 3 9 5-9 5-9-5 9-5z M3 8v8l9 5 9-5V8 M12 13v8',
  tag: 'M3 4h9l9 9-8 8-10-10V4z M8 8h.01',
  link: 'M10 13a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-3 3 M14 11a4 4 0 0 0-6 0l-4 4a4 4 0 0 0 6 6l3-3',
  cart: 'M2 4h3l3 11h10l3-8H6 M9 21h.01 M18 21h.01',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-4 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 3a4 4 0 0 1 0 8',
  target: 'M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20z M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 12h.01',
  refresh: 'M20 7V3m0 4h-4 M4 17v4m0-4h4 M20 7a8 8 0 0 0-14-1 M4 17a8 8 0 0 0 14 1',
  card: 'M3 5h18v14H3z M3 10h18 M7 15h3',
  wallet: 'M20 8V5H5a2 2 0 0 0 0 4h16v12H5a2 2 0 0 1-2-2V7 M21 13h-6v4h6',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  shield: 'M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z M12 8v5m0 3h.01',
  settings: 'M4 6h16M4 12h16M4 18h16 M8 4v4m8 2v4m-6 2v4',
  plug: 'M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-12 0z M12 17v5',
  plus: 'M12 5v14M5 12h14',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M17 17l4 4',
  export: 'M12 3v12m-5-5 5 5 5-5 M4 16v5h16v-5',
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'm6 6 12 12M18 6 6 18',
};
const ico = name => '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + glyphs[name] + '"/></svg>';
const h = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safe = value => encodeURIComponent(String(value));
const date = value => new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
const statusClass = value => statuses.includes(value) ? 'good' : ['Recusado', 'Rejeitado', 'Cancelado'].includes(value) ? 'bad' : ['Pendente', 'Em revisão', 'Aberto'].includes(value) ? 'pending' : 'muted';
const badge = value => '<span class="badge ' + statusClass(value) + '">' + h(value) + '</span>';
const label = slug => nav.find(([id]) => slug === id)?.[1];
const attr = (action, id = '') => 'data-act="' + h(action) + '" data-id="' + h(id) + '"';
const button = (text, action, id = '', variant = '', icon = '') => '<button type="button" class="btn ' + variant + '" ' + attr(action, id) + '>' + (icon ? ico(icon) : '') + h(text) + '</button>';
const go = (slug, text, variant = '') => '<a class="btn ' + variant + '" href="#/' + h(slug) + '">' + h(text) + ' ' + ico('arrow') + '</a>';
const checkoutHref = (id, campaign) => '#/checkout/' + safe(id) + (campaign ? '?campaign=' + safe(campaign) : '');
const checkoutUrl = (id, campaign) => new URL(checkoutHref(id, campaign), location.href).href;
const current = { store: 'all', currency: 'EUR', days: 30 };
const lastOrder = new Map();
let state = restore();
let activeTable = '';
let toastTimeout;

function restore() {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    const defaults = demoState();
    if (value && Object.entries(defaults).every(([name, fallback]) => Array.isArray(fallback) ? Array.isArray(value[name]) : value[name] && typeof value[name] === 'object')) return value;
  } catch {
    // Use demonstration fixtures when storage is unavailable.
  }
  return demoState();
}

function notify(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 4000);
}

function save(message) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
    notify(message);
  } catch {
    notify(message + ' A gravação neste navegador está indisponível.');
  }
  render();
}

const scoped = list => list.filter(item => current.store === 'all' || item.store === current.store);
const optedStore = () => current.store === 'all' ? stores[0].id : current.store;
const scopedMoney = orders => orders.filter(order => order.currency === current.currency);
const sum = orders => orders.reduce((total, order) => total + order.amount, 0);

function route() {
  const [path, query = ''] = (location.hash.slice(2) || 'overview').split('?');
  const [slug, encoded] = path.split('/');
  try { return { slug, id: decodeURIComponent(encoded || ''), campaign: new URLSearchParams(query).get('campaign') }; }
  catch { return { slug: 'overview' }; }
}

function logo() {
  return '<span class="logo"><span class="mark" aria-hidden="true">×</span><span>XPay<small>Commerce</small></span></span>';
}

function shell(slug, body) {
  const menus = navigation.map(([section, entries]) =>
    '<div class="nav-group"><p>' + section + '</p>' + entries.map(([id, title, icon]) =>
      '<a href="#/' + id + '" ' + (id === slug ? 'aria-current="page"' : '') + '>' + ico(icon) + h(title) + '</a>').join('') + '</div>').join('');
  return '<aside class="sidebar" id="sidebar"><a class="brand" href="#/overview" aria-label="XPay Commerce, início">' + logo() +
    '</a><nav aria-label="Navegação principal">' + menus + '</nav><div class="sidebar-foot"><span class="avatar">SN</span><span><strong>Studio Norte</strong><small>Workspace de teste</small></span></div></aside>' +
    '<div class="surface"><header class="topbar"><div class="context">' + button('', 'menu', '', 'icon menu-toggle', 'menu').replace('<button ', '<button aria-label="Abrir navegação" aria-controls="sidebar" aria-expanded="false" ') +
    '<span>Workspace</span><span class="crumb">/</span><strong>' + h(label(slug) || 'Detalhe') + '</strong></div>' +
    '<div class="selectors"><span class="environment"><i></i>Demonstração</span>' +
    '<label class="sr" for="store-filter">Loja</label><select id="store-filter">' + options([['all', 'Todas as lojas'], ...stores.map(store => [store.id, store.name])], current.store) + '</select>' +
    '<label class="sr" for="currency-filter">Moeda do resumo</label><select id="currency-filter">' + options(currencies, current.currency) + '</select></div></header>' +
    '<main id="content" tabindex="-1">' + body + '</main></div>';
}

function headline(title, description, actions = '') {
  return '<div class="headline"><div><h1>' + h(title) + '</h1><p>' + h(description) + '</p></div><div class="actions">' + actions + '</div></div>';
}

function metric(title, value, detail, icon) {
  return '<article class="metric"><div class="metric-title"><span>' + h(title) + '</span><span class="metric-icon">' + ico(icon) + '</span></div><strong>' + h(value) + '</strong><small>' + h(detail) + '</small></article>';
}

function chart(orders) {
  const days = current.days;
  const now = new Date();
  const dateAt = offset => new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
  const parts = Array.from({ length: 7 }, (_, index) => {
    const first = dateAt(days - 1 - Math.floor(index * days / 7));
    const end = dateAt(days - 1 - Math.floor((index + 1) * days / 7));
    const amount = sum(orders.filter(item => paid(item) && new Date(item.created) >= first && new Date(item.created) < end));
    return { amount, title: new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' }).format(first) };
  });
  const peak = Math.max(1, ...parts.map(part => part.amount));
  return '<div class="chart" aria-label="Vendas confirmadas por intervalo">' + parts.map(part =>
    '<div class="bar-cell" title="' + h(part.title + ' · ' + money(part.amount, current.currency)) + '">' +
    '<div class="bar-track"><div class="bar" style="height:' + Math.max(2, part.amount / peak * 100).toFixed(2) + '%"><span class="sr">' +
    h(part.title + ' ' + money(part.amount, current.currency)) + '</span></div></div><small>' + h(part.title) + '</small></div>').join('') + '</div>';
}

function overview() {
  const allOrders = scoped(state.orders);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - current.days + 1);
  cutoff.setHours(0, 0, 0, 0);
  const period = allOrders.filter(order => new Date(order.created) >= cutoff);
  const inCurrency = scopedMoney(period);
  const confirmed = inCurrency.filter(paid);
  const balance = wallet(state, current.currency, current.store);
  const links = scoped(state.links).filter(link => offerForLink(state, link.id)).length;
  const statusRows = stages.map(status => {
    const number = inCurrency.filter(item => item.status === status).length;
    const width = inCurrency.length ? Math.round(number / inCurrency.length * 100) : 0;
    return '<div class="breakdown-row">' + badge(status) + '<strong>' + number + '</strong><div class="track"><span class="' + statusClass(status) + '" style="width:' + width + '%"></span></div></div>';
  }).join('');
  return headline('Visão geral', 'Acompanhe as vendas e a operação das suas lojas.', button('Criar oferta', 'create', 'offers', 'primary', 'plus')) +
    '<section class="hero"><div class="hero-copy"><div class="hero-label"><i></i>Workspace comercial</div><h2>Da oferta à venda.<br>Num só lugar.</h2><p>Publique um link, receba um pedido de teste e acompanhe o resultado no financeiro.</p>' +
    go('links', 'Gerir links de pagamento', 'hero-button') + '</div><div class="hero-shape" aria-hidden="true"><span></span><span></span><span></span></div></section>' +
    '<div class="metrics">' + metric('Vendas confirmadas', money(sum(confirmed), current.currency), confirmed.length + ' pagamentos · ' + current.days + ' dias', 'card') +
    metric('Pedidos no período', period.length, 'Todas as moedas · ' + current.days + ' dias', 'cart') +
    metric('Saldo disponível', money(balance.available, current.currency), 'Saldo de demonstração', 'wallet') +
    metric('Links activos', links, 'Nas lojas seleccionadas', 'link') + '</div>' +
    '<div class="summary-grid"><section class="panel"><div class="panel-head"><div><h2>Volume de vendas</h2><p>Pagamentos confirmados em ' + current.currency + '</p></div><label class="sr" for="period-filter">Período</label><select id="period-filter">' +
    options([[7, '7 dias'], [30, '30 dias'], [90, '90 dias']], current.days) + '</select></div>' + chart(inCurrency) + '</section>' +
    '<section class="panel"><div class="panel-head"><div><h2>Estado dos pagamentos</h2><p>' + inCurrency.length + ' pedidos em ' + current.currency + '</p></div></div><div class="breakdown">' +
    statusRows + '</div></section></div>' +
    '<section class="panel"><div class="panel-head"><div><h2>Pedidos recentes</h2><p>Últimos movimentos das lojas seleccionadas</p></div>' +
    go('orders', 'Ver pedidos') + '</div>' + table('orders', allOrders.slice(0, 5), false) + '</section>';
}

function customerRows() {
  const rows = new Map();
  scoped(state.orders).forEach(order => {
    const id = order.store + ':' + order.email;
    if (!rows.has(id)) rows.set(id, { id, name: order.name, email: order.email, store: order.store, created: order.created, count: 0, orders: [] });
    const person = rows.get(id);
    person.count += 1;
    person.orders.push(order);
  });
  return [...rows.values()];
}

function rows(slug) {
  if (slug === 'customers') return customerRows();
  if (slug === 'subscriptions') return scoped(state.orders).filter(order => state.offers.find(offer => offer.id === order.offer)?.cycle === 'Mensal');
  if (slug === 'payments') return scoped(state.orders);
  return scoped(state[slug]);
}

function cell(item, field) {
  if (field === 'status') return badge(item[field]);
  if (field === 'money') return h(money(item.amount, item.currency));
  if (field === 'created') return h(date(item.created));
  if (field === 'store') return h(storeName(item.store));
  if (field === 'offerName') return h(state.offers.find(offer => offer.id === item.offer)?.name || item.offer);
  if (field === 'rate') return h(item.rate + '%');
  if (field === 'conversions') return h(state.orders.filter(order => order.campaign === item.id && paid(order)).length);
  return h(item[field]);
}

function tableRows(slug, items) {
  const { columns } = definitions[slug];
  if (!items.length) return '<tr><td colspan="' + (columns.length + 1) + '"><div class="empty">Sem registos para esta selecção.</div></td></tr>';
  return items.map(item => '<tr>' + columns.map((field, index) =>
    '<td' + (index === 0 ? ' class="first"' : '') + '>' + cell(item, field) + '</td>').join('') +
    '<td class="right">' + button('Detalhe', 'detail', slug + '|' + item.id, 'subtle') + '</td></tr>').join('');
}

function table(slug, items, searchable) {
  const { fields } = definitions[slug];
  return '<div class="table-wrap"><table><thead><tr>' + fields.map(column => '<th scope="col">' + h(column) + '</th>').join('') +
    '<th scope="col"><span class="sr">Acções</span></th></tr></thead><tbody' + (searchable ? ' id="results"' : '') + '>' + tableRows(slug, items) + '</tbody></table></div>';
}

function listPage(slug) {
  activeTable = slug;
  const title = label(slug);
  const actions = button('Exportar CSV', 'export', slug, '', 'export') + (definitions[slug].action ? button(definitions[slug].action, 'create', slug, 'primary', 'plus') : '');
  return headline(title, descriptions[slug], actions) + '<section class="panel"><div class="panel-head"><div><h2>' + h(title) +
    '</h2><p>' + rows(slug).length + ' registos de demonstração</p></div><label class="search">' + ico('search') +
    '<span class="sr">Pesquisar ' + h(title) + '</span><input id="search" type="search" placeholder="Pesquisar…"></label></div>' + table(slug, rows(slug), true) + '</section>';
}

function operations() {
  return headline('Backoffice', descriptions.operations) + '<div class="section-stack">' +
    [['merchants', 'Activação de comerciantes'], ['payouts', 'Revisão de saques'], ['rules', 'Routing'], ['tickets', 'Tickets operacionais']].map(([id, title]) =>
      '<section class="panel"><div class="panel-head"><h2>' + title + '</h2>' + (definitions[id].action ? button(definitions[id].action, 'create', id, '', 'plus') : '') +
      '</div>' + table(id, rows(id), false) + '</section>').join('') + '</div>';
}

function finance() {
  const balance = wallet(state, current.currency, current.store);
  return headline('Carteira', descriptions.finance, button('Pedir saque', 'create', 'payouts', 'primary', 'arrow')) +
    '<div class="metrics">' + [['Disponível', balance.available, 'Após reservas e saques', 'wallet'], ['Pendente', balance.pending, 'Pedidos em processamento', 'refresh'],
      ['Reservado', balance.reserved, 'Saques em revisão', 'shield'], ['Reembolsado', balance.refunded, 'Total de devoluções simuladas', 'card']]
      .map(([title, value, detail, icon]) => metric(title, money(value, current.currency), detail, icon)).join('') + '</div>' +
    '<section class="panel"><div class="panel-head"><div><h2>Movimentos por pedido</h2><p>' + current.currency + '</p></div></div>' +
    table('payments', scopedMoney(scoped(state.orders)), false) + '</section>';
}

function integrationPage() {
  return headline('Integrações', descriptions.integrations) + '<div class="integration-grid">' + integrations.map(([name, detail, status, next]) =>
    '<article class="panel integration"><div class="integration-icon">' + ico('plug') + '</div>' + badge(status) + '<h2>' + h(name) +
    '</h2><p>' + h(detail) + '</p><small>' + h(next) + '</small></article>').join('') + '</div>';
}

function options(values, selected) {
  return values.map(entry => {
    const [value, title] = Array.isArray(entry) ? entry : [entry, entry];
    return '<option value="' + h(value) + '"' + (String(value) === String(selected) ? ' selected' : '') + '>' + h(title) + '</option>';
  }).join('');
}

const input = (name, caption, type = 'text', extra = '') => '<label>' + h(caption) + '<input name="' + name + '" type="' + type + '" required maxlength="120" ' + extra + '></label>';
const select = (name, caption, entries, selected) => '<label>' + h(caption) + '<select name="' + name + '" required>' + options(entries, selected) + '</select></label>';
const storeSelect = () => select('store', 'Loja', stores.map(item => [item.id, item.name]), optedStore());
const amountInput = () => input('amount', 'Valor', 'text', 'inputmode="decimal" placeholder="49,00"');
const optionList = list => list.map(item => [item.id, item.name || item.id]);
const linkOptions = () => optionList(scoped(state.links).filter(item => offerForLink(state, item.id)));

function createForm(slug) {
  const fields = {
    products: () => input('name', 'Nome do produto') + select('kind', 'Tipo', ['Digital', 'Físico', 'Serviço']) + storeSelect() + select('status', 'Estado inicial', ['Activo', 'Rascunho']),
    offers: () => input('name', 'Nome da oferta') + select('product', 'Produto', optionList(scoped(state.products).filter(item => item.status === 'Activo'))) +
      '<div class="form-pair">' + amountInput() + select('currency', 'Moeda', currencies, current.currency) + '</div>' + select('cycle', 'Frequência', ['Único', 'Mensal']),
    links: () => input('name', 'Endereço do link', 'text', 'placeholder="estudio-criativo" pattern="[a-z0-9]+(-[a-z0-9]+)*"') +
      select('offer', 'Oferta', optionList(scoped(state.offers).filter(item => item.status === 'Publicado'))) + select('channel', 'Canal', ['Site', 'Directo', 'Rede social', 'Email', 'Afiliado']),
    campaigns: () => input('name', 'Nome da campanha') + select('link', 'Link activo', linkOptions()) + select('type', 'Canal', ['Landing page', 'Email', 'Rede social', 'Afiliado']) + select('status', 'Estado inicial', ['Activo', 'Planeado']),
    affiliates: () => input('name', 'Nome do parceiro') + input('email', 'Email de demonstração', 'email') + input('rate', 'Comissão (%)', 'number', 'min="0" max="100" step="0.1"') + storeSelect(),
    payouts: () => storeSelect() + '<div class="form-pair">' + select('currency', 'Moeda', currencies, current.currency) + amountInput() + '</div>',
    disputes: () => select('order', 'Pedido', scoped(state.orders).map(item => [item.id, item.id + ' · ' + item.item])) + input('name', 'Motivo do caso'),
    rules: () => input('name', 'Nome da regra') + select('provider', 'Provedor', ['Stripe', 'Whop', 'Clip', 'PayPal', 'Viva', 'Sentinel', 'Kontino', 'Coinflow', 'RoxPay', 'Slash']) + storeSelect(),
    tickets: () => input('name', 'Assunto') + select('category', 'Categoria', ['Reconciliação', 'Conta', 'Checkout', 'Suporte']) + storeSelect(),
  };
  showModal(definitions[slug].action, '<form class="flow-form" data-form="' + slug + '">' + fields[slug]() +
    '<p class="form-error" role="alert"></p><button class="btn primary" type="submit">Guardar na demonstração</button></form>');
}

function showModal(title, body) {
  modal.innerHTML = '<header><h2 id="modal-title">' + h(title) + '</h2>' + button('Fechar', 'close', '', 'subtle', 'close') + '</header><div class="dialog-body">' + body + '</div>';
  if (!modal.open) modal.showModal();
}

function detail(key) {
  const split = key.indexOf('|');
  const slug = key.slice(0, split);
  const id = key.slice(split + 1);
  const item = rows(slug).find(row => row.id === id);
  if (!item) return;
  const { fields, columns } = definitions[slug];
  let info = '<dl class="detail">' + fields.map((field, index) => '<div><dt>' + h(field) + '</dt><dd>' + cell(item, columns[index]) + '</dd></div>').join('') + '</dl>';
  const actions = [];
  if (slug === 'links') {
    if (offerForLink(state, item.id)) {
      info += '<label class="copy-field">URL do checkout<input type="url" readonly value="' + h(checkoutUrl(item.id)) + '"></label>' +
        '<p class="hint">O URL de demonstração usa os dados guardados neste navegador. Para ligar um site externo, consulte Integrações.</p>';
      info += '<details class="channel-details"><summary>Botão, embed e API</summary><p>Na ligação real, estes canais usam a mesma oferta. O botão abre o link público, o embed usa uma sessão autorizada e uma loja integrada cria a sessão no servidor.</p>' +
        '<label class="copy-field">Exemplo de botão HTML na demonstração<textarea readonly rows="2">' + h('<a href="' + checkoutUrl(item.id) + '">Comprar</a>') + '</textarea></label></details>';
      actions.push('<a class="btn primary" href="' + checkoutHref(item.id) + '">Abrir checkout ' + ico('arrow') + '</a>', button('Copiar link', 'copy-link', item.id));
    }
    actions.push(button(item.status === 'Activo' ? 'Pausar link' : 'Reactivar link', 'toggle', key));
  }
  if (slug === 'offers') actions.push(button(item.status === 'Publicado' ? 'Retirar oferta' : 'Publicar oferta', 'toggle', key));
  if (slug === 'products') actions.push(button(item.status === 'Activo' ? 'Arquivar produto' : 'Activar produto', 'toggle', key));
  if (slug === 'campaigns') {
    if (item.status === 'Activo' && offerForLink(state, item.link)) {
      info += '<label class="copy-field">Link da campanha<input type="url" readonly value="' + h(checkoutUrl(item.link, item.id)) + '"></label>';
      actions.push(button('Copiar link da campanha', 'copy-campaign', item.id));
    }
    actions.push(button(item.status === 'Activo' ? 'Pausar campanha' : 'Activar campanha', 'toggle', key));
  }
  if (['affiliates', 'rules'].includes(slug)) actions.push(button(item.status === 'Activo' ? 'Desactivar' : 'Activar', 'toggle', key));
  if (['orders', 'payments'].includes(slug) && item.status === 'Pendente') actions.push(button('Confirmar pagamento', 'change-order', id + '|Pago', 'primary'), button('Recusar', 'change-order', id + '|Recusado'));
  if (['orders', 'payments'].includes(slug) && item.status === 'Pago') actions.push(button('Simular reembolso', 'change-order', id + '|Reembolsado'));
  if (slug === 'orders' && item.status === 'Pago' && item.fulfillment !== 'Entregue') actions.push(button('Marcar entrega', 'fulfill', id, 'primary'));
  if (slug === 'merchants') {
    if (route().slug === 'operations' && item.status === 'Em revisão') actions.push(button('Aprovar activação', 'merchant-status', id + '|Aprovado', 'primary'), button('Rejeitar', 'merchant-status', id + '|Rejeitado'));
    if (route().slug === 'merchants' && item.status === 'Rejeitado') actions.push(button('Reenviar para revisão', 'merchant-status', id + '|Em revisão', 'primary'));
  }
  if (slug === 'payouts' && item.status === 'Em revisão' && route().slug === 'operations') actions.push(button('Concluir saque', 'review-payout', id + '|Concluído', 'primary'), button('Rejeitar', 'review-payout', id + '|Rejeitado'));
  if (slug === 'disputes' && item.status === 'Em revisão') actions.push(button('Concluir revisão', 'resolve', key));
  if (slug === 'tickets' && item.status === 'Aberto') actions.push(button('Fechar ticket', 'resolve', key));
  if (slug === 'customers') {
    info += '<h3>Pedidos do cliente</h3>' + table('orders', item.orders, false) +
      '<form class="flow-form" data-form="notes" data-id="' + h(id) + '"><label>Notas de demonstração<textarea name="note" rows="3" maxlength="500">' +
      h(state.notes[id]) + '</textarea></label><p class="form-error" role="alert"></p><button class="btn" type="submit">Guardar notas</button></form>';
  }
  showModal(item.name || id, info + '<div class="actions">' + actions.join('') + '</div>');
}

function renderCheckout(id, campaign) {
  const checkout = offerForLink(state, id);
  const header = '<header class="checkout-header"><a href="#/overview" aria-label="Voltar ao XPay Commerce">' + logo() + '</a><span class="environment"><i></i>Checkout de demonstração</span></header>';
  if (!checkout) return header + '<main id="content" tabindex="-1" class="checkout-empty"><h1>Link indisponível</h1><p>Este link expirou, foi desactivado ou pertence a outro navegador.</p>' + go('links', 'Voltar aos links') + '</main>';
  const { offer } = checkout;
  const order = lastOrder.get(id);
  const details = '<div class="checkout-product"><span class="checkout-store">' + h(storeName(offer.store)) + '</span><h1>' + h(offer.name) +
    '</h1><strong>' + h(money(offer.amount, offer.currency)) + '</strong><p>' + (offer.cycle === 'Mensal' ? 'Oferta mensal · simulação do primeiro pagamento' : 'Pagamento único · ' + offer.currency) + '</p></div>';
  const paymentForm = order
    ? '<div class="result">' + badge(order.status) + '<h2>' + h(order.status === 'Pago' ? 'Pagamento confirmado' : order.status === 'Pendente' ? 'Pagamento pendente' : 'Pagamento recusado') +
      '</h2><p>Pedido de demonstração ' + h(order.id) + '.</p>' + go('orders', 'Consultar pedido', 'primary') + ' ' + button('Nova compra', 'new-checkout', id) + '</div>'
    : '<h2>Dados do comprador</h2><p>Use apenas dados fictícios. Este formulário simula a compra.</p><form class="flow-form" data-form="checkout" data-id="' + h(id) + '" data-campaign="' + h(campaign) + '">' +
      input('name', 'Nome fictício', 'text', 'autocomplete="off" placeholder="Ex. Alex Demo"') + input('email', 'Email fictício', 'email', 'autocomplete="off" placeholder="alex@example.com"') +
      select('method', 'Método de demonstração', ['Cartão', 'Transferência']) + select('status', 'Resultado da simulação', ['Pago', 'Pendente', 'Recusado']) +
      '<p class="form-error" role="alert"></p><button class="btn primary" type="submit">Simular pagamento</button></form>';
  return header + '<main class="checkout" id="content" tabindex="-1">' + details + '<section class="panel checkout-form">' + paymentForm + '</section></main>';
}

function render() {
  const { slug, id, campaign } = route();
  activeTable = '';
  document.title = (label(slug) || 'Checkout') + ' · XPay Commerce';
  if (slug === 'checkout') {
    app.innerHTML = renderCheckout(id, campaign);
    return;
  }
  const page = label(slug) ? slug : 'overview';
  const body = page === 'overview' ? overview() : page === 'operations' ? operations() : page === 'finance' ? finance() : page === 'integrations' ? integrationPage() : listPage(page);
  app.innerHTML = shell(page, body);
}

function requireItem(list, id, message) {
  const item = list.find(value => value.id === id);
  if (!item) throw new Error(message);
  return item;
}

function createRecord(slug, data) {
  const { name, status, store } = data;
  if ('name' in data && !name) throw new Error('Introduza um nome ou assunto.');
  const at = today();
  if (slug === 'products') return { id: makeId('PRD'), name, status, store, kind: data.kind };
  if (slug === 'offers') {
    const product = requireItem(state.products.filter(item => item.status === 'Activo'), data.product, 'Crie ou seleccione um produto activo.');
    return { id: makeId('OFR'), name, product: product.id, store: product.store, amount: amountMinor(data.amount), currency: data.currency, cycle: data.cycle, status: 'Publicado' };
  }
  if (slug === 'links') {
    const offer = requireItem(state.offers.filter(item => item.status === 'Publicado'), data.offer, 'Crie ou seleccione uma oferta publicada.');
    if (state.links.some(item => item.id === name)) throw new Error('Este endereço já está reservado.');
    return { id: name, offer: offer.id, store: offer.store, channel: data.channel, status: 'Activo' };
  }
  if (slug === 'campaigns') {
    const link = requireItem(state.links.filter(item => offerForLink(state, item.id)), data.link, 'Seleccione um link activo.');
    return { id: makeId('CMP'), name, store: link.store, link: link.id, type: data.type, status };
  }
  if (slug === 'affiliates') return { id: makeId('AFF'), name, store, email: data.email, rate: Number(data.rate), status: 'Activo' };
  if (slug === 'disputes') {
    const order = requireItem(state.orders, data.order, 'Seleccione um pedido para abrir o caso.');
    return { id: makeId('DSP'), name, store: order.store, order: order.id, status: 'Em revisão' };
  }
  if (slug === 'rules') return { id: makeId('REG'), name, store, provider: data.provider, status: 'Activo' };
  if (slug === 'tickets') return { id: makeId('TK'), name, store, category: data.category, status: 'Aberto', created: at };
  throw new Error('Operação de demonstração inválida.');
}

function submit(event) {
  const form = event.target;
  const slug = form.dataset.form;
  if (!slug) return;
  event.preventDefault();
  const data = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value).trim()]));
  try {
    if (slug === 'checkout') {
      if (lastOrder.has(form.dataset.id)) return;
      const order = placeOrder(state, { ...data, linkId: form.dataset.id, campaignId: form.dataset.campaign });
      lastOrder.set(form.dataset.id, order);
      save('Pedido de demonstração registado.');
      return;
    }
    if (slug === 'notes') state.notes[form.dataset.id] = data.note;
    else if (slug === 'payouts') requestPayout(state, { store: data.store, currency: data.currency, value: data.amount });
    else state[slug].unshift(createRecord(slug, data));
    modal.close();
    save('Alteração guardada na demonstração.');
  } catch (error) {
    form.querySelector('.form-error').textContent = error.message;
  }
}

function updateStatus(action, key) {
  const [slug, id] = key.split('|');
  const changes = {
    products: ['Activo', 'Arquivado'], offers: ['Publicado', 'Pausado'], links: ['Activo', 'Pausado'],
    affiliates: ['Activo', 'Inactivo'], rules: ['Activo', 'Inactivo'], campaigns: ['Activo', 'Pausado'],
  };
  const item = state[slug].find(row => row.id === id);
  if (!item) return;
  const [first, second] = changes[slug] || [];
  item.status = action === 'resolve' ? 'Concluído' : (item.status === first ? second : first);
  modal.close();
  save('Estado actualizado na demonstração.');
}

function changeOrder(key) {
  const [id, status] = key.split('|');
  const order = state.orders.find(item => item.id === id);
  const transitions = { Pendente: ['Pago', 'Recusado'], Pago: ['Reembolsado'] };
  if (!transitions[order?.status]?.includes(status)) return;
  order.status = status;
  modal.close();
  save('Pagamento actualizado na demonstração.');
}

async function copy(url) {
  try {
    await navigator.clipboard.writeText(url);
    notify('Link copiado.');
  } catch {
    notify('Seleccione e copie o endereço no campo do link.');
  }
}

function exportTable(slug) {
  const { fields, columns } = definitions[slug];
  const csvCell = value => {
    const input = String(value ?? '');
    const literal = /^[=\t\r\n+@-]/.test(input.trimStart()) || /^[\t\r\n]/.test(input) ? "'" + input : input;
    return '"' + literal.replaceAll('"', '""') + '"';
  };
  const csv = [fields, ...rows(slug).map(row => columns.map(field => field === 'money'
    ? money(row.amount, row.currency)
    : field === 'offerName' ? (state.offers.find(item => item.id === row.offer)?.name || row.offer)
      : field === 'conversions' ? state.orders.filter(order => order.campaign === row.id && paid(order)).length : row[field]))]
    .map(row => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'xpay-' + slug + '-demo.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener('submit', submit);
document.addEventListener('input', event => {
  if (event.target.id !== 'search') return;
  const query = event.target.value.trim().toLocaleLowerCase('pt-PT');
  const matches = rows(activeTable).filter(item => Object.values(item).some(value => String(value).toLocaleLowerCase('pt-PT').includes(query)));
  document.querySelector('#results').innerHTML = tableRows(activeTable, matches);
});
document.addEventListener('change', event => {
  const setting = { 'store-filter': 'store', 'currency-filter': 'currency', 'period-filter': 'days' }[event.target.id];
  if (!setting) return;
  current[setting] = setting === 'days' ? Number(event.target.value) : event.target.value;
  render();
  document.getElementById(event.target.id)?.focus();
});
document.addEventListener('click', event => {
  if (event.target.closest('.skip')) {
    event.preventDefault();
    document.querySelector('#content')?.focus();
  }
  const target = event.target.closest('[data-act]');
  if (!target) return;
  const { act, id } = target.dataset;
  if (act === 'create') createForm(id);
  if (act === 'detail') detail(id);
  if (act === 'close') modal.close();
  if (act === 'toggle' || act === 'resolve') updateStatus(act, id);
  if (act === 'change-order') changeOrder(id);
  if (act === 'fulfill') {
    const order = state.orders.find(item => item.id === id && paid(item));
    if (order) {
      order.fulfillment = 'Entregue';
      modal.close();
      save('Entrega de demonstração registada.');
    }
  }
  if (act === 'merchant-status') {
    const [merchantId, status] = id.split('|');
    const merchant = state.merchants.find(item => item.id === merchantId);
    if (merchant && (merchant.status === 'Em revisão' || merchant.status === 'Rejeitado')) {
      merchant.status = status;
      modal.close();
      save('Activação actualizada na demonstração.');
    }
  }
  if (act === 'copy-link') copy(checkoutUrl(id));
  if (act === 'copy-campaign') copy(checkoutUrl(state.campaigns.find(item => item.id === id).link, id));
  if (act === 'export') exportTable(id);
  if (act === 'new-checkout') { lastOrder.delete(id); render(); }
  if (act === 'menu') {
    const open = document.querySelector('#sidebar').classList.toggle('open');
    target.setAttribute('aria-expanded', String(open));
  }
  if (act === 'review-payout') {
    const [payoutId, status] = id.split('|');
    const item = state.payouts.find(entry => entry.id === payoutId && entry.status === 'Em revisão');
    if (!item) return;
    item.status = status;
    modal.close();
    save('Revisão de saque registada na demonstração.');
  }
});
window.addEventListener('hashchange', () => {
  if (modal.open) modal.close();
  render();
  window.scrollTo(0, 0);
  document.querySelector('#content')?.focus({ preventScroll: true });
});
window.addEventListener('storage', event => {
  if (event.key !== key) return;
  state = restore();
  if (modal.open) modal.close();
  render();
});
render();
