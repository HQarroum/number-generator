import CryptoRandomGenerator from '../engines/crypto-random.js';
import MathRandomGenerator from '../engines/math-random.js';
import TextGenerator from '../backends/text.js';
import UintGenerator from '../backends/uint.js';

const map = {
  'u8': 8,
  'u16': 16,
  'u32': 32,
  'u64': 64
};

export class Factory {

  static Builder = class {

    #engine;
    #format;
    #min;
    #max;

    /**
     * Constructor.
     */
    constructor() {
      this.#min = 0;
      this.#max = 1000;
    }

    /**
     * Specifies the engine to use for building
     * a new generator.
     * @param {*} engine a string identifying the engine to use.
     * @returns an instance of the builder.
     */
    withEngine(engine) {
      this.#engine = engine;
      return (this);
    }

    /**
     * Specifies the format to use for building
     * a new generator.
     * @param {*} format a string identifying the format to use.
     * @returns an instance of the builder.
     */
    withFormat(format) {
      this.#format = format;
      return (this);
    }

    /**
     * Specifies the minimum number to be generated.
     * @param {*} minimum an integer representing the
     * minimum number to generate.
     * @returns an instance of the builder.
     */
    withMin(min) {
      this.#min = min;
      return (this);
    }

    /**
     * Specifies the maximum number to be generated.
     * @param {*} maximum an integer representing the
     * maximum number to generate.
     * @returns an instance of the builder.
     */
    withMax(max) {
      this.#max = max;
      return (this);
    }

    /**
     * Creates a generator based on the given options.
     * @param {*} opts the options to use to create a generator.
     * @returns a new instance of a generator.
     */
    create() {
      let engine  = null;
      let backend = null;
    
      if (this.#engine === 'crypto-random') {
        engine = new CryptoRandomGenerator(this.#min, this.#max);
      } else if (this.#engine === 'math-random') {
        engine = new MathRandomGenerator(this.#min, this.#max);
      } else {
        throw new Error(`Unknown engine '${this.#engine}'`);
      }
    
      if (Object.keys(map).includes(this.#format)) {
        backend = new UintGenerator(map[this.#format], engine);
      } else if (this.#format === 'text') {
        backend = new TextGenerator(engine);
      } else {
        throw new Error(`Unknown backend '${this.#format}`);
      }
    
      return (backend);
    }
  }
}
