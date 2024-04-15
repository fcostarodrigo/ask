import process from "node:process";
import { constantCase } from "change-case";
import { config as configDotEnv } from "dotenv";

const parsers = {
  array: (value) => value.split(","),
  boolean: (value) => value.toLowerCase() === "true",
  number: Number,
  string: (value) => value,
  password: (value) => value,
};

const disjunction = new Intl.ListFormat("en-US", {
  style: "short",
  type: "disjunction",
});

export function askEnv(options, { dotEnvConfig = undefined } = {}) {
  configDotEnv(dotEnvConfig);

  const result = {};

  for (const [name, config] of Object.entries(options)) {
    const required = "required" in config ? config.required : true;
    const key = constantCase(name);

    if (!(key in process.env) && required && !("defaultValue" in config)) {
      throw new Error(`Missing required environment variable ${key}`);
    }

    if (key in process.env) {
      const value = parsers[config.type](process.env[key]);

      if ("options" in config && !config.options.includes(value)) {
        const list = disjunction.format(config.options.map(String));
        throw new Error(
          `Environment variable ${key} with value converted to ${value} from ${process.env[key]} is not one of the values ${list}.`,
        );
      }

      result[name] = value;
      continue;
    }

    if ("defaultValue" in config) {
      result[name] = config.defaultValue;
    }
  }

  return result;
}
