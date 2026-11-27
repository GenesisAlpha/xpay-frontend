import test from 'node:test';
import assert from 'node:assert/strict';
import { fieldsFor, normalizeCart, cartTotal, allowedUrl, safeOrigin, paymentPhase } from '../public/checkout-contract.js';

test('merchant fields preserve the method-required contact', () => {
  assert.equal(fieldsFor({email:'hidden', phone:'hidden'}, 'mbway').phone, 'required');
  assert.equal(fieldsFor({email:'hidden', phone:'optional'}, 'card').email, 'hidden');
  assert.equal(fieldsFor({postalCode:'required'}, 'card').postalCode, 'required');
});

test('cart validates integer amounts, allowed quantities and duplicate IDs', () => {
  const items = normalizeCart([{id:'x',name:'Offer',unitAmount:990,quantity:2,maxQuantity:3}]);
  assert.equal(items[0].maxQuantity, 3);
  assert.equal(cartTotal(items), 1980);
  assert.throws(() => normalizeCart([{id:'x',name:'Offer',unitAmount:9.90,quantity:1}]));
  assert.throws(() => normalizeCart([...items,...items]));
  assert.throws(() => normalizeCart([{id:'x',name:'Offer',unitAmount:990,quantity:0}]));
});

test('redirection uses exact permitted origins', () => {
  const shop = 'https://shop.example';
  assert.equal(allowedUrl('https://shop.example/thanks',[shop],shop).href, shop + '/thanks');
  assert.equal(allowedUrl('https://shop.example.evil/thanks',[shop],shop), null);
  assert.equal(allowedUrl('javascript:alert(0)',[shop],shop), null);
  assert.equal(allowedUrl('https://user@shop.example/',[shop],shop), null);
  assert.equal(safeOrigin('https://shop.example/path',shop), null);
  assert.equal(safeOrigin(shop,shop), shop);
});

test('pending or action required does not grant the paid state', () => {
  assert.equal(paymentPhase('requires_action'), 'pending');
  assert.equal(paymentPhase('processing'), 'pending');
  assert.equal(paymentPhase('paid'), 'paid');
  assert.throws(() => paymentPhase('success'));
});
