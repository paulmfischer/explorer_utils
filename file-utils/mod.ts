import { type RecordInformation, RecordType } from "@paulmfischer/common";

export function getFiles(searchDirectory: string, recursively: boolean = false): RecordInformation[] {
  const files: RecordInformation[] = [];
  for (const dirEntry of Deno.readDirSync(searchDirectory)) {
    if (!dirEntry.name.startsWith('.')) {
      files.push({
        name: dirEntry.isDirectory ? `${dirEntry.name}/` : dirEntry.name,
        path: searchDirectory,
        type: dirEntry.isDirectory ? RecordType.Directory : RecordType.File
      });
    }
    
    if (recursively && dirEntry.isDirectory && !dirEntry.name.startsWith('.')) {
      for (const subDirEntry of getFiles(`${searchDirectory}/${dirEntry.name}`, recursively)) {
        files.push({
          name: subDirEntry.name,
          path: `${searchDirectory}/${dirEntry.name}`,
          type: dirEntry.isDirectory ? RecordType.Directory : RecordType.File
        });
      }
    }
  }
  return files;
}
