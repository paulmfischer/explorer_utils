import { parseArgs, ParseOptions } from '@std/cli/parse-args';
import { list } from '@paulmfischer/list';
import { search } from '@paulmfischer/search';
import meta from "./deno.json" with { type: "json" };

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
const args = parseArgs(Deno.args, options);

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
  list(searchDirectory, listFilter);
} else if (command == 'search') {
  search(searchDirectory, searchText);
}

function printUsage() {
  console.log("");
  console.log("Usage: eu [command] [options]");
  console.log("Command:");
  console.log("  list                     List all files in the search directory");
  console.log("    -lf, --listFilter        Filter results by either 'File' or 'Directories'");
  console.log("  search                   Search for a file in the search directory");
  console.log("    -sd, --searchDirectory   Directory in which to perform command");
  console.log("    -st, --searchText        Directory in which to perform command");
  console.log("Options:");
  console.log("  -h, --help               Show this help message");
  console.log("  -v, --version            Show the version number");
}