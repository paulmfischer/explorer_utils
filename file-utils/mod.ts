export interface RecordInformation {
  name: string;
  type: 'File' | 'Directory';
}

export function getFiles(searchDirectory: string, recursively: boolean = false): RecordInformation[] {
  const files: RecordInformation[] = [];
  for (const dirEntry of Deno.readDirSync(searchDirectory)) {
    if (!dirEntry.name.startsWith('.')) {
      files.push({
        name: dirEntry.name,
        type: dirEntry.isDirectory ? 'Directory' : 'File'
      });
    }
    
    if (recursively && dirEntry.isDirectory && !dirEntry.name.startsWith('.')) {
      for (const subDirEntry of getFiles(`${searchDirectory}/${dirEntry.name}`, recursively)) {
        files.push({
          name: subDirEntry.name,
          type: dirEntry.isDirectory ? 'Directory' : 'File'
        });
      }
    }
  }
  return files;
}