import { parseArgs, ParseOptions } from '@std/cli/parse-args';
import { getFiles } from "./file-utils.ts";
import { list } from '@paulmfischer/list';
import meta from "./deno.json" with { type: "json" };

const options: ParseOptions = {
  boolean: ["help", "version"],
  alias: {
    "help": "h",
    "version": "v",
    "listFilter": "lf",
    "searchDirectory": "sd",
    "searchText": "st"
  },
};
const args = parseArgs(Deno.args, options);

const command = args._[0];
const listFilter = args.listFilter;
const searchDirectory = args.searchDirectory ?? Deno.cwd();
const searchText = args.searchText;

console.log('args', args);
console.log('command', command);

if (args.help || (args._.length === 0 && !args.version)) {
  printUsage();
  Deno.exit(0);
} else if (args.version) {
  console.log(meta.version ? meta.version : "1.0.0");
  Deno.exit(0);
}

if (command == 'list') {
  console.log(list(searchDirectory, listFilter));
} else if (command == 'search') {
  const file = getFiles(searchDirectory).find(file => file.name.includes(searchText as string));
  if (file) {
    console.log(file);
  }
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