import "@testing-library/jest-dom";
import { expect } from "vitest"; // Ensure this import exists

// Extend the global window object to include Vitest's expect
declare global {
  interface Window {
    expect: typeof expect;
  }
}

// Assign Vitest's expect to the global window object
window.expect = expect;