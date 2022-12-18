import os from 'os';
import Joi from 'joi';
import signale from 'signale';
import { Factory } from '../generators/backends/factory.js';
import { program } from 'commander';

/**
 * The CPUs available.
 */
const cpus = Math.max(1, os.cpus().length);

/**
 * Options schema.
 */
const schema = Joi.object().keys({
  chunkSize: Joi.number().min(1).max(10000000).default(10000000).optional(),
  amount: Joi.number().min(1).required(),
  minNumber: Joi.number().min(0).default(0).optional(),
  maxNumber: Joi.number().min(1).default(255).optional(),
  threadCount: Joi.number().min(1).max(cpus).default(cpus).optional(),
  output: Joi.string().optional(),
  engine: Joi.string().valid('math-random', 'crypto-random').default('math-random').optional(),
  format: Joi.string().valid('u8', 'u16', 'u32', 'u64', 'text').default('text').optional(),
  yes: Joi.boolean().default(false).optional()
});

/**
 * Validates the program options.
 * @middleware
 */
export default (input, _, next) => {
  const result = schema.validate(program.opts());
  const opts   = result.value;

  // If an error occurs, we display the error and exit.
  if (result.error) {
    signale.error(result.error);
    return (program.outputHelp());
  }

  // Creating the generator associated with the given
  // command-line options.
  input.generator = new Factory.Builder()
    .withEngine(opts.engine)
    .withFormat(opts.format)
    .withMin(opts.minNumber)
    .withMax(opts.maxNumber)
    .create();

  // Verifying whether the generator supports the given minimum value.
  if (opts.minNumber < input.generator.min()) {
    throw new Error(`
      The given 'engine' and 'format' options are incompatible with a minimum value of '${opts.minNumber}'
      and is limited to a minimum value of '${input.generator.min()}'.
    `);
  }

  // Verifying whether the generator supports the given maximum value.
  if (opts.maxNumber > input.generator.max()) {
    throw new Error(`
      The given 'engine' and 'format' options are incompatible with a maximum value of '${opts.maxNumber}'
      and is limited to a maximum value of '${input.generator.max()}'.
    `);
  }

  next(input.opts = opts);
};
