import picocolors from 'picocolors';

export const prefixes = {
  wait: picocolors.white(picocolors.bold('○')),
  error: picocolors.red(picocolors.bold('⨯')),
  warn: picocolors.yellow(picocolors.bold('⚠')),
  info: picocolors.white(picocolors.bold(' ')),
  event: picocolors.green(picocolors.bold('✓')),
  trace: picocolors.magenta(picocolors.bold('»')),
} as const;

const LOGGING_METHOD = {
  log: 'log',
  warn: 'warn',
  error: 'error',
} as const;

export const prefixedLog = (prefixType: keyof typeof prefixes, ...message: unknown[]) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if ((message[0] === '' || message[0] === undefined) && message.length === 1) {
    message.shift();
  }

  const consoleMethod: keyof typeof LOGGING_METHOD =
    prefixType in LOGGING_METHOD
      ? LOGGING_METHOD[prefixType as keyof typeof LOGGING_METHOD]
      : 'log';

  const prefix = prefixes[prefixType];
  // If there's no message, don't print the prefix but a new line
  if (message.length === 0) {
    console[consoleMethod]('');
  } else {
    console[consoleMethod](prefix, ...message);
  }
};
