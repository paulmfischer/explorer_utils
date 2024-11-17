import { getFiles } from "@paulmfischer/file-utils";
import { sessionData, type Result, type RecordInformation, printResults } from "@paulmfischer/common";

async function search(): Promise<RecordInformation[]> {
  if (sessionData.args.debug) {
    console.log('start search', sessionData.args.searchDirectory, sessionData.args.searchText);
  }
  let files = await getFiles(sessionData.args.searchDirectory, sessionData.args.recursive);
  if (sessionData.args.debug) {
    console.log('end search', sessionData.args.searchDirectory, files);
  }
  files = files.filter(file => file.name.includes(sessionData.args.searchText));
  if (sessionData.args.debug) {
    console.log('filtered search results', files);
  }
  return files;
}

export async function searchCommand(): Promise<Result> {
  const searchText = sessionData.args.searchText;

  if (!searchText) {
    return {
      success: false,
      message: 'Search text is required with the search command, supply with --searchText or -t'
    };
  }


  try {
    const files = await search();
    printResults(files);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to search directory: ${error}`
    };
  }
}