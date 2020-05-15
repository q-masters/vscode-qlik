const esLintCLI = require("eslint").CLIEngine;
const minimist  = require("minimist");
const path      = require("path");
const chalk     = require("chalk");

/**
 * run with
 *
 * node eslint-cli-reporter.js [ESLINT CONFIGURATION DATA]
 */
const args         = minimist(process.argv);
const files        = args._.slice(2);

chalk.bold.greenBright("starting eslint");

/**
 * running eslint
 */
const formatter = esLintCLI.getFormatter();
const esLint = new esLintCLI({
    configFile: path.resolve(process.cwd(), `.eslintrc.json`),
});

const report = esLint.executeOnFiles(files);

if (!report.errorCount) {
    report.results.forEach((result) => {
        if (result.warningCount) {
            const filePath = result.filePath;
            console.log(chalk.yellow(`Warning: ${filePath}`));
            console.log(chalk.yellow(result.messages));
        }
    });

    console.log(chalk.bold.greenBright(`All files passes linting`));
    console.log(chalk.greenBright(`Files processed: ${report.results.length}`));
    process.exit(0);
} else {
    process.stdout.write(formatter(report.results));
    process.exit(1);
}
