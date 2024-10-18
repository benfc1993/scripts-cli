type Without<T> = { [P in keyof T]?: undefined }
type XOR<T, U> = (Without<T> & U) | (Without<U> & T)

export type Config = {
  exclude?: string[]
  options?: Options
}

type ExecOption = { args?: boolean; argsLabel?: string; exec: string }
export function isExecOption(option: Option): option is ExecOption {
  return 'exec' in option
}
type NpmOption = { args?: boolean; argsLabel?: string; exec?: never }
export function isNpmOption(option: Option): option is NpmOption {
  return !('options' in option) && !('exec' in option)
}
type NestedOption = { options: Options }
export function isNestedOption(option: Option): option is NestedOption {
  return 'options' in option
}
type Option =
  | XOR<ExecOption, NpmOption>
  | XOR<NestedOption, NpmOption>
  | XOR<ExecOption, NestedOption>

export type Options = Record<string, Option>
