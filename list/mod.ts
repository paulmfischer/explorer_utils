import { getFiles, type RecordInformation } from "@paulmfischer/file-utils";

export function list(searchDirectory: string, listFilter: string | null = null): RecordInformation[] {
  let files = getFiles(searchDirectory);
  if (listFilter == 'files') {
    files = files.filter(file => file.type == 'File');
  } else if (listFilter == 'directories') {
    files = files.filter(file => file.type == 'Directory');
  }

  console.log(files);
  return files;
}