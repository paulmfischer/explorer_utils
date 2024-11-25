import { getFiles } from "@paulmfischer/file-utils";
import { sessionData, type Result, type RecordInformation, printResults } from "@paulmfischer/common";

async function list(): Promise<RecordInformation[]> {
  let files = await getFiles(sessionData.args.searchDirectory, sessionData.args.recursive);
  if (sessionData.args.listFiles) {
    files = files.filter(file => !file.isDirectory);
  } else if (sessionData.args.listDirectories) {
    files = files.filter(file => file.isDirectory);
  }

  return files;
}

export async function listCommand(): Promise<Result> {
  try {
    const files = await list();
    printResults(files);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to list directory: ${error}`
    };
  }
}