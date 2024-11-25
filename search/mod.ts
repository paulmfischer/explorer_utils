import { getFiles, searchFileForText } from "@paulmfischer/file-utils";
import { sessionData, type Result, type RecordInformation, type FileSearchInformation, RecordType, getPadding } from "@paulmfischer/common";
import { join } from '@std/path/join';
import chalk from '@nothing628/chalk';

interface FileTextSearchResult {
  fileName: string;
  textSearchResults: FileSearchInformation[];
}
interface SearchResults {
  fileTextSearchResults: FileTextSearchResult[];
  fileResults: RecordInformation[];
}

async function search(): Promise<SearchResults> {
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
  for (const file of files.filter(file => !file.isDirectory)) {
    const fileName = join(`${file.path}/${file.name}`);
    const fileSearchResults = await searchFileForText(fileName, sessionData.args.searchText);
    if (fileSearchResults.length > 0) {
      searchResults.fileTextSearchResults.push({
        fileName,
        textSearchResults: fileSearchResults,
      });
    }
  }
  if (sessionData.args.debug) {
    console.log('text search results', searchResults);
  }
  searchResults.fileResults = files.filter(file => file.name.includes(sessionData.args.searchText));
  if (sessionData.args.debug) {
    console.log('filtered search results', searchResults.fileResults);
  }
  return searchResults;
}

export function printSearchResults(searchResults: SearchResults) {
  const maxNameLength = searchResults.fileResults.reduce((maxLength, file) => {
    if (file.name.length > maxLength) {
      maxLength = file.name.length;
    }
    return maxLength;
  }, 0);
  const maxTypeLength = searchResults.fileResults.some(file => file.isDirectory) ? RecordType.Directory.length : RecordType.File.length;

  for (const file of searchResults.fileResults) {
    const namePadding = getPadding(maxNameLength - file.name.length);
    const typePadding = getPadding(maxTypeLength - file.type.length);

    console.log(chalk.green(file.name) + namePadding + chalk.grey(`-- ${file.type}${typePadding}-- `) + chalk.blue(file.path));
  }

  const searchRegex = new RegExp(`(${sessionData.args.searchText})`, 'g');
  for (const fileText of searchResults.fileTextSearchResults) {
    console.log(`${chalk.blue(fileText.fileName)}:`);
    for (const lineFound of fileText.textSearchResults) {
      const lineDisplayText = chalk.green(lineFound.line.replace(searchRegex, `${chalk.bold.yellow('$1')}`));
      console.log(`    ${chalk.grey(lineFound.lineNumber)}: ${lineDisplayText}`);
    }
  }
}

export async function searchCommand(): Promise<Result> {
  const searchText = sessionData.args.searchText;

  if (!searchText || searchText.trim() == '') {
    return {
      success: false,
      message: 'Search text is required with the search command, supply with --searchText or --st'
    };
  }

  try {
    const results = await search();
    printSearchResults(results);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to search directory: ${error}`
    };
  }
}