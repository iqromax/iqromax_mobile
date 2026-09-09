// Global safeguard for WeakMap & Image polyfill for Three.js / Expo / React Native
if (typeof global !== 'undefined') {
  if (typeof global.Image === 'undefined') {
    global.Image = class Image {
      constructor() {
        this.src = '';
        this.onload = null;
        this.onerror = null;
      }
    };
  }
  if (typeof global.HTMLImageElement === 'undefined') {
    global.HTMLImageElement = global.Image;
  }
}

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
