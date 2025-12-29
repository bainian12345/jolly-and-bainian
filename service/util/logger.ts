import * as winston from 'winston';
const {combine, simple} = winston.format;

/**
 * Wrapper around winston logger.
 * Use logger.info() for general information.
 * Use logger.error() for error message not thrown and shown to users.
 * Log messages using the above two options will be forwarded to New Relic (NR) tagged with trace id.
 * logger.debug is just a thin wrapper around console.log and does not get forwarded to NR.
 */
export class Logger {
  private static instance: Logger;
  private winstonLogger: winston.Logger;

  private constructor() {
    this.winstonLogger = winston.createLogger({
      format: combine(simple()),
      transports: [new winston.transports.Console({level: 'info'})],
      exceptionHandlers: [new winston.transports.Console()],
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public warn(message: string, ...meta: unknown[]) {
    this.winstonLogger.warn(message, ...meta);
  }

  public info(message: string, ...meta: unknown[]) {
    this.winstonLogger.info(message, ...meta);
  }

  public error(message: string, ...meta: unknown[]) {
    this.winstonLogger.error(message, ...meta);
  }

  public debug(message: string, ...meta: unknown[]) {
    this.winstonLogger.debug('debug: ' + message, ...meta);
  }

  public child(metadata: object) {
    return this.winstonLogger.child(metadata);
  }
}

const logger = Logger.getInstance();

export {logger};
