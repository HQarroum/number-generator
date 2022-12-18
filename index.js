#!/usr/bin/env node

import fs from 'fs/promises';
import signale from 'signale';
import Chain from 'middleware-chain-js';
import { program } from 'commander';

/**
 * Middlewares.
 */
import validateOptions from './lib/middlewares/validate-options.js';
import checkFileExistence from './lib/middlewares/check-file-existence.js';
import generateNumbers from './lib/middlewares/generate-numbers.js';

/**
 * Package information.
 */
const info = JSON.parse(
  await fs.readFile(
    new URL('./package.json', import.meta.url)
  )
);

/**
 * Program options.
 */
program
  .name('number-generator')
  .version(info.version)
  .option('-a, --amount <amount>', 'The amount of numbers to generate')
  .option('-c, --chunk-size <size>', 'The size of the chunks to use when generating numbers (10000000 numbers by default)')
  .option('-m, --min-number <min-number>', 'The minimum possible random number to generate (0, by default)')
  .option('-x, --max-number <max-number>', 'The maximum possible random number to generate (1000, by default)')
  .option('-t, --thread-count <count>', 'The number of worker threads to use (set to the number of available CPUs by default)')
  .option('-o, --output <file>', 'A path to a file to write the numbers to')
  .option('-e, --engine <engine>', 'The generator engine to use (math-random or crypto-random)')
  .option('-y, --yes', 'Automatically answer positively to confirmation prompts')
  .option('-f, --format <format>', 'Specifies the generated dataset format (u8, u16, u32, u64, text)')
  .parse(process.argv);

// Creating the middleware chain.
const chain = new Chain();

/**
 * Loading the different stages of the program.
 */
chain.use([
  validateOptions,
  checkFileExistence,
  generateNumbers
]);

/**
 * Error handler.
 */
chain.use(function (err, input, output, next) {
  signale.error(err);
});

// Starting the chain.
chain.handle({}, {});
