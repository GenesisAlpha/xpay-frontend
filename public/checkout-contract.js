const knownFields = ['email', 'name', 'phone', 'country', 'postalCode', 'taxId'];
export const paymentMethods = ['card', 'mbway', 'bizum', 'multibanco', 'pix', 'iban'];
const fieldModes = new Set(['hidden', 'optional', 'required']);

export function fieldsFor(config = {}, method) {
  const rules = Object.fromEntries(knownFields.map(name => [
    name,
    fieldModes.has(config[name]) ? config[name] : name === 'email' ? 'required' : 'hidden',
  ]));
  if (method === 'mbway') rules.phone = 'required';
  return rules;
}

export function normalizeCart(items) {
  if (!Array.isArray(items) || !items.length || items.length > 50) throw new Error('Pedido indisponível.');
  const ids = new Set();
  return items.map(item => {
    if (!item || typeof item.id !== 'string' || !item.id || ids.has(item.id) ||
        typeof item.name !== 'string' || !item.name || !Number.isSafeInteger(item.unitAmount) ||
        item.unitAmount <= 0 || item.unitAmount > 100_000_000 || !Number.isInteger(item.quantity) ||
        item.quantity < 1 || item.quantity > 99) throw new Error('Pedido indisponível.');
    ids.add(item.id);
    const max = Number.isInteger(item.maxQuantity) && item.maxQuantity >= item.quantity
      ? Math.min(99, item.maxQuantity) : item.quantity;
    return { id: item.id, name: item.name, unitAmount: item.unitAmount, quantity: item.quantity, maxQuantity: max };
  });
}

export const cartTotal = items => items.reduce((total, item) => total + item.unitAmount * item.quantity, 0);

export function safeOrigin(value, currentOrigin) {
  try {
    const url = new URL(value);
    if (url.pathname !== '/' || url.search || url.hash) return null;
    return allowedUrl(value, [url.origin], currentOrigin)?.origin ?? null;
  } catch {
    return null;
  }
}

export function allowedUrl(value, origins, currentOrigin) {
  if (typeof value !== 'string' || !value) return null;
  try {
    const url = new URL(value, currentOrigin);
    if (url.username || url.password || !origins.includes(url.origin)) return null;
    const local = url.origin === currentOrigin && ['localhost', '127.0.0.1'].includes(url.hostname);
    return url.protocol === 'https:' || (url.protocol === 'http:' && local) ? url : null;
  } catch {
    return null;
  }
}

export function paymentPhase(status) {
  if (status === 'paid') return 'paid';
  if (['cancelled', 'expired', 'failed'].includes(status)) return status;
  if (['pending', 'processing', 'requires_action'].includes(status)) return 'pending';
  if (status === 'open') return 'open';
  throw new Error('Estado do pagamento indisponível.');
}
