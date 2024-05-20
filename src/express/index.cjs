const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
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
    connection.query(`SELECT * FROM posty`, (err, rows, fields) => {
      res.send(rows)
    })
})

app.listen(3000)