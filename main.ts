import { parseArgs, ParseOptions  } from '@std/cli/parse-args';
import { listCommand } from '@paulmfischer/list';
import { searchCommand } from '@paulmfischer/search';
import { Result } from "@paulmfischer/common";
import meta from "./deno.json" with { type: "json" };

interface Args {
  help: boolean;
  version: boolean;
  listFilter: string;
  searchDirectory: string;
  searchText: string;
  debug: boolean;
  _: Array<string | number>;
  "--"?: Array<string> | undefined;
}
console.log('check', meta.workspace);
const options: ParseOptions = {
  boolean: ["help", "version", "debug"],
  alias: {
    "help": "h",
    "version": "v",
    "listFilter": "f",
    "searchDirectory": "d",
    "searchText": "t",
    "debug": "D"
  },
};
const args = parseArgs(Deno.args, options) as Args;

const command = args._[0];
const listFilter = args.listFilter;
const searchDirectory = args.searchDirectory ?? Deno.cwd();
const searchText = args.searchText;

if (args.debug) {
  console.log('args', args);
  console.log('command', command);
}

if (args.help || (args._.length === 0 && !args.version)) {
  printUsage();
  Deno.exit(0);
} else if (args.version) {
  console.log(meta.version);
  Deno.exit(0);
}

if (command == 'list') {
  handleResult(listCommand(searchDirectory, listFilter));
} else if (command == 'search') {
  handleResult(searchCommand(searchDirectory, searchText));
}

function handleResult(result: Result) {
  if (!result.success) {
    printUsage(result.message);
    Deno.exit(0);
  }
}

function printUsage(additionalMessage?: string) {
  if (additionalMessage) {
    console.log(additionalMessage);
  }

  console.log("");
  console.log("Usage: eu [command] [options]");
  console.log("Commands:");
  console.log("  list                     List all files in the search directory");
  console.log("    -lf, --listFilter        Filter results by either 'File' or 'Directories'");
  console.log("  search                   Search for a file in the search directory");
  console.log("    -sd, --searchDirectory   Directory in which to perform command");
  console.log("    -st, --searchText        Directory in which to perform command");
  console.log("Options:");
  console.log("  -h, --help               Show this help message");
  console.log("  -v, --version            Show the version number");
}