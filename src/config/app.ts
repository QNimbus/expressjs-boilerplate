// Node imports
import path from "path";
import http from "http";
import https from "https";

// Third party imports

const environments = ["development"] as const;
const isValidEnvironment = (env: string): env is AppEnvironment => environments.includes(env as AppEnvironment);

export type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object ? Subset<K[attr]> : K[attr];
};

export type AppEnvironment = typeof environments[number];

export const appPath = path.resolve(__dirname, "..");

export type AppConfig = {
  [T in AppEnvironment]: Subset<EnvironmentConfig>;
} & { default: EnvironmentConfig };

export enum AppProtocol {
  HTTP = "http",
  HTTPS = "https",
}

export interface ExpressConfig {
  protocol: AppProtocol;
  options: http.ServerOptions | https.ServerOptions;
  port: number;
  host: string;
  cacheAge: number;
  authToken?: string;
}

export interface EnvironmentConfig {
  express: ExpressConfig;
}

const config: AppConfig = {
  default: {
    express: {
      protocol: AppProtocol.HTTP,
      options: {},
      port: 3000,
      host: "127.0.0.1",
      cacheAge: 0,
    },
  },
  development: {
    express: {
      options: {
        // Self-signed certificate for localhost (remember to run src/certs/gen.sh script)
        // key: fs.readFileSync(path.resolve(__dirname, '../certs', 'server-key.pem')),
        // cert: fs.readFileSync(path.resolve(__dirname, '../certs', 'server-cert.pem')),
      },
    },
  },
};

export const { ...appConfig } =
  process.env.NODE_ENV && isValidEnvironment(process.env.NODE_ENV) ? Object.assign({}, config.default, config[process.env.NODE_ENV]) : config.default;
