export type Config = {
  exclude?: string[];
  options: Options;
};
export type Options = Record<
  string,
  | {
      args?: boolean;
      argsLabel?: string;
      exec?: string;
      options?: never;
    }
  | { options: Options; args?: never; argsLabel?: never; exec?: never }
>;
