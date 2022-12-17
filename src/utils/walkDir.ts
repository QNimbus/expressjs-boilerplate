/*
 * File: walkDir.ts
 * Path: /src/utils
 * Project: expressjs-boilerplate
 * Version: 0.0.2
 * Copyright (c) 2022 BeSquared
 * -----
 * Author: B. van Wetten at <bas@vanwetten.com>
 * Created: 17-12-2022 12:55
 *
 * Modified: 17-12-2022 14:24
 * Modified by: B. van Wetten at <bas@vanwetten.com>
 * -----
 */

// Node imports
import path from "path";
import fs from "fs/promises";

const walkDir = async (walkPath: string, recursive = true, regex = /^.*$/): Promise<Array<string>> => {
  const _files = [];
  for await (const file of walkDirIterator(walkPath, recursive, regex)) {
    _files.push(file);
  }
  return _files;
};

const walkDirIterator = async function* (walkPath: string, recursive = true, regex = /^.*$/): AsyncIterableIterator<string> {
  try {
    for await (const d of await fs.opendir(walkPath)) {
      const entry = path.join(walkPath, d.name);
      if (recursive && d.isDirectory()) yield* walkDirIterator(entry);
      else if (d.isFile() && regex.test(d.name)) {
        yield entry;
      }
    }
  } catch (err: unknown) {
    // TODO: Proper error handling and logging
    if (err instanceof Error) {
      return {
        message: `Error: (${err.message})`,
      };
    }
  }
};

export { walkDir, walkDirIterator };
