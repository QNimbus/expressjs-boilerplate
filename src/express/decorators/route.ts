/*
 * File: route.ts
 * Path: /src/express/decorators
 * Project: expressjs-boilerplate
 * Version: 0.0.2
 * Copyright (c) 2022 BeSquared
 * -----
 * Author: B. van Wetten at <bas@vanwetten.com>
 * Created: 17-12-2022 12:55
 *
 * Modified: 17-12-2022 14:32
 * Modified by: B. van Wetten at <bas@vanwetten.com>
 *
 * Descripttion: Manages the configuration settings for the widget
 * -----
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// Node imports

// Local imports

// Third party imports
import express, { NextFunction, RequestHandler } from "express";

type RouteDecorator = (path: string, ...middleware: Array<RequestHandler>) => ReturnType<typeof route>;

type HandlerFn<T> = (req: express.Request, res: express.Response, next?: NextFunction) => T;

type RouteMethodPropertyDescriptor = TypedPropertyDescriptor<HandlerFn<void>> | TypedPropertyDescriptor<HandlerFn<Promise<void>>>;

type RouteMethodType = {
  (target: any, propertyKey: string | symbol, descriptor: RouteMethodPropertyDescriptor): void;
};

const routePrefix = "$$route_"; // Controller property prefix to identify decorated route handler object

/**
 * Regex matcher for valid route paths
 *
 * @param {string} path Route path to test for validity
 * @return {*}  {boolean}
 */
const isValidPath = (path: string): boolean => /^(?:\/(?<=\/)[a-zA-Z:0-9_-]*)+$/.test(path);

/**
 * General route decorator method. Used by HTTP method verb methods (e.g. 'get', 'post')
 *
 * @param {string} method HTTP method verb string
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {RouteMethodType}
 */
const route = (method: string, path: string, ...middleware: Array<RequestHandler>): RouteMethodType => {
  return function (target: any, propertyKey: string | symbol, _descriptor: RouteMethodPropertyDescriptor) {
    if (!isValidPath(path)) {
      throw new Error(
        `Invalid route path in @${method.charAt(0).toUpperCase() + method.slice(1)} decorator for class method '${target.constructor.name}.${String(
          propertyKey
        )}': ${path}`
      );
    }
    const routeProperty = `${routePrefix}${String(propertyKey)}`;
    const { middleware: actionMiddleware = [] } = target[routeProperty] || {};

    middleware.push(actionMiddleware);

    target[routeProperty] = { method, methodName: String(propertyKey), path, middleware };
  };
};

/**
 * Decorates an ExpressJS RequestHandler method with one or more middleware functions
 *
 * @param {...Array<RequestHandler>} middleware One or more middleware functions
 * @return {*}  {RouteMethodType}
 */
const Use = (...middleware: Array<RequestHandler>): RouteMethodType => {
  return function (target: any, propertyKey: string | symbol, _descriptor: RouteMethodPropertyDescriptor) {
    const routeProperty = `${routePrefix}${String(propertyKey)}`;
    const { middleware: actionMiddleware = [] } = target[routeProperty] || {};

    middleware.push(actionMiddleware);

    target[routeProperty] = { ...target[routeProperty], middleware };
  };
};

/**
 * Route decorator method for the HTTP 'HEAD' verb
 *
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {route}
 */
export let Head: RouteDecorator;
/**
 * Route decorator method for the HTTP 'OPTIONS' verb
 *
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {route}
 */
export let Options: RouteDecorator;
/**
 * Route decorator method for the HTTP 'GET' verb
 *
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {route}
 */
export let Get: RouteDecorator;
/**
 * Route decorator method for the HTTP 'POST' verb
 *
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {route}
 */
export let Post: RouteDecorator;
/**
 * Route decorator method for the HTTP 'PUT' verb
 *
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {route}
 */
export let Put: RouteDecorator;
/**
 * Route decorator method for the HTTP 'PATCH' verb
 *
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {route}
 */
export let Patch: RouteDecorator;
/**
 * Route decorator method for the HTTP 'DELETE' verb
 *
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {route}
 */
export let Delete: RouteDecorator;
/**
 * Route decorator method that matches all the HTTP methods
 *
 * @param {string} path Route path
 * @param {...Array<RequestHandler>} middleware Optional middleware functions
 * @return {*}  {route}
 */
export let All: RouteDecorator;

export { RouteDecorator, isValidPath, Use, routePrefix };

// Export all HTTP method verb decorators and bind them to the general 'route' method
// @[method](path:optional, ...middleware: optional)
const methods = ["head", "options", "get", "post", "put", "patch", "delete", "all"];
methods.forEach((method) => {
  const decoratorName = method.charAt(0).toUpperCase() + method.slice(1);
  exports[decoratorName] = route.bind(null, method);
});
