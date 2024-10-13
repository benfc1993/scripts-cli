#!/usr/bin/env node

import child_process from "child_process";
import { Argument, Command, Option } from "commander";
import { readFileSync } from "fs";
import path from "path";
import { cwd } from "process";
import { Options } from "./types";
import { presentOptions } from "./presentOptions";

// TODO: Check if this creates memory leak
const program = new Command();

async function run(options: Record<string, string | boolean | string[]> = {}) {
  const { config: configPath = "." } = options;

  const { config } = (await import(
    path.join(
      path.resolve(cwd(), configPath as string),
      "/.scriptscli.config.mjs",
    )
  ).catch(() => ({}))) as { config: Options };

  const packageJson = readFileSync(path.join(`${cwd()}/package.json`));
  const data = JSON.parse(packageJson.toString());

  const npmScripts = Object.keys(data.scripts)
    .filter((script) => {
      return !config?.[script]?.exclude;
    })
    .reduce((acc: Options, script) => {
      acc[script] = {};
      return acc;
    }, {});

  const { cmd, args } = await presentOptions({ ...npmScripts, ...config });
  child_process.spawn(cmd + " " + args, { stdio: "inherit", shell: true });
}

program
  .action(run)
  .option(
    "-c,--config <FilePath>",
    "location of config file other than project root",
  );
program.parse(process.argv);
