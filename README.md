# explorer_utils

**This is just a hobby project I created to play around with creating a CLI program using Deno. Use at your own risk.**

Deno CLI utility for listing file/directories as well as searching.

### Usage: `eu [command] [options]`

```
Commands:
  list                     List all files in the search directory
    --lf, --listFiles       Filter results to Files
    --ld, --listDirectories Filter results to Directories
    -r, --recursive         Recursively list all the files and/or directories, ignoring hidden subfolders by default
  search                   Search for a file in the search directory
    --sd, --searchDirectory Directory in which to perform command
    --st, --searchText      Search text to look for in file name, directory
    --sf, --searchFiles     Search text in files as well as for file name and directory
    -r, --recursive         Recursively search under the searchDirectory, ignoring hidden subfolders by default
Options:
  -h, --help               Show this help message
  -v, --version            Show the version number
  -D, --debug              Print debug statements
```

### Examples:
#### List
List files/directories for current folder: `eu list`

![eu list results](/images/list-results.png)

#### Search
Search current folders file/directoy names as well as contents for the text `add`: `eu search --searchText=add`

![eu search results](/images/search-results.png)

## Development

To test changes, run: `deno task dev [command] [options]`