const express = require('express')
const session = require('express-session')
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const multer = require("multer");
var crypto = require ("crypto")
var path = require ("path")
var fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../photos')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
    });
  }
});
const upload = multer({ storage: storage, limits: {fieldSize: 50*1024*1024} });
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

app.get('/posty', (req,res) => {
    connection.query(`SELECT * FROM posty ORDER BY data DESC`, (err, rows, fields) => {
      if(rows){
        res.send(rows)
      }else{
        res.send({ status: 0, text: "Przepraszamy... Nie udało się połączyć z bazą danych :("})
      }
    })
})

app.get('/post/:id', (req,res) => {
  connection.query(`SELECT * FROM posty WHERE id = ?`,[req.params.id], (err, rows, fields) => {
    if(rows && rows.length == 1){
      connection.query(`SELECT * FROM opinie WHERE opinie.post = ?`,[req.params.id], (err2, rows2, fields2) => {
        rows[0].opinie = [...rows2]
        res.send(rows)
      })
    }else{
      res.send({ status: 0, text: "Nie znaleziono posta..."})
    }
  })
})

app.post('/logowanie', (req,res) => {
  if(req.session.user){
    return res.json(req.session.user)
  }
  connection.query(`SELECT * FROM uzytkownicy WHERE login = ?`,[req.body.login], (err, rows, fields) => {
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
  connection.query(`SELECT id FROM uzytkownicy WHERE login = ?`,[req.params.login], (err, rows, fields) => {
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
  if(!req.session.user) return
  connection.query(`UPDATE uzytkownicy SET login = ? WHERE login = ?`,[req.body.nowy_login, req.body.stary_login], (err, rows, fields) => {
    res.json(`done`)
  })
})

app.post('/sprawdzhaslo', (req,res) => {
  if(!req.session.user) return
  connection.query(`SELECT haslo FROM uzytkownicy WHERE login = ?`,[req.body.login], (err, rows, fields) => {
    res.json(bcrypt.compareSync(req.body.haslo, rows[0].haslo))
  })
})

app.post('/zmianahasla', (req,res) => {
  if(!req.session.user) return
  const new_pass = bcrypt.hashSync(req.body.nowe_haslo, 10)
  connection.query(`UPDATE uzytkownicy SET haslo = ? WHERE login = ?`,[new_pass, req.body.login], (err, rows, fields) => {
    res.json(`done`)
  })
})

app.post('/usunkonto', (req,res) => {
  if(!req.session.user) return
  connection.query(`DELETE FROM uzytkownicy WHERE login = ?`,[req.body.login], (err, rows, fields) => {
    res.json(`done`)
  })
})

app.post('/wyslijwiadomosc', (req,res) => {
  connection.query(`INSERT INTO wiadomosci(imie,email,tytul,tresc,data) VALUES (?,?,?,?,NOW());`,[req.body.imie,req.body.email,req.body.tytul,req.body.tresc], (err, rows, fields) => {
    res.json("done")
  })
})


app.post('/usunpost', (req,res) => {
  if(!req.session.user) return
  connection.query(`SELECT img FROM posty WHERE id = ?`,[req.body.id], (err, rows, fields) => {
    if(rows[0] && rows[0].img){
      fs.unlink('../../photos/'+rows[0].img, (err) => {
        if (err) console.log("Was unable to delete the file")
      })
    }
  })
  connection.query(`DELETE FROM posty WHERE id = ?`,[req.body.id], (err, rows, fields) => {
    res.json(`done`)
  })
})

app.post("/dodajpost", upload.single("img"), dodajPost);

function dodajPost(req, res) {
  if(!req.session.user) return
  let filename = ""
  if(req.file){
    filename = req.file.filename
  }
  if(req.body.tagi){
    req.body.tagi = JSON.stringify(req.body.tagi.split(","))
  }
  connection.query(`INSERT INTO posty(tytul, tresc, data, tagi, img) VALUES (?,?,NOW(),?,?);`,[req.body.tytul,req.body.tekst,req.body.tagi,filename], (err, rows, fields) => {
    res.json("done")
  })
}

app.post("/edytujpost", upload.single("img"), edytujPost);

function edytujPost(req, res) {
  if(!req.session.user) return
  let filename = req.body.original_img
  if(req.file){
    filename = req.file.filename
    fs.unlink("../../photos/"+req.body.original_img, (err) => {
      if (err) console.log("Was unable to delete the file")
    })
  }
  if(req.body.tagi){
    req.body.tagi = JSON.stringify(req.body.tagi.split(","))
  }
  connection.query(`UPDATE posty SET tytul = ?, tresc = ?, tagi = ?, img = ? WHERE id = ?;`,[req.body.tytul,req.body.tekst,req.body.tagi,filename,req.body.id], (err, rows, fields) => {
    res.json("done")
  })
}

app.post('/usunimg', (req,res) => {
  if(!req.session.user) return
  fs.unlink('../../photos/'+req.body.img, (err) => {
    if (err) console.log("Was unable to delete the file")
  })
  connection.query(`UPDATE posty SET img = "" WHERE id = ?;`,[req.body.id], (err, rows, fields) => {
    res.json("done")
  })
})

app.get('/wiadomosci', (req,res) => {
  connection.query(`SELECT * FROM wiadomosci ORDER BY data DESC`, (err, rows, fields) => {
    if(err){
      res.send({status:0, text:"Nie udało się połączyć z bazą danych :("})
      return;
    }
    if(rows){
      res.send(rows)
    }else{
      res.send({ status: 0, text: "Nie masz żadnych nowych wiadomości!"})
    }
  })
})

app.post('/usunwiadomosci', (req,res) => {
  if(!req.session.user) return
  if(!/^[0-9, ]*$/.test(req.body.id)){
    return
  }
  connection.query(`DELETE FROM wiadomosci WHERE id IN(${req.body.id})`,(err, rows, fields) => {
    res.json(`done`)
  })
})

app.listen(3000)