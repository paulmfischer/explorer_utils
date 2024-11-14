import { parseArgs, ParseOptions  } from '@std/cli/parse-args';
import { listCommand } from '@paulmfischer/list';
import { searchCommand } from '@paulmfischer/search';
import { type Result, type Args } from "@paulmfischer/common";
import meta from "./deno.json" with { type: "json" };

const options: ParseOptions = {
  boolean: ["help", "version", "debug", "recursive"],
  alias: {
    "help": "h",
    "version": "v",
    "listFilter": "f",
    "searchDirectory": "d",
    "searchText": "t",
    "recursive": "r",
    "debug": "D"
  },
};
const args = parseArgs(Deno.args, options) as Args;

const command = args._[0];
args.searchDirectory = args.searchDirectory ?? Deno.cwd();

if (args.debug) {
  console.log('command', command);
  console.log('args', args);
}

if (args.help || (args._.length === 0 && !args.version)) {
  printUsage();
  Deno.exit(0);
} else if (args.version) {
  console.log(meta.version);
  Deno.exit(0);
}

if (command == 'list') {
  handleResult(listCommand(args));
} else if (command == 'search') {
  handleResult(searchCommand(args));
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
  console.log("    -f, --listFilter        Filter results by either 'File' or 'Directories'");
  console.log("    -r, --recursive         Recursively list all the files and/or directories, ignoring hidden subfolders by default");
  console.log("  search                   Search for a file in the search directory");
  console.log("    -d, --searchDirectory   Directory in which to perform command");
  console.log("    -t, --searchText        Search text to look for in file name, directory(, or in file?)");
  console.log("    -r, --recursive         Recursively search under the searchDirectory, ignoring hidden subfolders by default");
  console.log("Options:");
  console.log("  -h, --help               Show this help message");
  console.log("  -v, --version            Show the version number");
}