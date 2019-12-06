const express = require('express')
const MongoClient = require('mongodb').MongoClient
const mongo = require('mongodb')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const router = express.Router()

passport.serializeUser((user, done)=>{
  done(null, user)
})

passport.deserializeUser((user, done)=>{
  done(null, user)
})

passport.use(new LocalStrategy({usernameField:"email"}, (email, password, done)=>{
  connect((db)=>{
    db.collection('users').findOne({ email, password }, (err, user)=>{
      if(err) throw err;
      if(!user || user.password !== password) {
        return done(null, false, { message: 'Incorrect password or username.' });
      } else {
        return done(null, user);
      }
    })
  })
}));

function connect(callback){
  MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }).then((client)=>{
    const db = client.db('UserDB')
    callback(db)
  })
}

router.get('/', (req, res) => {
  connect((db)=>{
    db.collection('users').find({}).toArray().then((result)=>{
      res.json(result)
    })
  })
})

router.get('/:id', (req, res) => {
  connect((db)=>{
    const id = new mongo.ObjectID(req.params.id);
    db.collection('users').findOne({'_id': id}).then((result)=>{
      res.json(result)
    })
  })
})

router.delete('/:id', (req, res) => {
  connect((db)=>{
    const id = new mongo.ObjectID(req.params.id);
    db.collection('users').remove({'_id': id}).then((result)=>{
      res.json(result)
    })
  })
})

router.put('/:id', (req, res) => {
  const userName = req.body.name
  const userIdade = req.body.idade
  const userCep = req.body.cep
  const userNumero = req.body.numero
  const id = new mongo.ObjectID(req.params.id);
  connect((db)=>{
    db.collection('users').update({'_id': id},[
      {$set: {name: userName
        , idade: userIdade
        , cep: userCep
        , numero: userNumero
      }}
    ]).then((result)=>{
      res.json(result)
    })
  })
})

router.post('/', (req, res) => {
  const userName = req.body.name
  const userIdade = req.body.idade
  const userCep = req.body.cep
  const userNumero = req.body.numero
  connect((db)=>{
    db.collection('users').insertMany([
      {name: userName, idade: userIdade, cep: userCep, numero: userNumero}
    ]).then((result)=>{
      res.json(result)
    })
  })
})

router.post('/register', (req, res) => {
  const name = req.body.name
  const password = req.body.password
  const email = req.body.email
  connect((db)=>{
    db.collection('users').insertMany([
      {name, password, email}
    ]).then((result)=>{
      res.json(result)
    })
  })
})

router.post('/login', passport.authenticate('local',{failureRedirect: 'http://localhost:3000/login'}), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect('http://localhost:3000/dashboard/');
});

module.exports = router;
