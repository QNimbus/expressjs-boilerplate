/*
 * File: index.ts
 * Path: /src
 * Project: expressjs-boilerplate
 * Version: 0.0.2
 * Copyright (c) 2022 BeSquared
 * -----
 * Author: B. van Wetten at <bas@vanwetten.com>
 * Created: 17-12-2022 12:55
 *
 * Modified: 17-12-2022 14:19
 * Modified by: B. van Wetten at <bas@vanwetten.com>
 *
 * Description: Main application entry point
 * -----
 */

// Node imports
import path from "path";

// Local imports
import { appPath } from "./config";
import { version } from "../package.json";
import { ExpressServer } from "./express";

// Third party imports

console.log("Environment:", process.env.NODE_ENV);
console.log("Version:", version);
console.log("AppPath:", appPath);

const main = async () => {
  const server = await ExpressServer.getDefault(path.resolve(appPath, "./controllers"));

  server.start();
};

main().catch((err) => {
  console.error(err);
});
