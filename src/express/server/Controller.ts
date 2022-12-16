/* eslint-disable @typescript-eslint/no-explicit-any */

// Node imports

// Local imports
import { walkDir } from "../../utils";

// Third party imports
import { RequestHandler, Request, Response } from "express";

export type RouteType = {
  path: string;
  middleware: Array<(arg0: Request, arg1: Response) => void>;
  method: string;
  methodName: string;
};

// Filter method to find all *.js / *.ts files
const controllerFilesFilter = (fileName: string): boolean => /^[^.]+?\.(js|ts)$/.test(fileName);

const importModules = async (controllerFiles: Array<string>): Promise<any> => {
  return Promise.all(controllerFiles.map((controllerFile) => import(controllerFile)));
};

/**
 *
 *
 * @param {string} controllersPath
 * @return {*}  {Promise<Array<Controller>>}
 */
export const getControllers = async (controllersPath: string): Promise<Array<Controller>> => {
  const controllerFiles = (await walkDir(controllersPath)).filter(controllerFilesFilter);

  const importedModules = await importModules(controllerFiles);
  const controllers = importedModules
    .filter((module: any) => module.default.prototype instanceof Controller)
    .map((module: any) => module.default) as Array<Controller>;

  return controllers;
};

export type ControllerType<K extends PropertyKey> = {
  [P in Exclude<K, "getRoutes" | "new">]: (methodName: string) => RequestHandler;
} & {
  getRoutes: () => Array<RouteType>;
};

export abstract class Controller implements ControllerType<keyof Controller> {
  // @ts-ignore (will be initialized by Controller decorator)
  protected $routes: Array<RouteType>;

  public getRoutes(): Array<RouteType> {
    if (!this.$routes) {
      throw new RangeError("No routes defined. Did you use routing decorators? (e.g. @Get, @Post, et cetera)");
    }
    return this.$routes;
  }
}
