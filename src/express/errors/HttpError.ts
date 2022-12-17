/*
 * File: HttpError.ts
 * Path: /src/express/errors
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

export class HttpError extends Error {
  constructor(public status: string | number, name: string) {
    super(name);
  }
}
