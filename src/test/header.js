const http = require('http');
const url     = require('url');
const loginCrendentials = `hannuschkar4fa4\\qlik:qlik2020`;

const requestOptions = {
    headers: {
        'Authorization': `Basic ${Buffer.from(loginCrendentials).toString('base64')}`
    },
    host: 'windows-10-privat.shared',
    path: '/hub/'
};

http.get(requestOptions, (response) => {
    getCookie(response.headers.location);
}).on("error", () => {
    console.log("something goes wrong");
});

function getCookie(uri) {
    const parsedUrl = url.parse(uri);

    const options = {
        headers: {
            'Authorization': `Basic ${Buffer.from(loginCrendentials).toString('base64')}`
        },
        host: parsedUrl.host,
        path: parsedUrl.path,
        method: "POST"
    };

    const req = http.request(options, (res) => {
        console.log(res.headers);
    });

    req.write(JSON.stringify({
        userName: 
    }));
    req.end();
}
