export const currencies = ['EUR', 'GBP', 'USD', 'BRL'];
export const stores = [
  { id: 'studio', name: 'Studio Norte' },
  { id: 'lunar', name: 'Clube Lunar' },
];
export const storeName = id => stores.find(store => store.id === id)?.name || id;
export const stages = ['Pago', 'Pendente', 'Recusado', 'Reembolsado'];
export const statuses = ['Pago', 'Activo', 'Publicado', 'Concluído', 'Aprovado'];
export const paid = order => order.status === 'Pago';
export const today = () => new Date().toISOString();
export const makeId = prefix => `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

export function amountMinor(value) {
  const match = String(value).trim().match(/^(\d{1,7})(?:[,.](\d{1,2}))?$/);
  if (!match) throw new Error('Introduza um valor com até duas casas decimais.');
  const amount = Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0'));
  if (amount === 0) throw new Error('O valor deve ser superior a zero.');
  return amount;
}

export function money(amount, currency) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency }).format(amount / 100);
}

export function demoState() {
  const products = [
    { id: 'PRD-1001', name: 'Estúdio Criativo', kind: 'Digital', store: 'studio', status: 'Activo' },
    { id: 'PRD-1002', name: 'Sessão Estratégia', kind: 'Serviço', store: 'studio', status: 'Activo' },
    { id: 'PRD-1003', name: 'Clube Lunar', kind: 'Digital', store: 'lunar', status: 'Activo' },
    { id: 'PRD-1004', name: 'Caderno de Campo', kind: 'Físico', store: 'lunar', status: 'Rascunho' },
  ];
  const offers = [
    { id: 'OFR-2001', product: 'PRD-1001', name: 'Estúdio Criativo · Acesso', store: 'studio', amount: 4900, currency: 'EUR', cycle: 'Único', status: 'Publicado' },
    { id: 'OFR-2002', product: 'PRD-1002', name: 'Sessão Estratégia · 60 min', store: 'studio', amount: 12500, currency: 'EUR', cycle: 'Único', status: 'Publicado' },
    { id: 'OFR-2003', product: 'PRD-1003', name: 'Clube Lunar · Mensal', store: 'lunar', amount: 2400, currency: 'GBP', cycle: 'Mensal', status: 'Publicado' },
  ];
  const links = [
    { id: 'estudio-criativo', offer: 'OFR-2001', store: 'studio', status: 'Activo', channel: 'Site' },
    { id: 'sessao-estrategia', offer: 'OFR-2002', store: 'studio', status: 'Activo', channel: 'Directo' },
    { id: 'clube-lunar', offer: 'OFR-2003', store: 'lunar', status: 'Activo', channel: 'Rede social' },
  ];
  const names = ['Mariana Costa', 'Tomás Almeida', 'Helena Duarte', 'Rui Fernandes', 'Inês Lopes', 'João Santos', 'Catarina Alves', 'Pedro Matos', 'Beatriz Pinto', 'Miguel Reis', 'Clara Silva', 'Diana Lima'];
  const orders = names.map((name, index) => {
    const offer = offers[index === 1 ? 1 : index % 5 === 4 ? 2 : index % 2];
    const date = new Date();
    date.setDate(date.getDate() - index * 2);
    return {
      id: `XP-${1048 - index}`, name, email: `cliente${index + 1}@xpay.example`,
      offer: offer.id, store: offer.store, item: offer.name, amount: offer.amount, currency: offer.currency,
      status: index === 2 || index === 7 ? 'Pendente' : index === 5 ? 'Reembolsado' : 'Pago',
      created: date.toISOString(), channel: index % 3 === 0 ? 'Site' : 'Directo', method: index % 2 ? 'Cartão' : 'Transferência',
      fulfillment: index === 0 ? 'Entregue' : 'Por entregar',
    };
  });
  return {
    products, offers, links, orders,
    campaigns: [
      { id: 'CMP-01', name: 'Lançamento Estúdio', type: 'Landing page', store: 'studio', status: 'Activo', link: 'estudio-criativo' },
      { id: 'CMP-02', name: 'Clube Lunar · Newsletter', type: 'Email', store: 'lunar', status: 'Planeado', link: 'clube-lunar' },
    ],
    affiliates: [{ id: 'AFF-01', name: 'Parceiro Aurora', email: 'aurora@xpay.example', store: 'studio', status: 'Activo', rate: 15 }],
    tickets: [{ id: 'TK-301', name: 'Verificar conciliação de pedido XP-1046', category: 'Reconciliação', store: 'studio', status: 'Aberto', created: today() }],
    payouts: [{ id: 'PO-901', store: 'studio', currency: 'EUR', amount: 1500, status: 'Concluído', created: today() }],
    disputes: [{ id: 'DSP-01', order: 'XP-1043', store: 'studio', name: 'Documentação em revisão', status: 'Em revisão' }],
    rules: [{ id: 'REG-01', name: 'Europa · Cartão', store: 'studio', provider: 'Stripe', status: 'Activo' }],
    merchants: stores.map((store, index) => ({ id: store.id, name: store.name, store: store.id, status: index ? 'Em revisão' : 'Aprovado' })),
    notes: {},
  };
}

export function offerForLink(state, id) {
  const link = state.links.find(link => link.id === id && link.status === 'Activo');
  const offer = state.offers.find(offer => offer.id === link?.offer && offer.status === 'Publicado');
  return offer && state.products.some(product => product.id === offer.product && product.status === 'Activo')
    ? { link, offer }
    : undefined;
}

export function placeOrder(state, { linkId, name, email, method, status, campaignId, quantity = 1 }) {
  const checkout = offerForLink(state, linkId);
  if (!checkout) throw new Error('Este link está indisponível.');
  if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Indique um nome e um email válidos.');
  if (!['Pago', 'Pendente', 'Recusado'].includes(status)) throw new Error('Resultado de demonstração inválido.');
  const { link, offer } = checkout;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > (offer.cycle === 'Mensal' ? 1 : 9)) throw new Error('Quantidade de demonstração inválida.');
  const campaign = state.campaigns.find(item => item.id === campaignId && item.link === link.id && item.status === 'Activo');
  const order = {
    id: makeId('XP'), name: name.trim(), email: email.toLowerCase().trim(), method, status,
    offer: offer.id, amount: offer.amount * quantity, currency: offer.currency, item: offer.name, store: offer.store,
    ...(quantity > 1 ? { quantity } : {}),
    channel: campaign?.type || link.channel, campaign: campaign?.id, created: today(),
    fulfillment: 'Por entregar',
  };
  state.orders.unshift(order);
  return order;
}

export function wallet(state, currency, store) {
  const matches = item => item.currency === currency && (store === 'all' || item.store === store);
  const value = (items, status) => items.filter(item => matches(item) && item.status === status).reduce((sum, item) => sum + item.amount, 0);
  const confirmed = value(state.orders, 'Pago');
  const reserved = value(state.payouts, 'Em revisão');
  return {
    available: confirmed - reserved - value(state.payouts, 'Concluído'),
    pending: value(state.orders, 'Pendente'),
    reserved,
    refunded: value(state.orders, 'Reembolsado'),
  };
}

export function requestPayout(state, { store, currency, value }) {
  const amount = amountMinor(value);
  if (amount > wallet(state, currency, store).available) throw new Error('Saldo de demonstração insuficiente.');
  const payout = { id: makeId('PO'), store, currency, amount, status: 'Em revisão', created: today() };
  state.payouts.unshift(payout);
  return payout;
}
