import {sentenceCase} from 'change-case';
import enquirer from 'enquirer';

const typeMap = {
	list: ({options}) => (options ? {type: 'autocomplete', multiple: true} : {type: 'list'}),
	boolean: () => ({type: 'confirm'}),
	number: () => ({type: 'numeral'}),
	string: ({options}) => ({type: options ? 'autocomplete' : 'input'}),
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
