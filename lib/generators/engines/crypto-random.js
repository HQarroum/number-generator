import crypto from 'crypto';

/**
 * Generates random numbers using the Crypto API.
 */
class CryptoRandomGenerator {

  /**
   * The minimum integer value to generate.
   */
  #min;

  /**
   * The maximum integer value to generate.
   */
  #max;

  /**
   * Constructor.
   * @param {*} min the minimum integer value to generate.
   * @param {*} max the maximum integer value to generate.
   */
  constructor(min, max) {
    this.#min = min;
    this.#max = max;
  }

  /**
   * @returns the minimum integer value to generate.
   */
  min() {
    return (this.#min);
  }

  /**
   * @returns the maximum integer value to generate.
   */
  max() {
    return (this.#max);
  }

  /**
   * @returns a random number between `min` and `max`.
   */
  generate() {
    return (crypto.randomInt(this.#min, this.#max));
  }
}

export default CryptoRandomGenerator;