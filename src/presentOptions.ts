import { input, search } from "@inquirer/prompts";
import { Options } from "./types";
import FuzzySearch from "fuzzy-search";

export async function presentOptions(options: Options) {
  const choices = Object.keys(options);
  const selection = await search<keyof typeof options>({
    message: "What do you want to do",
    source: async (input) => {
      const search = new FuzzySearch(choices);
      const result = search.search(input);

      return result;
    },
  }).catch();

  const selectedOption = options[selection];

  if (selectedOption?.options) {
    return presentOptions(selectedOption.options);
  }

  const args = selectedOption.args
    ? await input({
        message: "Arguments:",
      }).catch()
    : "";

  console.log(args);

  const cmd = selectedOption?.exec ?? "npm run " + selection;

  return { cmd, args };
}
