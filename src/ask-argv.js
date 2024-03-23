import process from "node:process";
import { kebabCase, sentenceCase } from "change-case";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { config as configDotEnv } from "dotenv";
import { ask } from "./ask.js";

const yargsTypeMap = new Map([
  ["array", "array"],
  ["boolean", "boolean"],
  ["number", "number"],
  ["string", "string"],
  ["password", "string"],
]);

export async function askArgv(cliArguments, { dotEnvConfig = undefined } = {}) {
  configDotEnv(dotEnvConfig);

  const cliArgumentsWithName = Object.entries(cliArguments).map(([name, options]) => ({
    name,
    required: true,
    ...options,
  }));

  const positional = cliArgumentsWithName
    .filter((option) => "position" in option)
    .sort((a, b) => a.position - b.position);
  const positionalText = positional.map((option) => `[${option.name}]`).join(" ");
  const commandShape = positional.length > 0 ? `* ${positionalText}` : "*";

  const nonPositional = cliArgumentsWithName.filter((option) => !("position" in option));
  const parsed = yargs(hideBin(process.argv))
    .command(commandShape, false, makeBuild(nonPositional))
    .showHelpOnFail(false)
    .parse();

  const result = {};

  for (const cliArgument of cliArgumentsWithName) {
    result[cliArgument.name] = parsed[cliArgument.name];
    if (parsed[cliArgument.name] === undefined && cliArgument.required) {
      result[cliArgument.name] = await ask(cliArgument);
    }
  }

  return result;
}

function makeBuild(nonPositional) {
  return function (command) {
    command = command.env();

    for (const { name, options, type, yargsOverrides, defaultValue } of nonPositional) {
      command = command.option(kebabCase(name), {
        describe: sentenceCase(name),
        type: yargsTypeMap.get(type),
        required: false,
        choices: options,
        default: defaultValue,
        ...yargsOverrides,
      });
    }

    return command;
  };
}
