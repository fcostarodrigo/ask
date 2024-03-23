# Ask

Wrapper of yargs and enquirer libs to ask user for input.

## Install

```bash
npm i @fcostarodrigo/ask
```

## Usage

### Command line arguments

Create command line arguments. Each command line argument can be passed through the command line, environment variables and `.env` file. If the argument is missing and required, the user is prompted for it. Arguments are required by default. The options `--help` and `--version` are created automatically.

Pass an object describing each command line argument, the returned promise is an object of the same shape with the values extracted.

```js
import { askArgv } from "@fcostarodrigo/ask";

const { password } = await askArgv({
  password: {
    type: "password",
  },
});
```

Passing value using the command line.

```bash
node src/test.js --password xxx
# no prompt
```

Passing value using environment variable.

```bash
PASSWORD=xxx node src/test.js
# no prompt
```

Passing value using the `.env` file.

```bash
echo PASSWORD=xxx > .env
node src/test.js
# no prompt
```

Prompt the user for the missing value.

```bash
node src/test.js
# prompt for password
```

For each command line argument you can also specify:

- `yargsOverrides` Override yargs lib configuration.
- `enquirerOverrides` Override enquirer lib configuration.
- `defaultValue` Default value.
- `options` Possible options for strings and array types.
- `required` If the value is required or not.

### Positional arguments

```js
import { askArgv } from "@fcostarodrigo/ask";

const { username, password } = await askArgv({
  username: { type: "string", position: 0 },
  password: { type: "password", position: 1 },
});
```

```bash
node src/test.js john xxx
```

### `.env` location.

You can also pass the location of the `.env` file as the second parameter.

```js
import { askArgv } from "@fcostarodrigo/ask";

const { username } = await askArgv({ username: { type: "string" } }, { dotEnvConfig: ".dev.env" });
```

```bash
echo USERNAME=john > .dev.env
node src/test.js
```

### User input

You can prompt the user in the middle of your program without defining new command line arguments.

```js
import { ask } from "@fcostarodrigo/ask";

const password = await ask({ name: "password", type: "password" });
```

### Supported types

| Type     | options | yargs                                         | enquirer                                                                    |
| -------- | ------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| array    | no      | [array](https://yargs.js.org/docs/#array)     | [list](https://www.npmjs.com/package/enquirer#list-prompt)                  |
| array    | yes     | [array](https://yargs.js.org/docs/#array)     | [auto complete](https://www.npmjs.com/package/enquirer#autocomplete-prompt) |
| boolean  |         | [boolean](https://yargs.js.org/docs/#boolean) | [confirm](https://www.npmjs.com/package/enquirer#confirm-prompt)            |
| number   |         | [number](https://yargs.js.org/docs/#number)   | [numeral](https://www.npmjs.com/package/enquirer#numeral-prompt)            |
| string   | no      | [string](https://yargs.js.org/docs/#string)   | [input](https://www.npmjs.com/package/enquirer#input-prompt)                |
| string   | yes     | [string](https://yargs.js.org/docs/#string)   | [auto complete](https://www.npmjs.com/package/enquirer#autocomplete-prompt) |
| password |         | [string](https://yargs.js.org/docs/#string)   | [invisible](https://www.npmjs.com/package/enquirer#invisible-prompt)        |

## Changelog

[Changelog](CHANGELOG.MD)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
