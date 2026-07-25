import winston from 'winston';

const { combine, timestamp, errors, printf, json, colorize } = winston.format;

const prettyFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return JSON.stringify(
    {
      timestamp,
      level,
      message: stack || message,
      ...meta,
    },
    null,
    2
  );
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), errors({ stack: true })),
  transports: [],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), prettyFormat),
    })
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}
