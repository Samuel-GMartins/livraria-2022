(async () => {
const express = require('express')
const app = express()
const db = require("./db.js")
const port = 8080

app.set('view engine','ejs')

app.use(express.static('livraria-2022'))
app.use("/books",express.static('books'))
app.use("/imgs",express.static('imgs'))
app.use("/css",express.static('css'))
app.use("/js",express.static('js'))


const consulta = await db.selectFilmes()
const consultaLivro = await db.selectLivros()
const consultaCarrinho = await db.selectCarrinho()

console.log(consulta[0])
console.log(consultaLivro[0])


app.get("/",(req,res) => {
    res.render(`index`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaLivro
    })
})

app.get("/single-produto",(req,res) => {
    res.render(`single-produto`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaLivro,
        carrinho: consultaCarrinho
    })
})

app.get("/carrinho",(req,res) => {
    res.render(`carrinho`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaLivro,
        carrinho: consultaCarrinho
    })
})

app.listen(port,() => console.log(`Servidor Rodando na porta ${port} com nodemon!`))
})()