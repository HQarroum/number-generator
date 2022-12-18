/**
 * Generates random numbers using a textual format.
 */
class TextGenerator {

  /**
   * The underlying generation engine.
   */
  #engine;

  /**
   * Constructor.
   * @param {*} engine the generation engine
   * to use to generate random numbers.
   */
  constructor(engine) {
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
    const array = Array
      .from({ length: chunkSize }, () => this.#engine.generate())
      .join(',');
    return ({
      size: array.length,
      length: chunkSize,
      array
    });
  }

  /**
   * @returns the maximum possible value that this
   * generator can generate.
   */
  max() {
    return (Number.MAX_SAFE_INTEGER);
  }

  /**
   * @returns the minimum possible value that this
   * generator can generate.
   */
  min() {
    return (Number.MIN_SAFE_INTEGER);
  }

  /**
   * @param numbers the amount of numbers to estimate
   * the size of.
   * @returns an estimate (in bytes) of the
   * size of the generated numbers.
   */
  estimatedSize(numbers) {
    const low  = ((this.#engine.min().toString().length + 1) * numbers) - 1;
    const high = ((this.#engine.max().toString().length + 1) * numbers) - 1;
    return ((low + high) / 2);
  }
}

export default TextGenerator;