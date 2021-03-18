let User = require('../model/user');

// Ajout d'un assignment (POST)
function logIn(req, res){
    let user = new User();
    user.username = req.body.username;
    user.pwd = req.body.pwd;
    res.send(user);
}

module.exports = { logIn };