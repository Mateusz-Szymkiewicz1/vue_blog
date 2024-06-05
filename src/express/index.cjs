const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const app = express().use(express.json()).use(cors())

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vue_blog'
})

// app.post('/dodaj', (req,res) => {
//     connection.query(`INSERT INTO filmy (id, gatunki_id, rezyserzy_id, tytul, rok, ocena) VALUES (NULL, '${req.body.gatunek}', '${req.body.rezyser}', '${req.body.tytul}', '${req.body.rok}', '${req.body.ocena}');`, (err, rows, fields) => {
//       res.json(`Film ${req.body.tytul} dodany!`)
//     })
// })

app.get('/posty', (req,res) => {
    connection.query(`SELECT * FROM posty ORDER BY id DESC LIMIT 20`, (err, rows, fields) => {
      if(rows){
        res.send(rows)
      }else{
        res.send({ status: 0, text: "Przepraszamy... Nie udało się połączyć z bazą danych :("})
      }
    })
})

app.get('/post/:id', (req,res) => {
  connection.query(`SELECT * FROM posty WHERE id = ${req.params.id}`, (err, rows, fields) => {
    if(rows && rows.length == 1){
      res.send(rows)
    }else{
      res.send({ status: 0, text: "Nie znaleziono posta..."})
    }
  })
})

app.post('/logowanie', (req,res) => {
  connection.query(`SELECT * FROM uzytkownicy WHERE login = '${req.body.login}'`, (err, rows, fields) => {
    if(rows && rows.length == 1){
      if(bcrypt.compareSync(req.body.haslo, rows[0].haslo)){
        res.send({status:1})
      }else{
        res.send({ status: 0, text: "Niepoprawne dane logowania!"})
      }
    }else{
      res.send({ status: 0, text: "Niepoprawne dane logowania!"})
    }
  })
})

app.listen(3000)