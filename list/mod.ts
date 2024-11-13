import { getFiles } from "@paulmfischer/file-utils";
import { type Result } from "@paulmfischer/common";

function list(searchDirectory: string, listFilter: string | null = null) {
  let files = getFiles(searchDirectory);
  if (listFilter == 'files') {
    files = files.filter(file => file.type == 'File');
  } else if (listFilter == 'directories') {
    files = files.filter(file => file.type == 'Directory');
  }

  console.log(files);
}

export function listCommand(searchDirectory: string, listFilter: string | null = null): Result {
  try {
    list(searchDirectory, listFilter);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to list directory: ${error}`
    };
  }
}