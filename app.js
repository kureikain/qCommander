
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , https = require('https')
  , fs = require('fs');

//var app = express();
app = express(); //monkey code for now ;). it;s bad I know

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('root_url', '//127.0.0.1');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//https
//should comment out when running on heroku.
//Need to implement ssl on nginx level and use it as a reverse cache proxy.
var options = {
  key: fs.readFileSync('/etc/nginx/ssl/server.key'),
  cert: fs.readFileSync('/etc/nginx/ssl/server.crt')
};
https.createServer(options, app).listen(443, function(){
  console.log('Express server listening on port 443');
});