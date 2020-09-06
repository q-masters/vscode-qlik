"use strict";
/**
 * github action which parses the gitlog for convential commit messages
 * and returns a new version since last tag.
 *
 * if no tag exists it starts with 0.0.0
 *
 * @see https://www.conventionalcommits.org/en/v1.0.0-beta.2/
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const os_1 = require("os");
class ChangelogMarkDown {
    constructor() {
        this.conventialCommitPattern = /^([^\s]+)\s(fix|feat|break)(?=(?:\(.*?\))?:\s):\s(.*)$/;
        this.githubUrl = this.getCommitUri();
    }
    run() {
        const log = this.readGitLog();
        const data = this.readConventionalCommitMessages(log);
        return this.generateChangeLogMarkDown(data);
    }
    /**
     * parse git log for conventional commit messages
     */
    readConventionalCommitMessages(log) {
        const messages = log.split(os_1.EOL);
        const results = {
            break: [],
            fix: [],
            feat: []
        };
        messages.forEach(message => {
            const result = message.match(this.conventialCommitPattern);
            if (result) {
                const data = {
                    commitId: RegExp.$1,
                    message: RegExp.$3,
                    type: RegExp.$2
                };
                switch (RegExp.$2) {
                    case 'fix':
                        results.fix.push(data);
                        break;
                    case 'feat':
                        results.feat.push(data);
                        break;
                    case 'break':
                        results.break.push(data);
                        break;
                }
            }
        });
        return results;
    }
    /**
     * get git log since last tag
     */
    readGitLog() {
        let lastTag = "0.0.0";
        let gitLog = "";
        const hasTags = child_process_1.execSync(`git tag`).length;
        if (hasTags) {
            lastTag = child_process_1.execSync(`git describe --tags --abbrev=0`).toString().trim();
            gitLog = child_process_1.execSync(`git log ${lastTag}..HEAD --pretty=oneline`).toString();
        }
        else {
            gitLog = child_process_1.execSync(`git log --pretty=oneline`).toString();
        }
        return gitLog;
    }
    /**
     * generate changelog as markdown
     */
    generateChangeLogMarkDown(data) {
        let changelog = ``;
        let sections = [
            ['break', 'BREAKING_CHANGES'],
            ['feat', 'Features'],
            ['fix', 'Bug Fixes']
        ];
        do {
            const section = sections.shift();
            if (!data[section[0]].length) {
                continue;
            }
            changelog = changelog.concat(this.writeSubHeader(section[1]));
            for (let i = 0, ln = data[section[0]].length; i < ln; i++) {
                changelog = changelog.concat(this.writeChangeLogEntry(data[section[0]][i]));
            }
            changelog = changelog.concat(`${os_1.EOL}${os_1.EOL}`);
        } while (sections.length > 0);
        return changelog;
    }
    writeHeader(name) {
        return `##`;
    }
    writeSubHeader(name) {
        return `### ${name}${os_1.EOL}${os_1.EOL}`;
    }
    /**
     * write changelog entry
     */
    writeChangeLogEntry(data) {
        const commitId = data.commitId.substring(0, 7);
        return `* **${data.type}:** ${data.message} [${commitId}](${this.githubUrl}/${data.commitId})${os_1.EOL}`;
    }
    /**
     * extract github uri for commit messages
     */
    getCommitUri() {
        const remote = child_process_1.execSync('git config --get remote.origin.url').toString();
        return remote.replace(/^(?:git@[^:]+:|https:\/\/[^\/]+\/)(.*?)\.git/, "https://github.com/$1/commit").replace(os_1.EOL, '');
    }
}
const changes = new ChangelogMarkDown();
process.stdout.write(changes.run());
