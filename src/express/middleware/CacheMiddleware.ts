/*
 * File: CacheMiddleware.ts
 * Path: /src/express/middleware
 * Project: expressjs-boilerplate
 * Version: 0.0.2
 * Copyright (c) 2022 BeSquared
 * -----
 * Author: B. van Wetten at <bas@vanwetten.com>
 * Created: 17-12-2022 12:55
 * 
 * Modified: 17-12-2022 14:32
 * Modified by: B. van Wetten at <bas@vanwetten.com>
 * -----
 */

// Node imports

// Local imports
import { appConfig } from "../../config";

// Third party imports
import express, { NextFunction } from "express";

const CacheMiddleware = (req: express.Request, res: express.Response, next: NextFunction) => {
  if (req.method === "GET") {
    res.set("Cache-control", `public, max-age=${appConfig.express.cacheAge}`);
  } else {
    res.set("Cache-control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
  }

  return next();
};

export { CacheMiddleware };
