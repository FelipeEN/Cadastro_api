const express  = require('express')
const path = require('path')

const pool = require('../database/database')

const app = express()
const PORT = process.env.PORT || 3333

app.use(express.json())


app.use(express.static(path.join(__dirname,'../page')))


app.post('/usuarios', async (req,res) =>{
    const {nome, email}= req.body
    if(!nome || !email){
       return res.status(400).json({
            mensagem : "informe email e a senha"
        })
    }
    try{
        const sql = `INSERT INTO usuarios(nome,email) VALUES (?,?)`
        const [resultado] = await pool.execute(sql,[nome,email])
        res.status(200).json({
            id : resultado.insertId,nome,email
        })

    }catch(error){
        console.log(error)
        
        res.status(500).json({
            mensagem : "Erro ao se conectar com o banco"
        })
    }
})

app.get('/usuarios', async (req,res)=>{
    try{
        const[usuarios]=await pool.execute(
            ` SELECT id, nome, criado_em FROM usuarios ORDER BY id DESC`
        )
        res.json(usuarios)
    }catch(error){
        console.log(error)
        res.status(500).json({
            erro: "Não foi possivel consultar."
        })
    }
})

app.listen(PORT, ()=> {
    console.log(`servidor funcionando na porta ${PORT}`)
})

module.exports = app