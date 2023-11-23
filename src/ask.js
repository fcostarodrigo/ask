import process from "node:process";
import { sentenceCase } from "change-case";
import enquirer from "enquirer";
import fuzzy from "fuzzy";

function suggest(input, choices) {
  return fuzzy
    .filter(input.replaceAll(" ", ""), choices, { extract: (choice) => choice.name })
    .map((result) => result.original);
}

function confirm() {
  return { type: "confirm" };
}

function numeral() {
  return { type: "numeral" };
}

function invisible() {
  return { type: "invisible" };
}

function autocomplete({ options, defaultValue, type }) {
  if (!options && type === "array") {
    return { type: "list" };
  }

  if (!options && type === "string") {
    return { type: "input" };
  }

  const multiple = type === "array" ? true : undefined;

  if (defaultValue && !options.includes(defaultValue)) {
    defaultValue = null;
  }

  if (!defaultValue) {
    return {
      type: "autocomplete",
      multiple,
      suggest,
    };
  }

  const choices = [defaultValue].concat(options.filter((option) => option !== defaultValue));

  return {
    type: "autocomplete",
    multiple,
    suggest,
    initial: 0,
    choices,
  };
}

const enquirerTypeMap = {
  boolean: confirm,
  number: numeral,
  password: invisible,
  array: autocomplete,
  string: autocomplete,
};

export async function ask(option) {
  try {
    const prompt = await enquirer.prompt({
      name: option.name,
      message: sentenceCase(option.name),
      choices: option.options,
      initial: option.defaultValue,
      limit: 10,
      ...enquirerTypeMap[option.type](option),
      ...option.enquirerOverrides,
    });

    return prompt[option.name];
  } catch {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
}
