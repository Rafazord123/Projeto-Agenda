//Trabalho do Model: gerenciar tudo o que é referente a base de dados

const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }

});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user) {
            this.errors.push('Usúario não existe')
            return;
        }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)){
        this.errors.push('Senha iválida');
        this.user = null;
        return;
    }    
   }
    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists()// checa se o email ja foi cadastrado

        if (this.errors.length > 0) return;// se ja cadatrastrad ocorre o erro

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt); // gera uma senha a aleatoria na base de dados e esconde a verdadeira



        this.user = await LoginModel.create(this.body);
    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('Usúario já existe.');
    }

    valida() {
        this.cleanUp();
        //Validação
        //O email precisa ser válido
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');
        // a senha tem que conter ente 3 e 20 caracteres
        if (this.body.password.length < 3 || this.body.password.length > 20) {
            this.errors.push('A senha precisa ter entre 3 a 20 caracteres.')
        }
    }
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;