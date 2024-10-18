#!/usr/bin/env node

import child_process from 'child_process'
import { Command } from 'commander'
import { readFileSync } from 'fs'
import path from 'path'
import { cwd } from 'process'
import { Config } from './types'
import { presentOptions } from './presentOptions'
import { parseOptions } from './parseOptions'

const program = new Command()

async function run(
  cliOptions: Record<string, string | boolean | string[]> = {}
) {
  const { config: configPath = '.' } = cliOptions

  const { default: config } = (await import(
    path.join(
      path.resolve(cwd(), configPath as string),
      '/.scriptscli.config.mjs'
    )
  ).catch(() => ({ options: {} }))) as { default: Config | undefined }

  const packageJson = readFileSync(path.join(`${cwd()}/package.json`))
  const data = JSON.parse(packageJson.toString())

  try {
    const options = parseOptions(config, data.scripts)
    const { cmd, args } = await presentOptions(options)
    child_process.spawn(cmd + ' ' + args, { stdio: 'inherit', shell: true })
  } catch (e) {
    return
  }
}

program
  .action(run)
  .option(
    '-c,--config <FilePath>',
    'location of config file other than project root'
  )
program.parse(process.argv)
