/**
 * Modular arithmetic on Z_w, and the lens a seat reads the board through.
 *
 * The board is a cylinder: columns are Z_w, rows are not periodic. A *lens* is
 * an affine map on the columns,
 *
 *     view = m * (canonical - f) + f   (mod w)
 *
 * with multiplier `m` invertible mod w, fixing the column `f`. Fixing `f` is
 * what makes both seats agree on where the goals are.
 *
 * The engine stores one canonical column per position and hands each seat its
 * own lens. Canonical is bookkeeping, not a player: no code path assumes either
 * seat's lens is the identity, and `reframe()` below rewrites a configuration
 * into a different canonical frame without changing what either seat sees.
 */

export function mod(x, m) {
  return ((x % m) + m) % m;
}

/** Representative of x in (-m/2, m/2] — "three left" rather than "eight right". */
export function signedRep(x, m) {
  const r = mod(x, m);
  return r > m / 2 ? r - m : r;
}

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function areCoprime(a, m) {
  return gcd(a, m) === 1;
}

/** The x with a*x = 1 (mod m). Throws when a is not invertible. */
export function modInverse(a, m) {
  const r = mod(a, m);
  if (!areCoprime(r, m)) {
    throw new RangeError(`${a} is not invertible mod ${m} (gcd is ${gcd(r, m)})`);
  }
  for (let x = 1; x < m; x++) {
    if (mod(r * x, m) === 1) return x;
  }
  /* c8 ignore next */
  throw new RangeError(`no inverse of ${a} mod ${m}`); // unreachable once coprime
}

/** Every multiplier that yields a valid lens on Z_w. */
export function validMultipliers(width) {
  const out = [];
  for (let i = 1; i < width; i++) if (areCoprime(i, width)) out.push(i);
  return out;
}

export class Lens {
  /**
   * @param {{width:number, multiplier:number, fixedPoint:number}} spec
   */
  constructor({ width, multiplier, fixedPoint }) {
    if (!Number.isInteger(width) || width < 1) {
      throw new RangeError(`width must be a positive integer, got ${width}`);
    }
    if (!areCoprime(multiplier, width)) {
      throw new RangeError(
        `multiplier ${multiplier} must be coprime with width ${width}; ` +
          `valid multipliers: ${validMultipliers(width).join(', ')}`
      );
    }
    this.width = width;
    this.multiplier = mod(multiplier, width);
    this.fixedPoint = mod(fixedPoint, width);
    Object.freeze(this);
  }

  /**
   * The additive offset in the equivalent `m * canonical + b` form. The legacy
   * v3.1 game stored exactly this as `state.b`.
   */
  get offset() {
    return mod(this.fixedPoint * (1 - this.multiplier), this.width);
  }

  /** Canonical column -> the column this seat sees. */
  toView(canonicalCol) {
    return mod(this.multiplier * (canonicalCol - this.fixedPoint) + this.fixedPoint, this.width);
  }

  /** A column this seat sees -> canonical. */
  toCanonical(viewCol) {
    const inv = modInverse(this.multiplier, this.width);
    return mod(inv * (viewCol - this.fixedPoint) + this.fixedPoint, this.width);
  }

  /**
   * A canonical sideways displacement, as this seat perceives it. The fixed
   * point cancels, so displacements scale by the multiplier alone — which is
   * the whole trick: one player's "three across" is the other's "four across".
   */
  viewDelta(canonicalDelta) {
    return signedRep(this.multiplier * canonicalDelta, this.width);
  }

  /**
   * The inverse of `viewDelta`: a displacement this seat perceives, in
   * canonical terms. What the sandbox needs when somebody clicks a cell in the
   * hockey player's move palette — they are pointing at a hockey displacement,
   * and the move set is stored canonically.
   */
  canonicalDelta(viewDelta) {
    const inv = modInverse(this.multiplier, this.width);
    return signedRep(inv * viewDelta, this.width);
  }

  /** The lens that undoes this one. */
  inverse() {
    return new Lens({
      width: this.width,
      multiplier: modInverse(this.multiplier, this.width),
      fixedPoint: this.fixedPoint,
    });
  }

  /** This lens followed by `next`. */
  compose(next) {
    if (next.width !== this.width || next.fixedPoint !== this.fixedPoint) {
      throw new RangeError('lenses must share a width and a fixed point to compose');
    }
    return new Lens({
      width: this.width,
      multiplier: mod(next.multiplier * this.multiplier, this.width),
      fixedPoint: this.fixedPoint,
    });
  }
}

/**
 * The duality number relating two seats: the multiplier taking what seat A sees
 * to what seat B sees. For the published game this is 4.
 */
export function dualityBetween(lensA, lensB) {
  if (lensA.width !== lensB.width) {
    throw new RangeError('lenses must share a width');
  }
  return mod(lensB.multiplier * modInverse(lensA.multiplier, lensA.width), lensA.width);
}

/**
 * The order of a lens: how many times it must be applied to return to the
 * identity. Multiplier 4 on Z_11 has order 5, so it generates the quadratic
 * residues rather than all of Z_11* — a primitive root (2, 6, 7, 8) would give
 * order 10.
 */
export function lensOrder(multiplier, width) {
  const m = mod(multiplier, width);
  if (!areCoprime(m, width)) throw new RangeError(`${multiplier} is not invertible mod ${width}`);
  let k = 1;
  let acc = m;
  while (acc !== 1) {
    acc = mod(acc * m, width);
    k++;
  }
  return k;
}
