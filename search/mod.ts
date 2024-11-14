import { getFiles, type RecordInformation } from "@paulmfischer/file-utils";
import { type Args, type Result } from "@paulmfischer/common";

function search(args: Args): RecordInformation[] {
  const files = getFiles(args.searchDirectory, args.recursive).filter(file => file.name.includes(args.searchText as string));
  return files;
}

export function searchCommand(args: Args): Result {
  const searchText = args.searchText;

  if (!searchText) {
    return {
      success: false,
      message: 'Search text is required with the search command, supply with --searchText or -t'
    };
  }

  try {
    const file = search(args);
    if (file) {
      console.log(file);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to search directory: ${error}`
    };
  }
}