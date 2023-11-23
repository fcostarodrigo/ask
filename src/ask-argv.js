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

export async function askArgv({ positional = [], dotEnvConfig = undefined, ...config }) {
  configDotEnv(dotEnvConfig);

  const positionalText = positional.map((option) => `[${option.name}]`).join(" ");

  const commandShape = positional.length > 0 ? `* ${positionalText}` : "*";

  const parsed = yargs(hideBin(process.argv))
    .command(commandShape, false, makeBuild(config))
    .showHelpOnFail(false)
    .parse();

  const result = {};

  for (const option of positional) {
    result[option.name] = parsed[option.name];
    if (parsed[option.name] === undefined && option.required) {
      result[option.name] = await ask(option);
    }
  }

  for (const [name, option] of Object.entries(config)) {
    result[name] = parsed[name];
    if (parsed[name] === undefined && option.required) {
      result[name] = await ask({ name, ...option });
    }
  }

  return result;
}

function makeBuild(config) {
  return function (command) {
    command = command.env();

    for (const [name, { options, type, yargsOverrides, defaultValue }] of Object.entries(config)) {
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
