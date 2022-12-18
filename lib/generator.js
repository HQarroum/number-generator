import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';
import Pool from 'promise-pool-js';

/**
 * The `Generator` class is used to generate random numbers.
 */
export class Generator {

  /**
   * The options associated with the generator.
   */
  #opts;

  /**
   * The number of chunks to generate.
   */
  #chunks;

  /**
   * The size of each chunk.
   */
  #chunkSize;

  /**
   * `Generator` constructor.
   * @param {*} opts the generator options.
   */
  constructor({
    engine = 'math-random',
    number,
    minNumber = 0,
    maxNumber = 1 * 1000 * 1000,
    chunkSize = 10 * 1000 * 1000,
    threadCount = 1,
    format = 'text'
  }) {
    // Storing the options.
    this.#opts = { engine, minNumber, maxNumber, threadCount, format };
    // Calculating the number of chunks to generate.
    this.#chunks = Math.max(1, Math.round(number / chunkSize));
    // Calculating the chunk size.
    this.#chunkSize = this.#chunks === 1 ? number : chunkSize;
  }

  /**
   * Creates a worker thread.
   * @param {*} index the index of the worker thread.
   * @returns a promise resolved when the worker thread is ready.
   */
  #createWorker(index) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./lib/worker.js', {
        workerData: {
          index,
          chunkSize: this.#chunkSize,
          min: this.#opts.minNumber,
          max: this.#opts.maxNumber,
          engine: this.#opts.engine,
          format: this.#opts.format
        }
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }

  /**
   * Generates random numbers using multiple worker threads.
   * @return an event emitter that will produce events for
   * each available chunks and signal the completion of the
   * number generation process.
   */
  generate() {
    const emitter = new EventEmitter();
    const pool    = new Pool(this.workerThreads());

    // The amount of chunks processed.
    let count = 0;

    // Creating the worker threads.
    for (let i = 0; i < this.#chunks; ++i) {
      pool.schedule(() => this.#createWorker(i));
    }
    
    // Receiving the result of each worker thread.
    pool.on('after.each', (e) => {
      count += 1;
      const isLast = count === this.#chunks;
      emitter.emit('chunk', e.result, isLast);
      delete e.result.data;
      if (isLast) {
        emitter.emit('end');
      }
    });

    return (emitter);
  }

  /**
   * @returns the number of chunks to generate.
   */
  chunks() {
    return (this.#chunks);
  }

  /**
   * @returns the size of each chunk.
   */
  chunkSize() {
    return (this.#chunkSize);
  }

  /**
   * @returns the amount of numbers to generate.
   */
  numbers() {
    return (this.#chunkSize * this.#chunks);
  }

  /**
   * @returns the number of worker threads to use.
   */
  maxThreadCount() {
    return (this.#opts.threadCount);
  }

  /**
   * @returns the actual number of projected worker
   * threads to use.
   */
  workerThreads() {
    return (Math.min(this.maxThreadCount(), this.chunks()));
  }
}