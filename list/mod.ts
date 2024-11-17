import { getFiles } from "@paulmfischer/file-utils";
import { sessionData, type Result, type RecordInformation, printResults, RecordType } from "@paulmfischer/common";

function list(): RecordInformation[] {
  let files = getFiles(sessionData.args.searchDirectory, sessionData.args.recursive);
  if (sessionData.args.listFiles) {
    files = files.filter(file => file.type == RecordType.File);
  } else if (sessionData.args.listDirectories) {
    files = files.filter(file => file.type == RecordType.Directory);
  }

  return files;
}

export function listCommand(): Result {
  try {
    const files = list();
    printResults(files);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to list directory: ${error}`
    };
  }
}