// tslint:disable-next-line:no-var-requires

import ClientError from "./error.ts";
import Logger from "./logger.ts";
const log: Logger = new Logger();

export interface IRequestContext {
  "description"?: string;
}

export interface IHttpClientOptions {
  "authorizationHeader"?: string;
  "origin"?: string;
}
export class HttpClient {
  private authorizationHeader?: string;
  private origin: string;

  public constructor(options: IHttpClientOptions) {
    log.debug("constructor");
    this.authorizationHeader = options.authorizationHeader;
    this.origin = options.origin || "";
  }
  public async getHttpResponse(
    url: string,
    requestInit: RequestInit,
    expectedHttpStatusCode: number[],
    context: IRequestContext,
  ): Promise<Response> {
    if (!requestInit.headers) {
      requestInit.headers = new Headers();
    }

    if (!requestInit.method) {
      requestInit.method = "UNDEFINED";
    }

    if (!context.description) {
      context.description = "";
    }

    if (this.authorizationHeader) {
      (requestInit.headers as Headers).append(
        "Authorization",
        this.authorizationHeader,
      );
    }
    (requestInit.headers as Headers).append(
      "User-Agent",
      "nextcloud-node-client",
    );

    log.debug("getHttpResponse request header:", requestInit.headers);
    log.debug("getHttpResponse url", url, requestInit);

    const response: Response = await fetch(url, requestInit);

    if (expectedHttpStatusCode.indexOf(response.status) === -1) {
      log.debug(
        "getHttpResponse unexpected status response " + response.status + " " +
          response.statusText,
      );
      log.debug("getHttpResponse description " + context.description);
      log.debug("getHttpResponse expected " + expectedHttpStatusCode.join(","));
      log.debug(
        "getHttpResponse headers ",
        JSON.stringify(response.headers, null, 4),
      );
      log.debug("getHttpResponse request body ", requestInit.body);
      log.debug("getHttpResponse text:", await response.text());
      throw new ClientError(
        `HTTP response status ${response.status} not expected. Expected status: ${
          expectedHttpStatusCode.join(",")
        } - status text: ${response.statusText}`,
        "ERR_UNEXPECTED_HTTP_STATUS",
        {
          expectedHttpStatusCodes: expectedHttpStatusCode,
          responseStatus: response.status,
          responseStatusText: response.statusText,
        },
      );
    }
    return response;
  }
}
