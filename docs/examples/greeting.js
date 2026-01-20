/**
 * Greeting utilities
 * This file is loaded externally to demonstrate the src attribute
 */

export function greet(name) {
  return `Hello, ${name}!`;
}

export function farewell(name) {
  return `Goodbye, ${name}!`;
}

// Usage example
const message = greet('World');
console.log(message);
