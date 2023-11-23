import type PromptOptions from "enquirer";

export function ask(options: {
  name: string;
  enquirerOverrides?: PromptOptions;
  type: "boolean";
  defaultValue?: boolean;
}): Promise<boolean>;

export function ask(options: {
  name: string;
  enquirerOverrides?: PromptOptions;
  type: "number";
  defaultValue?: number;
}): Promise<number>;

export function ask(options: {
  name: string;
  enquirerOverrides?: PromptOptions;
  type: "password" | "string";
  options?: string[];
  defaultValue?: string;
}): Promise<string>;

export function ask(options: {
  name: string;
  enquirerOverrides?: PromptOptions;
  type: "array";
  options?: string[];
  defaultValue?: string[];
}): Promise<string[]>;

export function askArgv(options: {
  positional?: Array<{
    name: string;
    enquirerOverrides?: PromptOptions;
    type: "boolean" | "number" | "password" | "string" | "array";
    options?: string[];
    defaultValue?: boolean | number | string | string[];
  }>;
  dotEnvConfig?: string;
}): Promise<Record<string, boolean | number | string | string[] | undefined>>;
