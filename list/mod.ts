import { getFiles, type RecordInformation } from "@paulmfischer/file-utils";
import { type Args, type Result } from "@paulmfischer/common";

function list(args: Args): RecordInformation[] {
  console.log('getting files for list', args);
  let files = getFiles(args.searchDirectory, args.recursive);
  if (args.listFilter == 'files') {
    files = files.filter(file => file.type == 'File');
  } else if (args.listFilter == 'directories') {
    files = files.filter(file => file.type == 'Directory');
  }

  return files;
}

export function listCommand(args: Args): Result {
  try {
    const files = list(args);
    console.log(files);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to list directory: ${error}`
    };
  }
}