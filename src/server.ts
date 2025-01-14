import Logger from "./logger.ts";
const log: Logger = new Logger();

export interface IBasicAuth {
  "username": string;
  "password": string;
}

/**
 * The options of a server constructor
 */
export interface IServerOptions {
  /**
   * the url of the nextcloud server like https://nextcloud.mydomain.com
   */
  "url": string;
  /**
   * basic authentication informatin to access the nextcloud server
   */
  "basicAuth": IBasicAuth;
}

// tslint:disable-next-line: max-classes-per-file
export default class Server {
  public url: string;
  public basicAuth: IBasicAuth;
  public constructor(options: IServerOptions) {
    log.debug("constructor");
    this.url = options.url;
    this.basicAuth = options.basicAuth;
  }
}
