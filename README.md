# leethanaOS
This is my personal portfolio built in Vue.js that features a Lua interpreter, a terminal, a text editor, and a virtual persistent file system.

## Help
### About
leethanaOS is a web based portfolio operatins simulator I made in Vue.js.
It comes with a working Lua interpreter (thanks to Wasmoon) and a persistent simulated file system stored in IndexedDB.

#### Features
- Openable, dragable, and resizable app windows
- A terminal with (some) standard Linux commands
- A Lua interpreter (Wasmoon) in the terminal
- A text editor app (Text++) where you can edit files
- A simulated persistent file system (stored in IndexedDB)

### Commands
- test: returns a string if the commands works
- openurl [url]: opens the URL in a new browser tab
- echo [string]: echoes the string in the terminal
- compgen [options]: returns available commands (DO NOT USE, UNSTABLE)
- help: returns this text :)
- clear: clears the current terminal history
- cd [directory]: changes the current working directory
- ls: lists the direct children of the current working directory
- mkdir [directory]: creates a directory
- rmdir [directory]: removes the directory (empty)
- touch [filename]: creates an empty file
- rm [options]: removes a file/directory/shortcut
- tpp [filename]: opens the file in the Text++ app
- lua [filename]: evaluates the Lua file
[Standard Lua commands also included]
- readline (Lua command): gets input from the command line (should be awaited with :await())

### Upcoming
- A GUI file explorer
- A proxied browser (iframe + Go web proxy)