#!/usr/bin/env node

const checker = require(".");
const extract = require("./extract");
const fs = require("fs");
const YAML = require("yamljs");
const chalk = require("chalk");
const program = require("commander");
const buildVersion = require("./package.json").version;

// We play with mdspell's internals here. It's not ideal, but it works
const spellConfig = require("markdown-spellcheck/es5/spell-config").default;
const spellcheck = require("markdown-spellcheck").default;

function loader(filename) {
  const suffix = filename.split(".").pop().toLowerCase();
  // If it ends in .yml
  if (["yml", "yaml"].indexOf(suffix) !== -1) {
    return YAML.load(filename);
  }
  // Assume everything else is JSON
  return JSON.parse(fs.readFileSync(filename));
}

(async () => {
  // Partially taken from https://github.com/lukeapage/node-markdown-spellcheck/blob/master/es6/cli.js#L15
  program
    .version(buildVersion)
    .option("-n, --ignore-numbers", "Ignores numbers.")
    .option("--en-us", "American English dictionary.")
    .option("--en-gb", "British English dictionary.")
    .option("--en-au", "Australian English dictionary.")
    .option("--es-es", "Spanish dictionary.")
    .option(
      "-d, --dictionary [file]",
      "specify a custom dictionary file - it should not include the file extension and will load .dic and .aiff."
    )
    .option("-a, --ignore-acronyms", "Ignores acronyms.")
    .option(
      "-s, --spelling [file]",
      "specify a custom list of spelling exceptions"
    )
    .option("-j, --json-path [path]", "specify a jsonpath expression to match")
    .option(
      "-f, --fields [fields]",
      "specify a comma separated list of field names to match"
    )
    .arguments("<source-file>")
    .parse(process.argv);

  if (program.args.length < 1) {
    return program.help();
  }

  const programOpts = program.opts();

  let language;
  if (programOpts.enUs) {
    language = "en-us";
  } else if (programOpts.enGb) {
    language = "en-gb";
  } else if (programOpts.enAu) {
    language = "en-au";
  } else if (programOpts.esEs) {
    language = "es-es";
  }

  const options = {
    ignoreAcronyms: programOpts.ignoreAcronyms,
    ignoreNumbers: programOpts.ignoreNumbers,
    dictionary: {
      language: language,
      file: programOpts.dictionary,
    },
  };

  // Add all spelling exceptions based on .spelling in the current directory
  // or the file provided
  let spellingFile = programOpts.spelling || "./.spelling";
  await new Promise((resolve) => spellConfig.initialise(spellingFile, resolve));
  spellConfig.getGlobalWords().forEach((word) => {
    spellcheck.spellcheck.addWord(word);
  });

  const i = loader(program.args[0]);

  let jsonPath = "";
  if (programOpts.jsonPath) {
    jsonPath = programOpts.jsonPath;
  } else {
    jsonPath = programOpts.fields.split(",");
  }

  const errors = await checker(i, jsonPath, options);
  if (errors.length == 0) {
    process.exit(0);
  }

  for (let error of errors) {
    for (let single of error.errors) {
      error.value = error.value.replace(single.word, chalk.red(single.word));
    }
    console.log(`${error.path}\n${error.value}\n`);
  }

  process.exit(1);
})();
