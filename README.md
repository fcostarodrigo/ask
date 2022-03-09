# Ask

Wrapper of yargs and enquirer to ask user for input.

## Install

```
npm i @fcostarodrigo/ask
```

## Usage

### Command line arguments

Prompt user when the argument is missing.
Arguments are required by default.
Accepts environment variables.
Reads `.env` files.

```js
import { askArgv } from "@fcostarodrigo/ask";

const password = await askArgv({
  password: {
    type: "password",
  },
});
```

```bash
node src/test.js --password xxx
# no prompt
```

```bash
PASSWORD=xxx node src/test.js
# no prompt
```

```bash
echo PASSWORD=xxx > .env
node src/test.js
# no prompt
```

```bash
node src/test.js
# prompt for password
```

Accepts positional arguments

```js
import { askArgv } from "@fcostarodrigo/ask";

const { username, password } = await askArgv({
  positional: [
    { name: "username", type: "string" },
    { name: "password", type: "password" },
  ],
});
```

```bash
node src/test.js user xxx
```

### User input

You can use in the middle of your program to get additional information.

```js
import { ask } from "@fcostarodrigo/ask";

const password = await ask({ name: "password", type: "password" });
```

You can specify a list of options.

```js
import { ask } from "@fcostarodrigo/ask";

const letter = await ask({ type: "string", options: ["a", "b", "c"] });
```

### Overrides

You can pass `yargsOverrides` or `enquirerOverrides` to override any configuration.

### Default value.

Set the default value passing the `defaultValue` option.

### Type mapping

| Type     | options | yargs                                         | enquirer                                                                    |
| -------- | ------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| list     | no      | [array](https://yargs.js.org/docs/#array)     | [list](https://www.npmjs.com/package/enquirer#list-prompt)                  |
| list     | yes     | [array](https://yargs.js.org/docs/#array)     | [auto complete](https://www.npmjs.com/package/enquirer#autocomplete-prompt) |
| boolean  |         | [boolean](https://yargs.js.org/docs/#boolean) | [confirm](https://www.npmjs.com/package/enquirer#confirm-prompt)            |
| number   |         | [number](https://yargs.js.org/docs/#number)   | [numeral](https://www.npmjs.com/package/enquirer#numeral-prompt)            |
| string   | no      | [string](https://yargs.js.org/docs/#string)   | [input](https://www.npmjs.com/package/enquirer#input-prompt)                |
| string   | yes     | [string](https://yargs.js.org/docs/#string)   | [auto complete](https://www.npmjs.com/package/enquirer#autocomplete-prompt) |
| password |         | [string](https://yargs.js.org/docs/#string)   | [invisible](https://www.npmjs.com/package/enquirer#invisible-prompt)        |

## Changelog

[Changelog](CHANGELOG.MD)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
