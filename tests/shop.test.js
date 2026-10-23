import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeCart,
  changeQuantity,
  subtotal,
  shipping,
  cartCount,
  money,
} from "../src/shop.js";

test("saved cart rejects invalid, duplicate, unknown, and excessive entries", () => {
  assert.deepEqual(
    sanitizeCart([
      { id: "bites", quantity: 2 },
      { id: "bites", quantity: 3 },
      { id: "unknown", quantity: 1 },
      { id: "fur", quantity: -1 },
      { id: "play", quantity: 21 },
      { id: "tummy", quantity: 1.5 },
      null,
    ]),
    [{ id: "bites", quantity: 2 }],
  );
  for (const invalid of [null, {}, "bad data", 42])
    assert.deepEqual(sanitizeCart(invalid), []);
});
test("cart supports add, increment, decrement, remove without mutation", () => {
  const original = [{ id: "bites", quantity: 1 }];
  const updated = changeQuantity(original, "bites", 1);
  assert.deepEqual(original, [{ id: "bites", quantity: 1 }]);
  assert.deepEqual(updated, [{ id: "bites", quantity: 2 }]);
  assert.deepEqual(changeQuantity(updated, "bites", -2), []);
  assert.deepEqual(changeQuantity([], "fur", 1), [{ id: "fur", quantity: 1 }]);
  assert.deepEqual(changeQuantity(original, "invalid", 1), original);
  assert.equal(
    changeQuantity([{ id: "fur", quantity: 20 }], "fur", 1)[0].quantity,
    20,
  );
});
test("currency totals use integer cents and shipping switches at $50", () => {
  const cart = [
    { id: "fur", quantity: 1 },
    { id: "tummy", quantity: 1 },
  ];
  assert.equal(subtotal(cart), 5000);
  assert.equal(shipping(cart), 0);
  assert.equal(cartCount(cart), 2);
  assert.equal(shipping([{ id: "bites", quantity: 1 }]), 500);
  assert.equal(shipping([]), 0);
  assert.equal(money(1900), "$19.00");
});
