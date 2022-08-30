import express from 'express';
import session from 'express-session';
import mongoSession from 'connect-mongodb-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import tourneys from './routes/tourneys.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import User from './schemas/user.js';
import Tourney from './schemas/tourneys.js'
import { Recoverable } from 'repl';

//---------- Global vars -----------
const app = express();
const __dirname = path.resolve();
const MongoDBSession = mongoSession(session);


//---------- Middleware -----------
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, '../client/styles')));
app.use(cors());
app.use('/tournaments', tourneys);


const db_uri = 'mongodb+srv://admin:admin123@cluster0.bmsy0.mongodb.net/TourneyExpressData?retryWrites=true&w=majority';
const PORT = process.env.PORT || 8000;

function startServer() {
    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`);
    });
};

mongoose.connect(db_uri, startServer);

const store = new MongoDBSession({
	uri: db_uri,
	collection: 'sessions'
})

app.use(session({
	secret: 'Omnipong sucks',
	cookie: {maxAge: 600000},
	resave: false,
	saveUninitialized: false,
	store: store
}))

const isAuth = (req, res, next) => {
    console.log("session: " + req.session.isAuth);
    if (req.session.isAuth) {
		next();
    } else {
        res.redirect('/login');
    }
}

const isNotAuth = (req, res, next) => {
    console.log(req.session.isAuth)
    if (!req.session.isAuth) {
		next();
    } else {
        res.redirect('/');
    }
}

//---------- Get Routes -----------
app.get('/', isAuth, (req, res) => {
    const filePath = path.join(__dirname, '../client/index.html');
	res.sendFile(filePath);
});

app.get('/signup', isNotAuth, (req, res) => {
    const filePath = path.join(__dirname, '../client/signup.html');
	res.sendFile(filePath);
});

app.get('/login', isNotAuth, (req, res) => {
    req.session.isAuth = false;
	const filePath = path.join(__dirname, '../client/login.html');
	res.sendFile(filePath);
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            throw err;
        }

        res.redirect('/login');
    })
})

app.get('/tournaments', isAuth, (req, res) => {
	const filePath = path.join(__dirname, '../client/tourney_list.html');
	res.sendFile(filePath);
})

app.get('/tournaments/create', isAuth, (req, res) => {
	const filePath = path.join(__dirname, '../client/new_tourney.html');
	res.sendFile(filePath);
})

app.get('/dashboard', isAuth, (req, res) => {
	const filePath = path.join(__dirname, '../client/dashboard.html');
	res.sendFile(filePath);
})

app.get('/dashboard/info', isAuth, (req, res) => {
    const user = req.session.user;
	res.json(user);
})

//---------- Post Routes -----------
app.post('/signup', (req, res) => {
    const user = new User(req.body)
        , salt = crypto.randomBytes(128).toString('base64')
        , password = req.body.password;
    crypto.pbkdf2(password, salt, 10000, 256, 'sha256', (err, hash) => {
        if (err) {
            return res.send('error');
        }
        user.password = hash.toString('base64');
        user.salt = salt;
        try {
            user.save();
			res.json({msg: 'Success'});
        } catch (e) {
            console.log(e.message);
        }
        
    });
})

app.post('/login', (req, res) => {
    console.log("Called");
    const user = User.find({username: req.body.username}, (err, person) => {
        if (err || person.length == 0) {
			console.log(err);
            return res.json({err: 'Wrong username'});
        } 
		console.log(person[0]);
        const salt = person[0].salt, password = req.body.password;
        crypto.pbkdf2(password, salt, 10000, 256, 'sha256', (e, hash) => {
            if (e) {
				console.log(e);
                return res.send('error');
            }
            if (hash.toString('base64') == person[0].password) {
                req.session.isAuth = true;
                req.session.user = person[0];
                console.log("success");
                res.json({msg: "success"});
            } else {
                console.log("wrong pw")
                res.json({err: 'Wrong password'});
            }
        })
    })
})

// app.post('/tournaments/create', isAuth, (req, res) => {
// 	const tourney = new Tourney(req.body);
//     try {
//         tourney.save();
//         res.json({msg: 'Success'});
//     } catch (e) {
//         console.log(e.message);
//     }
// })

// app.post('/tournaments/register/:id', isAuth, (req, res) => {
//     const tourney = Tourney.findOneAndUpdate(
//         {"_id": },
//         {
//             "$push": {
//                 "players":
//             }
//         }
//     )
// })


