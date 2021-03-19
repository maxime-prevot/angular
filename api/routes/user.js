var User = require('../model/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require("../config");

function postUser(req, res){
    let user = new User();
    user.username = "test";
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    user.pwd = hashedPassword;
    console.log("POST user reçu :");
    console.log(user)

    user.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${user.username} saved!`})
    })
}

 async function logIn(req, res){
    User.findOne({username: req.body.username}, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
      var passwordIsValid = req.body.pwd.localeCompare(user.pwd);
      if (passwordIsValid == -1) return res.status(401).send({ auth: false, token: null });
      
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      
      res.status(200).send({ auth: true, token: token });
    });
    
  }
  
  module.exports = { logIn, postUser };
