/*
 * File: Router.ts
 * Path: /src/express/server
 * Project: expressjs-boilerplate
 * Version: 0.0.2
 * Copyright (c) 2022 BeSquared
 * -----
 * Author: B. van Wetten at <bas@vanwetten.com>
 * Created: 17-12-2022 12:55
 * 
 * Modified: 17-12-2022 14:33
 * Modified by: B. van Wetten at <bas@vanwetten.com>
 * -----
 */

// Node imports

// Local imports
import { appConfig } from "../../config";
import { Controller, RouteType, getControllers } from "./Controller";

// Third party imports
import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 *
 *
 * @export
 * @class Router
 */
export class Router {
  private _controllers: Array<Controller>;

  /*
   *  Constructor
   */

  constructor(controllers: Router["_controllers"]) {
    this._controllers = controllers;
  }

  /*
   *  Public methods
   */

  public static getEmptyRouter() {
    return new Router([]);
  }

  public static async getDefault(controllersPath: string): Promise<Router> {
    const controllers = await getControllers(controllersPath);
    const router = new Router(controllers);

    return router;
  }

  public route(app: Express.Application): void {
    if (!appConfig.allowEmptyRouter && this._controllers.length <= 0) {
      throw RangeError("Router needs at least one controller");
    }

    this._controllers.forEach((controller) => {
      // @ts-ignore
      const controllerInstance: Controller = new controller();
      controllerInstance.getRoutes().forEach(({ method, methodName, middleware, path }: RouteType) => {
        function runAsyncWrapper(callback: (...args: Parameters<RequestHandler>) => Promise<void> | void): (...args: Parameters<RequestHandler>) => void {
          return function (req: Request, res: Response, next: NextFunction) {
            return Promise.resolve(callback(req, res, next))
              .then(() => {
                if (!res.headersSent) {
                  res.end();
                }
              })
              .catch(next);
          };
        }

        // @ts-ignore To allow string index signature of Express.Application (app.get, app.post, app.put, et cetera)
        app[method](path, middleware, runAsyncWrapper(controllerInstance[methodName]));
      });
    });
  }
}
