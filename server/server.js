//======= API IMPORTS =================
var express = require('express');
var app = express();
var cors = require('cors'); cors({credentials: true, origin: true});
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
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


//======= USER ROUTES =================
var router = express.Router();
router.route('/user')
.post(function(req, res) {
    var user = new User();              
    user.username = req.body.username;
    user.email = req.body.email; 
    bcrypt.hash(req.body.password, 10, function(err, hash){
        if (err){ res.send(err);}
        user.password = hash;
        user.save(function(err) {
            if (err){ res.send(err);}
            res.json({"msg": "success"})
            console.log('NEW USER: ' + user.username + ', pass: ' + user.password + ", email: " + user.email);
        });
    });      
})
.get(function(req, res) {
    User.find(function(err, users) {
        console.log('SENDING ' + users.length + ' users!');
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

// router.post('/login', function(req, res, next) {
//   User.authenticate('local', function(err, user, info) {
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
console.log('Server is running on port ' + port)