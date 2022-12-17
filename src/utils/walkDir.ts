/**
 * @module utils
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
