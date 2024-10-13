export type Options = Record<
  string,
  | {
      args?: boolean;
      exec?: string;
      options?: never;
      exclude?: never;
    }
  | { options: Options; args: never; exec: never; exclude?: never }
  | {
      exclude: boolean;
      args?: boolean;
      exec?: string;
      options?: never;
    }
>;
