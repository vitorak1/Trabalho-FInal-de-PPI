
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(3000, ()=> console.log('Rodando na porta 3000'));
