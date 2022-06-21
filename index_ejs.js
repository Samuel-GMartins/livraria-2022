// const { render } = require('express/lib/response')

(async () => {
const express = require('express')
const app = express()
const db = require("./db.js")
const url = require("url")
const bodyParser = require("body-parser")
const session = require("express-session")
const mysqlSession = require("express-mysql-session")(session)
const port = 8080

app.set('view engine','ejs')

const dia = 1000 * 60 * 60 * 24;
const min15 = 1000 * 60 * 60 / 4;


const options ={
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'session_tbl',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }  
}


await db.makeSession(app,options,session)

function checkFirst(req, res, next) {
    if (!req.session.userInfo) {
      res.redirect('/promocoes');
    } else {
      next();
    }
  }

function checkAuth(req, res, next) {
    if (!req.session.userInfo) {
      res.send('Você não está autorizado para acessar esta página');
    } else {
      next();
    }
  }

var userInfo=''
app.locals.info = {
    user:userInfo
} 

app.locals.titulo = "Livraria 2022 - Área Administrativa"
app.locals.idProd = 5

//Config para as variáveis post
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(express.static('livraria-2022'))
app.use("/books",express.static('books'))
app.use("/imgs",express.static('imgs'))
app.use("/css",express.static('css'))
app.use("/js",express.static('js'))

const consulta = await db.selectFilmes()
const consultaLivro = await db.selectLivros()

app.get("/login",async(req,res) => {
    res.render(`login`, {
        titulo:"Entrar - Livros Online"
    })
})

app.post("/login", async (req,res)=>{
    const {email,senha} = req.body
    const logado = await db.selectUsers(email,senha)
    if(logado != ""){
    req.session.userInfo = email
    userInfo = req.session.userInfo
    req.app.locals.info.user= userInfo
    res.redirect('/')
    } else {res.send("<h2>Login ou senha não conferem</h2>")}
})

app.use('/logout', function (req, res) {
    req.app.locals.info = {}
    req.session.destroy()
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect("/login") 
 
})

app.get("/",checkFirst,(req,res) => {
    res.render(`index`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaLivro
    })
})

// ADMIN  ===============================

app.get("/adm",(req,res) => {
    res.render(`admin/index-admin`,{
        galeria: consultaLivro
    })
})


app.get("/upd-form-produto",async (req,res) => {
    const produto = await db.selectSingle(req.app.locals.idProd)
    res.render(`admin/atualiza-produto`,{
        galeria: consultaLivro,
        id: req.app.locals.idProd,
        produtoDaVez: produto
    })
})

app.post("/upd-form-produto",(req,res) => {
    req.app.locals.idProd = req.body.id
    res.send(`Produto Atualizado com Sucesso`)
})

app.post("/atualiza_single",async(req,res) => {
    const b = req.body
    await db.updateProduto(b.resumo,b.imagem,b.valor,b.titulo,b.id)
    res.send(`Produto Atualizado com Sucesso`)
})

app.get("/upd-promo",(req,res) => {
    res.render(`admin/atualiza-promocoes`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaLivro
    })
})

app.get("/insere-livro",async(req,res) =>{
   await db.insertLivro({titulo:"Guerra Dos Mundos", resumo:"Lorem loren",valor:20.45,imagem:"guerra-dos-mundos.jpg"})
    res.send("<h2>livro Adicionado!</h2> <a href='./'>Voltar</a>")
})

app.get("/atualiza-promo",async(req,res) =>{
    let qs = url.parse(req.url,true).query
    await db.updatePromo(qs.promo,qs.id) //localhost:8080/atualiza-promo?promo=1&id=8
     res.send("<h2>Lista de Promoções Atualizadas!</h2> <a href='./'>Voltar</a>")
 })

 // FIM DO ADMIN  ===============================

app.get("/promocoes",async (req,res) => {
    const consultaPromo = await db.selectPromo()
    res.render(`promocoes`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaPromo
    })
})


app.get("/single-produto",async(req,res) => {
    let infoUrl = req.url
    let urlProp = url.parse(infoUrl,true) // ?id=5
    let q = urlProp.query
    const consultaSingle = await db.selectSingle(q.id)
    const consultaInit = await db.selectSingle(4)


    res.render(`single-produto`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaSingle,
        inicio: consultaInit
        })
})

app.get("/cadastro",async(req,res) => {
    let infoUrl = req.url
    let urlProp = url.parse(infoUrl,true) // ?id=5
    let q = urlProp.query
    const consultaSingle = await db.selectSingle(q.id)
    const consultaInit = await db.selectSingle(4)

    res.render(`cadastro`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaInit
        })
})

app.post("/cadastro",async(req,res)=> {
    const info=req.body
    await db.cadastroContato({
    nome:info.nome,
    email:info.email,
    telefone:info.telefone,
    senha:info.senha,
    conf_senha:info.conf_senha
})
    res.redirect("/promocoes")
})

app.get("/contato",async(req,res) => {
    let infoUrl = req.url
    let urlProp = url.parse(infoUrl,true) // ?id=5
    let q = urlProp.query
    const consultaSingle = await db.selectSingle(q.id)
    const consultaInit = await db.selectSingle(4)

    res.render(`contato`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaInit
        })
})

app.post("/contato",async(req,res)=> {
    const info=req.body
    await db.insertContato({
    nome:info.cad_nome,
    sobrenome:info.cad_sobrenome,
    email:info.cad_email,
    mensagem:info.cad_mensagem
})
    res.redirect("/promocoes")
})

app.get("/carrinho",checkAuth, async(req,res) => {
    const consultaCarrinho = await db.selectCarrinho()
    res.render(`carrinho`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        carrinho: consultaCarrinho
    })
})

app.post("/carrinho",async(req,res)=> {
    const info =req.body
    await db.insertCarrinho({
        produto: info.produto,
        quantidade: info.quantidade,
        valor: info.valor,
        livros_id: info.livros_id
    })
    res.send(req.body)
})

app.post("/delete-carrinho",async(req,res)=> {
    const info =req.body
    await db.deleteCarrinho(info.id)
    res.send(info)
})


app.listen(port,() => console.log(`Servidor Rodando na porta ${port} com nodemon!`))
})()