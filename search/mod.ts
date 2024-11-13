import { getFiles, type RecordInformation } from "@paulmfischer/file-utils";
import { type Result } from "@paulmfischer/common";

function search(searchDirectory: string, searchText: string | null = null): RecordInformation | null {
  const file = getFiles(searchDirectory).find(file => file.name.includes(searchText as string));
  if (file) {
    console.log(file);
    return file;
  }

  return null;
}

export function searchCommand(searchDirectory: string, searchText: string | null = null): Result {
  if (!searchText) {
    return {
      success: false,
      message: 'Search text is required with the search command, supply with --searchText or -t'
    };
  }

  search(searchDirectory, searchText);

  return {
    success: true,
  }
}