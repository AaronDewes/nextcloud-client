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
  }

  /**
   * Logs a silly message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public silly(...args: unknown[]) {
    /* istanbul ignore next */
    console.log(...args);
  }

  /**
   * Logs a trace message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public trace(...args: unknown[]) {
    /* istanbul ignore next */
    console.log(...args);
  }

  /**
   * Logs a debug message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public debug(...args: unknown[]) {
    console.log(...args);
  }

  /**
   * Logs a info message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public info(...args: unknown[]) {
    /* istanbul ignore next */
    console.log(...args);
  }

  /**
   * Logs a warn message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public warn(...args: unknown[]) {
    /* istanbul ignore next */
    console.log(...args);
  }

  /**
   * Logs a error message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public error(...args: unknown[]) {
    /* istanbul ignore next */
    console.log(...args);
  }

  /**
   * Logs a fatal message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  public fatal(...args: unknown[]) {
    /* istanbul ignore next */
    console.log(...args);
  }
}
