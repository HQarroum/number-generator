import fs from 'fs/promises';
import path from 'path';
import prompt from 'prompts';
import signale from 'signale';

/**
 * Verify whether the output file is empty.
 * @middleware
 */
export default async (input, _, next) => {
  if (!input.opts.output || input.opts.yes) {
    // No output file specified, or the user wants to
    // automatically answer yes.
    return (next());
  }

  try {
    const outputFile = await fs.lstat(path.resolve(input.opts.output));
    
    if (outputFile.size > 0) {
      const response = await prompt({
        type: 'confirm',
        name: 'confirm',
        message: `File ${input.opts.output} is not empty. Do you want to overwrite the file?`
      });
      if (response.confirm !== true) {
        signale.error('Aborting');
        process.exit();
      }
    }
    // Truncating file content if the user wants to proceed.
    await fs.truncate(input.opts.output, 0);
    next();
  } catch (e) {
    next();
  }
};
