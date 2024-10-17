import { input, search } from "@inquirer/prompts";
import { presentOptions } from "./presentOptions";
import { Options } from "./types";

jest.mock("@inquirer/prompts");
const mockSearch = search as jest.MockedFunction<typeof search>;
const mockInput = input as jest.MockedFunction<typeof input>;

describe("presentOptions", () => {
  describe("npm scripts", () => {
    it("should return an npm script with no arguments", async () => {
      const scriptName = "my-script";
      const expectedCmd = `npm run ${scriptName}`;

      const options: Options = { [scriptName]: {} };
      mockSearch.mockResolvedValueOnce(scriptName);
      const result = await presentOptions(options);

      expect(result.cmd).toEqual(expectedCmd);
      expect(result.args).toEqual(``);
    });

    it("should return an npm script with arguments", async () => {
      const scriptName = "my-script";
      const options: Options = { [scriptName]: { args: true } };
      const expectedCmd = `npm run ${scriptName}`;
      const expectedArguments = "testing";

      mockSearch.mockResolvedValueOnce(scriptName);
      mockInput.mockResolvedValueOnce(expectedArguments);

      const result = await presentOptions(options);

      expect(result.cmd).toEqual(expectedCmd);
      expect(result.args).toEqual(expectedArguments);
    });
  });

  describe("exec scripts", () => {
    it("should return the provided exec command", async () => {
      const scriptName = "my-script";
      const exec = "run this";
      const options: Options = { [scriptName]: { exec } };

      mockSearch.mockResolvedValueOnce(scriptName);
      mockInput.mockResolvedValueOnce("");

      const result = await presentOptions(options);

      expect(result.cmd).toEqual(exec);
      expect(result.args).toEqual(``);
    });

    it("should return the exec command with arguments", async () => {
      const scriptName = "my-script";
      const exec = "run this";
      const expectedArguments = "testing";

      const options: Options = { [scriptName]: { exec, args: true } };

      mockSearch.mockResolvedValueOnce(scriptName);
      mockInput.mockResolvedValueOnce(expectedArguments);

      const result = await presentOptions(options);

      expect(result.cmd).toEqual(exec);
      expect(result.args).toEqual(expectedArguments);
    });
  });

  it("should use the provided argument label when provided", async () => {
    const scriptName = "my-script";
    const expectedArgumentLabel = "My label";
    const options: Options = {
      [scriptName]: { argsLabel: expectedArgumentLabel, args: true },
    };

    mockSearch.mockResolvedValueOnce(scriptName);
    mockInput.mockResolvedValueOnce("");

    await presentOptions(options);

    expect(mockInput).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedArgumentLabel + ":",
      }),
    );
  });
  describe("nested options", () => {
    it("should call presentOptions recursively", async () => {
      const scriptName = "my-script";
      const expectedCmd = `npm run ${scriptName}`;
      const expectedArguments = "testing";
      const expectedArgumentLabel = "My label";

      const nestedOptions = {
        [scriptName]: {
          argsLabel: expectedArgumentLabel,
          args: true,
        },
      };

      const options: Options = {
        [scriptName]: {
          options: nestedOptions,
        },
      };

      mockSearch.mockResolvedValue(scriptName);
      mockInput.mockResolvedValue(expectedArguments);

      const result = await presentOptions(options);

      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expectedArgumentLabel + ":",
        }),
      );
      expect(result.cmd).toEqual(expectedCmd);
      expect(result.args).toEqual(expectedArguments);
    });
  });

  it("should throw an error if there are no options ", async () => {
    expect(async () => await presentOptions({})).rejects.toThrow("no options");
  });

  it("should throw an error if no selection is made", async () => {
    expect(async () => await presentOptions({ myScript: {} })).rejects.toThrow(
      "no selection made",
    );
  });
});
