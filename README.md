# GGPP (Glenn GIT Project Patcher)

A simple GIT project patcher (Glenn GIT Project Patcher)

## Structure
- ES6 Javascript
- PKG
- Commander
- Express
- Ini
- Listr
- JsonDB

## Why?
Sometimes when you are working on larger packages it happens that something breaks that's used inside multiple projects.
Now you could just copy/paste that fix all around... or use this.
This application can creates the patch for you, uploads it to the repository. And other projects can then pull the patch.

## Usage
```
_______  _______  _______  _______  
|       ||       ||       ||       |
|    ___||    ___||    _  ||    _  |
|   | __ |   | __ |   |_| ||   |_| |
|   ||  ||   ||  ||    ___||    ___|
|   |_| ||   |_| ||   |    |   |    
|_______||_______||___|    |___|    

Usage: ggpp [options] [command]

Options:
  -V, --version          output the version number
  --registry <registry>  sets a temporary registry for the current command
  --project <project>    sets a temporary project for the current command
  --auth <code>          sets the authentication code for the server/sets the authentication code for uploading/deleting patches to the server
  -d, --debug            output debugging information
  -h, --help             output usage information

Commands:
  init                   initializes a project configuration within the current directory
  list                   list all available patches for the current project configuration
  download [id]          downloads one or all patches for the current project
  create <description>   creates a new patch and uploads that to the repository
  delete <id>            removes a patch from the repository
  server                 starts the registry server
```

## Installation
### Linux / MacOS
#### Automatic
- Run this command `wget https://raw.githubusercontent.com/glenndehaan/ggpp/master/install.sh -O ggpp-install.sh && chmod 755 ggpp-install.sh && sudo bash ggpp-install.sh && rm ggpp-install.sh`

#### Manual
- Download the latest `ggpp-linux` or `ggpp-macos` from https://github.com/glenndehaan/ggpp/releases
- Save the application to a folder you won't forget
- Symlink the app as `ggpp` inside your `$PATH`
- The app should be working: `ggpp --help`

### Windows
- Download the latest `ggpp-win.exe` from https://github.com/glenndehaan/ggpp/releases
- Save the application to a folder you won't forget
- Rename the `ggpp-win.exe` to `ggpp.exe`
- Add the installation folder to your `$PATH`
- The app should be working: `ggpp --help`

## Development Usage
- Install NodeJS 8.0 or higher.
- Run `npm ci` in the root folder
- Run `node ./src/ggpp.js --help` in the root folder

## Build Usage
- Install NodeJS 8.0 or higher.
- Run `npm ci` in the root folder
- Run `npm run build` in the root folder
- Binary will be stored in the `build` folder

## License

MIT
