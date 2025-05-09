import "@testing-library/jest-dom";
import { expect } from "vitest"; // Ensure Vitest's expect is imported

// Extend the window object type to include expect
declare global {
  interface Window {
    expect: typeof expect;
  }
}

// Assign Vitest's expect to the window object
window.expect = expect;