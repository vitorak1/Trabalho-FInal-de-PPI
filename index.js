
const express = require('express');
const router = express.Router();

let equipes = [];
let jogadores = [];

function auth(req,res,next){
    if(req.session.logado) return next();
    return res.redirect('/login');
}

router.get('/login', (req,res)=> res.render('login'));
router.post('/login',(req,res)=>{
    const {usuario,senha}=req.body;
    if(usuario==='admin' && senha==='1234'){
        req.session.logado=true;
        res.cookie('ultimoAcesso', new Date().toLocaleString());
        return res.redirect('/menu');
    }
    res.render('login',{erro:'Credenciais inválidas'});
});

router.get('/logout',(req,res)=>{req.session.destroy(()=>res.redirect('/login'));});

router.get('/menu', auth, (req,res)=>{
    res.render('menu',{ultimo:req.cookies.ultimoAcesso});
});

router.get('/equipes', auth,(req,res)=> res.render('equipes',{equipes}));
router.post('/equipes', auth,(req,res)=>{
    const {nome,capitao,contato}=req.body;
    if(!nome||!capitao||!contato) return res.render('equipes',{erro:'Todos os campos são obrigatórios',equipes});
    equipes.push({nome,capitao,contato});
    res.render('equipes',{equipes});
});

router.get('/jogadores', auth,(req,res)=> res.render('jogadores',{jogadores,equipes}));
router.post('/jogadores', auth,(req,res)=>{
    const {nome,nick,funcao,elo,genero,equipe}=req.body;
    if(!nome||!nick||!funcao||!elo||!genero||!equipe)
        return res.render('jogadores',{erro:'Preencha tudo', jogadores,equipes});
    jogadores.push({nome,nick,funcao,elo,genero,equipe});
    res.render('jogadores',{jogadores,equipes});
});

module.exports = router;


const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const routes = require('../routes');

const expressApp = express();

expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(cookieParser());

expressApp.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  })
);

expressApp.set("view engine", "ejs");
expressApp.set("views", path.join(__dirname, "..", "views"));

expressApp.use(express.static(path.join(__dirname, "..", "public")));

expressApp.use("/", routes);

module.exports = expressApp;
