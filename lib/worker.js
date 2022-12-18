import { Factory } from './generators/backends/factory.js';
import {
  parentPort,
  workerData
} from 'node:worker_threads';

/**
 * Generates random numbers in a dedicated worker thread.
 * @returns an object containing a the data associated with the
 * generated chunk of random numbers.
 */
const generate = ({ index, chunkSize, min, max, format, engine }) => {  
  const generator = new Factory.Builder()
    .withEngine(engine)
    .withFormat(format)
    .withMin(min)
    .withMax(max)
    .create();

  return ({
    index,
    ...generator.generate(chunkSize)
  });
};

// Posting back the generated numbers
// to the parent process.
parentPort.postMessage(generate(workerData));
