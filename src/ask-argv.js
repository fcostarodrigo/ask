import process from 'node:process';
import {paramCase, sentenceCase} from 'change-case';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {config as configDotEnv} from 'dotenv';
import {ask} from './ask.js';

const typeMap = new Map([
	['list', 'array'],
	['boolean', 'boolean'],
	['number', 'number'],
	['string', 'string'],
	['password', 'string'],
]);

export async function askArgv({positional = [], dotEnvPath = undefined, ...config}) {
	configDotEnv(dotEnvPath);

	const positionalText = positional.map((option) => `[${option.name}]`).join(' ');

	const commandShape = positional.length > 0 ? `* ${positionalText}` : '*';

	const parsed = yargs(hideBin(process.argv))
		.command(commandShape, false, makeBuild(config))
		.showHelpOnFail(false)
		.parse();

	const result = {};

	for (const option of positional) {
		result[option.name] = parsed[option.name];
		if (!parsed[option.name]) {
			result[option.name] = await ask(option);
		}
	}

	for (const [name, option] of Object.entries(config)) {
		result[name] = parsed[name];
		if (!parsed[name]) {
			result[name] = await ask({name, ...option});
		}
	}

	return result;
}

function makeBuild(config) {
	return function (command) {
		command = command.env();

		for (const [name, {options, type, yargsOverrides, defaultValue}] of Object.entries(config)) {
			command = command.option(paramCase(name), {
				describe: sentenceCase(name),
				type: typeMap.get(type),
				required: false,
				choices: options,
				default: defaultValue,
				...yargsOverrides,
			});
		}

		return command;
	};
}
