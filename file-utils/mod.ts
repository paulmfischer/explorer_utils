import { sessionData, type RecordInformation, RecordType, type FileSearchInformation } from "@paulmfischer/common";

export async function getFiles(searchDirectory: string, recursively: boolean = false): Promise<RecordInformation[]> {
  const files: RecordInformation[] = [];
  for await (const dirEntry of Deno.readDir(searchDirectory)) {
    if (!dirEntry.name.startsWith('.')) {
      files.push({
        name: dirEntry.isDirectory ? `${dirEntry.name}/` : dirEntry.name,
        path: searchDirectory,
        type: dirEntry.isDirectory ? RecordType.Directory : RecordType.File
      });
    }
    
    if (recursively && dirEntry.isDirectory && !dirEntry.name.startsWith('.')) {
      for (const subDirEntry of await getFiles(`${searchDirectory}/${dirEntry.name}`, recursively)) {
        files.push({
          name: subDirEntry.type == RecordType.Directory ? `${subDirEntry.name}/` : subDirEntry.name,
          path: `${searchDirectory}/${dirEntry.name}`,
          type: subDirEntry.type,
        });
      }
    }
  }

  if (sessionData.args.debug) {
    console.log(`Files found at ${searchDirectory} directory`, files);
  }
  
  return files;
}

export async function searchFileForText(fileName: string, searchText: string): Promise<FileSearchInformation[]> {
  const fileSearchInfo: FileSearchInformation[] = [];
  const file = await Deno.open(fileName, { read: true });
  const decoder = new TextDecoder();
  let lineNumber = 1;
  for await (const chunk of file.readable) {
    const lineText = decoder.decode(chunk);
    console.log(lineText);
    if (lineText.includes(searchText)) {
      fileSearchInfo.push({
        line: lineText,
        lineNumber
      });
    }
    lineNumber++;
  }
  // Do work with file
  // if (file) {
  //   file.close();
  // }

  return fileSearchInfo;
}