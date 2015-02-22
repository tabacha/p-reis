var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    i18n = require('i18n'),
    flash = require('connect-flash'),
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    PORT_LISTENER = 3000;
console.log('I am listening to this port: http://localhost:%s', PORT_LISTENER);


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

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
          if (!user) { return done(null, false, { message: '1'});} 
          if (user.password != password) { return done(null, false, { message: '2' });}; 
        return done(null, user);
      })
    });
  }
));

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
app.get('/calls', ensureAuthenticated, function(req, res) {
    res.render('calls', {
        menu: 'calls',
        title: req.__('Calls'),
        user:req.user,
    });

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
  res.redirect('/login');
});

express.static.mime.define({'text/css': ['css']});
app.use('/css',
        express.static(__dirname + '/css'));
app.use('/components',
        express.static(__dirname + '/bower_components'));
app.listen(PORT_LISTENER);