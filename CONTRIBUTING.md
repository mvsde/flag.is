# Contributing

## Stack

- [Node.js](https://nodejs.org/)
- [Eleventy](https://www.11ty.dev/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- Vanilla CSS
- Vanilla JS

## Setup

```sh
npm install
```

## Development

```sh
node --run dev
```

## Formatting

```sh
node --run format
```

## Linting

```sh
# Run all linters
node --run lint

# Run individual linters
node --run lint:css
node --run lint:js
node --run lint:data
node --run lint:format
```

## Production

```sh
node --run build
```

## Edit a flag

Either use the [edit links on each flag page](https://flag.is/non-binary/) for minor edits with the GitHub web interface.

Or [fork the repository](https://github.com/mvsde/flag.is/fork) and make changes with your preferred code editor.

Each flag consists of two files, where `[id]` is the URL-safe lowercase and hyphenated name of the flag:

- Data file: `data/flags/[id].yaml`
- Image file: `public/img/[id].svg`

## Add a flag

To add a flag, create the following two files, where `[id]` is the URL-safe lowercase and hyphenated name of the flag:

- Data file: `data/flags/[id].yaml`
- Image file: `public/img/[id].svg`

The mandatory and optional properties for the YAML data file are specified in the [flag JSON schema](schemas/flag.yaml).

The flag image file should be an optimized SVG that uses basic shapes to improve readability and reusability.
