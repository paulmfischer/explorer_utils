export interface RecordInformation {
  name: string;
  type: 'File' | 'Directory';
}

export function getFiles(searchDirectory: string): RecordInformation[] {
  const files: RecordInformation[] = [];
  for (const dirEntry of Deno.readDirSync(searchDirectory)) {
    files.push({
      name: dirEntry.name,
      type: dirEntry.isDirectory ? 'Directory' : 'File'
    });
  }
  return files;
}