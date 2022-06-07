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

const consulta = await db.selectFilmes()
console.log(consulta[0])

app.get("/",(req,res) => {
    res.render(`index`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta})
})


app.listen(port,() => console.log(`Servidor Rodando na porta ${port} com nodemon!`))
})()