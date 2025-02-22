const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const image = require('./controllers/image.js');
const profile = require('./controllers/profile.js');

const db= knex({
    client: 'pg',
    connection:{
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB
    }
});

db.select('*').from('users');

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req,res) =>{ res.send('Success'); });
app.post('/signin',(req, res) =>{signin.handleSignIn(req,res,db,bcrypt)});
app.post('/register', (req,res) => {register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) =>{profile.handleProfileGET(req, res, db)});
app.put('/image', (req,res) => { image.handleImage(req, res, db)});
app.post('/imageurl', (req,res) => { image.handleAPICall(req, res)});

app.listen(process.env.PORT || 3000, () =>{
    console.log(`App is running on ${process.env.PORT}`);
});