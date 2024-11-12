import { getFiles, RecordInformation } from "@paulmfischer/file-utils";

export function list(searchDirectory: string, listFilter: string | null = null): RecordInformation[] {
  let files = getFiles(searchDirectory);
  if (listFilter == 'files') {
    console.log('filter by files');
    files = files.filter(file => file.type == 'File');
  } else if (listFilter == 'directories') {
    console.log('filter by directories');
    files = files.filter(file => file.type == 'Directory');
  }

  return files;
}