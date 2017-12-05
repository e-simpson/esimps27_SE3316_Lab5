//======= API IMPORTS =================
var express = require('express');
var app = express();
var cors = require('cors');
cors({ credentials: true, origin: true });
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken")
//=====================================


//======= APP CONNECTIONS =============
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/user', { useMongoClient: true })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
//=====================================


//======= MODEL IMPORTS ===============
var User = require("./models/user")
var Collection = require("./models/collection")
var Policy = require("./models/policy")
var DMCA = require("./models/dmca")
var Report = require("./models/report")
//=====================================


//======= FUNCTIONS ===================

//function to take an email address, generate a token for it, append it to the api url, and send it to the email address so it can be verified
//using third party api: nodemailer
var sendVerificationEmail = function(email, token) {
    console.log("[EMAILING] " + email + " for verification..")
    var link = "https://esimps27-lab-5-esimps27.c9users.io:8081/api/verify/" + token;
    nodemailer.createTestAccount((err, account) => {
        if (err) { return console.log(err); }

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
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
            html: '<h1 style="font-size:4em;">Welcome! </h1>' +
                '<a href=' + link + ' style="color: #009dff; font-size:2em; text-align: center; margin: auto;">Click here to verify your email</a>' +
                '<br><br><h1 style = "color: #bababa; font-size: 2.2em; padding-top: 30px; font-family: sans-serif; float: left;">NASA Gallery</h1>',
        };

        transporter.sendMail(mail, (error, info) => {
            if (error) { return console.log(error); }
            console.log('[EMAIL SENT] ', info.messageId);
        });
    });
};

//wraps some message in nice html and styling so it may display nicely (for email verification emails)
var wrapHtmlServerResponse = function(message) {
    return ('<h1 style="font-family: sans-serif; font-size:2em; text-align: center; padding-top: 100px; margin: auto;">' + message + '</h1>');
}
//=====================================




//======= USER ROUTES =================

var router = express.Router();          //router set up with express


//user route, used to post a new user registration
//get was used in testing
//delete was used in testing
router.route('/user')
    .post(function(req, res) {
        User.find({ email: req.body.email }, function(err, users) {
            if (err) { return console.log(err); }
            if (users.length > 0) { res.json({ "message": "Sorry, an account with that email already exists." }); return; }

            var user = new User();
            user.email = req.body.email;
            user.activated = false;
            user.name = req.body.name;
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                if (err) { res.send(err); }
                user.password = hash;
                user.save(function(err) {
                    if (err) { res.send(err); }
                    res.json({ "message": "An email has been sent to " + user.email + ". Please verify your account.", "code": 200, "function": "newAccount" })
                    console.log('[NEW USER] ' + user.email + ', unhashedpass: ' + req.body.password);

                    var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user.email }, 'tokenmaster9000');
                    sendVerificationEmail(user.email, token);
                });
            });
        });
    });
    // .get(function(req, res) {
    //     User.find(function(err, users) {
    //         console.log('[SENDING] ' + users.length + ' users..');
    //         if (err) {
    //             console.log("error: " + err);
    //             res.send(err);
    //         }
    //         res.send(users);
    //     });
    // })
// .delete(function(req, res) {
//     User.remove({}, function(err) {
//         if (err) { console.log(err); }
//         else { res.json({ "message": "success" }); }
//     });
// });


//verify route, with token appened, get request will verify the token using jwt, then send the success or fail response
//used for email verification
//using third-party api: JWT
router.route('/verify/:token')
    .get(function(req, res) {
        try {
            jwt.verify(req.params.token, 'tokenmaster9000', function(err, decoded) {
                if (err) { return console.log(err); }
                User.findOne({ email: decoded.data }, function(err, user) {
                    if (err) { return console.log(err); }
                    if (!user) { res.end(wrapHtmlServerResponse('No account with that email exists. \nWhat are you doing here?\n:o')); return; }
                    if (user.activated == true) { res.end(wrapHtmlServerResponse('Hmm.. ' + user.email + ' has already been verified.')); return; };
                    user.activated = true;
                    user.save();
                    console.log("[VERIFICATION] " + user.email + " has verified by token..");
                    res.end(wrapHtmlServerResponse('Thanks ' + user.email + '! You have been verified.'));
                });
            });
        }
        catch (err) {
            res.json({ "message": "token fail" })
        }
    })  


///login route, takes in a user name and email (login process)
//sends back a success, and a token to be stored at the client for later authentication
//using third-party api: JWT
router.route('/login')
    .post(function(req, res) {
        console.log("[LOGIN ATTEMPT] email: " + req.body.email + ", pass: " + req.body.password);
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) { return console.log(err); }
            if (!user) { res.json({ "message": "Invalid email. Please try again." }); return; }
            if (user.activated == false) {
                res.json({ "message": "Unverified email. Sending another verification email to " + req.body.email + "." });

                var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user.email }, 'tokenmaster9000');
                sendVerificationEmail(user.email, token);
                return;
            };

            bcrypt.compare(req.body.password, user.password, function(err, success) {
                if (err) { res.send(err); }
                if (success) {
                    var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user.email }, 'tokenmaster9000');
                    res.json({ "message": "Sign in success.", "code": 200, "function": "login", "token": token });
                    console.log("[LOGIN SUCCESS] email: " + req.body.email + ", pass: " + req.body.password);
                }
                else { res.json({ "message": "Incorrect password." }); }
            });
        });
    });


//auth route, takes a jwt token
//attempts to authenticate it and then sends back the associated user email if it is authenticated
//using third-party api: JWT
router.route('/auth')
    .post(function(req, res) {
        try {
            jwt.verify(req.body.token, 'tokenmaster9000', function(err, decoded) {
                if (err) { return res.send(err); }
                User.findOne({ email: decoded.data }, function(err, user) {
                    console.log("[AUTH SUCCESS] email: " + user.email);
                    if (err) { return res.send(err); }
                    if (!user) { res.json({ "message": "Invalid email. Please try again." }); return; }
                    res.json({ "message": "success", "code": 200, "function": "auth", "email": user.email, "name": user.name });
                });
            });
        }
        catch (err) {
            if (err) { return res.send(err); }
        }
    });


//collection route
//get returns all collections in the mongoDB
//post takes new collection details, creates a new collection and saves it to the mongoDB
router.route('/collection')
    .get(function(req, res) {
        Collection.find(function(err, collections) {
            console.log('[SENDING] ' + collections.length + ' image collections..');
            if (err) {
                console.log("error: " + err);
                res.send(err);
            }
            res.send(collections);
        });
    })
    .post(function(req, res) {
        var collection = new Collection();
        collection.owner = req.body.owner;
        collection.name = req.body.name;
        collection.access = req.body.access;
        if (req.body.images) { collection.images = JSON.parse(req.body.images); }
        if (req.body.ratings) { collection.ratings = JSON.parse(req.body.ratings); }
        if (req.body.totalrate) { collection.totalrate = req.body.totalrate; }
        if (req.body.nrates) { collection.nrates = req.body.nrates; }
        collection.desc = req.body.desc;
        collection.save(function(err) {
            if (err) { res.send(err); }
            res.json({ "message": "success", "function": "newCollection", "code": 200 })
            console.log('[NEW COLLECTION] ' + collection.name + " by " + collection.owner);
        });
    });
    // .delete(function(req, res) {
    //     Collection.remove({}, function(err) {
    //         if (err) { console.log(err); }
    //         else { res.json({ "message": "success" }); }
    //     });
    // });


//collection/owned route
//post takes a user email and returns all the collections that they have created
//used to display only a user's collections
router.route('/collection/owned')
    .post(function(req, res) {
        Collection.find({ owner: req.body.owner }, function(err, collections) {
            console.log('[SENDING OWNED] ' + req.body.owner + " " + collections.length + ' image collections..');
            if (err) {
                console.log("error: " + err);
                res.send(err);
            }
            res.send(collections);
        });
    });


//collection/editcollection route
//post takes a collectionID and will update the collection's details if it is passed any new ones to overwrite them with
//delete takes a collection ID and will delete the associated collection in the mongoDB
router.route('/collection/editcollection')
    .post(function(req, res) {
        Collection.findOne({ _id: req.body.id }, function(err, collection) {
            if (err) { res.send(err); return; }
            if (!collection) { res.json({ "message": "Invalid collection" }); return; }

            if (req.body.name != "") { collection.name = req.body.name; }
            if (req.body.desc != "") { collection.desc = req.body.desc; }
            if (req.body.access != "") { collection.access = req.body.access; }

            collection.save(function(err) {
                if (err) {
                    res.send(err);
                    console.log(err);
                    return;
                }
                res.json({ "message": "success.", "code": 200, "function": "edit" });
                console.log('[EDITED COLLECTION] ' + collection._id + " by " + collection.owner);
            });
        });
    })
    .delete(function(req, res) {
        Collection.remove({ _id: req.body["id"] }, function(err) {
            if (err) { res.send(err); return; }
            res.json({ "message": "success.", "code": 200, "function": "delete" });
            console.log('[DELETED COLLECTION] ' + req.body["id"]);
        });
    });


//collection/editimages route
//post takes in an image link and a collection ID, it will add the link to the collection's images array if it finds a collection with the same ID
//delete takes a collection id and a link, it will delete the link from the found collection's images array
router.route('/collection/editimages')
    .post(function(req, res) {
        Collection.findOne({ _id: req.body.id }, function(err, collection) {
            if (err) { res.send(err); return; }
            if (!collection) { res.json({ "message": "Invalid collection" }); return; }

            collection.images.push(req.body.link);

            collection.save(function(err) {
                if (err) {
                    res.send(err);
                    console.log(err);
                    return;
                }
                res.json({ "message": "success.", "code": 200, "function": "addImage", "name": collection.name });
                console.log('[ADDED IMAGE TO COLLECTION] ' + req.body.link + collection._id + " by " + collection.owner);
            });
        });
    })
    .delete(function(req, res) {
        Collection.findOne({ _id: req.body["id"] }, function(err, collection) {
            if (err) { res.send(err); return; }
            if (!collection) { res.json({ "message": "Invalid collection" }); return; }

            collection.images.pullOne(req.body["link"]);

            collection.save(function(err) {
                if (err) {
                    res.send(err);
                    console.log(err);
                    return;
                }
                res.json({ "message": "success.", "code": 200, "function": "removeImage" });
                console.log('[REMOVED IMAGE FROM COLLECTION] ' + collection._id + " by " + collection.owner);
            });
        });
    });


//rate route
//takes in a collection id, a rating, and the rater's email, it will save this rating in the collection's ratings
//it will also re-calculate the collection's ratings and save them to the collection
router.route('/rate')
    .post(function(req, res) {
        Collection.findOne({ _id: req.body.id }, function(err, collection) {
            if (err) { res.send(err); return; }
            if (!collection) { res.json({ "message": "Invalid collection" }); return; }

            for (var i = 0; i < collection.ratings.length; i++) {
                if (collection.ratings[i].email == req.body.email) {
                    collection.ratings.splice(i, 1);
                    break;
                }
            }
            collection.ratings.push({ email: req.body.email, rating: parseInt(req.body.rating) });

            var total = 0;
            for (var i = 0; i < collection.ratings.length; i++) {
                total = total + collection.ratings[i].rating;
            }

            collection.nrates = collection.ratings.length;
            collection.totalrate = total;
            collection.save(function(err) {
                if (err) {
                    res.send(err);
                    console.log(err);
                    return;
                }
                res.json({ "message": "success.", "code": 200, "function": "rate" });
                console.log('[NEW RATING] ' + req.body.rating + " by " + req.body.email);
            });

        });
    });


//policy route
//post takes in a new security and privacy message and saves them to the policy DB
//get returns the security and privacy messages to the client
router.route('/policy')
    .post(function(req, res) {
        Policy.remove({}, function(err) {
            if (err) { console.log(err); }
        });

        var policy = new Policy();

        policy.security = req.body.security;
        policy.privacy = req.body.privacy;
        policy.save(function(err) {
            if (err) {
                res.send(err);
                console.log(err);
                return;
            }
            res.json({ "message": "success", "code": 200, "function": "policyChange" });
            console.log('[WRITING POLICY]');
        });
    })
    .get(function(req, res) {
        Policy.find(function(err, policy) {
            console.log('[SENDING POLICY]');
            if (err) {
                console.log("error: " + err);
                res.send(err);
            }


            res.send(policy);
        });
    });


//dmca route
//post takes in a new dmca and takedown messages and saves them to the dmca DB
//get returns the dmca and takedown messages to the client
router.route('/dmca')
    .post(function(req, res) {
        DMCA.remove({}, function(err) {
            if (err) { console.log(err); }
        });

        var dmca = new DMCA();

        dmca.dmca = req.body.dmca;
        dmca.takedown = req.body.takedown;
        dmca.save(function(err) {
            if (err) {
                res.send(err);
                console.log(err);
                return;
            }
            res.json({ "message": "success", "code": 200, "function": "dmcaChange" });
            console.log('[WRITING DMCA]');
        });
    })
    .get(function(req, res) {
        DMCA.find(function(err, dmca) {
            console.log('[SENDING DMCA]');
            if (err) {
                console.log("error: " + err);
                res.send(err);
            }


            res.send(dmca);
        });
    });



//report route
//post takes report parameters and a collection ID, and saves the report to the report DB, it will also look for and fla/unflag a corresponding collection
//delete will delete all the reports in the reportDB (only can be done by admin)
router.route('/report')
    .post(function(req, res) {
        if (req.body.id) {
            Collection.findOne({ _id: req.body.id }, function(err, collection) {
                if (err) { res.send(err); return; }

                collection.flagged = req.body.flagged;

                collection.save(function(err) {
                    if (err) { res.send(err);
                        console.log(err); return; }
                    if (collection.flagged == true) {
                        console.log('[COLLECTION FLAGGED] ' + collection._id + " by " + collection.owner);
                    }
                    else {
                        console.log('[COLLECTION UNFLAGGED] ' + collection._id + " by " + collection.owner);
                    }
                });
            });
        }

        var report = new Report();
        report.type = req.body.type;
        report.offender = req.body.name + req.body.id;
        report.reporter = req.body.email;
        report.desc = req.body.desc;
        var d = new Date();
        report.date = d.toString();
        report.save(function(err) {
            if (err) {
                res.send(err);
                console.log(err);
                return;
            }
            res.json({ "message": "success", "code": 200, "function": "report" });
            console.log('[NEW REPORT TAKEN]');
        });
    })
    .get(function(req, res) {
        Report.find(function(err, report) {
            console.log('[SENDING REPORTS] reports: ' + report.length);
            if (err) {
                console.log("error: " + err);
                res.send(err);
            }
            res.send(report);
        });
    })
    .delete(function(req, res) {
        Report.remove({}, function(err) {
            if (err) { console.log(err); return; }
            console.log('[DELETED ALL REPORTS]');
            res.json({ "message": "success" });
        });
    });






//applys router middleware for testing purposes
router.use(function(req, res, next) {
    console.log('Something is happening');
    next();
});


//connects the app to the router, using path 'api'
app.use('/api', router);







//assigns the port and starts the server
var port = 8081;
app.listen(port);
console.log('[INITIALIZED] running on port ' + port + '..')
