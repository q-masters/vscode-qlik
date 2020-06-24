const path = require("path");
const fs   = require("fs");

const webappPath = path.resolve(process.cwd(), 'dist/webview/connection');

let indexHtml  = fs.readFileSync(path.resolve(webappPath, 'index.html')).toString();

function makeInline(config, data) {
    let currentData = new Buffer.from('', 'utf-8');
    let isFlagSet = false;

    return data.replace(config.pattern, (match, script) => {
        const replacement = !isFlagSet ? '###INLINE_CONTENT###' : '';
        isFlagSet = true;

        const content = fs.readFileSync(path.resolve(webappPath, script));
        fs.unlinkSync(path.resolve(webappPath, script));

        if (config.isScript && script.indexOf('-es2015') === -1) {
            return '';
        }

        currentData = Buffer.concat([currentData, content]);
        return replacement;
    }).replace(/###INLINE_CONTENT###/, () =>  {
        return config.template.replace(/###INLINE_CONTENT###/, currentData.toString());
    });
}

[
    {
        isScript: true,
        pattern: /<script src="(.*?)".*?><\/script>/g,
        template: `<script type="module">
        ###INLINE_CONTENT###
    </script>`
    },
    {
        pattern: /<link rel="stylesheet" href="(.*?)".*?>/g,
        template: `
        <style type="text/css">
        ###INLINE_CONTENT###
    </style>`
    }
].forEach((config) => {
    indexHtml = makeInline(config, indexHtml);
});

fs.writeFileSync(path.resolve(webappPath, 'index.html'), indexHtml, {flag: "w"});
