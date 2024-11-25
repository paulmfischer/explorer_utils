import { EOL } from "@std/fs/eol";
import { sessionData, type RecordInformation, RecordType, type FileSearchInformation } from "@paulmfischer/common";

export async function getFiles(searchDirectory: string, recursively: boolean = false): Promise<RecordInformation[]> {
  const files: RecordInformation[] = [];
  for await (const dirEntry of Deno.readDir(searchDirectory)) {
    if (!dirEntry.name.startsWith('.')) {
      files.push({
        name: dirEntry.isDirectory ? `${dirEntry.name}/` : dirEntry.name,
        path: searchDirectory,
        isDirectory: dirEntry.isDirectory,
        type: dirEntry.isDirectory ? RecordType.Directory : RecordType.File
      });
    }
    
    if (recursively && dirEntry.isDirectory && !dirEntry.name.startsWith('.')) {
      for (const subDirEntry of await getFiles(`${searchDirectory}/${dirEntry.name}`, recursively)) {
        files.push({
          name: subDirEntry.type == RecordType.Directory ? `${subDirEntry.name}/` : subDirEntry.name,
          path: `${searchDirectory}/${dirEntry.name}`,
          isDirectory: subDirEntry.isDirectory,
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
  if (sessionData.args.debug) {
    console.log('searching file:', fileName, 'search text:', searchText);
  }
  const file = await Deno.open(fileName, { read: true });
  const decoder = new TextDecoder();
  for await (const chunk of file.readable) {
    const fileText = decoder.decode(chunk);
    if (sessionData.args.debug) {
      console.log('file text', fileText);
    }
    const fileByLines = fileText.split(EOL);
    let lineNumber = 1;
    for (const line of fileByLines) {
      if (sessionData.args.debug) {
        console.log('line', line, `line includes search text ${searchText}`, line.includes(searchText));
      }
      if (line.includes(searchText)) {
        fileSearchInfo.push({
          line: line,
          lineNumber
        });
      }
      lineNumber++;
    }
  }

  return fileSearchInfo;
}