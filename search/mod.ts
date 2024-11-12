import { getFiles, type RecordInformation } from "@paulmfischer/file-utils";

export function search(searchDirectory: string, searchText: string | null = null): RecordInformation | null {
  if (searchText == null) {
    console.log('Search text is required with the search command, supply with --searchText or -t');
    return null;
  }
  const file = getFiles(searchDirectory).find(file => file.name.includes(searchText as string));
  if (file) {
    console.log(file);
    return file;
  }

  return null;
}