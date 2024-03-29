/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var id = 2;
var messages = [
  // {roomname: 'lobby', username: 'OptimusPrime', text: 'I am some dummy text', objectId: 1}
];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  var statusCode;
  var resObj = {results: messages};
  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.

  if (request.method === 'GET' && request.url === '/classes/messages') {
    statusCode = 200;
  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    statusCode = 201;
    var body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      // console.log('this is body', body);
      // console.log('type of body', typeof body);
      body = JSON.parse(body);
      
      body.objectId = id;
      id += 1;
      messages.push(body);
      
    });
  } else if (request.method === 'OPTIONS') {
    statusCode = 200;


  } else {
    statusCode = 404;
  }

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  
  response.end(JSON.stringify(resObj));
};

exports.requestHandler = requestHandler;