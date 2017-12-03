//======= API IMPORTS =================
var express = require('express');
var app = express();
var cors = require('cors'); cors({credentials: true, origin: true});
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken")
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
var Collection = require("./models/collection")
//=====================================


//======= FUNCTIONS ===================
var sendVerificationEmail = function(email, token) {
    console.log("[EMAILING] " + email + " for verification..")
    var link = "https://esimps27-lab-5-esimps27.c9users.io:8081/api/verify/" + token;
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
            html: '<h1 style="font-size:4em;">Welcome! </h1>'
            + '<a href=' + link + ' style="color: #009dff; font-size:2em; text-align: center; margin: auto;">Click here to verify your email</a>'
            + '<br><br><h1 style = "color: #bababa; font-size: 2.2em; padding-top: 30px; font-family: sans-serif; float: left;">NASA Gallery</h1>',
        };
    
        transporter.sendMail(mail, (error, info) => {
            if (error) {return console.log(error);}
            console.log('[EMAIL SENT] ', info.messageId);
        });
    });
};

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
        if (users.length > 0) {res.json({"message": "Sorry, an account with that email already exists."}); return;}
        
        var user = new User();            
        user.email = req.body.email; 
        user.activated = false;
        user.name = req.body.name;
        user.token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user.email}, 'tokenmaster9000');
        bcrypt.hash(req.body.password, 10, function(err, hash){
            if (err){ res.send(err);}
            user.password = hash;
            user.save(function(err) {
                if (err){ res.send(err);}
                res.json({"message": "An email has been sent to " + user.email + ". Please verify your account.", "code": 200, "function": "newAccount"})
                console.log('[NEW USER] ' + user.email + ', unhashedpass: ' + req.body.password);
                sendVerificationEmail(user.email, user.token);
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
            else { res.json({"message": "success"}); }
        }
    );
});

router.get('/verify/:token', function(req,res){
    User.findOne({token: req.params.token}, function(err, user){
        if (err) { return console.log(err);} 
        if (!user) { res.end(wrapHtmlServerResponse('No account with that email exists. \nWhat are you doing here?\n:o')); return; }
        if (user.activated == true) { res.end(wrapHtmlServerResponse('Hmm.. ' + user.email + ' has already been verified.')); return;};
        user.activated = true;
        user.save();
        console.log("[VERIFICATION] " + user.email + " has verified by token..");
        res.end(wrapHtmlServerResponse('Thanks ' + user.email + '! You have been verified.'));
    });
})

router.post('/login', function(req,res){
    console.log("[LOGIN ATTEMPT] email: " + req.body.email + ", pass: " + req.body.password);
    User.findOne({email: req.body.email}, function(err, user){
        if (err) { return console.log(err);} 
        if (!user) { res.json({"message": "Invalid email. Please try again."}); return; }
        if (user.activated == false) { 
            res.json({"message": "Unverified email. Sending another verification email to " + req.body.email + "."}); 
            sendVerificationEmail(user.email, user.token); 
            return;
        };
        
        bcrypt.compare(req.body.password, user.password, function(err, success) {
            if (err){ res.send(err);}
            if (success) {
                user.token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user.email}, 'tokenmaster9000');
                user.save();
                res.json({"message": "Sign in success.", "code": 200, "function": "login", "token": user.token});
                console.log("[LOGIN SUCCESS] email: " + req.body.email + ", pass: " + req.body.password);
            }
            else {res.json({"message": "Incorrect password."});}
        });
    });
});

router.post('/auth', function(req,res){
    console.log("[AUTH ATTEMPT] token: " + req.body.token);
    User.findOne({token: req.body.token}, function(err, user){
        if (err) { return console.log(err);} 
        if (!user) { res.json({"message": "Invalid email. Please try again."}); return; }
        res.json({"message": "success", "code": 200, "function": "login", "email": user.email, "name": user.name});
    });
});

router.route('/image')
.get(function(req, res) {
    Collection.find(function(err, images) {
        console.log('[SENDING] ' + images.length + ' image collections..');
        if (err) { console.log("error: " + err); res.send(err);}
        res.send(images);
    });
})
.post(function(req,res){
    var collection = new Collection();            
        collection.owner = req.body.owner; 
        collection.name= req.body.name;
        collection.access = req.body.access;
        collection.images = JSON.parse(req.body.images);
        collection.totalrate = req.body.totalrate;
        collection.nrates = req.body.nrates;
        collection.desc = req.body.desc;
        collection.save(function(err) {
            if (err){ res.send(err);}
            res.json({"message": "success"})
            console.log('[NEW COLLECTION] ' + collection.name + " by " + collection.owner);
        });
})
.delete(function(req, res) {
    Collection.remove({}, function(err) {
            if (err) { console.log(err);} 
            else { res.json({"message": "success"}); }
        }
    );
});


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


app.use('/api', router);








var port = 8081;
app.listen(port);
console.log('[INITIALIZED] running on port ' + port + '..')