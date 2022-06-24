import {sentenceCase} from 'change-case';
import enquirer from 'enquirer';
import compareStrings from 'compare-strings';

function suggest(input, choices) {
	const scores = new Map();

	for (const choice of choices) {
		scores.set(choice, compareStrings(input, choice.name));
	}

	return choices
		.filter((choice) => scores.get(choice) > 0.5)
		.sort((a, b) => scores.get(b) - scores.get(a));
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
