/**
 * Maximum unsigned 8-bits integer.
 * @constant
 */
const UINT8_MAX = 255;

/**
 * Maximum unsigned 16-bits integer.
 * @constant
 */
const UINT16_MAX = 65535;

/**
 * Maximum unsigned 32-bits integer.
 * @constant
 */
const UINT32_MAX = 4294967295;

/**
 * Information about the supported bit sizes.
 */
const bitsDescription = {

  /**
   * Generates unsigned 8-bits random integers.
   * @param {*} opts generation options.
   * @returns an object containing a buffer of random numbers.
   */
  8: {
    max: UINT8_MAX,
    bytes: 1,
    compute: (opts) => {
      const array = Uint8Array.from(
        { length: opts.chunkSize },
        () => opts.engine.generate()
      );
      return ({
        size: array.byteLength,
        length: opts.chunkSize,
        array
      });
    }
  },

  /**
   * Generates unsigned 16-bits random integers.
   * @param {*} opts generation options.
   * @returns an object containing a buffer of random numbers.
   */
  16: {
    max: UINT16_MAX,
    bytes: 2,
    compute: (opts) => {
      const array = Uint16Array.from(
        { length: opts.chunkSize },
        () => opts.engine.generate()
      );
      return ({
        size: array.byteLength,
        length: opts.chunkSize,
        array: Buffer.from(array.buffer)
      });
    }
  },

  /**
   * Generates unsigned 32-bits random integers.
   * @param {*} opts generation options.
   * @returns an object containing a buffer of random numbers.
   */
  32: {
    max: UINT32_MAX,
    bytes: 4,
    compute: (opts) => {
      const array = Uint32Array.from(
        { length: opts.chunkSize },
        () => opts.engine.generate()
      );
      return ({
        size: array.byteLength,
        length: opts.chunkSize,
        array: Buffer.from(array.buffer)
      });
    }
  },

  /**
   * Generates unsigned 64-bits random integers.
   * @param {*} opts generation options.
   * @returns an object containing a buffer of random numbers.
   */
  64: {
    max: Number.MAX_SAFE_INTEGER - 1,
    bytes: 8,
    compute: (opts) => {
      const iterable = function* () { 
        for (let i = 0; i < opts.chunkSize; ++i) {
          yield BigInt(opts.engine.generate());
        }
      }();
      const array = BigUint64Array.from(iterable);
      return ({
        size: array.byteLength,
        length: opts.chunkSize,
        array: Buffer.from(array.buffer)
      });
    }
  }
};

class UintGenerator {

  /**
   * The number of bits of the unsigned integers
   * to generate.
   */
  #bits;

  /**
   * The underlying generation engine.
   */
  #engine;

  /**
   * Constructor.
   * @param {*} engine the generation engine
   * to use to generate random numbers.
   */
  constructor(bits, engine) {
    if (!Object
      .keys(bitsDescription)
      .map(n => parseInt(n))
      .includes(bits)) {
      throw new Error(`Unsupported bit size`);
    }
    this.#bits   = bits;
    this.#engine = engine;
  }

  /**
   * @returns the engine associated with the generator.
   */
  engine() {
    return (this.#engine);
  }

  /**
   * @param {*} chunkSize the number of random integers to create.
   * @returns a buffer of random numbers.
   */
  generate(chunkSize) {
    return (bitsDescription[this.#bits].compute({
      engine: this.#engine,
      chunkSize
    }));
  }

  /**
   * @returns the maximum possible value that this
   * generator can generate.
   */
  max() {
    return (bitsDescription[this.#bits].max);
  }

  /**
   * @returns the minimum possible value that this
   * generator can generate.
   */
  min() {
    return (0);
  }

  /**
   * @param numbers the amount of numbers to estimate
   * the size of.
   * @returns an estimate (in bytes) of the
   * size of the generated numbers.
   */
  estimatedSize(numbers) {
    return (numbers * bitsDescription[this.#bits].bytes);
  }
}

export default UintGenerator;