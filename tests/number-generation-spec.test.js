import { EventEmitter } from 'events';
import { Generator } from '../lib/generator';
import prettyBytes from 'pretty-bytes';

describe('Generator', () => {

  /**
   * Chunk calculation test.
   */
  it('should be able to compute the correct chunks', () => {
    const generator = new Generator({
      number: 100 * 1000 * 1000,
      chunkSize: 10 * 1000 * 1000
    });

    expect(generator.chunks()).toBe(10);
    expect(generator.chunkSize()).toBe(10 * 1000 * 1000);
  });

  /**
   * Worker threads number calculation test.
   */
  it('should be able to compute the correct number of worker threads to use', () => {
    const small = new Generator({
      number: 10 * 1000 * 1000,
      chunkSize: 10 * 1000 * 1000,
      threadCount: 12
    });

    const medium = new Generator({
      number: 100 * 1000 * 1000,
      chunkSize: 10 * 1000 * 1000,
      threadCount: 12
    });

    const large = new Generator({
      number: 1000 * 1000 * 1000,
      chunkSize: 10 * 1000 * 1000,
      threadCount: 12
    });

    expect(small.workerThreads()).toBe(1);
    expect(medium.workerThreads()).toBe(10);
    expect(large.workerThreads()).toBe(12);
  });

  /**
   * Number generation with a single chunk test.
   */
  it('should be able to generate random numbers using a single chunk', (done) => {
    const generator = new Generator({
      number: 10 * 1000 * 1000,
      maxNumber: 9,
      chunkSize: 10 * 1000 * 1000
    });
    
    const emitter = generator.generate();

    emitter
      .on('chunk', (result, last) => {
        expect(result.index).toBe(0);
        expect(last).toBe(true);
      })
      .on('end', () => done());
  });

  /**
   * Number generation with multiple chunks test.
   */
  it('should be able to generate random numbers using multiple chunks', (done) => {
    let last      = false;
    const indexes = [];

    const generator = new Generator({
      number: 10 * 1000 * 1000,
      chunkSize: 1 * 1000 * 1000
    });
    
    const emitter = generator.generate();

    emitter.on('chunk', (result, lastChunk) => {
      indexes.push(result.index);
      if (lastChunk) {
        last = lastChunk;
      }
    });

    emitter.on('end', () => {
      indexes.sort();
      expect(indexes.length).toBe(10);
      expect(indexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(last).toBe(true);
      done();
    });
  });
});