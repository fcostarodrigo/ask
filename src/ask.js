import {sentenceCase} from 'change-case';
import enquirer from 'enquirer';
import fuzzy from 'fuzzy';

function suggest(input, choices) {
	return fuzzy
		.filter(input.replaceAll(' ', ''), choices, {extract: (choice) => choice.name})
		.map((result) => result.original);
}

const typeMap = {
	list: ({options}) => (options ? {type: 'autocomplete', multiple: true, suggest} : {type: 'list'}),
	boolean: () => ({type: 'confirm'}),
	number: () => ({type: 'numeral'}),
	string: ({options}) => (options ? {type: 'autocomplete', suggest} : {type: 'input'}),
	password: () => ({type: 'invisible'}),
};

export async function ask(option) {
	const prompt = await enquirer.prompt({
		name: option.name,
		message: sentenceCase(option.name),
		choices: option.options,
		initial: option.defaultValue,
		...typeMap[option.type](option),
		...option.enquirerOverrides,
	});

	return prompt[option.name];
}
