/**
 * The Duality Games engine: pure rules, no DOM and no network.
 *
 * Everything here is a plain function over plain data, so it runs identically
 * in a browser and under `node --test`. The transport layer (Firestore) and the
 * renderer sit on top and are swappable.
 */

export * from './duality.js';
export * from './rules.js';
export * from './game.js';
export * from './presets.js';
