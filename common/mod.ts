import chalk from '@nothing628/chalk';

export interface Result {
  success: boolean;
  message?: string;
}

export interface Args {
  help: boolean;
  version: boolean;
  listFiles: boolean;
  listDirectories: boolean;
  searchDirectory: string;
  searchText: string;
  recursive: boolean;
  debug: boolean;
  _: Array<string | number>;
  "--"?: Array<string> | undefined;
}

export enum RecordType {
  File = 'File',
  Directory = 'Directory',
}
export interface RecordInformation {
  name: string;
  path: string;
  type: RecordType;
}
export interface FileSearchInformation {
  lineNumber: number;
  line: string
}

export const sessionData: { args: Args } = { args: {} as Args};

const paddingChr = ' ';
function getPadding(spacingDiff: number) {
  let typePadding = ' ';
  for (let index = 0; index < spacingDiff; index++) {
    typePadding += paddingChr;
  }

  return typePadding;
}

export function printResults(files: RecordInformation[]) {
  const maxNameLength = files.reduce((maxLength, file) => {
    if (file.name.length > maxLength) {
      maxLength = file.name.length;
    }
    return maxLength;
  }, 0);
  const maxTypeLength = files.some(file => file.type === RecordType.Directory) ? RecordType.Directory.length : RecordType.File.length;

  for (const file of files) {
    const namePadding = getPadding(maxNameLength - file.name.length);
    const typePadding = getPadding(maxTypeLength - file.type.length);

    console.log(chalk.green(file.name) + namePadding + chalk.grey(`-- ${file.type}${typePadding}-- `) + chalk.blue(file.path));
  }
}