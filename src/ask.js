import { sentenceCase } from "change-case";
import enquirer from "enquirer";
import fuzzy from "fuzzy";
import process from "node:process";

function autocomplete({ defaultValue, options, type }) {
  if (!options && type === "array") {
    return { type: "list" };
  }

  if (!options && type === "string") {
    return { type: "input" };
  }

  const multiple = type === "array" ? true : undefined;

  if (defaultValue && !options.includes(defaultValue)) {
    defaultValue = undefined;
  }

  if (!defaultValue) {
    return {
      multiple,
      suggest,
      type: "autocomplete",
    };
  }

  const choices = [defaultValue, ...options.filter((option) => option !== defaultValue)];

  return {
    choices,
    initial: 0,
    multiple,
    suggest,
    type: "autocomplete",
  };
}

function confirm() {
  return { type: "confirm" };
}

function invisible() {
  return { type: "invisible" };
}

function numeral() {
  return { type: "numeral" };
}

function suggest(input, choices) {
  return fuzzy
    .filter(input.replaceAll(" ", ""), choices, { extract: (choice) => choice.name })
    .map((result) => result.original);
}

const enquirerTypeMap = {
  array: autocomplete,
  boolean: confirm,
  number: numeral,
  password: invisible,
  string: autocomplete,
};

export async function ask(option) {
  try {
    const prompt = await enquirer.prompt({
      choices: option.options,
      initial: option.defaultValue,
      limit: 10,
      message: sentenceCase(option.name),
      name: option.name,
      ...enquirerTypeMap[option.type](option),
      ...option.enquirerOverrides,
    });

    return prompt[option.name];
  } catch {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
}
