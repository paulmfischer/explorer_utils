import { getFiles } from "@paulmfischer/file-utils";
import { sessionData, type Result, type RecordInformation, printResults } from "@paulmfischer/common";

function search(): RecordInformation[] {
  return getFiles(sessionData.args.searchDirectory, sessionData.args.recursive).filter(file => file.name.includes(sessionData.args.searchText as string));
}

export function searchCommand(): Result {
  const searchText = sessionData.args.searchText;

  if (!searchText) {
    return {
      success: false,
      message: 'Search text is required with the search command, supply with --searchText or -t'
    };
  }

  try {
    const files = search();
    printResults(files);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to search directory: ${error}`
    };
  }
}