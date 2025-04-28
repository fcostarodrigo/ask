import type PromptOptions from "enquirer";
import { type Options } from "yargs";

type Type = "boolean" | "number" | "password" | "string" | "array";

type TypeMap = {
  boolean: boolean;
  number: number;
  password: string;
  string: string;
  array: string[];
};

type OptionsTypeMap = {
  boolean: {};
  number: {};
  password: {};
  string: { options?: string[] };
  array: { options?: string[] };
};

type OptionsEnvTypeMap = {
  boolean: { options?: boolean[] };
  number: { options?: number[] };
  password: { options?: string[] };
  string: { options?: string[] };
  array: { options?: string[] };
};

type AskOptions<T extends Type> = {
  name: string;
  enquirerOverrides?: PromptOptions;
  type: T;
  defaultValue?: TypeMap[T];
} & OptionsTypeMap[T];

type ArgvOptions<T extends Type> = {
  enquirerOverrides?: PromptOptions;
  yargsOverrides?: Options;
  type: T;
  position?: number;
  defaultValue?: TypeMap[T];
} & OptionsTypeMap[T];

export function ask<T extends Type>(options: AskOptions<T>): Promise<TypeMap[T]>;

export function askArgv<Types extends Record<string, Type>>(
  options: { [Key in keyof Types]: ArgvOptions<Types[Key]> },
  otherOptions?: { dotEnvConfig?: string },
): Promise<{ [Key in keyof Types]: TypeMap[Types[Key]] }>;

export function askEnv<Types extends Record<string, Type>>(
  options: {
    [Key in keyof Types]: {
      type: Types[Key];
      defaultValue?: TypeMap[Types[Key]];
    } & OptionsEnvTypeMap[Types[Key]];
  },
  otherOptions?: { dotEnvConfig?: string },
): { [Key in keyof Types]: TypeMap[Types[Key]] };
