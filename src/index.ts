#!/usr/bin/env node

import child_process from "child_process";
import { Command } from "commander";
import { readFileSync } from "fs";
import path from "path";
import { cwd } from "process";
import { Config, Options } from "./types";
import { presentOptions } from "./presentOptions";

const program = new Command();

async function run(options: Record<string, string | boolean | string[]> = {}) {
  const { config: configPath = "." } = options;

  const { default: config } = (await import(
    path.join(
      path.resolve(cwd(), configPath as string),
      "/.scriptscli.config.mjs",
    )
  ).catch(() => ({ options: {} }))) as { default: Config };

  const packageJson = readFileSync(path.join(`${cwd()}/package.json`));
  const data = JSON.parse(packageJson.toString());

  const npmScripts = Object.keys(data.scripts)
    .filter((script) => {
      return !config.exclude?.includes(script);
    })
    .reduce((acc: Options, script) => {
      acc[script] = {};
      return acc;
    }, {});

  try {
    const { cmd, args } = await presentOptions({
      ...npmScripts,
      ...config.options,
    });
    child_process.spawn(cmd + " " + args, { stdio: "inherit", shell: true });
  } catch (e) {
    return;
  }
}

program
  .action(run)
  .option(
    "-c,--config <FilePath>",
    "location of config file other than project root",
  );
program.parse(process.argv);
