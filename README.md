# Scripts CLI

This package aims to take out the step of remembering all of the scripts in your package.json file and remove the need to put all utility scripts into package.json.

![Example use](./assets/out-2.gif)

## Installation

### npm

```bash
npm install --save-dev scripts-cli
```

### yarn

```bash
yarn add -D scripts-cli
```

## Config

By default `scripts-cli` will include all scripts in `package.json`. By selecting a script in `package.json` it will run:

```bash
npm run <selected script>
```

In order to change the behaviour of `package.json` scripts and add any other scripts for the project you can create a `.scriptscli.config.mjs` file.

For each entry you can provide the following:

| key     | description                                                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| args    | default ( `false` ). When `true` the cli will allow arguments to be provided and passed to final command.                                                          |
| exclude | default ( `false` ). When `true` this script will not show in the selectable list                                                                                  |
| options | default ( `{}` ). This allows for nested options. The object supplied has the same options as the top level.                                                       |
| exec    | default ( `undefined` ). For a script in `package.json` if a value is provided here it will override the script. This string will be provided to the shell to run. |

### Package.json

```json
{
  "scripts": {
    "test": "echo \"Running tests\"",
    "dev": "ts-node . -w",
    "db:migrate:latest": "echo \"Running latest migrations\"",
    "db:create:migration": "echo \"Creating migration$1\"",
    "scripts": "scripts-cli"
  }
}
```

### .scriptscli.config.json

```javascript
export const config = {
  test: {
    args: true, // This will ask the user to provide arguments then run 'npm run test' followed by any provided arguments.
  },
  scripts: {
    exclude: true, // This will exclude the option 'scripts' from the list
  },
  "Create test file": {
    args: true, // This will ask the user for any arguments
    exec: "./scripts/create-testfile.sh", // This will then run ./script/create-testfile.sh followed by any arguments provided.
  },
  "db:create:migration": {
    exclude: true,
  },
  "db:migrate:latest": {
    exclude: true,
  },
  db: {
    options: {
      // This will mean whenever 'db' is selected from the list nothing will be run but a new list consisting of 'create migration' and 'migrate latest' will show.
      "create migration": {
        args: true,
        exec: "npm run db:create:migration",
      },
      "migrate latest": {
        exec: "npm run db:migrate:latest",
      },
    },
  },
};
```
