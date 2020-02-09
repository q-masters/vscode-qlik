/**
 * github action which parses the gitlog for convential commit messages
 * and returns a new version since last tag.
 *
 * if no tag exists it starts with 0.0.0
 *
 * @see https://www.conventionalcommits.org/en/v1.0.0-beta.2/
 */

import { execSync } from "child_process";
import { EOL } from "os";

declare type ChangeLogEntry = {commitId: string, message: string, type: string};
declare type ChangeLogData  = { fix: ChangeLogEntry[], feat: ChangeLogEntry[], break: ChangeLogEntry[]};

class ChangelogMarkDown {

    private conventialCommitPattern = /^([^\s]+)\s(fix|feat|break)(?=(?:\(.*?\))?:\s):\s(.*)$/;

    private githubUrl: string;

    public constructor() {
        this.githubUrl = this.getCommitUri();
    }

    public run() {
        const log  = this.readGitLog();
        const data = this.readConventionalCommitMessages(log);
        return this.generateChangeLogMarkDown(data);
    }

    /**
     * parse git log for conventional commit messages
     */
    private readConventionalCommitMessages(log: string): ChangeLogData {
        const messages = log.split(EOL);
        const results: ChangeLogData  = {
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
                }

                switch (RegExp.$2) {
                    case 'fix'  : results.fix.push(data); break;
                    case 'feat' : results.feat.push(data); break;
                    case 'break': results.break.push(data); break;
                }
            }
        });

        return results;
    }

    /**
     * get git log since last tag
     */
    private readGitLog(): string {
        let lastTag = "0.0.0";
        let gitLog: string = "";

        const hasTags = execSync(`git tag`).length;
        if (hasTags) {
            lastTag = execSync(`git describe --tags --abbrev=0`).toString().trim();
            gitLog  = execSync(`git log ${lastTag}..HEAD --pretty=oneline`).toString();
        } else {
            gitLog = execSync(`git log --pretty=oneline`).toString();
        }
        return gitLog;
    }

    /** 
     * generate changelog as markdown
     */
    private generateChangeLogMarkDown(data: ChangeLogData) {
        let changelog = ``;
        let sections  = [
            ['break', 'BREAKING_CHANGES'],
            ['feat', 'Features'],
            ['fix', 'Bug Fixes']
        ];

        do {
            const section = sections.shift() as string[];

            if (!data[section[0]].length) {
                continue;
            }

            changelog = changelog.concat(this.writeSubHeader(section[1]));

            for(let i = 0, ln = data[section[0]].length; i < ln; i++) {
                changelog = changelog.concat(this.writeChangeLogEntry(data[section[0]][i]));
            }

            changelog = changelog.concat(`${EOL}${EOL}`);

        } while(sections.length > 0);

        return changelog;
    }

    private writeHeader(name: string): string {
        return `##`;
    }

    private writeSubHeader(name: string): string {
        return `### ${name}${EOL}${EOL}`;
    }

    /**
     * write changelog entry
     */
    private writeChangeLogEntry(data: ChangeLogEntry): string {
        const commitId = data.commitId.substring(0, 7);
        return `* **${data.type}:** ${data.message} [${commitId}](${this.githubUrl}/${data.commitId})${EOL}`;
    }

    /**
     * extract github uri for commit messages
     */
    private getCommitUri(): string {
        const remote = execSync('git config --get remote.origin.url').toString(); 
        return remote.replace(/^(?:git@[^:]+:|https:\/\/[^\/]+\/)(.*?)\.git/, "https://github.com/$1/commit").replace(EOL, '');
    }
}

const changes = new ChangelogMarkDown();
process.stdout.write(changes.run());
