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

async function selectPromo(){
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT * FROM livros WHERE promo=1")
    //console.log(rows)
    return rows
}

async function updatePromo(id){
    const conectado = await conecta()
    const values = [promo,id]
    return await conectado.query("UPDATE livros SET promo=? WHERE livros_id=?",values)
}
//updatePromo(1,3)

async function deleteCarrinho(id){
    const conectado = await conecta()
    const values = [id]
    return await conectado.query("DELETE FROM carrinho WHERE carrinho_id=?",values)
}

async function insertLivro(livro){
    const conectado = await conecta()
    const values = [livro.titulo,livro.resumo,livro.valor,livro.imagem]
    const [rows] = 
    await conectado.query("INSERT INTO livros(titulo,resumo,valor,imagem) VALUES (?,?,?,?)",values)
    console.log("Insert OK")
    return rows
}

async function insertContato(contato){
    const conectado = await conecta()
    const values = [contato.nome,contato.sobrenome,contato.email,contato.mensagem]
    const [rows] = 
    await conectado.query("INSERT INTO contato(nome,sobrenome,email,mensagem) VALUES (?,?,?,?)",values)
    console.log("Insert OK")
    return rows
}

async function insertCarrinho(carrinho){
    const conectado = await conecta()
    const values = [carrinho.produto,carrinho.quantidade,carrinho.valor,carrinho.livros_id]
    const [rows] = 
    await conectado.query("INSERT INTO carrinho(produto,quantidade,valor,livros_id) VALUES (?,?,?,?)",values)
    console.log("Insert OK")
    return rows
}

async function cadastroContato(usuarios){
    const conectado = await conecta()
    const values = [usuarios.nome,usuarios.email,usuarios.telefone,usuarios.senha,usuarios.conf_senha]
    const [rows] = 
    await conectado.query("INSERT INTO usuarios(nome,email,telefone,senha,conf_senha) VALUES (?,?,?,?,?)",values)
    console.log("Insert OK")
    return rows
}
// insertContato({
//     nome:"Michael",
//     sobrenome:"Jackson",
//     email:"maiquin@gmail.com",
//     mensagem:"hi hii"
// })

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



module.exports = {
    selectFilmes,
    selectLivros,
    selectSingle,
    selectCarrinho,
    selectPromo,
    insertLivro,
    updatePromo,
    insertContato,
    cadastroContato,
    insertCarrinho,
    deleteCarrinho
}



