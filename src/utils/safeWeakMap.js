// Global safeguard for WeakMap to prevent React Native / Expo / Three.js / React Navigation
// from throwing "TypeError: WeakMap key must be an Object" when primitives (null, undefined, string, number)
// are passed into weakMap.get(), .set(), .has(), or .delete().

const originalWeakMapSet = WeakMap.prototype.set;
const originalWeakMapGet = WeakMap.prototype.get;
const originalWeakMapHas = WeakMap.prototype.has;
const originalWeakMapDelete = WeakMap.prototype.delete;

WeakMap.prototype.set = function (key, value) {
  if (key === null || (typeof key !== 'object' && typeof key !== 'function')) {
    return this;
  }
  return originalWeakMapSet.call(this, key, value);
};

WeakMap.prototype.get = function (key) {
  if (key === null || (typeof key !== 'object' && typeof key !== 'function')) {
    return undefined;
  }
  return originalWeakMapGet.call(this, key);
};

WeakMap.prototype.has = function (key) {
  if (key === null || (typeof key !== 'object' && typeof key !== 'function')) {
    return false;
  }
  return originalWeakMapHas.call(this, key);
};

WeakMap.prototype.delete = function (key) {
  if (key === null || (typeof key !== 'object' && typeof key !== 'function')) {
    return false;
  }
  return originalWeakMapDelete.call(this, key);
};
