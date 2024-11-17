import { parseArgs, ParseOptions  } from '@std/cli/parse-args';
import { listCommand } from '@paulmfischer/list';
import { searchCommand } from '@paulmfischer/search';
import { sessionData, type Result, type Args } from "@paulmfischer/common";
import meta from "./deno.json" with { type: "json" };

const options: ParseOptions = {
  boolean: true,
  alias: {
    "help": "h",
    "version": "v",
    "listFiles": "lf",
    "listDirectories": "ld",
    "searchDirectory": "sd",
    "searchText": "st",
    "searchFiles": "sf",
    "recursive": "r",
    "debug": "D"
  },
};
const args = parseArgs(Deno.args, options) as Args;
const command = args._[0];

sessionData.args = args;
sessionData.args.searchDirectory = args.searchDirectory ?? Deno.cwd();

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
  handleResult(listCommand());
} else if (command == 'search') {
  handleResult(searchCommand());
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
  console.log("    --lf, --listFiles       Filter results to Files");
  console.log("    --ld, --listDirectories Filter results to Directories");
  console.log("    -r, --recursive         Recursively list all the files and/or directories, ignoring hidden subfolders by default");
  console.log("  search                   Search for a file in the search directory");
  console.log("    --sd, --searchDirectory Directory in which to perform command");
  console.log("    --st, --searchText      Search text to look for in file name, directory");
  console.log("    --sf, --searchFiles     Search text in files as well as for file name and directory");
  console.log("    -r, --recursive         Recursively search under the searchDirectory, ignoring hidden subfolders by default");
  console.log("Options:");
  console.log("  -h, --help               Show this help message");
  console.log("  -v, --version            Show the version number");
}