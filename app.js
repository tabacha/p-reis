var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('./lib/passport-reis'),
    i18n = require('i18n'),
    flash = require('connect-flash'),
    session = require('express-session'),
    callsRouter = require('./lib/calls'),
    PORT_LISTENER = 3000;




i18n.configure({
    locales:['en', 'de'],
    cookie: 'yourcookiename',
    defaultLocale: 'en',
    directory: __dirname + '/locales'
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


var app = express();

app.set('views', './views');
app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use( bodyParser.json() );
app.use(session({ secret: 'dassd324932689kkkkk', 
                  resave:false,
                  saveUninitialized:false
                }));
// app.use(express.session());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
//app.use(express.cookieParser());
app.use(i18n.init); // Should always before app.route
app.get('/welcome', ensureAuthenticated, function(req, res) {
    res.render('welcome', {
        title: req.__('p-reis welcome'),
        user:req.user.username,
        email:req.user.email,
    });

});
app.get('/',  function(req, res) {
  res.redirect('/calls');
});
app.get('/login', function(req, res) {
    msg="";
    err=req.flash('error');
    if (err != undefined ) {
        msg=err;
        if (err=='1') {
            msg=req.__('Invalid user !');
        } 
        if (err=='2') {
            msg=req.__('Invalid password!');
        }

    }

    res.render('login', {
        title: req.__('p-reis login page'),
        message: msg
    });
});
app.post('/login', passport.authenticate('local', { failureFlash: true,
                                                    successRedirect: '/',
                                                    failureRedirect: '/login' }));
app.get('/logout', function(req, res){
  req.logout();
  res.render('logout', {
        menu: 'logout',
        title: req.__('Logged out'),
        user:req.user,
  });
});
express.static.mime.define({'text/css': ['css']});
app.use('/css',
        express.static(__dirname + '/css'));
app.use('/components',
        express.static(__dirname + '/bower_components'));
// ----------------------------------------------------------------------------
app.all('*', ensureAuthenticated);
app.use('/calls',callsRouter);
console.log('I am listening to this port: http://localhost:%s', PORT_LISTENER);
app.listen(PORT_LISTENER);