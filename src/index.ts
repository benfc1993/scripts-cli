#!/usr/bin/env node

import child_process from "child_process";
import { Command } from "commander";
import { readFileSync } from "fs";
import path from "path";
import { cwd } from "process";
import { Options } from "./types";
import { presentOptions } from "./presentOptions";

// TODO: Check if this creates memory leak
const program = new Command();

async function run() {
  // TODO:handle config file not created
  const { config } = (await import(
    path.join(`${cwd()}/.project.config.mjs`)
  )) as { config: Options };

  const packageJson = readFileSync(path.join(`${cwd()}/package.json`));
  const data = JSON.parse(packageJson.toString());

  const npmScripts = Object.keys(data.scripts).reduce(
    (acc: Options, script) => {
      acc[script] = {};
      return acc;
    },
    {},
  );

  const { cmd, args } = await presentOptions({ ...npmScripts, ...config });
  child_process.spawn(cmd + " " + args, { stdio: "inherit", shell: true });
}

program.action(run);
// TODO: does it need args?
program.parse(process.argv);
