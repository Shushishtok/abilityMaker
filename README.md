# Dota 2 Custom Game Ability KV Generator
A utility that converts Typescript code to ability kv files that Dota 2 custom games can use.

# That's Typescript. Can it work with lua addons?
Yes! The code is typescript, but it doesn't force the entire project to be typescript as well.

# What do I need to use this repo?
In order to make Typescript compile at all, [NodeJS](https://nodejs.org/en/) must be installed on your system. Install the latest stable version shown in the link.
I heavily recommend using VSCode, not only because of its internal support of NodeJS, but also because it's a great editor. Also, not all editors support NodeJS and/or Typescript, which, depending on the editor, will make it inconvenient to work with the tooltip generator.

# Installation Instructions
* Install NodeJS.
* Install this module with `npm i @shushishtok/ability_generator` (please wait until you receive a message, that the adjustments are successful)
* If your npc directory is NOT `/scripts/npc`, then you need to change the path in `package.json`: `"~kv": "YOUR_PATH/scripts/npc"`

# Initialize the module!
* Run `npm run init` to initialize the module

# Build Instructions
You have several ways to start the build command.

To test: in the resource folder, go to `scripts/npc/abilities`, open `abilityData.ts`, change one or more characters in the localization, and save. The terminal should show updates, and addon_english should update with that change.

## Running build task with console
* Open your console and type `npm run dev`

## Running build task with Visual Studio
* Run build task: `CTRL+SHIFT+B` on VSCode

## Running build task with Sublime:
* Tools > Build System > New Build System...
* Type:
```
{
    "shell_cmd": "npm run dev"
}
```
* Save as any name like `ability_maker_ts.sublime-build` under `AppData/Roaming/Sublime Text 3/Packages/User`
* Have any file from the project open -> press Ctrl + Shift + B -> select `ability_maker_ts` -> console opens and it is run, is closed with esc, will still continue to compile everything until sublime is closed.
* If you want to stop the process earlier you can do so with Tools > Cancel Build
