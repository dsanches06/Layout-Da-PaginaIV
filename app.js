var http = require('http');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');
var options = {
    "default": {
        "folder": "www",
        "document": "index.html",
        "port": 8081,
        "favicon": ""
    },
    "extensions": {
        "txt": "text/plain",
        "htm": "text/html",
        "html": "text/html",
        "js": "application/javascript",
        "json": "application/json",
        "css": "text/css",
        "gif": "image/gif",
        "jpg": "image/jpg",
        "png": "image/png",
        "ico": "image/x-icon"
    }
};

/* global __dirname, process */
function logOnDev(message) {
    if (process.env.NODE_ENV === "development") {
        console.log(message);
    }
}

function router(request) {
    var pathname = url.parse(querystring.unescape(request.url)).pathname;
    switch (pathname) {
        case "/": pathname += options.default.document;
            break;
        case "/favicon.ico": pathname = options.default.favicon;
            break;
        default:
            break;
    }
    return pathname
        ? path.join(__dirname, options.default.folder, pathname)
        : null;
}

function mimeType(pathname) {
    var extension = path.extname(pathname);
    if (extension.charAt(0) === ".") {
        extension = extension.substr(1);
    }
    return options.extensions[extension];
}

http.createServer(function (request, response) {
    logOnDev(`Request for ${request.url} received.`);
    var pathname = router(request);
    if (pathname) {
        fs.readFile(pathname, function (err, data) {
            if (err) {
                logOnDev(err);
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.write("HTTP Status: 404 : NOT FOUND");
            } else {
                response.writeHead(200, { 'Content-Type': mimeType(pathname) });
                response.write(data);
            }
            response.end();
        });
    }
}).listen(options.default.port);

logOnDev(`Server running at http://localhost:${options.default.port}/`);