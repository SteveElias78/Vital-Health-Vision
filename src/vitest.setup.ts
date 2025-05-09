
import "@testing-library/jest-dom";

// Extend the window object type to include expect
declare global {
  interface Window {
    expect: typeof import("vitest")["expect"];
  }
}

// This expands the expect function by adding custom matchers
// for asserting on DOM elements
window.expect = expect;
