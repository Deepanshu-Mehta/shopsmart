global.IntersectionObserver = class {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

import '@testing-library/jest-dom';

// Global fetch mock lifecycle — reset per test.
// Default returns a never-resolving promise so components that call fetch
// but don't have an explicit mock don't throw "Cannot read .then of undefined".
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  vi.unstubAllGlobals();
});
