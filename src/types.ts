export type Options = Record<
  string,
  | {
      args?: boolean;
      exec?: string;
      options?: never;
    }
  | { options: Options; args: never; exec: never }
>;
