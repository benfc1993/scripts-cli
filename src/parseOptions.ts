import { Config, Options } from './types'

export function parseOptions(
  config: Config | undefined,
  scripts: Record<string, string>
): Options {
  const { names, globs } = (config?.exclude ?? []).reduce(
    (acc: { names: string[]; globs: string[] }, exc) => {
      if (exc.includes('*')) acc.globs.push(exc.replace(/\*/g, ''))
      else acc.names.push(exc)
      return acc
    },
    { names: [], globs: [] }
  )

  const npmScripts = Object.keys(scripts)
    .filter((script) => {
      if (!config || !config.exclude) return true

      let globMatch = false
      for (const glob of globs) {
        globMatch = script.startsWith(glob)
        if (globMatch) break
      }

      if (globMatch) return false

      return !names.includes(script)
    })
    .reduce((acc: Options, script) => {
      acc[script] = {}
      return acc
    }, {})

  return { ...npmScripts, ...config?.options }
}
