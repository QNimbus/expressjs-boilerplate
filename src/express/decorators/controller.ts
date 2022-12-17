/*
 * File: controller.ts
 * Path: /src/express/decorators
 * Project: expressjs-boilerplate
 * Version: 0.0.2
 * Copyright (c) 2022 BeSquared
 * -----
 * Author: B. van Wetten at <bas@vanwetten.com>
 * Created: 17-12-2022 12:55
 * 
 * Modified: 17-12-2022 14:31
 * Modified by: B. van Wetten at <bas@vanwetten.com>
 * -----
 */

/* eslint-disable @typescript-eslint/ban-types */

// Node imports

// Local imports
import { isValidPath, routePrefix } from "./route";

// Third party imports
import { RequestHandler } from "express";

/**
 * RouteController class decorator
 *
 * @param controllerPath        Root path of the route controller
 * @param controllerMiddleware  Optional middleware functions
 * @returns ClassDecorator
 */
const RouteController = (controllerPath = "", controllerMiddleware: Array<RequestHandler> = []): ClassDecorator => {
  return function <TFunction extends Function>(target: TFunction): TFunction | void {
    const proto = target.prototype;
    controllerPath = controllerPath.replace("/", "").length === 0 ? "" : controllerPath;

    proto.$routes = Object.getOwnPropertyNames(proto)
      .filter((prop) => prop.indexOf(routePrefix) === 0 && proto[prop]["path"] && proto[prop]["method"])
      .map((prop) => {
        const { method, methodName, path: routePath, middleware } = proto[prop];
        const path = controllerPath + routePath;

        if (!isValidPath(path)) {
          throw new Error(`Invalid route path for '${methodName}': ${path}`);
        }

        return { method, methodName, path, middleware: middleware.concat(controllerMiddleware) };
      });
  };
};

export { RouteController as Route };
