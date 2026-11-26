import test from 'node:test';
import assert from 'node:assert/strict';
import { amountMinor, demoState, offerForLink, placeOrder, requestPayout, wallet } from '../public/model.js';

test('normaliza unidades menores e rejeita valores ambíguos', () => {
  assert.equal(amountMinor('49,05'), 4905);
  assert.equal(amountMinor('49.5'), 4950);
  assert.equal(amountMinor('0,01'), 1);
  for (const value of ['0', '-12', '12,345', '1e3', 'NaN']) assert.throws(() => amountMinor(value));
});

test('o mesmo link aceita vários pedidos e fixa loja, moeda e preço', () => {
  const state = demoState();
  const input = { linkId: 'estudio-criativo', name: 'Pessoa Demo', email: 'demo@xpay.example', method: 'Cartão', status: 'Pago', amount: 1, currency: 'GBP' };
  const first = placeOrder(state, { ...input, campaignId: 'CMP-01' });
  const next = placeOrder(state, { ...input, campaignId: 'CMP-02' });
  assert.notEqual(first.id, next.id);
  assert.equal(first.amount, 4900);
  assert.equal(first.currency, 'EUR');
  assert.equal(first.store, 'studio');
  assert.equal(first.campaign, 'CMP-01');
  assert.equal(next.campaign, undefined);
  assert.equal(state.orders[0], next);
});

test('pausar oferta ou link interrompe a criação de pedidos', () => {
  const state = demoState();
  assert.ok(offerForLink(state, 'estudio-criativo'));
  state.offers[0].status = 'Pausado';
  assert.equal(offerForLink(state, 'estudio-criativo'), undefined);
  state.offers[0].status = 'Publicado';
  state.links[0].status = 'Pausado';
  assert.throws(() => placeOrder(state, { linkId: 'estudio-criativo' }), /indisponível/);
});

test('saque reserva saldo da loja e da moeda seleccionadas', () => {
  const state = demoState();
  const before = wallet(state, 'EUR', 'studio');
  const other = wallet(state, 'GBP', 'lunar');
  const payout = requestPayout(state, { store: 'studio', currency: 'EUR', value: '10,00' });
  assert.equal(wallet(state, 'EUR', 'studio').available, before.available - 1000);
  assert.equal(wallet(state, 'EUR', 'studio').reserved, 1000);
  assert.deepEqual(wallet(state, 'GBP', 'lunar'), other);
  payout.status = 'Concluído';
  assert.equal(wallet(state, 'EUR', 'studio').available, before.available - 1000);
  assert.equal(wallet(state, 'EUR', 'studio').reserved, 0);
  assert.throws(() => requestPayout(state, { store: 'studio', currency: 'GBP', value: '1' }), /insuficiente/);
});
