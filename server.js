let http = require('http');
let fs = require('fs');
let path = require('path');
let url = require('url');
let qs = require("querystring");
let loginService = require("./services/login");
let getContent = require("./lib/GetContentType");
let flash = require('connect-flash');

global.__basedir = __dirname;

let handel = function (req, res) {
    let reqUrl = url.parse(req.url).pathname;
    let filePath = '.' + reqUrl;
    if (filePath == './')
        filePath = './index.html';

    let extname = path.extname(filePath);

    let contentType = getContent.type(extname);

    if (req.method == "GET") {
        fs.readFile(filePath, function (error, content) {
            if (error) {
                res.writeHead(404);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            } else {
                res.writeHead(200, {'Content-Type': contentType});
                res.end(content, 'utf-8');
            }
        });
    }
    else if (req.method == "POST") {
        let requestBody = '';
        req.on("readable", function () {
            while (null !== (chunk = req.read())) {
                requestBody += chunk.toString();
            }
        });
        req.on("end", function () {
            let userLogin = qs.parse(requestBody);
            let user = loginService.login(userLogin);
            if (user) {
                res.writeHead(200, {'Content-Type': 'application/json'});

                // res.write(JSON.stringify(user));
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end();
            }
        });

        // res.write("Post Method");
        // res.end();
    }

};
let server = http.createServer(handel);

server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
