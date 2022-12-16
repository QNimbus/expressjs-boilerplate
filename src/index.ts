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
