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

async function selectCarrinho(){
    const conectado = await conecta()
    const [rows] = await conectado.query("SELECT * FROM carrinho ORDER BY carrinho_id DESC")
    //console.log(rows)
    return rows
}

//selectFilmes()
//selectLivros()


module.exports = {selectFilmes,selectLivros,selectCarrinho}



