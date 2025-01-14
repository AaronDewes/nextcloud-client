import fs from "node:fs/promises";
import path from "node:path";

export interface IFileNameFormats {
  absolute: string;
  relative: string;
}

export default class FileSystemFolder {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  public getName(): IFileNameFormats {
    return { relative: this.name, absolute: path.resolve(this.name) };
  }

  public async getFileNames(): Promise<IFileNameFormats[]> {
    const fileNames: IFileNameFormats[] = [];

    for (
      const absoluteFileName of await this.getFileNamesRecursively(this.name)
    ) {
      fileNames.push({
        absolute: absoluteFileName,
        relative: absoluteFileName.replace(
          path.resolve(this.getName().absolute),
          "",
        ).replace(/\\/g, "/"),
      });
    }
    return fileNames;
  }

  private async getFileNamesRecursively(name: string): Promise<string[]> {
    const subdirs: string[] = await fs.readdir(name);
    const files = await Promise.all(subdirs.map(async (subdir: string) => {
      const res: string = path.resolve(name, subdir);
      return (await fs.stat(res)).isDirectory()
        ? this.getFileNamesRecursively(res)
        : res;
    }));
    return files.reduce((a: any, f: any) => a.concat(f), []);
  }
}
