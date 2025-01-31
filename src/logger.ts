import Environment from "./environment.ts";
import {
  type ILogObj as LogObject,
  Logger as TSLogLogger,
} from "tslog";

export default class Logger {
  private logger: TSLogLogger<LogObject>;

  public constructor() {
    let minLevel: number;

    switch (Environment.getMinLogLevel()) {
      case "silly":
        minLevel = 0;
        break;
      case "trace":
        minLevel = 1;
        break;
      case "debug":
        minLevel = 2;
        break;
      case "info":
        minLevel = 3;
        break;
      case "warn":
        minLevel = 4;
        break;
      case "error":
        minLevel = 5;
        break;
      case "fatal":
        minLevel = 6;
        break;
      default:
        minLevel = 5;
    }

    this.logger = new TSLogLogger({ minLevel });
    // overload is required to get the real position for logging
    this.silly = this.logger.silly.bind(this.logger);
    this.trace = this.logger.trace.bind(this.logger);
    this.debug = this.logger.debug.bind(this.logger);
    this.info = this.logger.info.bind(this.logger);
    this.warn = this.logger.warn.bind(this.logger);
    this.error = this.logger.error.bind(this.logger);
    this.fatal = this.logger.fatal.bind(this.logger);
  }

  /**
   * Logs a silly message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public silly(...args: unknown[]): LogObject | undefined {
    /* istanbul ignore next */
    return this.logger.silly(...args);
  }

  /**
   * Logs a trace message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public trace(...args: unknown[]): LogObject | undefined {
    /* istanbul ignore next */
    return this.logger.trace(...args);
  }

  /**
   * Logs a debug message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public debug(...args: unknown[]): LogObject | undefined {
    return this.logger.debug(...args);
  }

  /**
   * Logs a info message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public info(...args: unknown[]): LogObject | undefined {
    /* istanbul ignore next */
    return this.logger.info(...args);
  }

  /**
   * Logs a warn message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public warn(...args: unknown[]): LogObject | undefined {
    /* istanbul ignore next */
    return this.logger.warn(...args);
  }

  /**
   * Logs a error message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public error(...args: unknown[]): LogObject | undefined {
    /* istanbul ignore next */
    return this.logger.error(...args);
  }

  /**
   * Logs a fatal message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public fatal(...args: unknown[]): LogObject | undefined {
    /* istanbul ignore next */
    return this.logger.fatal(...args);
  }
}
