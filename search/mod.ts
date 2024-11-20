import { getFiles, searchFileForText } from "@paulmfischer/file-utils";
import { sessionData, type Result, type RecordInformation, printResults, type FileSearchInformation, RecordType } from "@paulmfischer/common";
import { join } from '@std/path/join';

interface FileTextSearchResult {
  fileName: string;
  textSearchResults: FileSearchInformation[];
}
interface SearchResults {
  fileTextSearchResults: FileTextSearchResult[];
  fileResults: RecordInformation[];
}

async function search(): Promise<RecordInformation[]> {
  const searchResults: SearchResults = {
    fileTextSearchResults: [],
    fileResults: [],
  };
  if (sessionData.args.debug) {
    console.log('start search', sessionData.args.searchDirectory, sessionData.args.searchText);
  }
  let files = await getFiles(sessionData.args.searchDirectory, sessionData.args.recursive);
  if (sessionData.args.debug) {
    console.log('end search', sessionData.args.searchDirectory, files);
  }
  for (const file of files.filter(file => file.type == RecordType.File)) {
    const fileName = join(`${file.path}/${file.name}`);
    const fileSearchResults = await searchFileForText(fileName, sessionData.args.searchText);
    if (fileSearchResults.length > 0) {
      searchResults.fileTextSearchResults.push({
        fileName,
        textSearchResults: fileSearchResults,
      });
    }
  }
  console.log('text search results', searchResults);
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
      message: 'Search text is required with the search command, supply with --searchText or --st'
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