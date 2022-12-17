// Node imports
import http from "http";
import https from "https";
import { AddressInfo } from "net";

// Local imports
import { Router } from "./Router";
import { HttpError } from "../errors";
import { CacheMiddleware } from "../middleware";
import { appConfig, AppProtocol, EnvironmentConfig } from "../../config";

// Third party imports
import express, { Express, RequestHandler, ErrorRequestHandler, NextFunction } from "express";

export interface RoutingOptions {
  notFoundCallback?: RequestHandler;
  errorHandlerCallback?: ErrorRequestHandler;
}

/**
 *
 *
 * @export
 * @class ExpressServer
 */
export class ExpressServer {
  private readonly _app: Express;
  private _server: http.Server | https.Server;

  private _router: Router;
  private _middleware: Array<RequestHandler>;

  private _protocol: string;
  private _port: number;
  private _host: string;
  private _isRunning: boolean;

  /*
   *  Property accessors
   */

  get app(): Express {
    return this._app;
  }

  get server(): http.Server | https.Server {
    return this._server;
  }

  get isRunning(): boolean {
    return this._isRunning;
  }

  get host(): string {
    return this._host;
  }

  get port(): number {
    return this._port;
  }

  get address(): string | AddressInfo | null {
    return this._server.address();
  }

  get url(): string {
    return `${this._protocol}://${this._host}:${this._port}/`;
  }

  /*
   *  Constructor
   */

  constructor(router: Router = Router.getEmptyRouter(), options: Partial<EnvironmentConfig["express"]> = {}) {
    this._router = router;
    this._middleware = [];
    this._host = (process.env.HOST && process.env.HOST) || options.host || appConfig.express.host;
    this._protocol = (process.env.PROTOCOL && process.env.PROTOCOL) || options.protocol || appConfig.express.protocol;
    this._port = (process.env.PORT && parseInt(process.env.PORT)) || options.port || appConfig.express.port;
    this._isRunning = false;

    // Initialize new ExpressJS app
    this._app = express();

    // Initialze http(s) server
    this._server = ExpressServer.createServer(appConfig.express.options, this._app);

    // Configure ExpressJS app (see: https://expressjs.com/en/4x/api.html#app.settings.table)
    this._app.set("env", process.env.NODE_ENV);
    this._app.set("x-powered-by", process.env.NODE_ENV !== "production");

    // Configure ExpressJS app custom values
    this._app.set("port", this._port);
    this._app.set("host", this._host);

    this._app.set("json spaces", 2);
  }

  /*
   *  Private methods
   */

  private static createServer(options: http.ServerOptions | https.ServerOptions = {}, requestListener?: http.RequestListener) {
    if (appConfig.express.protocol === AppProtocol.HTTPS) {
      return https.createServer(options, requestListener);
    } else {
      return http.createServer(options, requestListener);
    }
  }

  private listen() {
    this._server.listen(this._port, this._host, () => {
      this._isRunning = true;
      console.log(`🚀 Server is running on ${appConfig.express.protocol}://${this._app.get("host")}:${this._app.get("port")}`);
    });
  }

  /**
   * Default basic 404 handler
   *
   * @private
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {NextFunction} next
   * @return {*}  {void}
   * @memberof ExpressServer
   */
  private notFound(req: express.Request, res: express.Response, next: NextFunction): void {
    return next(new HttpError(404, "Resource not found"));
  }

  /**
   * Default basic error handler
   *
   * @private
   * @param {(Error | HttpError)} err
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {NextFunction} _next
   * @return {*}
   * @memberof ExpressServer
   */
  private errorHandler(err: Error | HttpError, req: express.Request, res: express.Response, _next: NextFunction) {
    // @ts-ignore Error does not have a status property
    return res.status(err.status || 500).send(err.message);
  }

  private initRouting({ notFoundCallback = this.notFound, errorHandlerCallback = this.errorHandler }: RoutingOptions = {}) {
    // Register Request loggers
    // Optional ...

    // Caching middleware
    this._app.use(CacheMiddleware);

    // Register global middleware
    if (this._middleware.length > 0) {
      this._app.use(this._middleware);
    }

    // Register route endpoints
    this._router.route(this._app);

    // Register error loggers
    // Optional ...

    // Register 404 and error handler
    this._app.use(notFoundCallback);
    this._app.use(errorHandlerCallback);
  }

  /*
   *  Public methods
   */

  /**
   *
   *
   * @static
   * @return {*}  {Promise<ExpressServer>}
   * @memberof ExpressServer
   */
  public static async getDefault(controllersPath?: string): Promise<ExpressServer> {
    if (controllersPath) {
      return new ExpressServer(await Router.getDefault(controllersPath));
    }
    return new ExpressServer();
  }

  /**
   * Starts ExpressJS server
   *
   * @memberof ExpressServer
   */
  public start() {
    if (this._isRunning) {
      throw new Error("Server is already running");
    }

    this.initRouting();
    this.listen();
  }
}
