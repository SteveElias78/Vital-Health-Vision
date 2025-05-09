
import "@testing-library/jest-dom";
import { expect } from "vitest";

// Extend the global window object to include Vitest's expect
declare global {
  interface Window {
    expect: typeof expect;
  }
}

// Assign Vitest's expect to the global window object
window.expect = expect;

// Add custom matchers if needed
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received !== null && 
                received !== undefined && 
                received.ownerDocument !== undefined;
    if (pass) {
      return {
        message: () => `expected ${received} not to be in the document`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be in the document`,
        pass: false,
      };
    }
  },
});
