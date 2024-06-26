const express = require('express')
const session = require('express-session')
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcryptjs')
MySQLStore = require('connect-mysql')(session)
const app = express().use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(session({
  secret: "sesja",
  saveUninitialized: false,
  resave: false,
  cookie: { 
    maxAge: 1000*60*60*48,
  },
  store: new MySQLStore({
    config: {
      user: 'root', 
      password: '',
      database: 'vue_blog',
    },
    cleanup: true
  }) 
}))

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
  if(req.session.user){
    return res.json(req.session.user)
  }
  connection.query(`SELECT * FROM uzytkownicy WHERE login = '${req.body.login}'`, (err, rows, fields) => {
    if(rows && rows.length == 1){
      if(bcrypt.compareSync(req.body.haslo, rows[0].haslo)){
        req.session.user = rows[0].login
        res.send({status: 200})
      }else{
        res.send({ status: 0, text: "Niepoprawne dane logowania!"})
      }
    }else{
      res.send({ status: 0, text: "Niepoprawne dane logowania!"})
    }
  })
})

app.get('/user/:login', (req,res) => {
  connection.query(`SELECT id FROM uzytkownicy WHERE login = '${req.params.login}'`, (err, rows, fields) => {
    if(rows && rows.length > 0){
      res.send({status: 1})
    }else{
      res.send({status: 0})
    }
  })
})

app.post('/wyloguj', (req,res) => {
  req.session.destroy()
  res.json("done")
})

app.post('/zmianaloginu', (req,res) => {
    connection.query(`UPDATE uzytkownicy SET login = '${req.body.nowy_login}' WHERE login = '${req.body.stary_login}'`, (err, rows, fields) => {
      res.json(`done`)
    })
})

app.listen(3000)