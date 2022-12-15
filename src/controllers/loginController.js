const Login = require('../models/LoginModels')

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado')
    res.render('login')
}
exports.register = async function(req,res){
    try {
    const login = new Login(req.body)
    await login.register();

    if(login.errors.length > 0) {
        req.flash('errors', login.errors);
        req.session.save(function(){// salva a sessão
        return res.redirect('/login/index') // volta para a página de login
        });
        return;
    }

    //se nao occorer nenhum erro mensagen de sucesso
    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(function () {// salva a sessão
        return res.redirect('/login/index'); // volta para a página de login
    });
 } catch (e) {
    console.log(e);
    return res.render('404');
    }
};

exports.login = async function(req,res){
    try {
    const login = new Login(req.body)
    await login.login();
    if(login.errors.length > 0) {
        req.flash('errors', login.errors);
        req.session.save(function(){// salva a sessão
        return res.redirect('/login/index') // volta para a página de login
        });
        return;
    }
    //se nao occorer nenhum erro mensagen de sucesso
    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user;
    req.session.save(function () {// salva a sessão
        return res.redirect('/login/index'); // volta para a página de login
    });
 } catch (e) {
    console.log(e);
    return res.render('404');
    }
};

exports.logout = function(req,res) {
    req.session.destroy();
    res.redirect('/');
}

