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
