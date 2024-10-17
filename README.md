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
yarn add --dev scripts-cli
```

## Config

By default `scripts-cli` will include all scripts in `package.json`. By selecting a script in `package.json` it will run:

```bash
npm run <selected script>
```

In order to change the behaviour of `package.json` scripts and add any other scripts for the project you can create a `.scriptscli.config.mjs` file.

```typescript
type Options =
  | {
      args?: boolean;
      argumentsLabel?: string;
      exec?: string;
    }
  | {
      options: Options;
    };

type Config = {
  exclude: string[];
  options: Options;
};
```

For each option entry you can provide the following:

| key       | description                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| args      | default ( `false` ). When `true` the cli will allow arguments to be provided and passed to final command.                                                          |
| argsLabel | default ( `Arguments` ). When provided this will be used in the CLI as a label for the arguments input.                                                            |
| options   | default ( `{}` ). This allows for nested options. The object supplied has the same options as the top level.                                                       |
| exec      | default ( `undefined` ). For a script in `package.json` if a value is provided here it will override the script. This string will be provided to the shell to run. |

### Example Package.json

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

### Example .scriptscli.config.json

```javascript
/** @type { import("scripts-cli").Config } */

export default {
  // This list will exclude scripts with this name from being added at the top level by default.
  // Adding them manually to the options will allow them to still be selected.
  exclude: ["db:create:migration", "db:migrate:latest", "scripts"],
  // These are the options to be presented.
  // For package.json scripts the key needs to be the same as in package.json
  options: {
    test: {
      args: true, // This will ask the user to provide arguments then run 'npm run test' followed by any provided arguments.
    },
    "Create test file": {
      args: true, // This will ask the user for any arguments
      argsLabel: "File name", // This will be the label used when asking for arguments input.
      exec: "./scripts/create-testfile.sh", // This will then run ./script/create-testfile.sh followed by any arguments provided.
    },
    db: {
      options: {
        // This will mean whenever 'db' is selected from the list nothing will be run
        // but a new list consisting of 'create migration' and 'migrate latest' will show.
        "create migration": {
          args: true,
          exec: "npm run db:create:migration",
        },
        "db:migrate:latest": {}, // As this key matches a script in package.json selecting this will run 'npm run db:migrate:latest'
      },
    },
  },
};
```
