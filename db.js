// db = DataBase

async function conecta(){
    const mysql = require("mysql2/promise")
    const conn = await mysql.createConnection({
        host: "localhost",
        user: "samuel",
        password: "But4kozcs@",
        database: "filmes"
    })
    console.log('mySQL conectado!')
    global.connection = conn
    return connection
}

//conecta()

async function selectFilmes(){
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT f.titulo,f.genero,d.nome FROM videos as f INNER JOIN diretor as d ON f.diretor = d.diretor_id ORDER BY f.titulo ASC")
    //console.log(rows)
    return rows
}

async function selectLivros(){
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT * FROM livros ORDER BY livros_id DESC")
    //console.log(rows)
    return rows
}

async function selectSingle(id){
    const conectado = await conecta()
    const values = [id]
    const [rows] = await conectado.query("SELECT * FROM livros WHERE livros_id=?",values)
    //console.log(rows)
    return rows
}

async function insertLivro(livro,){
    const conectado = await conecta()
    const values = [livro.titulo,livro.resumo,livro.valor,livro.imagem]
    const [rows] = 
    await conectado.query("INSERT INTO livros(titulo,resumo,valor,imagem) VALUES (?,?,?,?)",values)
    console.log("Insert OK")
    return rows
}

async function selectCarrinho(){
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT * FROM carrinho ORDER BY carrinho_id DESC")
    //console.log(rows)
    return rows
}

//selectFilmes()
//selectLivros()
//selectSingle(10)
// insertLivro({titulo:"Wild Fury", resumo:"Lorem Resumo Wild Fire",valor:40.35,imagem:"wild-fury.jpg"})



module.exports = {selectFilmes,selectLivros,selectSingle,selectCarrinho}



