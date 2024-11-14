export interface Result {
  success: boolean;
  message?: string;
}

export interface Args {
  help: boolean;
  version: boolean;
  listFilter: string;
  searchDirectory: string;
  searchText: string;
  recursive: boolean;
  debug: boolean;
  _: Array<string | number>;
  "--"?: Array<string> | undefined;
}