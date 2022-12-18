import CryptoRandomGenerator from '../lib/generators/engines/crypto-random';
import MathRandomGenerator from '../lib/generators/engines/math-random';

describe('Generation Engines', () => {
  
  /**
   * Crypto Random test.
   */
  it('should be able to generate numbers using the crypto random engine', () => {
    const engine = new CryptoRandomGenerator(0, 1000);
    const nb     = engine.generate();

    expect(typeof nb).toBe('number');
    expect(nb >= 0 && nb <= 1000).toBe(true);
  });

  /**
   * Math Random test.
   */
   it('should be able to generate numbers using the math random engine', () => {
    const engine = new MathRandomGenerator(0, 1000);
    const nb     = engine.generate();

    expect(typeof nb).toBe('number');
    expect(nb >= 0 && nb <= 1000).toBe(true);
  });
});