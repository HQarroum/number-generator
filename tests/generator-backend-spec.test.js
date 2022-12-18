import TextGenerator from '../lib/generators/backends/text';
import UintGenerator from '../lib/generators/backends/uint';
import MathRandomGenerator from '../lib/generators/engines/math-random';
import { Factory } from '../lib/generators/backends/factory.js';
import CryptoRandomGenerator from '../lib/generators/engines/crypto-random';

/**
 * The numbers to generate.
 */
const CHUNK_SIZE = 10;

describe('Generation Backends', () => {
  
  /**
   * Uint8 back-end test.
   */
  it('should be able to generate a chunk of numbers using the Uint8 back-end', () => {
    const generator = new UintGenerator(8,
      new MathRandomGenerator(0, 1000)
    );
    const data = generator.generate(CHUNK_SIZE);
    expect(data.size).toEqual(data.length);
    expect(data.size).toBe(1 * CHUNK_SIZE);
    data.array.forEach((number) => {
      expect(typeof number).toBe('number');
    });
    expect(generator.estimatedSize(CHUNK_SIZE)).toBe(1 * CHUNK_SIZE);
  });

  /**
   * Uint16 back-end test.
   */
  it('should be able to generate a chunk of numbers using the Uint16 back-end', () => {
    const generator = new UintGenerator(16,
      new MathRandomGenerator(0, 1000)
    );
    const data = generator.generate(CHUNK_SIZE);
    expect(data.size).toEqual(data.length * 2);
    expect(data.size).toBe(2 * CHUNK_SIZE);
    data.array.forEach((number) => {
      expect(typeof number).toBe('number');
    });
    expect(generator.estimatedSize(CHUNK_SIZE)).toBe(2 * CHUNK_SIZE);
  });

  /**
   * Uint32 back-end test.
   */
  it('should be able to generate a chunk of numbers using the Uint32 back-end', () => {
    const generator = new UintGenerator(32,
      new MathRandomGenerator(0, 1000)
    );
    const data = generator.generate(CHUNK_SIZE);
    expect(data.size).toEqual(data.length * 4);
    expect(data.size).toBe(4 * CHUNK_SIZE);
    data.array.forEach((number) => {
      expect(typeof number).toBe('number');
    });
    expect(generator.estimatedSize(CHUNK_SIZE)).toBe(4 * CHUNK_SIZE);
  });

  /**
   * Uint64 back-end test.
   */
  it('should be able to generate a chunk of numbers using the Uint64 back-end', () => {
    const generator = new UintGenerator(64,
      new MathRandomGenerator(0, 1000)
    );
    const data = generator.generate(CHUNK_SIZE);
    expect(data.size).toEqual(data.length * 8);
    expect(data.size).toBe(8 * CHUNK_SIZE);
    data.array.forEach((number) => {
      expect(typeof number).toBe('number');
    });
    expect(generator.estimatedSize(CHUNK_SIZE)).toBe(8 * CHUNK_SIZE);
  });

  /**
   * Invalid size back-end test.
   */
  it('should not be able to generate a chunk of numbers using an invalid size', () => {
    expect(() => {
      new UintGenerator(1, new MathRandomGenerator(0, 1000));
    }).toThrow();
  });

  /**
   * Text back-end test.
   */
  it('should be able to generate a chunk of numbers using the Text back-end', () => {
    const generator = new TextGenerator(new MathRandomGenerator(0, 1000));
    const data      = generator.generate(CHUNK_SIZE);
    const estimate  = generator.estimatedSize(CHUNK_SIZE);
    
    expect(typeof data.array).toBe('string');
    expect(typeof estimate).toBe('number');
  });

  /**
   * Factory back-end test.
   */
  it('should be able to create a new back-end using the factory', () => {
    const f1 = new Factory.Builder()
      .withEngine('math-random')
      .withFormat('u32')
      .create();
    expect(f1 instanceof UintGenerator).toBe(true);
    expect(f1.engine() instanceof MathRandomGenerator).toBe(true);

    const f2 = new Factory.Builder()
      .withEngine('crypto-random')
      .withFormat('u64')
      .create();
    expect(f2 instanceof UintGenerator).toBe(true);
    expect(f2.engine() instanceof CryptoRandomGenerator).toBe(true);
  });
});