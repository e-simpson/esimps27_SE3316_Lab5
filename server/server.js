//======= API IMPORTS =================
var express = require('express');
var app = express();
var cors = require('cors'); cors({credentials: true, origin: true});
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
//=====================================


//======= APP CONNECTIONS =============
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/user', {useMongoClient:true})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
//=====================================


//======= MODEL IMPORTS ===============
var User = require("./models/user")
//=====================================


//======= FUNCTIONS ===================
var sendVerificationEmail = function(email) {
    console.log("[EMAILING] " + email + " for verification..")
    var link = "https://esimps27-lab-5-esimps27.c9users.io:8081/api/verify/" + email;
    nodemailer.createTestAccount((err, account) => {
        if (err) {return console.log(err);}
        
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'networkmaster8080@gmail.com', 
                pass: 'ilovenetworking'
            }
        });
    
        var mail = {
            from: '"Nasa Gallery" <networkmaster8080@gmail.com>',
            to: email,
            subject: 'Verify your email!',
            // text: 'Hello! \n https://esimps27-lab-5-esimps27.c9users.io/api/verify/',
            html: '<h1 style="font-size:6em;">Welcome,</h1> <a href=' + link + ' style="color: #009dff; font-size:2em; text-align: center; margin: auto;">Complete verification</a>'
        };
    
        transporter.sendMail(mail, (error, info) => {
            if (error) {return console.log(error);}
            console.log('[EMAIL SENT] ', info.messageId);
        });
    });
};

var checkUserExistence = function(passedEmail, callback){
    return User.find({email: passedEmail}, function(err, users){
        if (err) { return console.log(err);} 
        if (users.length > 0) {return true;}
        console.log(users.length)
        return false;
    });
}

var activateEmail = function(passedEmail){
    var r = -2;
    User.findOne({email: passedEmail}, function(err, user){
        if (err) { return console.log(err);} 
        if (checkUserExistence(passedEmail)){r = -2; return;}
        if (user.activated == true) {r = -1; return;};
        user.activated = true;
        user.save();
        r = 1;
    });
    return r;
}

var createUser = function(email, password){
    var success = false;
    var user = new User();            
    user.email = email; 
    user.activated = false;
    bcrypt.hash(password, 10, function(err, hash){
        if (err) { return console.log(err);} 
        user.password = hash;
        user.save(function(err) {
            if (err) { return console.log(err);} 
            console.log('[NEW USER] ' + user.email + ', unhashedpass: ' + password);
            sendVerificationEmail(user.email);
        });
    });
    return false;
}

var wrapHtmlServerResponse = function(message){
    return ('<h1 style="font-family: sans-serif; font-size:2em; text-align: center; padding-top: 100px; margin: auto;">' + message + '</h1>');
}
//=====================================




//======= USER ROUTES =================
var router = express.Router();
router.route('/user')
.post(function(req, res) {
    User.find({email: req.body.email}, function(err, users){
        if (err) { return console.log(err);} 
        if (users.length > 0) {res.json({"msg": "Sorry, an account with that email already exists."}); return;}
        
        var user = new User();            
        user.email = req.body.email; 
        user.activated = false;
        bcrypt.hash(req.body.password, 10, function(err, hash){
            if (err){ res.send(err);}
            user.password = hash;
            user.save(function(err) {
                if (err){ res.send(err);}
                res.json({"msg": "success"})
                console.log('[NEW USER] ' + user.email + ', unhashedpass: ' + req.body.password);
                sendVerificationEmail(user.email);
            });
        });
    });
})
.get(function(req, res) {
    User.find(function(err, users) {
        console.log('[SENDING] ' + users.length + ' users..');
        if (err) { console.log("error: " + err); res.send(err);}
        res.send(users);
    });
})
.delete(function(req, res) {
    User.remove({}, function(err) {
            if (err) { console.log(err);} 
            else { res.end('success');}
        }
    );
});

router.get('/verify/:email', function(req,res){
    User.findOne({email: req.params.email}, function(err, user){
        if (err) { return console.log(err);} 
        if (!user) { res.end(wrapHtmlServerResponse('No account with email ' + req.params.email + ' exists. \nWhat are you doing here?\n:o')); return; }
        if (user.activated == true) { res.end(wrapHtmlServerResponse('Hmm.. ' + req.params.email + ' has already been verified.')); return;};
        user.activated = true;
        user.save();
        console.log("[VERIFICATION] " + req.params.email + " has verified by email..");
        res.end(wrapHtmlServerResponse('Thanks ' + req.params.email + '! You have been verified.'));
    });
})



// router.post('/login', function(req, res, next) {
//   Passport.authenticate('local', function(err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.status(401).json({
//         err: info
//       });
//     }
//     req.logIn(user, function(err) {
//       if (err) {
//         return res.status(500).json({
//           err: 'Could not log in user'
//         });
//       }
//       res.status(200).json({
//         status: 'Login successful!'
//       });
//     });
//   })(req, res, next);
// });

// router.get('/logout', function(req, res) {
//   req.logout();
//   res.status(200).json({
//     status: 'Bye!'
//   });
// });
//=====================================



router.use(function(req, res, next) {
    console.log('Something is happening');
    next();
});


router.get('/', function(req, res) {
    res.json({ message: 'Hello World' });
});

app.use('/api', router);














var port = 8081;
app.listen(port);
console.log('[INITIALIZED] running on port ' + port + '..')