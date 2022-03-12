import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import tourneys from './routes/tourneys.js';
import user from './routes/user.js';
import fs from 'fs';
import path from 'path';
import User from './schemas/user.js';

const app = express();
const __dirname = path.resolve();

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, '../client/styles')));
app.use(cors());
app.use('/tournaments', tourneys);
app.use('/user', user);

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../client/index.html');
	res.sendFile(filePath);
});

app.get('/signup', (req, res) => {
    const filePath = path.join(__dirname, '../client/signup.html');
	res.sendFile(filePath);
});

app.get('/login', (req, res) => {
	const filePath = path.join(__dirname, '../client/login.html');
	res.sendFile(filePath);
})

app.get('/tournaments', (req, res) => {
	const filePath = path.join(__dirname, '../client/tourneys.html');
	res.sendFile(filePath);
})



const db_url = 'mongodb+srv://admin:admin@cluster0.bmsy0.mongodb.net/TourneyExpressData?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;

function startServer() {
    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`);
    });
};

mongoose.connect(db_url, startServer);